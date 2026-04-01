import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, limit, doc, getDoc } from 'firebase/firestore';
import { Chat, Order, Service } from '../types';
import { ChatWindow } from '../components/Chat/ChatWindow';
import { ShoppingBag, ChevronLeft, Package, CheckCircle2, Clock, Info } from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';
import { motion } from 'motion/react';

export const OrderChat = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const [chatId, setChatId] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !orderId) return;

    const fetchData = async () => {
      try {
        // Fetch Order
        const orderSnap = await getDoc(doc(db, 'orders', orderId));
        if (orderSnap.exists()) {
          const orderData = { id: orderSnap.id, ...orderSnap.data() } as Order;
          setOrder(orderData);

          // Fetch Service
          const serviceSnap = await getDoc(doc(db, 'services', orderData.serviceId));
          if (serviceSnap.exists()) {
            setService({ id: serviceSnap.id, ...serviceSnap.data() } as Service);
          }
        }

        // Find or Create Chat
        const q = query(
          collection(db, 'chats'),
          where('orderId', '==', orderId),
          limit(1)
        );

        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          setChatId(snapshot.docs[0].id);
        } else {
          // Create new order chat
          const docRef = await addDoc(collection(db, 'chats'), {
            userId: user.uid,
            orderId: orderId,
            type: 'order',
            status: 'open',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          setChatId(docRef.id);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, orderId]);

  if (!user || !orderId) return null;

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link to="/my-orders" className="flex items-center text-zinc-500 hover:text-white transition-colors group">
            <ChevronLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Voltar para Meus Pedidos
          </Link>
          <div className="flex items-center space-x-3">
            <Badge variant="default" className="bg-zinc-900 border-zinc-800 text-zinc-400">
              ID: {orderId.slice(0, 8)}
            </Badge>
            {order && (
              <Badge variant={order.status === 'completed' ? 'success' : 'warning'}>
                {order.status === 'completed' ? 'Concluído' : 'Em Andamento'}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Order Info */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card className="p-6 bg-zinc-900/50 border-zinc-800">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-zinc-800 overflow-hidden flex-shrink-0">
                    {service?.imageUrl ? (
                      <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        <Package className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white leading-tight">{service?.name || 'Carregando...'}</h2>
                    <p className="text-sm text-zinc-500">R$ {order?.price.toLocaleString('pt-BR')}</p>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-zinc-800">
                  <div className="flex items-start space-x-3">
                    <Info className="w-4 h-4 text-zinc-500 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Informações do Pedido</h4>
                      <p className="text-sm text-zinc-300 mt-1">{order?.briefing || 'Sem briefing fornecido.'}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500">Status do Pagamento</span>
                    <span className="text-green-500 font-bold flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-1" /> Pago
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-orange-500/5 border-orange-500/10">
                <h4 className="text-sm font-bold text-orange-500 flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4" />
                  Chat de Entrega
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Utilize este chat para enviar arquivos, solicitar revisões e acompanhar o progresso da entrega do seu serviço.
                </p>
              </Card>
            </motion.div>
          </div>

          {/* Right Column: Chat Window */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="h-[600px] bg-zinc-900/20 rounded-2xl border border-zinc-800 border-dashed flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="w-12 h-12 bg-zinc-800 rounded-full mb-4" />
                  <div className="w-32 h-4 bg-zinc-800 rounded" />
                </div>
              </div>
            ) : chatId ? (
              <ChatWindow 
                chatId={chatId} 
                title={`Chat do Pedido: ${service?.name || 'Serviço'}`} 
                subtitle="Equipe Técnica Online" 
              />
            ) : (
              <div className="h-[600px] flex items-center justify-center text-zinc-500">
                Erro ao inicializar chat.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
