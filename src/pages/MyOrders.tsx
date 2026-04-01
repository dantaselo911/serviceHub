import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Order, Quote, Service, OrderStatus, QuoteStatus } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Card, Badge, Button } from '../components/ui';
import { ShoppingBag, FileText, Clock, CheckCircle2, XCircle, MessageSquare, Briefcase, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [services, setServices] = useState<Record<string, Service>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'quotes'>('orders');

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const ordersSnap = await getDocs(query(collection(db, 'orders'), where('userId', '==', user.uid), orderBy('createdAt', 'desc')));
        const quotesSnap = await getDocs(query(collection(db, 'quotes'), where('userId', '==', user.uid), orderBy('createdAt', 'desc')));
        const servicesSnap = await getDocs(collection(db, 'services'));

        const serviceMap: Record<string, Service> = {};
        servicesSnap.docs.forEach(doc => serviceMap[doc.id] = { id: doc.id, ...doc.data() } as Service);
        setServices(serviceMap);

        setOrders(ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
        setQuotes(quotesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quote)));
      } catch (error) {
        console.error("Error fetching my orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const acceptQuote = async (quoteId: string) => {
    try {
      await updateDoc(doc(db, 'quotes', quoteId), { status: 'accepted', updatedAt: new Date().toISOString() });
      setQuotes(quotes.map(q => q.id === quoteId ? { ...q, status: 'accepted' as QuoteStatus } : q));
      toast.success('Orçamento aceito! O prestador será notificado.');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'quotes');
    }
  };

  const rejectQuote = async (quoteId: string) => {
    try {
      await updateDoc(doc(db, 'quotes', quoteId), { status: 'rejected', updatedAt: new Date().toISOString() });
      setQuotes(quotes.map(q => q.id === quoteId ? { ...q, status: 'rejected' as QuoteStatus } : q));
      toast.success('Orçamento recusado.');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'quotes');
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Carregando seus pedidos...</div>;

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white">Meus Pedidos</h1>
          <p className="text-zinc-500 mt-2">Acompanhe o status dos seus serviços e orçamentos.</p>
        </div>

        <div className="flex space-x-4 border-b border-zinc-800 mb-8">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'orders' ? 'border-orange-600 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
          >
            <ShoppingBag className="w-4 h-4 inline mr-2" /> Pedidos Diretos ({orders.length})
          </button>
          <button 
            onClick={() => setActiveTab('quotes')}
            className={`px-6 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'quotes' ? 'border-orange-600 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
          >
            <FileText className="w-4 h-4 inline mr-2" /> Orçamentos ({quotes.length})
          </button>
        </div>

        <div className="space-y-6">
          {activeTab === 'orders' ? (
            orders.length > 0 ? orders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-4 flex-grow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant="info">#{order.id.substring(0, 8)}</Badge>
                        <Badge variant={order.status === 'completed' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'}>
                          {order.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-sm text-zinc-500 flex items-center">
                        <Clock className="w-4 h-4 mr-1" /> {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Briefcase className="w-5 h-5 text-orange-500 mt-1" />
                      <div>
                        <div className="text-xs text-zinc-500 uppercase font-bold">Serviço</div>
                        <div className="text-white font-semibold">{services[order.serviceId]?.name || 'Serviço Removido'}</div>
                      </div>
                    </div>

                    <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800">
                      <div className="text-xs text-zinc-500 uppercase font-bold mb-2 flex items-center">
                        <MessageSquare className="w-3 h-3 mr-1" /> Seu Briefing
                      </div>
                      <p className="text-zinc-300 text-sm italic">"{order.briefing}"</p>
                    </div>
                  </div>

                  <div className="md:w-64 flex flex-col justify-center border-l border-zinc-800 md:pl-6">
                    <div className="text-xs text-zinc-500 uppercase font-bold mb-1">Valor Pago</div>
                    <div className="text-2xl font-bold text-white">R$ {order.price.toLocaleString('pt-BR')}</div>
                  </div>
                </div>
              </Card>
            )) : (
              <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-800">
                <ShoppingBag className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-zinc-300">Nenhum pedido direto</h3>
                <p className="text-zinc-500 mt-2">Você ainda não realizou nenhuma compra direta.</p>
                <Button variant="outline" className="mt-6" onClick={() => setActiveTab('quotes')}>Ver Orçamentos</Button>
              </div>
            )
          ) : (
            quotes.length > 0 ? quotes.map((quote) => (
              <Card key={quote.id} className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-4 flex-grow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant="info">#{quote.id.substring(0, 8)}</Badge>
                        <Badge variant={quote.status === 'completed' ? 'success' : quote.status === 'rejected' ? 'danger' : 'warning'}>
                          {quote.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-sm text-zinc-500 flex items-center">
                        <Clock className="w-4 h-4 mr-1" /> {new Date(quote.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Briefcase className="w-5 h-5 text-orange-500 mt-1" />
                      <div>
                        <div className="text-xs text-zinc-500 uppercase font-bold">Serviço Solicitado</div>
                        <div className="text-white font-semibold">{services[quote.serviceId]?.name || 'Serviço Removido'}</div>
                      </div>
                    </div>

                    <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800">
                      <div className="text-xs text-zinc-500 uppercase font-bold mb-2 flex items-center">
                        <MessageSquare className="w-3 h-3 mr-1" /> Seu Briefing
                      </div>
                      <p className="text-zinc-300 text-sm italic">"{quote.briefing}"</p>
                    </div>

                    {quote.response && (
                      <div className="bg-orange-900/10 rounded-lg p-4 border border-orange-900/30">
                        <div className="text-xs text-orange-500 uppercase font-bold mb-2">Resposta do Prestador</div>
                        <p className="text-zinc-300 text-sm italic">"{quote.response}"</p>
                      </div>
                    )}
                  </div>

                  <div className="md:w-64 flex flex-col justify-center border-l border-zinc-800 md:pl-6">
                    <div className="mb-6">
                      <div className="text-xs text-zinc-500 uppercase font-bold mb-1">Valor Ofertado</div>
                      <div className="text-2xl font-bold text-white">
                        {quote.quotedPrice ? `R$ ${quote.quotedPrice.toLocaleString('pt-BR')}` : 'Aguardando Orçamento'}
                      </div>
                    </div>

                    {quote.status === 'quoted' && (
                      <div className="space-y-2">
                        <Button className="w-full" size="sm" onClick={() => acceptQuote(quote.id)}>Aceitar e Contratar</Button>
                        <Button className="w-full" variant="ghost" size="sm" onClick={() => rejectQuote(quote.id)}>Recusar</Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )) : (
              <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-800">
                <FileText className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-zinc-300">Nenhum orçamento</h3>
                <p className="text-zinc-500 mt-2">Você ainda não solicitou nenhum orçamento personalizado.</p>
                <Button variant="outline" className="mt-6" onClick={() => setActiveTab('orders')}>Ver Pedidos</Button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
