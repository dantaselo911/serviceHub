import React, { useEffect, useState } from 'react';
import { collection, getDocs, setDoc, doc, query, where, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Button } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const INITIAL_CATEGORIES = [
  { name: 'Criação de Sites', icon: 'Globe', order: 1 },
  { name: 'Design Gráfico', icon: 'Paintbrush', order: 2 },
  { name: 'Edição de Vídeo', icon: 'Video', order: 3 },
  { name: 'Tráfego Pago', icon: 'Megaphone', order: 4 },
  { name: 'Social Media', icon: 'Megaphone', order: 5 },
  { name: 'Automação', icon: 'Settings', order: 6 },
  { name: 'Fachadas de Loja', icon: 'Hammer', order: 7 },
  { name: 'Letreiros', icon: 'Hammer', order: 8 },
  { name: 'Adesivação', icon: 'Hammer', order: 9 },
  { name: 'Reformas', icon: 'Hammer', order: 10 },
  { name: 'Pintura', icon: 'Paintbrush', order: 11 },
  { name: 'Elétrica', icon: 'Zap', order: 12 },
  { name: 'Instalação', icon: 'Zap', order: 13 },
  { name: 'Assistência Técnica', icon: 'Settings', order: 14 },
];

export const SeedData = () => {
  const { isAdmin } = useAuth();
  const [isSeeding, setIsSeeding] = useState(false);

  const seed = async () => {
    if (!isAdmin) return;
    setIsSeeding(true);
    try {
      const catSnap = await getDocs(collection(db, 'categories'));
      if (catSnap.size === 0) {
        for (const cat of INITIAL_CATEGORIES) {
          const id = cat.name.toLowerCase().replace(/\s+/g, '-');
          await setDoc(doc(db, 'categories', id), cat);
        }
        toast.success('Categorias inicializadas com sucesso!');
      } else {
        toast.info('Categorias já existem no banco de dados.');
      }
    } catch (error) {
      console.error("Error seeding data", error);
      toast.error('Erro ao inicializar dados.');
    } finally {
      setIsSeeding(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between">
      <div className="text-sm text-zinc-400">Configuração inicial do banco de dados</div>
      <Button size="sm" variant="outline" onClick={seed} isLoading={isSeeding}>
        Inicializar Categorias
      </Button>
    </div>
  );
};
