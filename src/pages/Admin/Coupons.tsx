import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { Coupon, Category, Service } from '../../types';
import { Button, Card, Input, Badge } from '../../components/ui';
import { Plus, Search, Edit2, Trash2, Ticket, Calendar, Check, X, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

export const AdminCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    appliesToCategory: '',
    appliesToService: '',
    minimumOrderValue: 0,
    usageLimit: 100,
    expiresAt: '',
    active: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [couponsSnap, categoriesSnap, servicesSnap] = await Promise.all([
        getDocs(query(collection(db, 'coupons'), orderBy('createdAt', 'desc'))),
        getDocs(collection(db, 'categories')),
        getDocs(collection(db, 'services')),
      ]);

      setCoupons(couponsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Coupon)));
      setCategories(categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
      setServices(servicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        appliesToCategory: coupon.appliesToCategory || '',
        appliesToService: coupon.appliesToService || '',
        minimumOrderValue: coupon.minimumOrderValue,
        usageLimit: coupon.usageLimit,
        expiresAt: coupon.expiresAt,
        active: coupon.active,
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: 0,
        appliesToCategory: '',
        appliesToService: '',
        minimumOrderValue: 0,
        usageLimit: 100,
        expiresAt: '',
        active: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        code: formData.code.toUpperCase(),
        appliesToCategory: formData.appliesToCategory || null,
        appliesToService: formData.appliesToService || null,
        updatedAt: serverTimestamp(),
      };

      if (editingCoupon) {
        await updateDoc(doc(db, 'coupons', editingCoupon.id), data);
        toast.success('Cupom atualizado com sucesso');
      } else {
        await addDoc(collection(db, 'coupons'), {
          ...data,
          usedCount: 0,
          createdAt: serverTimestamp(),
        });
        toast.success('Cupom criado com sucesso');
      }

      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving coupon:', error);
      toast.error('Erro ao salvar cupom');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este cupom?')) return;
    try {
      await deleteDoc(doc(db, 'coupons', id));
      toast.success('Cupom excluído com sucesso');
      fetchData();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast.error('Erro ao excluir cupom');
    }
  };

  const toggleStatus = async (coupon: Coupon) => {
    try {
      await updateDoc(doc(db, 'coupons', coupon.id), { active: !coupon.active });
      toast.success(`Cupom ${!coupon.active ? 'ativado' : 'desativado'}`);
      fetchData();
    } catch (error) {
      toast.error('Erro ao alterar status');
    }
  };

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Gerenciamento de Cupons</h1>
          <p className="text-zinc-500 mt-1">Crie e gerencie cupons de desconto para seus clientes.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-orange-600 hover:bg-orange-700 text-white">
          <Plus className="w-5 h-5 mr-2" />
          Novo Cupom
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-zinc-900 border-zinc-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-600/10 rounded-xl">
              <Ticket className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Cupons Ativos</p>
              <p className="text-2xl font-bold text-white">{coupons.filter(c => c.active).length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-zinc-900 border-zinc-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-600/10 rounded-xl">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Total de Usos</p>
              <p className="text-2xl font-bold text-white">
                {coupons.reduce((acc, curr) => acc + curr.usedCount, 0)}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-zinc-900 border-zinc-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-600/10 rounded-xl">
              <Tag className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Tipos de Desconto</p>
              <p className="text-2xl font-bold text-white">Fixo & %</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
        <Input
          placeholder="Pesquisar por código ou descrição..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-zinc-900 border-zinc-800 text-white w-full max-w-md"
        />
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950/50">
              <th className="px-6 py-4 text-sm font-medium text-zinc-400">Código</th>
              <th className="px-6 py-4 text-sm font-medium text-zinc-400">Desconto</th>
              <th className="px-6 py-4 text-sm font-medium text-zinc-400">Uso</th>
              <th className="px-6 py-4 text-sm font-medium text-zinc-400">Expiração</th>
              <th className="px-6 py-4 text-sm font-medium text-zinc-400">Status</th>
              <th className="px-6 py-4 text-sm font-medium text-zinc-400 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filteredCoupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-white font-bold">{coupon.code}</span>
                    <span className="text-xs text-zinc-500">{coupon.description}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="default" className="bg-orange-600/10 text-orange-500 border-orange-600/20">
                    {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `R$ ${coupon.discountValue}`}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-white text-sm">{coupon.usedCount} / {coupon.usageLimit}</span>
                    <div className="w-24 h-1.5 bg-zinc-800 rounded-full mt-1 overflow-hidden">
                      <div 
                        className="h-full bg-orange-600" 
                        style={{ width: `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-zinc-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(coupon.expiresAt).toLocaleDateString('pt-BR')}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => toggleStatus(coupon)}>
                    <Badge variant={coupon.active ? 'success' : 'danger'}>
                      {coupon.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleOpenModal(coupon)}
                      className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(coupon.id)}
                      className="text-zinc-400 hover:text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">
                  {editingCoupon ? 'Editar Cupom' : 'Novo Cupom'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Código do Cupom</label>
                  <Input
                    required
                    placeholder="EX: BEMVINDO10"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Descrição</label>
                  <Input
                    required
                    placeholder="Descrição do cupom"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Tipo de Desconto</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'percentage' | 'fixed' })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-600"
                  >
                    <option value="percentage">Porcentagem (%)</option>
                    <option value="fixed">Valor Fixo (R$)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Valor do Desconto</label>
                  <Input
                    required
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Aplicar a Categoria (Opcional)</label>
                  <select
                    value={formData.appliesToCategory}
                    onChange={(e) => setFormData({ ...formData, appliesToCategory: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-600"
                  >
                    <option value="">Todas as Categorias</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Aplicar a Serviço (Opcional)</label>
                  <select
                    value={formData.appliesToService}
                    onChange={(e) => setFormData({ ...formData, appliesToService: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-600"
                  >
                    <option value="">Todos os Serviços</option>
                    {services.map(ser => (
                      <option key={ser.id} value={ser.id}>{ser.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Pedido Mínimo (R$)</label>
                  <Input
                    type="number"
                    value={formData.minimumOrderValue}
                    onChange={(e) => setFormData({ ...formData, minimumOrderValue: Number(e.target.value) })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Limite de Uso</label>
                  <Input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Data de Expiração</label>
                  <Input
                    required
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>

                <div className="flex items-center space-x-3 pt-8">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-orange-600 focus:ring-orange-600"
                  />
                  <label htmlFor="active" className="text-sm font-medium text-zinc-400">Cupom Ativo</label>
                </div>

                <div className="md:col-span-2 flex justify-end space-x-4 pt-8">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsModalOpen(false)}
                    className="text-zinc-400 hover:text-white"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-8">
                    {editingCoupon ? 'Salvar Alterações' : 'Criar Cupom'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
