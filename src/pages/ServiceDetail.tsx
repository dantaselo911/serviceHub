import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, createNotification } from '../firebase';
import { Service, Category } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Button, Card, Badge, Input } from '../components/ui';
import { Star, Clock, MapPin, ShieldCheck, ArrowLeft, Send, FileUp, Info } from 'lucide-react';
import { FileUploader } from '../components/FileUploader';
import { ReviewSection } from '../components/ReviewSection';
import { toast } from 'sonner';
import { motion } from 'motion/react';

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
          briefing,
          attachments,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        await addDoc(collection(db, 'orders'), orderData);
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
              <h1 className="text-4xl font-bold text-white mb-4">{service.name}</h1>
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
