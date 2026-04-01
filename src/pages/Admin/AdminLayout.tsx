import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui';
import { LayoutDashboard, ShoppingBag, Briefcase, Users, Settings, LogOut, ArrowLeft, Layers } from 'lucide-react';

export const AdminLayout = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Acesso Negado.</div>;

  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col">
        <div className="p-6 border-b border-zinc-900">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <Briefcase className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">AdminHub</span>
          </Link>
        </div>

        <nav className="flex-grow p-4 space-y-2">
          <Link to="/admin" className="flex items-center space-x-3 px-4 py-3 text-zinc-400 hover:bg-zinc-900 hover:text-white rounded-lg transition-all">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link to="/admin/services" className="flex items-center space-x-3 px-4 py-3 text-zinc-400 hover:bg-zinc-900 hover:text-white rounded-lg transition-all">
            <Briefcase className="w-5 h-5" />
            <span className="font-medium">Serviços</span>
          </Link>
          <Link to="/admin/orders" className="flex items-center space-x-3 px-4 py-3 text-zinc-400 hover:bg-zinc-900 hover:text-white rounded-lg transition-all">
            <ShoppingBag className="w-5 h-5" />
            <span className="font-medium">Pedidos</span>
          </Link>
          <Link to="/admin/categories" className="flex items-center space-x-3 px-4 py-3 text-zinc-400 hover:bg-zinc-900 hover:text-white rounded-lg transition-all">
            <Layers className="w-5 h-5" />
            <span className="font-medium">Categorias</span>
          </Link>
          <Link to="/admin/users" className="flex items-center space-x-3 px-4 py-3 text-zinc-400 hover:bg-zinc-900 hover:text-white rounded-lg transition-all">
            <Users className="w-5 h-5" />
            <span className="font-medium">Usuários</span>
          </Link>
          <Link to="/admin/settings" className="flex items-center space-x-3 px-4 py-3 text-zinc-400 hover:bg-zinc-900 hover:text-white rounded-lg transition-all">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Configurações</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-zinc-900">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center space-x-3 px-4 py-3 text-zinc-400 hover:bg-zinc-900 hover:text-white rounded-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar ao Site</span>
          </button>
          <button 
            onClick={() => signOut()}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-900/10 rounded-lg transition-all mt-2"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
