import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { Category } from '../../types';
import { Button, Card, Input } from '../../components/ui';
import { Plus, Edit2, Trash2, Search, Save, X, LayoutGrid } from 'lucide-react';
import { toast } from 'sonner';

export const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: 'LayoutGrid',
    order: 0,
  });

  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
      setCategories(cats);
      setLoading(loading && false);
    });
    return unsubscribe;
  }, []);

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        icon: category.icon,
        order: category.order,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        icon: 'LayoutGrid',
        order: categories.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateDoc(doc(db, 'categories', editingCategory.id), formData);
        toast.success('Categoria atualizada com sucesso!');
      } else {
        await addDoc(collection(db, 'categories'), formData);
        toast.success('Categoria criada com sucesso!');
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar categoria.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await deleteDoc(doc(db, 'categories', id));
        toast.success('Categoria excluída com sucesso!');
      } catch (error) {
        console.error(error);
        toast.error('Erro ao excluir categoria.');
      }
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Categorias</h1>
          <p className="text-zinc-400 mt-1">Gerencie as categorias de serviços da plataforma.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-orange-600 hover:bg-orange-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      <Card className="p-6 bg-zinc-900/50 border-zinc-800">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Buscar categorias..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-zinc-950 border-zinc-800 text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 text-sm">
                <th className="pb-4 font-medium px-4">Ordem</th>
                <th className="pb-4 font-medium px-4">Nome</th>
                <th className="pb-4 font-medium px-4">Ícone</th>
                <th className="pb-4 font-medium px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredCategories.map((category) => (
                <tr key={category.id} className="text-zinc-300 hover:bg-zinc-800/30 transition-colors">
                  <td className="py-4 px-4 font-mono text-sm">{category.order}</td>
                  <td className="py-4 px-4 font-medium text-white">{category.name}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <LayoutGrid className="w-4 h-4 text-orange-500" />
                      <span className="text-sm">{category.icon}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenModal(category)}
                        className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
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
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 bg-zinc-900 border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-zinc-400" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Nome da Categoria</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Design Gráfico"
                  className="bg-zinc-950 border-zinc-800 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Ícone (Nome Lucide)</label>
                <Input
                  required
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="Ex: Paintbrush"
                  className="bg-zinc-950 border-zinc-800 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Ordem de Exibição</label>
                <Input
                  type="number"
                  required
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="bg-zinc-950 border-zinc-800 text-white"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-grow text-zinc-400 hover:text-white"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-grow bg-orange-600 hover:bg-orange-700 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
