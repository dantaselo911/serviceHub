import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, addDoc, collection, serverTimestamp, updateDoc, arrayUnion, arrayRemove, query, where, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, createNotification } from '../firebase';
import { Service, Category } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Button, Card, Badge, Input } from '../components/ui';
import { Star, Clock, MapPin, ShieldCheck, ArrowLeft, Send, FileUp, Info, Heart, Ticket, X } from 'lucide-react';
import { FileUploader } from '../components/FileUploader';
import { ReviewSection } from '../components/ReviewSection';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { cn } from '../components/ui';

export const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, login } = useAuth();
  const navigate = useNavigate();
  
  const [service, setService] = useState<Service | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [briefing, setBriefing] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  
  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;
      try {
        const docSnap = await getDoc(doc(db, 'services', id));
        if (docSnap.exists()) {
          const serviceData = { id: docSnap.id, ...docSnap.data() } as Service;
          setService(serviceData);
          
          const catSnap = await getDoc(doc(db, 'categories', serviceData.categoryId));
          if (catSnap.exists()) {
            setCategory({ id: catSnap.id, ...catSnap.data() } as Category);
          }
        }
      } catch (error) {
        console.error("Error fetching service", error);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  const handleAction = async () => {
    if (!user) {
      toast.error('Você precisa estar logado para continuar.');
      login();
      return;
    }

    if (!briefing.trim()) {
      toast.error('Por favor, preencha o briefing do serviço.');
      return;
    }

    setSubmitting(true);
    try {
      if (service?.mode === 'fixed') {
        // Create Order
        const orderData = {
          userId: user.uid,
          serviceId: service.id,
          status: 'pending',
          price: service.price,
          discountAmount: discountAmount,
          finalPrice: service.price - discountAmount,
          couponCode: appliedCoupon?.code || null,
          briefing,
          attachments,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        await addDoc(collection(db, 'orders'), orderData);

        // Update coupon usage count if applied
        if (appliedCoupon) {
          const couponRef = doc(db, 'coupons', appliedCoupon.id);
          await updateDoc(couponRef, {
            usedCount: appliedCoupon.usedCount + 1
          });
        }

        await createNotification(
          user.uid,
          'Pedido Realizado!',
          `Seu pedido para "${service.name}" foi recebido com sucesso.`,
          'success',
          '/my-orders'
        );
        toast.success('Pedido realizado com sucesso!');
        navigate('/my-orders');
      } else {
        // Create Quote Request
        const quoteData = {
          userId: user.uid,
          serviceId: service?.id,
          status: 'requested',
          couponCode: appliedCoupon?.code || null,
          briefing,
          attachments,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        await addDoc(collection(db, 'quotes'), quoteData);
        await createNotification(
          user.uid,
          'Orçamento Solicitado!',
          `Sua solicitação de orçamento para "${service?.name}" foi enviada.`,
          'info',
          '/my-orders'
        );
        toast.success('Solicitação de orçamento enviada!');
        navigate('/my-orders');
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, service?.mode === 'fixed' ? 'orders' : 'quotes');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    if (!service) return;

    setIsValidatingCoupon(true);
    try {
      const q = query(collection(db, 'coupons'), where('code', '==', couponCode.toUpperCase()), where('active', '==', true));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error('Cupom inválido ou expirado');
        return;
      }

      const couponData = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as any;

      // Validate expiration
      if (new Date(couponData.expiresAt) < new Date()) {
        toast.error('Cupom expirado');
        return;
      }

      // Validate usage limit
      if (couponData.usedCount >= couponData.usageLimit) {
        toast.error('Limite de uso do cupom atingido');
        return;
      }

      // Validate minimum order value
      if (service.mode === 'fixed' && service.price < couponData.minimumOrderValue) {
        toast.error(`Valor mínimo para este cupom é R$ ${couponData.minimumOrderValue}`);
        return;
      }

      // Validate applicability
      if (couponData.appliesToCategory && couponData.appliesToCategory !== service.categoryId) {
        toast.error('Este cupom não é válido para esta categoria');
        return;
      }

      if (couponData.appliesToService && couponData.appliesToService !== service.id) {
        toast.error('Este cupom não é válido para este serviço');
        return;
      }

      // Calculate discount
      let discount = 0;
      if (service.mode === 'fixed') {
        if (couponData.discountType === 'percentage') {
          discount = (service.price * couponData.discountValue) / 100;
        } else {
          discount = couponData.discountValue;
        }
      }

      setAppliedCoupon(couponData);
      setDiscountAmount(discount);
      toast.success('Cupom aplicado com sucesso!');
    } catch (err) {
      console.error('Error applying coupon:', err);
      toast.error('Erro ao validar cupom');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode('');
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast.error('Faça login para favoritar serviços.');
      return;
    }

    const isFavorite = user.favorites?.includes(service?.id || '');
    const userRef = doc(db, 'users', user.uid);

    try {
      if (isFavorite) {
        await updateDoc(userRef, {
          favorites: arrayRemove(service?.id)
        });
        toast.success('Removido dos favoritos');
      } else {
        await updateDoc(userRef, {
          favorites: arrayUnion(service?.id)
        });
        toast.success('Adicionado aos favoritos');
      }
    } catch (error) {
      console.error("Error toggling favorite", error);
      toast.error('Erro ao atualizar favoritos.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-600" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-bold">Serviço não encontrado</h2>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/catalog')}>Voltar ao Catálogo</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center text-zinc-400 hover:text-white mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Voltar
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="aspect-video rounded-2xl overflow-hidden border border-zinc-800">
              <img 
                src={service.imageUrl || `https://picsum.photos/seed/${service.id}/1200/675`} 
                alt={service.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="info">{category?.name}</Badge>
                <Badge variant={service.type === 'digital' ? 'info' : 'success'}>
                  {service.type === 'digital' ? 'Digital' : 'Presencial'}
                </Badge>
              </div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h1 className="text-4xl font-bold text-white">{service.name}</h1>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleFavorite}
                  className={cn(
                    "flex items-center space-x-2 transition-all",
                    user?.favorites?.includes(service.id)
                      ? "bg-orange-600/10 border-orange-600 text-orange-500"
                      : "text-zinc-400 hover:text-white"
                  )}
                >
                  <Heart className={cn("w-4 h-4", user?.favorites?.includes(service.id) && "fill-current")} />
                  <span>{user?.favorites?.includes(service.id) ? 'Favoritado' : 'Favoritar'}</span>
                </Button>
              </div>
              <div className="flex items-center space-x-6 text-zinc-400 mb-8">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-amber-500 fill-current mr-2" />
                  <span className="text-white font-bold">4.9</span>
                  <span className="ml-1 text-sm">(128 avaliações)</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{service.estimatedTime}</span>
                </div>
                {service.location && (
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{service.location}</span>
                  </div>
                )}
              </div>

              <div className="prose prose-invert max-w-none">
                <h3 className="text-xl font-bold text-white mb-4">Descrição do Serviço</h3>
                <p className="text-zinc-400 leading-relaxed whitespace-pre-line">
                  {service.fullDescription}
                </p>
              </div>
            </div>

            <Card className="p-8 bg-zinc-900/30">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <ShieldCheck className="w-6 h-6 mr-2 text-orange-500" /> Garantia ServiceHub
              </h3>
              <ul className="space-y-4 text-zinc-400">
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  Pagamento seguro e liberação apenas após a entrega.
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  Suporte especializado em caso de imprevistos.
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  Profissionais qualificados e avaliados pela comunidade.
                </li>
              </ul>
            </Card>
          </div>

          {/* Right Column: Order Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="p-8 border-orange-500/20 shadow-2xl shadow-orange-950/10">
                <div className="mb-8">
                  <div className="text-zinc-400 text-sm mb-1">
                    {service.mode === 'fixed' ? 'Preço do Serviço' : 'Valor Estimado'}
                  </div>
                  <div className="text-4xl font-bold text-white">
                    {service.mode === 'fixed' ? `R$ ${service.price.toLocaleString('pt-BR')}` : 'Sob Orçamento'}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Briefing do Serviço
                    </label>
                    <textarea 
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all min-h-[150px] resize-none"
                      placeholder="Descreva detalhadamente o que você precisa..."
                      value={briefing}
                      onChange={(e) => setBriefing(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Arquivos de Referência (Opcional)
                    </label>
                    <FileUploader onFilesChange={setAttachments} />
                  </div>

                  {/* Coupon Section */}
                  <div className="pt-4 border-t border-zinc-800">
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Cupom de Desconto
                    </label>
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between bg-orange-600/10 border border-orange-600/30 rounded-lg px-4 py-2">
                        <div className="flex items-center text-orange-500">
                          <Ticket className="w-4 h-4 mr-2" />
                          <span className="font-bold">{appliedCoupon.code}</span>
                          <span className="ml-2 text-xs">(- R$ {discountAmount.toLocaleString('pt-BR')})</span>
                        </div>
                        <button onClick={removeCoupon} className="text-zinc-500 hover:text-white transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Digite seu cupom"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="flex-grow"
                        />
                        <Button
                          variant="outline"
                          onClick={handleApplyCoupon}
                          isLoading={isValidatingCoupon}
                          disabled={!couponCode.trim()}
                        >
                          Aplicar
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Order Summary */}
                  {service.mode === 'fixed' && (
                    <div className="pt-4 border-t border-zinc-800 space-y-2">
                      <div className="flex justify-between text-sm text-zinc-400">
                        <span>Subtotal</span>
                        <span>R$ {service.price.toLocaleString('pt-BR')}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-sm text-orange-500">
                          <span>Desconto</span>
                          <span>- R$ {discountAmount.toLocaleString('pt-BR')}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-bold text-white pt-2">
                        <span>Total</span>
                        <span>R$ {(service.price - discountAmount).toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                  )}

                  <Button 
                    className="w-full py-6 text-lg" 
                    onClick={handleAction}
                    isLoading={submitting}
                  >
                    {service.mode === 'fixed' ? 'Contratar Agora' : 'Solicitar Orçamento'}
                  </Button>

                  <div className="flex items-center justify-center text-xs text-zinc-500 space-x-2">
                    <Info className="w-3 h-3" />
                    <span>Você não será cobrado agora</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
        {/* Reviews Section */}
        <div className="mt-20">
          <ReviewSection serviceId={id!} />
        </div>
      </div>
    </div>
  );
};
