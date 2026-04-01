import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar, Footer } from './components/layout';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { ServiceDetail } from './pages/ServiceDetail';
import { MyOrders } from './pages/MyOrders';
import { Profile } from './pages/Profile';
import { Deposit } from './pages/Deposit';
import { AdminLayout } from './pages/Admin/AdminLayout';
import { AdminDashboard } from './pages/Admin/Dashboard';
import { AdminServices } from './pages/Admin/Services';
import { AdminOrders } from './pages/Admin/Orders';
import { AdminCategories } from './pages/Admin/Categories';
import { AdminUsers } from './pages/Admin/Users';
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
            {
              name: 'Landing Page Premium',
              shortDescription: 'Criação de landing page de alta conversão com design moderno e responsivo.',
              fullDescription: 'Desenvolvemos landing pages focadas em conversão, utilizando as melhores práticas de UX/UI. Inclui integração com formulários, design responsivo, otimização de velocidade e SEO básico.',
              categoryId: catMap['Criação de Sites'],
              type: 'digital',
              mode: 'fixed',
              price: 1500,
              estimatedTime: '7-10 dias',
              imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
              active: true,
              createdAt: serverTimestamp(),
            },
            {
              name: 'Identidade Visual Completa',
              shortDescription: 'Criação de logotipo, paleta de cores, tipografia e manual da marca.',
              fullDescription: 'Construímos a alma da sua marca. O pacote inclui logotipo (3 variações), manual da marca, paleta de cores, tipografia e artes para redes sociais.',
              categoryId: catMap['Design Gráfico'],
              type: 'digital',
              mode: 'fixed',
              price: 2500,
              estimatedTime: '15 dias',
              imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800',
              active: true,
              createdAt: serverTimestamp(),
            },
            {
              name: 'Reforma Residencial',
              shortDescription: 'Serviços de reforma completa para sua casa ou apartamento.',
              fullDescription: 'Equipe especializada em reformas residenciais. Pintura, elétrica, hidráulica e acabamentos. Solicite um orçamento para uma visita técnica.',
              categoryId: catMap['Reformas'],
              type: 'physical',
              mode: 'quote',
              price: 0,
              estimatedTime: 'Sob consulta',
              location: 'São Paulo e Região',
              imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800',
              active: true,
              createdAt: serverTimestamp(),
            }
          ];

          for (const ser of initialServices) {
            await addDoc(collection(db, 'services'), ser);
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
          <Route path="/service/:id" element={<Layout><ServiceDetail /></Layout>} />
          
          {/* Protected Client Routes */}
          <Route path="/my-orders" element={<ProtectedRoute><Layout><MyOrders /></Layout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
          <Route path="/deposit" element={<ProtectedRoute><Layout><Deposit /></Layout></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
