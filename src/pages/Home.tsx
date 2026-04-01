import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, limit, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Category, Service } from '../types';
import { Button, Card, Badge, Input } from '../components/ui';
import { Search, ArrowRight, Globe, Paintbrush, Video, Megaphone, Settings, Hammer, Zap, ShieldCheck, Star, Plus } from 'lucide-react';
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

      {/* Services Categories Info */}
      <section className="py-24 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white">O que oferecemos</h2>
            <p className="text-zinc-500 mt-4 max-w-2xl mx-auto">
              Soluções completas para você e sua empresa, com os melhores profissionais do mercado.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Design & Criatividade",
                desc: "Logotipos, identidade visual, artes para redes sociais e muito mais.",
                icon: Paintbrush
              },
              {
                title: "Tecnologia & Web",
                desc: "Desenvolvimento de sites, landing pages, e-commerce e automações.",
                icon: Globe
              },
              {
                title: "Marketing & Vendas",
                desc: "Gestão de tráfego pago, SEO, social media e estratégias digitais.",
                icon: Megaphone
              },
              {
                title: "Vídeo & Áudio",
                desc: "Edição de vídeo, motion graphics, locução e trilhas sonoras.",
                icon: Video
              },
              {
                title: "Serviços Físicos",
                desc: "Reformas, elétrica, pintura e manutenção residencial/comercial.",
                icon: Hammer
              },
              {
                title: "Consultoria & Suporte",
                desc: "Assistência técnica, consultoria de negócios e suporte especializado.",
                icon: Settings
              }
            ].map((item, i) => (
              <Card key={i} className="p-8 bg-black border-zinc-900 hover:border-orange-500/30 transition-all group">
                <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-600/10 group-hover:text-orange-500 transition-colors">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
              </Card>
            ))}
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

      {/* Testimonials Section */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white">O que dizem nossos clientes</h2>
            <p className="text-zinc-500 mt-4 max-w-2xl mx-auto">
              Milhares de pessoas já transformaram seus projetos com a ServiceHub.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Ricardo Silva",
                role: "Empresário",
                content: "A ServiceHub facilitou muito a contratação de profissionais para minha empresa. O sistema de orçamentos é rápido e transparente.",
                avatar: "https://i.pravatar.cc/150?u=ricardo"
              },
              {
                name: "Ana Oliveira",
                role: "Designer Freelancer",
                content: "Como prestadora, a plataforma me deu visibilidade e segurança nos pagamentos. Recomendo tanto para clientes quanto para profissionais.",
                avatar: "https://i.pravatar.cc/150?u=ana"
              },
              {
                name: "Marcos Souza",
                role: "Proprietário de Imóvel",
                content: "Contratei uma reforma completa pelo site. O acompanhamento via chat e a qualidade do serviço foram excepcionais.",
                avatar: "https://i.pravatar.cc/150?u=marcos"
              }
            ].map((testimonial, i) => (
              <Card key={i} className="p-8 bg-zinc-950 border-zinc-900 hover:border-orange-500/30 transition-all">
                <div className="flex items-center space-x-1 text-orange-500 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-zinc-300 italic mb-8 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center space-x-4">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full border border-zinc-800" />
                  <div>
                    <h4 className="text-white font-bold">{testimonial.name}</h4>
                    <p className="text-zinc-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white">Perguntas Frequentes</h2>
            <p className="text-zinc-500 mt-4">
              Tudo o que você precisa saber sobre a ServiceHub.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Como faço para contratar um serviço?",
                a: "Basta navegar pelo catálogo, escolher o serviço desejado, preencher o briefing e realizar o pagamento. Se for um serviço sob orçamento, você solicita o valor e aguarda o retorno do prestador."
              },
              {
                q: "O pagamento é seguro?",
                a: "Sim! Utilizamos um sistema de saldo em conta. Você adiciona fundos via PIX e o valor fica retido na plataforma até que você confirme o recebimento do serviço."
              },
              {
                q: "Como funciona o chat?",
                a: "Após a contratação ou solicitação de orçamento, um chat exclusivo é aberto entre você e o administrador/prestador para alinhar todos os detalhes do projeto."
              },
              {
                q: "Posso cancelar um pedido?",
                a: "Sim, desde que o serviço ainda não tenha sido iniciado. Entre em contato com o suporte para solicitar o cancelamento e estorno do saldo."
              }
            ].map((faq, i) => (
              <details key={i} className="group bg-black border border-zinc-900 rounded-xl overflow-hidden transition-all hover:border-zinc-800">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="text-lg font-semibold text-white">{faq.q}</span>
                  <Plus className="w-5 h-5 text-zinc-500 group-open:rotate-45 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-zinc-400 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-black overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Card className="p-12 bg-zinc-950 border-zinc-900 text-center max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-4">Fique por dentro das novidades</h2>
            <p className="text-zinc-500 mb-10 max-w-lg mx-auto">
              Receba ofertas exclusivas, novos serviços e dicas de profissionais diretamente no seu e-mail.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <Input placeholder="Seu melhor e-mail" className="flex-grow" />
              <Button type="submit">Inscrever-se</Button>
            </form>
          </Card>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-white">ServiceHub Blog</h2>
              <p className="text-zinc-500 mt-4">Dicas, tendências e insights para o seu negócio.</p>
            </div>
            <Button variant="outline">Ver todos os artigos</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Como escolher o melhor design para sua marca",
                excerpt: "Descubra os elementos essenciais para criar uma identidade visual impactante e memorável.",
                date: "28 Mar, 2026",
                image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800"
              },
              {
                title: "5 tendências de desenvolvimento web para 2026",
                excerpt: "Fique por dentro das tecnologias que estão moldando o futuro da web e como elas podem ajudar seu negócio.",
                date: "25 Mar, 2026",
                image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800"
              },
              {
                title: "Guia completo para reformas residenciais",
                excerpt: "Tudo o que você precisa planejar antes de começar a transformar sua casa ou apartamento.",
                date: "20 Mar, 2026",
                image: "https://images.unsplash.com/photo-1503387762-592dee58c460?auto=format&fit=crop&q=80&w=800"
              }
            ].map((post, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-6 border border-zinc-900">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="text-sm text-orange-500 font-bold mb-2 uppercase tracking-wider">{post.date}</div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-orange-500 transition-colors">{post.title}</h3>
                <p className="text-zinc-500 leading-relaxed line-clamp-2">{post.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-zinc-950 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">10k+</div>
              <div className="text-zinc-500 text-sm uppercase tracking-widest">Clientes Felizes</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-zinc-500 text-sm uppercase tracking-widest">Profissionais</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">25k+</div>
              <div className="text-zinc-500 text-sm uppercase tracking-widest">Projetos Entregues</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">4.9/5</div>
              <div className="text-zinc-500 text-sm uppercase tracking-widest">Avaliação Média</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-orange-600/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-5xl font-bold text-white mb-8">Pronto para tirar seu projeto do papel?</h2>
          <p className="text-xl text-zinc-500 mb-12 max-w-2xl mx-auto">
            Junte-se a milhares de clientes satisfeitos e tenha acesso aos melhores profissionais do mercado.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/catalog">
              <Button size="lg" className="px-12 py-8 text-xl">Começar Agora</Button>
            </Link>
            <Link to="/support">
              <Button variant="outline" size="lg" className="px-12 py-8 text-xl">Falar com Consultor</Button>
            </Link>
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
