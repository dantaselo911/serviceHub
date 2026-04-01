import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { Service, Category, ServiceType, ServiceMode } from '../../types';
import { Button, Card, Badge, Input } from '../../components/ui';
import { Plus, Edit2, Trash2, Search, Filter, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

export const AdminServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [formData, setFormData] = useState<Partial<Service>>({
    name: '',
    shortDescription: '',
    fullDescription: '',
    categoryId: '',
    type: 'digital',
    mode: 'fixed',
    price: 0,
    estimatedTime: '',
    location: '',
    imageUrl: '',
    active: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catSnap = await getDocs(query(collection(db, 'categories'), orderBy('order', 'asc')));
        const cats = catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
        setCategories(cats);

        const serSnap = await getDocs(query(collection(db, 'services'), orderBy('createdAt', 'desc')));
        setServices(serSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
      } catch (error) {
        console.error("Error fetching services", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.categoryId) {
      toast.error('Preencha os campos obrigatórios.');
      return;
    }

    try {
      if (editingService) {
        await updateDoc(doc(db, 'services', editingService.id), {
          ...formData,
          updatedAt: serverTimestamp(),
        });
        setServices(services.map(s => s.id === editingService.id ? { ...s, ...formData } as Service : s));
        toast.success('Serviço atualizado!');
      } else {
        const docRef = await addDoc(collection(db, 'services'), {
          ...formData,
          createdAt: serverTimestamp(),
          active: true,
        });
        setServices([{ id: docRef.id, ...formData } as Service, ...services]);
        toast.success('Serviço criado!');
      }
      setIsModalOpen(false);
      setEditingService(null);
      setFormData({
        name: '',
        shortDescription: '',
        fullDescription: '',
        categoryId: '',
        type: 'digital',
        mode: 'fixed',
        price: 0,
        estimatedTime: '',
        location: '',
        imageUrl: '',
        active: true,
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'services');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return;
    try {
      await deleteDoc(doc(db, 'services', id));
      setServices(services.filter(s => s.id !== id));
      toast.success('Serviço excluído!');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'services');
    }
  };

  const toggleActive = async (service: Service) => {
    try {
      await updateDoc(doc(db, 'services', service.id), { active: !service.active });
      setServices(services.map(s => s.id === service.id ? { ...s, active: !s.active } : s));
      toast.success(service.active ? 'Serviço ocultado!' : 'Serviço ativado!');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'services');
    }
  };

  const filteredServices = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                         s.shortDescription.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === '' || s.categoryId === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-8 space-y-8 bg-black min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Gerenciar Serviços</h1>
          <p className="text-zinc-500 mt-1">Crie, edite e gerencie o catálogo de serviços.</p>
        </div>
        <Button onClick={() => { setEditingService(null); setFormData({ name: '', categoryId: '', type: 'digital', mode: 'fixed', price: 0, active: true }); setIsModalOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Novo Serviço
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Buscar serviços..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-zinc-900 border-zinc-800 text-white"
          />
        </div>
        <select 
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">Todas as Categorias</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-900/50 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Serviço</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Tipo/Modo</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Preço</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded bg-zinc-800 overflow-hidden flex-shrink-0">
                        {service.imageUrl ? (
                          <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-600"><ImageIcon className="w-5 h-5" /></div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{service.name}</div>
                        <div className="text-xs text-zinc-500 truncate max-w-[200px]">{service.shortDescription}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="default">{categories.find(c => c.id === service.categoryId)?.name || 'N/A'}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <Badge variant={service.type === 'digital' ? 'info' : 'success'}>{service.type}</Badge>
                      <Badge variant="warning">{service.mode}</Badge>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-white">
                      {service.mode === 'fixed' ? `R$ ${service.price.toLocaleString('pt-BR')}` : 'Orçamento'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={service.active ? 'success' : 'danger'}>{service.active ? 'Ativo' : 'Inativo'}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => toggleActive(service)} className="p-2 text-zinc-400 hover:text-white transition-colors">
                        {service.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => { setEditingService(service); setFormData(service); setIsModalOpen(true); }} className="p-2 text-zinc-400 hover:text-orange-500 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(service.id)} className="p-2 text-zinc-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-2xl font-bold text-white mb-6">{editingService ? 'Editar Serviço' : 'Novo Serviço'}</h2>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Nome do Serviço</label>
                  <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: Criação de Logo" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Categoria</label>
                  <select 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    value={formData.categoryId}
                    onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                  >
                    <option value="">Selecionar Categoria</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Descrição Curta</label>
                <Input value={formData.shortDescription} onChange={e => setFormData({ ...formData, shortDescription: e.target.value })} placeholder="Uma frase chamativa" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Descrição Completa</label>
                <textarea 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  value={formData.fullDescription}
                  onChange={e => setFormData({ ...formData, fullDescription: e.target.value })}
                  placeholder="Detalhes completos do serviço..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Tipo</label>
                  <select 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value as ServiceType })}
                  >
                    <option value="digital">Digital</option>
                    <option value="physical">Presencial</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Modo de Contratação</label>
                  <select 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    value={formData.mode}
                    onChange={e => setFormData({ ...formData, mode: e.target.value as ServiceMode })}
                  >
                    <option value="fixed">Preço Fixo</option>
                    <option value="quote">Sob Orçamento</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Preço (R$)</label>
                  <Input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Prazo Estimado</label>
                  <Input value={formData.estimatedTime} onChange={e => setFormData({ ...formData, estimatedTime: e.target.value })} placeholder="Ex: 5 dias úteis" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">URL da Imagem</label>
                <Input value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="https://..." />
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-zinc-800">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button type="submit">Salvar Serviço</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
