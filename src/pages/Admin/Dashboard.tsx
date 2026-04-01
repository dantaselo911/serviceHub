import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, limit, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { Card, Badge } from '../../components/ui';
import { ShoppingBag, FileText, Users, DollarSign, TrendingUp, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalQuotes: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const ordersSnap = await getDocs(collection(db, 'orders'));
        const quotesSnap = await getDocs(collection(db, 'quotes'));
        const usersSnap = await getDocs(collection(db, 'users'));
        
        const orders = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const revenue = orders.reduce((acc, curr: any) => acc + (curr.price || 0), 0);

        setStats({
          totalOrders: ordersSnap.size,
          totalQuotes: quotesSnap.size,
          totalUsers: usersSnap.size,
          totalRevenue: revenue,
          recentOrders: orders.slice(0, 5),
        });
      } catch (error) {
        console.error("Error fetching admin stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const chartData = [
    { name: 'Jan', value: 4000 },
    { name: 'Fev', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Abr', value: 2780 },
    { name: 'Mai', value: 1890 },
    { name: 'Jun', value: 2390 },
  ];

  if (loading) return <div className="p-8 text-white">Carregando dashboard...</div>;

  return (
    <div className="p-8 space-y-8 bg-black min-h-screen">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Admin</h1>
          <p className="text-zinc-500 mt-1">Visão geral da plataforma ServiceHub.</p>
        </div>
        <div className="text-sm text-zinc-500">Última atualização: {new Date().toLocaleTimeString()}</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 border-l-4 border-l-orange-600">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-orange-600/20 rounded-lg flex items-center justify-center">
              <ShoppingBag className="text-orange-500 w-5 h-5" />
            </div>
            <Badge variant="success">+12%</Badge>
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalOrders}</div>
          <div className="text-zinc-500 text-sm">Total de Pedidos</div>
        </Card>

        <Card className="p-6 border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <FileText className="text-blue-500 w-5 h-5" />
            </div>
            <Badge variant="info">+5%</Badge>
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalQuotes}</div>
          <div className="text-zinc-500 text-sm">Solicitações de Orçamento</div>
        </Card>

        <Card className="p-6 border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center">
              <DollarSign className="text-emerald-500 w-5 h-5" />
            </div>
            <Badge variant="success">+18%</Badge>
          </div>
          <div className="text-2xl font-bold text-white">R$ {stats.totalRevenue.toLocaleString('pt-BR')}</div>
          <div className="text-zinc-500 text-sm">Faturamento Total</div>
        </Card>

        <Card className="p-6 border-l-4 border-l-purple-600">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
              <Users className="text-purple-500 w-5 h-5" />
            </div>
            <Badge variant="info">+24</Badge>
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
          <div className="text-zinc-500 text-sm">Clientes Cadastrados</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <Card className="lg:col-span-2 p-8">
          <h3 className="text-xl font-bold text-white mb-8 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-orange-500" /> Desempenho de Vendas
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#f97316' }}
                />
                <Bar dataKey="value" fill="#ea580c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-8">
          <h3 className="text-xl font-bold text-white mb-8 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-orange-500" /> Pedidos Recentes
          </h3>
          <div className="space-y-6">
            {stats.recentOrders.length > 0 ? stats.recentOrders.map((order: any) => (
              <div key={order.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                    {order.userId.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Pedido #{order.id.substring(0, 6)}</div>
                    <div className="text-xs text-zinc-500">R$ {order.price?.toLocaleString('pt-BR')}</div>
                  </div>
                </div>
                <Badge variant={order.status === 'completed' ? 'success' : 'warning'}>
                  {order.status}
                </Badge>
              </div>
            )) : (
              <div className="text-center py-8 text-zinc-600">Nenhum pedido recente.</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
