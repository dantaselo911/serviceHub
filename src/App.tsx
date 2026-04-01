import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar, Footer } from './components/layout';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { HowItWorks } from './pages/HowItWorks';
import { Contact } from './pages/Contact';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';
import { FAQ } from './pages/FAQ';
import { Pricing } from './pages/Pricing';
import { ServiceDetail } from './pages/ServiceDetail';
import { MyOrders } from './pages/MyOrders';
import { Profile } from './pages/Profile';
import { Favorites } from './pages/Favorites';
import { Deposit } from './pages/Deposit';
import { SupportChat } from './pages/SupportChat';
import { OrderChat } from './pages/OrderChat';
import { AdminLayout } from './pages/Admin/AdminLayout';
import { AdminDashboard } from './pages/Admin/Dashboard';
import { AdminServices } from './pages/Admin/Services';
import { AdminOrders } from './pages/Admin/Orders';
import { AdminCategories } from './pages/Admin/Categories';
import { AdminUsers } from './pages/Admin/Users';
import { AdminChats } from './pages/Admin/Chats';
import { AdminCoupons } from './pages/Admin/Coupons';
import { AdminSettings } from './pages/Admin/Settings';
import { Toaster } from 'sonner';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// Seed Data Helper
const SeedData = () => {
  const { isAdmin } = useAuth();

  useEffect(() => {
    const seed = async () => {
      if (!isAdmin) return;
      
      const catSnap = await getDocs(collection(db, 'categories'));
      if (catSnap.empty) {
        console.log("Seeding initial categories...");
        const categories = [
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

        for (const cat of categories) {
          await addDoc(collection(db, 'categories'), cat);
        }

        // Add some initial services
        const serSnap = await getDocs(collection(db, 'services'));
        if (serSnap.empty) {
          const catDocs = await getDocs(collection(db, 'categories'));
          const catMap: Record<string, string> = {};
          catDocs.forEach(doc => catMap[doc.data().name] = doc.id);

          const initialServices = [
            // CRIAÇÃO DE SITES
            { name: 'Landing Page Profissional', shortDescription: 'Página de vendas de alta conversão.', fullDescription: 'Design responsivo, copywriting persuasivo e otimização de velocidade.', categoryId: catMap['Criação de Sites'], type: 'digital', mode: 'fixed', price: 497, estimatedTime: '5 dias', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Site Institucional 5 Páginas', shortDescription: 'Site completo para sua empresa.', fullDescription: 'Home, Sobre, Serviços, Blog e Contato. Design exclusivo e painel de gestão.', categoryId: catMap['Criação de Sites'], type: 'digital', mode: 'fixed', price: 1290, estimatedTime: '15 dias', imageUrl: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Loja Virtual Básica', shortDescription: 'Comece a vender online hoje.', fullDescription: 'Configuração de produtos, meios de pagamento e frete. Design responsivo.', categoryId: catMap['Criação de Sites'], type: 'digital', mode: 'fixed', price: 1990, estimatedTime: '20 dias', imageUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Página de Captura', shortDescription: 'Focada em geração de leads.', fullDescription: 'Design limpo e direto para capturar e-mails e contatos.', categoryId: catMap['Criação de Sites'], type: 'digital', mode: 'fixed', price: 350, estimatedTime: '3 dias', imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'One Page Premium', shortDescription: 'Tudo em uma única página elegante.', fullDescription: 'Ideal para portfólios ou lançamentos de produtos específicos.', categoryId: catMap['Criação de Sites'], type: 'digital', mode: 'fixed', price: 790, estimatedTime: '7 dias', imageUrl: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },

            // DESIGN GRÁFICO
            { name: 'Criação de Logo', shortDescription: 'Sua marca com identidade única.', fullDescription: 'Criação de logotipo profissional com 3 variações e manual básico.', categoryId: catMap['Design Gráfico'], type: 'digital', mode: 'fixed', price: 120, estimatedTime: '3 dias', imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Identidade Visual Básica', shortDescription: 'Logo + Paleta + Tipografia.', fullDescription: 'Manual da marca completo para manter a consistência visual.', categoryId: catMap['Design Gráfico'], type: 'digital', mode: 'fixed', price: 350, estimatedTime: '7 dias', imageUrl: 'https://images.unsplash.com/photo-1572044162444-ad60f128bde2?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Banner para Loja', shortDescription: 'Destaque suas promoções.', fullDescription: 'Artes para banners rotativos ou fixos em e-commerce.', categoryId: catMap['Design Gráfico'], type: 'digital', mode: 'fixed', price: 180, estimatedTime: '2 dias', imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Flyer Promocional', shortDescription: 'Divulgue seu evento ou produto.', fullDescription: 'Design de flyer para impressão ou distribuição digital.', categoryId: catMap['Design Gráfico'], type: 'digital', mode: 'fixed', price: 90, estimatedTime: '2 dias', imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Card para Redes Sociais', shortDescription: 'Post profissional para Instagram/FB.', fullDescription: 'Arte individual para postagem em redes sociais.', categoryId: catMap['Design Gráfico'], type: 'digital', mode: 'fixed', price: 35, estimatedTime: '1 dia', imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },

            // EDIÇÃO DE VÍDEO
            { name: 'Edição de Reels/Shorts', shortDescription: 'Vídeos curtos e dinâmicos.', fullDescription: 'Edição com legendas, cortes rápidos e trilha sonora trend.', categoryId: catMap['Edição de Vídeo'], type: 'digital', mode: 'fixed', price: 40, estimatedTime: '1 dia', imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Vídeo Promocional 30s', shortDescription: 'Ideal para anúncios rápidos.', fullDescription: 'Edição focada em vendas para campanhas de tráfego pago.', categoryId: catMap['Edição de Vídeo'], type: 'digital', mode: 'fixed', price: 180, estimatedTime: '2 dias', imageUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Edição para YouTube', shortDescription: 'Vídeos longos com qualidade.', fullDescription: 'Cortes, correção de cor, áudio e elementos gráficos.', categoryId: catMap['Edição de Vídeo'], type: 'digital', mode: 'fixed', price: 250, estimatedTime: '3 dias', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Motion simples para anúncio', shortDescription: 'Animações que chamam atenção.', fullDescription: 'Elementos gráficos animados para destacar sua oferta.', categoryId: catMap['Edição de Vídeo'], type: 'digital', mode: 'fixed', price: 220, estimatedTime: '3 dias', imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Legendas dinâmicas', shortDescription: 'Aumente a retenção do seu vídeo.', fullDescription: 'Legendas coloridas e animadas estilo criadores famosos.', categoryId: catMap['Edição de Vídeo'], type: 'digital', mode: 'fixed', price: 60, estimatedTime: '1 dia', imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },

            // TRÁFEGO PAGO
            { name: 'Configuração de Campanha Meta Ads', shortDescription: 'Setup inicial de anúncios.', fullDescription: 'Configuração de pixel, públicos e primeira campanha.', categoryId: catMap['Tráfego Pago'], type: 'digital', mode: 'fixed', price: 250, estimatedTime: '2 dias', imageUrl: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Gestão Mensal de Tráfego Básica', shortDescription: 'Acompanhamento e otimização.', fullDescription: 'Gestão contínua de campanhas com relatórios semanais.', categoryId: catMap['Tráfego Pago'], type: 'digital', mode: 'fixed', price: 900, estimatedTime: 'Mensal', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Campanha para WhatsApp', shortDescription: 'Leads direto no seu celular.', fullDescription: 'Focada em levar clientes para o fechamento no Whats.', categoryId: catMap['Tráfego Pago'], type: 'digital', mode: 'fixed', price: 180, estimatedTime: '2 dias', imageUrl: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Campanha para Leads', shortDescription: 'Encha seu funil de vendas.', fullDescription: 'Campanhas de formulário ou conversão em landing page.', categoryId: catMap['Tráfego Pago'], type: 'digital', mode: 'fixed', price: 350, estimatedTime: '3 dias', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Auditoria de Anúncios', shortDescription: 'Descubra onde está perdendo dinheiro.', fullDescription: 'Análise detalhada de campanhas existentes com sugestões de melhoria.', categoryId: catMap['Tráfego Pago'], type: 'digital', mode: 'fixed', price: 200, estimatedTime: '2 dias', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },

            // SOCIAL MEDIA
            { name: 'Gestão Mensal Instagram Básica', shortDescription: 'Presença digital constante.', fullDescription: 'Postagens regulares, interação e gestão de perfil.', categoryId: catMap['Social Media'], type: 'digital', mode: 'fixed', price: 600, estimatedTime: 'Mensal', imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Calendário de Conteúdo', shortDescription: 'Saiba o que postar e quando.', fullDescription: 'Planejamento estratégico de temas para 30 dias.', categoryId: catMap['Social Media'], type: 'digital', mode: 'fixed', price: 180, estimatedTime: '3 dias', imageUrl: 'https://images.unsplash.com/photo-1506784919141-93b3393a4929?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Pacote com 12 posts', shortDescription: 'Artes profissionais para seu feed.', fullDescription: 'Criação de 12 artes com legendas e hashtags.', categoryId: catMap['Social Media'], type: 'digital', mode: 'fixed', price: 250, estimatedTime: '5 dias', imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Planejamento de Conteúdo', shortDescription: 'Estratégia para crescer.', fullDescription: 'Análise de concorrência e definição de pilares de conteúdo.', categoryId: catMap['Social Media'], type: 'digital', mode: 'fixed', price: 220, estimatedTime: '4 dias', imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Bio + Destaques + Ajuste de perfil', shortDescription: 'Primeira impressão profissional.', fullDescription: 'Otimização de bio, criação de capas para destaques e foto.', categoryId: catMap['Social Media'], type: 'digital', mode: 'fixed', price: 90, estimatedTime: '2 dias', imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },

            // AUTOMAÇÃO
            { name: 'Automação de WhatsApp', shortDescription: 'Atendimento 24h automático.', fullDescription: 'Respostas automáticas e fluxos de atendimento no Whats.', categoryId: catMap['Automação'], type: 'digital', mode: 'fixed', price: 450, estimatedTime: '5 dias', imageUrl: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Chatbot básico', shortDescription: 'Triagem automática de clientes.', fullDescription: 'Robô para responder dúvidas frequentes no site ou redes.', categoryId: catMap['Automação'], type: 'digital', mode: 'fixed', price: 600, estimatedTime: '7 dias', imageUrl: 'https://images.unsplash.com/photo-1531746790731-6c087fecd05a?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Integração com formulários', shortDescription: 'Dados onde você precisa.', fullDescription: 'Conecte seu site com planilhas, CRM ou e-mail.', categoryId: catMap['Automação'], type: 'digital', mode: 'fixed', price: 300, estimatedTime: '3 dias', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Resposta automática para leads', shortDescription: 'Não deixe o cliente esperando.', fullDescription: 'Envio imediato de proposta ou boas-vindas após contato.', categoryId: catMap['Automação'], type: 'digital', mode: 'fixed', price: 250, estimatedTime: '2 dias', imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Automação de atendimento', shortDescription: 'Fluxo completo de vendas.', fullDescription: 'Sistema inteligente que guia o cliente até a compra.', categoryId: catMap['Automação'], type: 'digital', mode: 'fixed', price: 700, estimatedTime: '10 dias', imageUrl: 'https://images.unsplash.com/photo-1531746790731-6c087fecd05a?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },

            // FACHADAS DE LOJA
            { name: 'Projeto de Fachada Simples', shortDescription: 'Visual renovado para sua loja.', fullDescription: 'Projeto visual 2D com sugestões de cores e materiais.', categoryId: catMap['Fachadas de Loja'], type: 'physical', mode: 'fixed', price: 600, estimatedTime: '5 dias', imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dee62?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Fachada Comercial Completa', shortDescription: 'Transformação total da sua marca.', fullDescription: 'Projeto executivo completo para fachadas de grande porte.', categoryId: catMap['Fachadas de Loja'], type: 'physical', mode: 'quote', price: 0, estimatedTime: 'Sob consulta', imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dee62?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Fachada com ACM', shortDescription: 'Modernidade e durabilidade.', fullDescription: 'Revestimento em ACM com acabamento premium.', categoryId: catMap['Fachadas de Loja'], type: 'physical', mode: 'quote', price: 0, estimatedTime: 'Sob consulta', imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dee62?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Atualização visual de fachada', shortDescription: 'Pequenos ajustes, grande impacto.', fullDescription: 'Pintura, novos adesivos e ajustes na iluminação.', categoryId: catMap['Fachadas de Loja'], type: 'physical', mode: 'fixed', price: 450, estimatedTime: '3 dias', imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dee62?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Fachada com iluminação', shortDescription: 'Destaque sua loja à noite.', fullDescription: 'Projeto e instalação de refletores e fitas LED.', categoryId: catMap['Fachadas de Loja'], type: 'physical', mode: 'quote', price: 0, estimatedTime: 'Sob consulta', imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dee62?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },

            // LETREIROS
            { name: 'Letreiro simples PVC', shortDescription: 'Economia com qualidade.', fullDescription: 'Letras recortadas em PVC expandido com pintura automotiva.', categoryId: catMap['Letreiros'], type: 'physical', mode: 'fixed', price: 350, estimatedTime: '7 dias', imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dee62?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Letreiro em acrílico', shortDescription: 'Brilho e sofisticação.', fullDescription: 'Letras em acrílico com corte a laser de alta precisão.', categoryId: catMap['Letreiros'], type: 'physical', mode: 'quote', price: 0, estimatedTime: 'Sob consulta', imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dee62?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Letreiro luminoso', shortDescription: 'Visibilidade total.', fullDescription: 'Letreiro com iluminação interna por LED.', categoryId: catMap['Letreiros'], type: 'physical', mode: 'quote', price: 0, estimatedTime: 'Sob consulta', imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dee62?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Letreiro caixa alta', shortDescription: 'Efeito 3D impactante.', fullDescription: 'Letras com profundidade em diversos materiais.', categoryId: catMap['Letreiros'], type: 'physical', mode: 'quote', price: 0, estimatedTime: 'Sob consulta', imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dee62?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Letreiro interno decorativo', shortDescription: 'Para recepções e escritórios.', fullDescription: 'Letreiros delicados para ambientes internos.', categoryId: catMap['Letreiros'], type: 'physical', mode: 'fixed', price: 280, estimatedTime: '5 dias', imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dee62?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },

            // ADESIVAÇÃO
            { name: 'Adesivação de vitrine', shortDescription: 'Atraia quem passa na rua.', fullDescription: 'Aplicação de adesivos promocionais ou decorativos em vidros.', categoryId: catMap['Adesivação'], type: 'physical', mode: 'fixed', price: 250, estimatedTime: '2 dias', imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dee62?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Adesivação de balcão', shortDescription: 'Personalize seu atendimento.', fullDescription: 'Revestimento de balcões com adesivo vinílico.', categoryId: catMap['Adesivação'], type: 'physical', mode: 'fixed', price: 180, estimatedTime: '2 dias', imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dee62?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Adesivo perfurado', shortDescription: 'Privacidade e propaganda.', fullDescription: 'Ideal para vidros traseiros de carros ou vitrines.', categoryId: catMap['Adesivação'], type: 'physical', mode: 'quote', price: 0, estimatedTime: 'Sob consulta', imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dee62?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Envelopamento parcial', shortDescription: 'Destaque sua frota.', fullDescription: 'Aplicação de adesivos em partes estratégicas do veículo.', categoryId: catMap['Adesivação'], type: 'physical', mode: 'quote', price: 0, estimatedTime: 'Sob consulta', imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dee62?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Adesivo promocional para loja', shortDescription: 'Anuncie ofertas rapidamente.', fullDescription: 'Adesivos de fácil aplicação e remoção.', categoryId: catMap['Adesivação'], type: 'physical', mode: 'fixed', price: 150, estimatedTime: '1 dia', imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dee62?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },

            // REFORMAS
            { name: 'Reforma comercial simples', shortDescription: 'Pequenos reparos em lojas.', fullDescription: 'Ajustes rápidos para manter seu comércio funcionando.', categoryId: catMap['Reformas'], type: 'physical', mode: 'quote', price: 0, estimatedTime: 'Sob consulta', imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Ajuste de acabamento', shortDescription: 'Detalhes que fazem diferença.', fullDescription: 'Correção de rodapés, molduras e pequenos detalhes.', categoryId: catMap['Reformas'], type: 'physical', mode: 'quote', price: 0, estimatedTime: 'Sob consulta', imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Reforma interna parcial', shortDescription: 'Renove um ambiente específico.', fullDescription: 'Foco em um cômodo ou área da sua loja.', categoryId: catMap['Reformas'], type: 'physical', mode: 'quote', price: 0, estimatedTime: 'Sob consulta', imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Reforma de sala comercial', shortDescription: 'Prepare seu novo escritório.', fullDescription: 'Divisórias, pintura e adequação de espaço.', categoryId: catMap['Reformas'], type: 'physical', mode: 'quote', price: 0, estimatedTime: 'Sob consulta', imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Pequenas correções estruturais', shortDescription: 'Segurança em primeiro lugar.', fullDescription: 'Reparos em rachaduras e infiltrações leves.', categoryId: catMap['Reformas'], type: 'physical', mode: 'quote', price: 0, estimatedTime: 'Sob consulta', imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },

            // PINTURA
            { name: 'Pintura de fachada comercial', shortDescription: 'Destaque seu negócio.', fullDescription: 'Pintura externa com tintas resistentes ao sol e chuva.', categoryId: catMap['Pintura'], type: 'physical', mode: 'quote', price: 0, estimatedTime: 'Sob consulta', imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185138a047a?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Pintura interna de loja', shortDescription: 'Ambiente novo para clientes.', fullDescription: 'Pintura rápida e limpa para não atrapalhar suas vendas.', categoryId: catMap['Pintura'], type: 'physical', mode: 'quote', price: 0, estimatedTime: 'Sob consulta', imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185138a047a?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Pintura decorativa', shortDescription: 'Estilo e personalidade.', fullDescription: 'Texturas, cimento queimado e outras técnicas.', categoryId: catMap['Pintura'], type: 'physical', mode: 'quote', price: 0, estimatedTime: 'Sob consulta', imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185138a047a?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Repintura rápida', shortDescription: 'Renovação express.', fullDescription: 'Ideal para entrega de imóveis ou mudanças rápidas.', categoryId: catMap['Pintura'], type: 'physical', mode: 'fixed', price: 300, estimatedTime: '2 dias', imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185138a047a?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Pintura de parede específica', shortDescription: 'Destaque um ambiente.', fullDescription: 'Pintura de uma única parede com cor diferenciada.', categoryId: catMap['Pintura'], type: 'physical', mode: 'fixed', price: 180, estimatedTime: '1 dia', imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185138a047a?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },

            // ELÉTRICA
            { name: 'Instalação de tomada', shortDescription: 'Mais praticidade no dia a dia.', fullDescription: 'Instalação ou troca de tomadas e interruptores.', categoryId: catMap['Elétrica'], type: 'physical', mode: 'fixed', price: 120, estimatedTime: '1 dia', imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Troca de disjuntor', shortDescription: 'Segurança para sua rede.', fullDescription: 'Substituição de disjuntores danificados ou antigos.', categoryId: catMap['Elétrica'], type: 'physical', mode: 'fixed', price: 150, estimatedTime: '1 dia', imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Revisão elétrica básica', shortDescription: 'Evite problemas futuros.', fullDescription: 'Check-up geral na fiação e quadro de energia.', categoryId: catMap['Elétrica'], type: 'physical', mode: 'fixed', price: 220, estimatedTime: '1 dia', imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Instalação de iluminação comercial', shortDescription: 'Luz certa para vender mais.', fullDescription: 'Instalação de trilhos, spots e luminárias.', categoryId: catMap['Elétrica'], type: 'physical', mode: 'quote', price: 0, estimatedTime: 'Sob consulta', imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Correção de falha elétrica', shortDescription: 'Resolva curtos e quedas.', fullDescription: 'Diagnóstico e reparo de problemas elétricos urgentes.', categoryId: catMap['Elétrica'], type: 'physical', mode: 'quote', price: 0, estimatedTime: 'Sob consulta', imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },

            // INSTALAÇÃO
            { name: 'Instalação de placa comercial', shortDescription: 'Sua marca visível.', fullDescription: 'Fixação segura de placas em fachadas ou paredes.', categoryId: catMap['Instalação'], type: 'physical', mode: 'quote', price: 0, estimatedTime: 'Sob consulta', imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Instalação de letreiro', shortDescription: 'Montagem profissional.', fullDescription: 'Instalação de letras caixa ou letreiros luminosos.', categoryId: catMap['Instalação'], type: 'physical', mode: 'quote', price: 0, estimatedTime: 'Sob consulta', imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Instalação de suporte e estrutura', shortDescription: 'Base sólida para sua marca.', fullDescription: 'Montagem de estruturas metálicas para comunicação visual.', categoryId: catMap['Instalação'], type: 'physical', mode: 'quote', price: 0, estimatedTime: 'Sob consulta', imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Montagem simples em loja', shortDescription: 'Ajustes rápidos de PDV.', fullDescription: 'Instalação de displays, prateleiras e elementos visuais.', categoryId: catMap['Instalação'], type: 'physical', mode: 'fixed', price: 250, estimatedTime: '1 dia', imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Instalação de comunicação visual', shortDescription: 'Tudo no lugar certo.', fullDescription: 'Serviço completo de instalação de adesivos, placas e banners.', categoryId: catMap['Instalação'], type: 'physical', mode: 'quote', price: 0, estimatedTime: 'Sob consulta', imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },

            // ASSISTÊNCIA TÉCNICA
            { name: 'Visita técnica', shortDescription: 'Avaliação presencial.', fullDescription: 'Deslocamento e diagnóstico inicial do problema.', categoryId: catMap['Assistência Técnica'], type: 'physical', mode: 'fixed', price: 100, estimatedTime: '1 dia', imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Diagnóstico técnico', shortDescription: 'Entenda o que precisa ser feito.', fullDescription: 'Análise detalhada com emissão de laudo e orçamento.', categoryId: catMap['Assistência Técnica'], type: 'physical', mode: 'fixed', price: 120, estimatedTime: '1 dia', imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Manutenção preventiva', shortDescription: 'Evite paradas inesperadas.', fullDescription: 'Limpeza e ajustes periódicos em seus equipamentos.', categoryId: catMap['Assistência Técnica'], type: 'physical', mode: 'quote', price: 0, estimatedTime: 'Sob consulta', imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Suporte técnico local', shortDescription: 'Ajuda quando você precisa.', fullDescription: 'Atendimento presencial para resolução de falhas.', categoryId: catMap['Assistência Técnica'], type: 'physical', mode: 'quote', price: 0, estimatedTime: 'Sob consulta', imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
            { name: 'Ajuste e reparo simples', shortDescription: 'Conserto rápido.', fullDescription: 'Reparos que não exigem troca de peças complexas.', categoryId: catMap['Assistência Técnica'], type: 'physical', mode: 'fixed', price: 150, estimatedTime: '1 dia', imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800', active: true, createdAt: serverTimestamp() },
          ];

          for (const ser of initialServices) {
            await addDoc(collection(db, 'services'), ser);
          }
        }

        // Add initial coupons
        const coupSnap = await getDocs(collection(db, 'coupons'));
        if (coupSnap.empty) {
          const catDocs = await getDocs(collection(db, 'categories'));
          const catMap: Record<string, string> = {};
          catDocs.forEach(doc => catMap[doc.data().name] = doc.id);

          const serDocs = await getDocs(collection(db, 'services'));
          const serMap: Record<string, string> = {};
          serDocs.forEach(doc => serMap[doc.data().name] = doc.id);

          const initialCoupons = [
            { code: 'BEMVINDO10', description: '10% de desconto na primeira contratação', discountType: 'percentage', discountValue: 10, appliesToCategory: null, appliesToService: null, minimumOrderValue: 0, usageLimit: 100, usedCount: 0, expiresAt: '2026-12-31', active: true, createdAt: serverTimestamp() },
            { code: 'SITE100', description: 'R$ 100 de desconto em serviços de Criação de Sites', discountType: 'fixed', discountValue: 100, appliesToCategory: catMap['Criação de Sites'], appliesToService: null, minimumOrderValue: 500, usageLimit: 50, usedCount: 0, expiresAt: '2026-12-31', active: true, createdAt: serverTimestamp() },
            { code: 'LOGO20', description: '20% de desconto em Criação de Logo', discountType: 'percentage', discountValue: 20, appliesToCategory: null, appliesToService: serMap['Criação de Logo'], minimumOrderValue: 0, usageLimit: 30, usedCount: 0, expiresAt: '2026-12-31', active: true, createdAt: serverTimestamp() },
            { code: 'LOJA15', description: '15% de desconto em Fachadas de Loja', discountType: 'percentage', discountValue: 15, appliesToCategory: catMap['Fachadas de Loja'], appliesToService: null, minimumOrderValue: 0, usageLimit: 20, usedCount: 0, expiresAt: '2026-12-31', active: true, createdAt: serverTimestamp() },
            { code: 'DIGITAL50', description: 'R$ 50 de desconto para pedidos acima de R$ 300 em serviços digitais', discountType: 'fixed', discountValue: 50, appliesToCategory: null, appliesToService: null, minimumOrderValue: 300, usageLimit: 100, usedCount: 0, expiresAt: '2026-12-31', active: true, createdAt: serverTimestamp() },
          ];

          for (const coup of initialCoupons) {
            await addDoc(collection(db, 'coupons'), coup);
          }
        }
      }
    };
    seed();
  }, [isAdmin]);

  return null;
};

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <SeedData />
        <Toaster position="top-right" theme="dark" richColors />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/catalog" element={<Layout><Catalog /></Layout>} />
          <Route path="/how-it-works" element={<Layout><HowItWorks /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/terms" element={<Layout><Terms /></Layout>} />
          <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
          <Route path="/faq" element={<Layout><FAQ /></Layout>} />
          <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
          <Route path="/service/:id" element={<Layout><ServiceDetail /></Layout>} />
          
          {/* Protected Client Routes */}
          <Route path="/my-orders" element={<ProtectedRoute><Layout><MyOrders /></Layout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Layout><Favorites /></Layout></ProtectedRoute>} />
          <Route path="/deposit" element={<ProtectedRoute><Layout><Deposit /></Layout></ProtectedRoute>} />
          <Route path="/support" element={<ProtectedRoute><Layout><SupportChat /></Layout></ProtectedRoute>} />
          <Route path="/order-chat/:orderId" element={<ProtectedRoute><Layout><OrderChat /></Layout></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="chats" element={<AdminChats />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
