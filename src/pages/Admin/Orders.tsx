import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, query, orderBy, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, createNotification } from '../../firebase';
import { Order, Quote, OrderStatus, QuoteStatus, Service, UserProfile } from '../../types';
import { Button, Card, Badge, Input } from '../../components/ui';
import { CheckCircle2, XCircle, Clock, MessageSquare, User, Briefcase, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../components/ui';

export const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [services, setServices] = useState<Record<string, Service>>({});
  const [users, setUsers] = useState<Record<string, UserProfile>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'quotes'>('orders');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersSnap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
        const quotesSnap = await getDocs(query(collection(db, 'quotes'), orderBy('createdAt', 'desc')));
        const servicesSnap = await getDocs(collection(db, 'services'));
        const usersSnap = await getDocs(collection(db, 'users'));

        const serviceMap: Record<string, Service> = {};
        servicesSnap.docs.forEach(doc => serviceMap[doc.id] = { id: doc.id, ...doc.data() } as Service);
        setServices(serviceMap);

        const userMap: Record<string, UserProfile> = {};
        usersSnap.docs.forEach(doc => userMap[doc.id] = { uid: doc.id, ...doc.data() } as any as UserProfile);
        setUsers(userMap);

        setOrders(ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
        setQuotes(quotesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quote)));
      } catch (error) {
        console.error("Error fetching admin orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const order = orders.find(o => o.id === orderId);
      await updateDoc(doc(db, 'orders', orderId), { status, updatedAt: new Date().toISOString() });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
      
      if (order) {
        await createNotification(
          order.userId,
          'Atualização de Pedido',
          `O status do seu pedido #${order.id.slice(0, 5)} foi alterado para "${status}".`,
          status === 'completed' ? 'success' : 'info',
          '/my-orders'
        );
      }

      toast.success(`Status do pedido atualizado para ${status}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'orders');
    }
  };

  const updateQuoteStatus = async (quoteId: string, status: QuoteStatus, quotedPrice?: number, response?: string) => {
    try {
      const quote = quotes.find(q => q.id === quoteId);
      const updateData: any = { status, updatedAt: new Date().toISOString() };
      if (quotedPrice !== undefined) updateData.quotedPrice = quotedPrice;
      if (response !== undefined) updateData.response = response;

      await updateDoc(doc(db, 'quotes', quoteId), updateData);
      setQuotes(quotes.map(q => q.id === quoteId ? { ...q, ...updateData } : q));

      if (quote) {
        await createNotification(
          quote.userId,
          'Atualização de Orçamento',
          `Seu orçamento para "${quote.serviceId}" foi atualizado para "${status}".`,
          status === 'quoted' ? 'success' : 'info',
          '/my-orders'
        );
      }

      toast.success(`Status do orçamento atualizado para ${status}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'quotes');
    }
  };

  if (loading) return <div className="p-8 text-white">Carregando pedidos...</div>;

  return (
    <div className="p-8 space-y-8 bg-black min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestão de Pedidos</h1>
          <p className="text-zinc-500 mt-1">Gerencie pedidos diretos e solicitações de orçamento.</p>
        </div>
      </div>

      <div className="flex space-x-4 border-b border-zinc-800">
        <button 
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'orders' ? 'border-orange-600 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
        >
          Pedidos Diretos ({orders.length})
        </button>
        <button 
          onClick={() => setActiveTab('quotes')}
          className={`px-6 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'quotes' ? 'border-orange-600 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
        >
          Orçamentos ({quotes.length})
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <Briefcase className="w-5 h-5 text-orange-500 mt-1" />
                      <div>
                        <div className="text-xs text-zinc-500 uppercase font-bold">Serviço</div>
                        <div className="text-white font-semibold">{services[order.serviceId]?.name || 'Serviço Removido'}</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <User className="w-5 h-5 text-orange-500 mt-1" />
                      <div>
                        <div className="text-xs text-zinc-500 uppercase font-bold">Cliente</div>
                        <div className="text-white font-semibold">{users[order.userId]?.displayName || 'Usuário'}</div>
                        <div className="text-xs text-zinc-500">{users[order.userId]?.email}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800">
                    <div className="text-xs text-zinc-500 uppercase font-bold mb-2 flex items-center">
                      <MessageSquare className="w-3 h-3 mr-1" /> Briefing do Cliente
                    </div>
                    <p className="text-zinc-300 text-sm italic">"{order.briefing}"</p>
                  </div>
                </div>

                <div className="md:w-64 flex flex-col justify-between border-l border-zinc-800 md:pl-6">
                  <div className="mb-6">
                    <div className="text-xs text-zinc-500 uppercase font-bold mb-1">Valor do Pedido</div>
                    <div className="text-2xl font-bold text-white">R$ {order.price.toLocaleString('pt-BR')}</div>
                  </div>
                  
                  <div className="space-y-2">
                    {order.status === 'pending' && (
                      <Button className="w-full" size="sm" onClick={() => updateOrderStatus(order.id, 'processing')}>Iniciar Processamento</Button>
                    )}
                    {order.status === 'processing' && (
                      <Button className="w-full" variant="primary" size="sm" onClick={() => updateOrderStatus(order.id, 'completed')}>Marcar como Concluído</Button>
                    )}
                    {order.status !== 'completed' && order.status !== 'cancelled' && (
                      <Button className="w-full" variant="danger" size="sm" onClick={() => updateOrderStatus(order.id, 'cancelled')}>Cancelar Pedido</Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )) : (
            <div className="text-center py-20 text-zinc-600">Nenhum pedido encontrado.</div>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <Briefcase className="w-5 h-5 text-orange-500 mt-1" />
                      <div>
                        <div className="text-xs text-zinc-500 uppercase font-bold">Serviço Solicitado</div>
                        <div className="text-white font-semibold">{services[quote.serviceId]?.name || 'Serviço Removido'}</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <User className="w-5 h-5 text-orange-500 mt-1" />
                      <div>
                        <div className="text-xs text-zinc-500 uppercase font-bold">Cliente</div>
                        <div className="text-white font-semibold">{users[quote.userId]?.displayName || 'Usuário'}</div>
                        <div className="text-xs text-zinc-500">{users[quote.userId]?.email}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800">
                    <div className="text-xs text-zinc-500 uppercase font-bold mb-2 flex items-center">
                      <MessageSquare className="w-3 h-3 mr-1" /> Briefing do Orçamento
                    </div>
                    <p className="text-zinc-300 text-sm italic">"{quote.briefing}"</p>
                  </div>

                  {quote.response && (
                    <div className="bg-orange-900/10 rounded-lg p-4 border border-orange-900/30">
                      <div className="text-xs text-orange-500 uppercase font-bold mb-2">Sua Resposta</div>
                      <p className="text-zinc-300 text-sm italic">"{quote.response}"</p>
                    </div>
                  )}
                </div>

                <div className="md:w-64 flex flex-col justify-between border-l border-zinc-800 md:pl-6">
                  <div className="mb-6">
                    <div className="text-xs text-zinc-500 uppercase font-bold mb-1">Valor Ofertado</div>
                    <div className="text-2xl font-bold text-white">
                      {quote.quotedPrice ? `R$ ${quote.quotedPrice.toLocaleString('pt-BR')}` : 'Aguardando'}
                    </div>
                  </div>

                  {quote.status === 'requested' && (
                    <div className="space-y-4">
                      <Input 
                        type="number" 
                        placeholder="Valor R$" 
                        id={`price-${quote.id}`}
                      />
                      <textarea 
                        id={`resp-${quote.id}`}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-sm text-white focus:outline-none"
                        placeholder="Mensagem de resposta..."
                      />
                      <Button className="w-full" size="sm" onClick={() => {
                        const p = (document.getElementById(`price-${quote.id}`) as HTMLInputElement).value;
                        const r = (document.getElementById(`resp-${quote.id}`) as HTMLTextAreaElement).value;
                        if (!p) return toast.error('Informe o valor do orçamento');
                        updateQuoteStatus(quote.id, 'quoted', Number(p), r);
                      }}>Enviar Orçamento</Button>
                    </div>
                  )}
                  
                  {quote.status === 'accepted' && (
                    <Button className="w-full" size="sm" onClick={() => updateQuoteStatus(quote.id, 'completed')}>Marcar como Concluído</Button>
                  )}
                </div>
              </div>
            </Card>
          )) : (
            <div className="text-center py-20 text-zinc-600">Nenhuma solicitação de orçamento encontrada.</div>
          )
        )}
      </div>
    </div>
  );
};
