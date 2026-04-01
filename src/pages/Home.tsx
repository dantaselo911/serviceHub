import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, limit, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Category, Service } from '../types';
import { Button, Card, Badge } from '../components/ui';
import { Globe, Paintbrush, Video, Megaphone, Settings, Hammer, Zap, ShieldCheck, Star, Search, ArrowRight } from 'lucide-react';

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

const WIN_BG = '#d4d0c8';
const WIN_BLUE = '#000080';
const WIN_ORANGE = '#ff6600';

export const Home = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catSnap = await getDocs(query(collection(db, 'categories'), orderBy('order', 'asc')));
        setCategories(catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));

        const serSnap = await getDocs(query(collection(db, 'services'), where('active', '==', true), limit(6)));
        setFeaturedServices(serSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
      } catch (error) {
        console.error('Error fetching home data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ background: WIN_BG, minHeight: '100vh', fontFamily: 'Tahoma, Arial, sans-serif' }}>

      {/* ── Hero / Welcome Window ── */}
      <section className="max-w-7xl mx-auto px-4 pt-6 pb-4">
        <div className="win-panel">
          {/* Window title bar */}
          <div className="win-titlebar">
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 14 }}>&#127968;</span>
              <span className="text-white text-xs font-bold">Bem-vindo ao ServiceHub - Plataforma Premium</span>
            </div>
            <div className="flex items-center gap-0.5">
              <button className="win-btn w-5 h-4 p-0 text-xs leading-none flex items-center justify-center" aria-label="Minimize">_</button>
              <button className="win-btn w-5 h-4 p-0 text-xs leading-none flex items-center justify-center" aria-label="Maximize">□</button>
              <button className="win-btn w-5 h-4 p-0 text-xs leading-none flex items-center justify-center font-bold" aria-label="Close" style={{ background: '#aa0000', color: '#fff' }}>✕</button>
            </div>
          </div>

          {/* Menu bar */}
          <div className="win-menubar flex items-center gap-0 text-xs">
            <span className="px-3 py-0.5 hover:bg-[#000080] hover:text-white cursor-pointer">Arquivo</span>
            <span className="px-3 py-0.5 hover:bg-[#000080] hover:text-white cursor-pointer">Editar</span>
            <span className="px-3 py-0.5 hover:bg-[#000080] hover:text-white cursor-pointer">Exibir</span>
            <span className="px-3 py-0.5 hover:bg-[#000080] hover:text-white cursor-pointer">Ajuda</span>
          </div>

          {/* Body */}
          <div className="p-6 flex flex-col md:flex-row items-start gap-6">
            {/* Left: Illustration / icon area */}
            <div
              className="win-sunken flex-shrink-0 flex flex-col items-center justify-center"
              style={{ width: 140, height: 140, background: '#ffffff' }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  background: WIN_ORANGE,
                  border: '3px solid #882200',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: 36, lineHeight: 1 }}>&#128736;</span>
              </div>
              <span className="text-xs mt-2 text-center" style={{ color: WIN_BLUE, fontWeight: 'bold' }}>
                ServiceHub
              </span>
            </div>

            {/* Right: Text + CTA */}
            <div className="flex-1">
              <h1
                className="text-2xl md:text-3xl font-bold leading-tight mb-3"
                style={{ color: '#000', fontFamily: 'Tahoma, Arial, sans-serif' }}
              >
                Contrate os melhores{' '}
                <span style={{ color: WIN_ORANGE }}>serviços</span>{' '}
                com confiança.
              </h1>
              <p className="text-xs mb-4" style={{ color: '#444', lineHeight: 1.6 }}>
                De criação de sites a reformas residenciais. Uma central completa para todas as suas necessidades digitais e físicas.
              </p>

              {/* Search bar */}
              <div className="flex items-center gap-2 mb-4">
                <div className="win-sunken flex-1 flex items-center px-2 py-1 gap-2" style={{ background: '#fff' }}>
                  <Search className="w-3 h-3 text-gray-500 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Pesquisar serviços..."
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                    className="flex-1 text-xs bg-transparent outline-none"
                    style={{ fontFamily: 'Tahoma, Arial, sans-serif', color: '#000' }}
                  />
                </div>
                <Link to={`/catalog${searchValue ? `?q=${encodeURIComponent(searchValue)}` : ''}`}>
                  <Button variant="primary" size="sm">
                    Pesquisar
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link to="/catalog">
                  <Button variant="primary" size="md">
                    &#128269; Explorar Serviços
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button variant="secondary" size="md">
                    &#8505; Como Funciona
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right side: info panel */}
            <div
              className="win-panel flex-shrink-0 hidden lg:block"
              style={{ width: 200 }}
            >
              <div className="win-titlebar">
                <span className="text-white text-xs font-bold">Destaques</span>
              </div>
              <div className="p-3 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: WIN_ORANGE }} />
                  <span>Garantia de Qualidade</span>
                </div>
                <hr style={{ borderColor: '#808080' }} />
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 flex-shrink-0" style={{ color: WIN_ORANGE }} />
                  <span>Entrega Ágil</span>
                </div>
                <hr style={{ borderColor: '#808080' }} />
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 flex-shrink-0" style={{ color: WIN_ORANGE }} />
                  <span>Suporte Premium</span>
                </div>
                <hr style={{ borderColor: '#808080' }} />
                <Badge variant="warning" className="w-full text-center">
                  PLATAFORMA PREMIUM
                </Badge>
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div className="win-statusbar text-xs">
            <div className="win-sunken px-2 py-0.5">Pronto</div>
            <div className="win-sunken px-2 py-0.5 ml-auto">servicehub.com.br</div>
          </div>
        </div>
      </section>

      {/* ── Categories Window ── */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div className="win-panel">
          <div className="win-titlebar">
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 12 }}>&#128193;</span>
              <span className="text-white text-xs font-bold">Categorias Populares</span>
            </div>
            <div className="flex items-center gap-0.5">
              <button className="win-btn w-5 h-4 p-0 text-xs leading-none flex items-center justify-center" aria-label="Minimize">_</button>
              <button className="win-btn w-5 h-4 p-0 text-xs leading-none flex items-center justify-center" aria-label="Maximize">□</button>
            </div>
          </div>

          {/* Toolbar */}
          <div
            className="flex items-center justify-between px-3 py-1 gap-2"
            style={{ borderBottom: '1px solid #808080', background: WIN_BG }}
          >
            <span className="text-xs font-bold">Encontre exatamente o que você precisa por categoria.</span>
            <Link
              to="/catalog"
              className="text-xs flex items-center gap-1"
              style={{ color: WIN_BLUE, textDecoration: 'none', fontWeight: 'bold' }}
            >
              Ver todas <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {categories.length > 0
                ? categories.map(cat => {
                    const Icon = categoryIcons[cat.name] || Globe;
                    return (
                      <Link
                        key={cat.id}
                        to={`/catalog?category=${cat.id}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <div
                          className="win-btn flex flex-col items-center p-3 gap-2 hover:bg-[#e4e0d8] cursor-pointer group"
                          style={{ height: '100%', minHeight: 80 }}
                        >
                          <div
                            className="w-8 h-8 flex items-center justify-center"
                            style={{
                              background: '#ffffff',
                              border: '1px solid #808080',
                            }}
                          >
                            <Icon className="w-5 h-5" style={{ color: WIN_ORANGE }} />
                          </div>
                          <span className="text-xs text-center leading-tight" style={{ color: '#000', fontFamily: 'Tahoma, Arial, sans-serif' }}>
                            {cat.name}
                          </span>
                        </div>
                      </Link>
                    );
                  })
                : Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className="win-sunken h-20 animate-pulse"
                      style={{ background: '#c4c0b8' }}
                    />
                  ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Services Window ── */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div className="win-panel">
          <div className="win-titlebar">
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 12 }}>&#11088;</span>
              <span className="text-white text-xs font-bold">Serviços em Destaque</span>
            </div>
            <div className="flex items-center gap-0.5">
              <button className="win-btn w-5 h-4 p-0 text-xs leading-none flex items-center justify-center" aria-label="Minimize">_</button>
              <button className="win-btn w-5 h-4 p-0 text-xs leading-none flex items-center justify-center" aria-label="Maximize">□</button>
            </div>
          </div>

          <div
            className="px-3 py-1 text-xs"
            style={{ borderBottom: '1px solid #808080', background: WIN_BG }}
          >
            Nossa seleção de serviços mais procurados com garantia de qualidade ServiceHub.
          </div>

          {/* Column headers — like a file explorer */}
          <div
            className="hidden md:grid px-3 py-0.5 text-xs font-bold gap-4"
            style={{
              gridTemplateColumns: '1fr 1fr 80px 100px',
              background: '#d4d0c8',
              borderBottom: '1px solid #808080',
            }}
          >
            <div className="win-raised px-2 py-0.5 cursor-pointer hover:bg-[#e4e0d8]">Nome &#9650;</div>
            <div className="win-raised px-2 py-0.5 cursor-pointer hover:bg-[#e4e0d8]">Descrição</div>
            <div className="win-raised px-2 py-0.5 cursor-pointer hover:bg-[#e4e0d8]">Avaliação</div>
            <div className="win-raised px-2 py-0.5 cursor-pointer hover:bg-[#e4e0d8]">Preço</div>
          </div>

          <div className="p-4">
            {/* Grid view */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredServices.map((service, idx) => (
                <Link
                  key={service.id}
                  to={`/service/${service.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    className="win-panel hover:bg-[#e8e4dc] group cursor-pointer transition-none"
                  >
                    {/* Mini title bar */}
                    <div
                      className="flex items-center justify-between px-2 py-1"
                      style={{
                        background: idx % 2 === 0 ? '#000080' : '#000060',
                        color: '#fff',
                      }}
                    >
                      <span className="text-xs font-bold truncate">{service.name}</span>
                      <Badge
                        variant={service.type === 'digital' ? 'info' : 'success'}
                        className="ml-1 flex-shrink-0"
                      >
                        {service.type === 'digital' ? 'Digital' : 'Local'}
                      </Badge>
                    </div>

                    {/* Image */}
                    <div
                      className="win-sunken m-2 overflow-hidden"
                      style={{ height: 120 }}
                    >
                      <img
                        src={service.imageUrl || `https://picsum.photos/seed/${service.id}/800/450`}
                        alt={service.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Content */}
                    <div className="px-3 pb-3">
                      <p className="text-xs mb-3 leading-relaxed" style={{ color: '#444' }}>
                        {service.shortDescription}
                      </p>

                      <div
                        className="win-sunken flex items-center justify-between p-2"
                        style={{ background: '#ffffff' }}
                      >
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="w-3 h-3" style={{ color: '#cc8800', fill: '#cc8800' }} />
                          <span style={{ color: '#cc8800', fontWeight: 'bold' }}>4.9</span>
                        </div>
                        <div className="text-xs font-bold" style={{ color: WIN_ORANGE }}>
                          {service.mode === 'fixed'
                            ? `R$ ${service.price.toLocaleString('pt-BR')}`
                            : 'Sob Orçamento'}
                        </div>
                      </div>

                      <div className="flex justify-end mt-2">
                        <Button variant="primary" size="sm" className="text-xs">
                          Ver Detalhes &raquo;
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              {featuredServices.length === 0 && !loading &&
                <div className="col-span-3 win-sunken p-8 text-center text-xs" style={{ background: '#fff' }}>
                  Nenhum serviço em destaque encontrado.
                </div>
              }

              {loading && Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="win-panel animate-pulse">
                  <div style={{ height: 20, background: '#000080' }} />
                  <div className="m-2" style={{ height: 120, background: '#c4c0b8' }} />
                  <div className="p-3 space-y-2">
                    <div style={{ height: 10, background: '#c4c0b8' }} />
                    <div style={{ height: 10, background: '#c4c0b8', width: '60%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust / Info Section ── */}
      <section className="max-w-7xl mx-auto px-4 py-4 pb-8">
        <div className="win-panel">
          <div className="win-titlebar">
            <span className="text-white text-xs font-bold">Por que escolher o ServiceHub?</span>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: ShieldCheck,
                title: 'Garantia de Qualidade',
                desc: 'Todos os prestadores são verificados e avaliados rigorosamente.',
              },
              {
                icon: Zap,
                title: 'Entrega Ágil',
                desc: 'Prazos respeitados e comunicação transparente em cada etapa.',
              },
              {
                icon: Star,
                title: 'Suporte Premium',
                desc: 'Atendimento dedicado para garantir sua satisfação total.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="win-raised p-4 flex items-start gap-3">
                <div
                  className="w-10 h-10 flex-shrink-0 flex items-center justify-center"
                  style={{
                    background: '#ffffff',
                    border: '2px solid #808080',
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: WIN_ORANGE }} />
                </div>
                <div>
                  <h4 className="text-xs font-bold mb-1" style={{ color: WIN_BLUE }}>
                    {title}
                  </h4>
                  <p className="text-xs" style={{ color: '#444', lineHeight: 1.5 }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
