import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Category, Service } from '../types';
import { Button, Card, Badge, Input } from '../components/ui';
import { Search, Filter, SlidersHorizontal, Star, MapPin, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  
  const selectedCategory = searchParams.get('category') || 'all';
  const selectedType = searchParams.get('type') || 'all';

  useEffect(() => {
    const fetchCategories = async () => {
      const catSnap = await getDocs(query(collection(db, 'categories'), orderBy('order', 'asc')));
      setCategories(catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        let q = query(collection(db, 'services'), where('active', '==', true));
        
        const querySnapshot = await getDocs(q);
        let results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));

        // Client-side filtering for better flexibility with multiple conditions in Firestore
        if (selectedCategory !== 'all') {
          results = results.filter(s => s.categoryId === selectedCategory);
        }
        if (selectedType !== 'all') {
          results = results.filter(s => s.type === selectedType);
        }
        if (searchTerm) {
          const lowerSearch = searchTerm.toLowerCase();
          results = results.filter(s => 
            s.name.toLowerCase().includes(lowerSearch) || 
            s.shortDescription.toLowerCase().includes(lowerSearch)
          );
        }

        setServices(results);
      } catch (error) {
        console.error("Error fetching services", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [selectedCategory, selectedType, searchTerm]);

  const handleCategoryChange = (id: string) => {
    const params = new URLSearchParams(searchParams);
    if (id === 'all') params.delete('category');
    else params.set('category', id);
    setSearchParams(params);
  };

  const handleTypeChange = (type: string) => {
    const params = new URLSearchParams(searchParams);
    if (type === 'all') params.delete('type');
    else params.set('type', type);
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-black pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white">Catálogo de Serviços</h1>
            <p className="text-zinc-500 mt-2">Explore nossa seleção premium de serviços digitais e físicos.</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
            <Input 
              placeholder="O que você está procurando?" 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="space-y-8">
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Filter className="w-4 h-4 mr-2 text-orange-500" /> Categorias
              </h3>
              <div className="space-y-2">
                <button 
                  onClick={() => handleCategoryChange('all')}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                    selectedCategory === 'all' ? "bg-orange-600 text-white" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  )}
                >
                  Todas as Categorias
                </button>
                {categories.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                      selectedCategory === cat.id ? "bg-orange-600 text-white" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <SlidersHorizontal className="w-4 h-4 mr-2 text-orange-500" /> Tipo de Serviço
              </h3>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => handleTypeChange('all')}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-medium border transition-all",
                    selectedType === 'all' ? "bg-zinc-100 text-black border-white" : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700"
                  )}
                >
                  Todos
                </button>
                <button 
                  onClick={() => handleTypeChange('digital')}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-medium border transition-all",
                    selectedType === 'digital' ? "bg-zinc-100 text-black border-white" : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700"
                  )}
                >
                  Digital
                </button>
                <button 
                  onClick={() => handleTypeChange('physical')}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-medium border transition-all",
                    selectedType === 'physical' ? "bg-zinc-100 text-black border-white" : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700"
                  )}
                >
                  Presencial
                </button>
              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-80 bg-zinc-900 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service) => (
                  <Link key={service.id} to={`/service/${service.id}`}>
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
                        
                        <div className="flex flex-wrap gap-4 mb-6">
                          <div className="flex items-center text-xs text-zinc-400">
                            <Clock className="w-3 h-3 mr-1" /> {service.estimatedTime}
                          </div>
                          {service.location && (
                            <div className="flex items-center text-xs text-zinc-400">
                              <MapPin className="w-3 h-3 mr-1" /> {service.location}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800">
                          <div className="text-sm text-zinc-400">
                            {service.mode === 'fixed' ? 'Preço fixo' : 'Sob orçamento'}
                          </div>
                          <div className="text-xl font-bold text-white">
                            {service.mode === 'fixed' ? `R$ ${service.price.toLocaleString('pt-BR')}` : 'Consultar'}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-800">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-zinc-500 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Nenhum serviço encontrado</h3>
                <p className="text-zinc-500 mt-2">Tente ajustar seus filtros ou termo de busca.</p>
                <Button 
                  variant="outline" 
                  className="mt-6"
                  onClick={() => {
                    setSearchTerm('');
                    setSearchParams({});
                  }}
                >
                  Limpar Filtros
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

import { cn } from '../components/ui';
