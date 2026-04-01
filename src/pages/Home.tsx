import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, limit, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Category, Service } from '../types';
import { Button, Card, Badge } from '../components/ui';
import { Search, ArrowRight, Globe, Paintbrush, Video, Megaphone, Settings, Hammer, Zap, ShieldCheck, Star } from 'lucide-react';
import { motion } from 'motion/react';

const categoryIcons: Record<string, any> = {
  'Criação de Sites': Globe,
  'Design Gráfico': Paintbrush,
  'Edição de Vídeo': Video,
  'Tráfego Pago': Megaphone,
  'Social Media': Megaphone,
  'Automação': Settings,
  'Fachadas de Loja': Hammer,
  'Letreiros': Hammer,
  'Adesivação': Hammer,
  'Reformas': Hammer,
  'Pintura': Paintbrush,
  'Elétrica': Zap,
  'Instalação': Zap,
  'Assistência Técnica': Settings,
};

export const Home = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catSnap = await getDocs(query(collection(db, 'categories'), orderBy('order', 'asc')));
        setCategories(catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));

        const serSnap = await getDocs(query(collection(db, 'services'), where('active', '==', true), limit(6)));
        setFeaturedServices(serSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
      } catch (error) {
        console.error("Error fetching home data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900/20 to-transparent opacity-50 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="warning">Plataforma Premium</Badge>
              <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
                Contrate os melhores <span className="text-orange-600">serviços</span> com confiança.
              </h1>
              <p className="mt-6 text-xl text-zinc-400">
                De criação de sites a reformas residenciais. Uma central completa para todas as suas necessidades digitais e físicas.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/catalog">
                  <Button size="lg" className="w-full sm:w-auto">Explorar Serviços</Button>
                </Link>
                <Link to="/how-it-works">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">Como Funciona</Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white">Categorias Populares</h2>
              <p className="text-zinc-500 mt-2">Encontre exatamente o que você precisa por categoria.</p>
            </div>
            <Link to="/catalog" className="text-orange-500 hover:text-orange-400 font-medium flex items-center group">
              Ver todas <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.length > 0 ? categories.map((cat) => {
              const Icon = categoryIcons[cat.name] || Globe;
              return (
                <Link key={cat.id} to={`/catalog?category=${cat.id}`}>
                  <Card className="p-6 text-center hover:border-orange-500/50 hover:bg-zinc-900 transition-all group cursor-pointer">
                    <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-600/20 group-hover:text-orange-500 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-semibold text-zinc-300 group-hover:text-white">{cat.name}</h3>
                  </Card>
                </Link>
              );
            }) : (
              // Skeleton or empty state
              Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-32 bg-zinc-900 rounded-xl animate-pulse" />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white">Serviços em Destaque</h2>
            <p className="text-zinc-500 mt-4 max-w-2xl mx-auto">
              Nossa seleção de serviços mais procurados com garantia de qualidade ServiceHub.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <Link key={service.id} to={`/service/${service.id}`}>
                <Card className="group hover:border-zinc-700 transition-all">
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
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-orange-500 transition-colors">{service.name}</h3>
                      <div className="flex items-center text-amber-500">
                        <Star className="w-4 h-4 fill-current mr-1" />
                        <span className="text-sm font-bold">4.9</span>
                      </div>
                    </div>
                    <p className="text-zinc-500 text-sm line-clamp-2 mb-4">{service.shortDescription}</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800">
                      <div className="text-sm text-zinc-400">A partir de</div>
                      <div className="text-xl font-bold text-white">
                        {service.mode === 'fixed' ? `R$ ${service.price.toLocaleString('pt-BR')}` : 'Sob Orçamento'}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-zinc-950 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="text-orange-500 w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Garantia de Qualidade</h4>
                <p className="text-zinc-500 text-sm">Todos os prestadores são verificados e avaliados rigorosamente.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="text-orange-500 w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Entrega Ágil</h4>
                <p className="text-zinc-500 text-sm">Prazos respeitados e comunicação transparente em cada etapa.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Star className="text-orange-500 w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Suporte Premium</h4>
                <p className="text-zinc-500 text-sm">Atendimento dedicado para garantir sua satisfação total.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
