import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { Service } from '../types';
import { Card, Button, Badge } from '../components/ui';
import { Heart, ShoppingBag, Search, Star, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export const Favorites = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?.favorites || user.favorites.length === 0) {
        setServices([]);
        setLoading(false);
        return;
      }

      try {
        const results: Service[] = [];
        for (const serviceId of user.favorites) {
          const serviceSnap = await getDoc(doc(db, 'services', serviceId));
          if (serviceSnap.exists()) {
            results.push({ id: serviceSnap.id, ...serviceSnap.data() } as Service);
          }
        }
        setServices(results);
      } catch (error) {
        console.error("Error fetching favorites", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user?.favorites]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <Heart className="w-8 h-8 text-orange-500 fill-current" />
            Meus Favoritos
          </h1>
          <p className="text-zinc-500 mt-2">Serviços que você salvou para contratar depois.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-80 bg-zinc-900 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {services.map((service) => (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Link to={`/service/${service.id}`}>
                    <Card className="group hover:border-zinc-700 transition-all h-full flex flex-col">
                      <div className="aspect-video relative overflow-hidden">
                        <img 
                          src={service.imageUrl || `https://picsum.photos/seed/${service.id}/800/450`} 
                          alt={service.name} 
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge variant={service.type === 'digital' ? 'info' : 'success'}>
                            {service.type === 'digital' ? 'Digital' : 'Presencial'}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-white group-hover:text-orange-500 transition-colors">{service.name}</h3>
                          <div className="flex items-center text-amber-500">
                            <Star className="w-4 h-4 fill-current mr-1" />
                            <span className="text-sm font-bold">4.9</span>
                          </div>
                        </div>
                        <p className="text-zinc-500 text-sm line-clamp-2 mb-4">{service.shortDescription}</p>
                        
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800">
                          <div className="text-xl font-bold text-white">
                            {service.mode === 'fixed' ? `R$ ${service.price.toLocaleString('pt-BR')}` : 'Consultar'}
                          </div>
                          <Button size="sm">Ver Detalhes</Button>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-800">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="text-zinc-700 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Nenhum favorito ainda</h3>
            <p className="text-zinc-500 mt-2">Explore o catálogo e clique no coração para salvar serviços.</p>
            <Link to="/catalog">
              <Button className="mt-6">Explorar Catálogo</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
