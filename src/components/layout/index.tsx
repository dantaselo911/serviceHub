import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui';
import { Menu, X, User, LogOut, LayoutDashboard, Briefcase, FileText, Search, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NotificationCenter } from '../NotificationCenter';

export const Navbar = () => {
  const { user, login, signOut, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <Briefcase className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">ServiceHub</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/catalog" className="text-zinc-400 hover:text-white transition-colors">Serviços</Link>
            {user ? (
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <Link to="/admin" className="text-orange-500 hover:text-orange-400 font-medium flex items-center">
                    <LayoutDashboard className="w-4 h-4 mr-1" /> Painel Admin
                  </Link>
                )}
                <Link to="/my-orders" className="text-zinc-400 hover:text-white transition-colors flex items-center">
                  <FileText className="w-4 h-4 mr-1" /> Pedidos
                </Link>
                <NotificationCenter />
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-zinc-300 hover:text-white transition-colors">
                    <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full border border-zinc-700" />
                    <span className="text-sm font-medium">{user.displayName.split(' ')[0]}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white">Perfil</Link>
                    <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-800 hover:text-red-300 flex items-center">
                      <LogOut className="w-4 h-4 mr-2" /> Sair
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Button onClick={login} variant="primary" size="sm">Entrar com Google</Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-zinc-400 hover:text-white">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-900 border-b border-zinc-800 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              <Link to="/catalog" className="block text-zinc-400 hover:text-white py-2" onClick={() => setIsMenuOpen(false)}>Serviços</Link>
              {user ? (
                <>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-zinc-400">Notificações</span>
                    <NotificationCenter />
                  </div>
                  {isAdmin && <Link to="/admin" className="block text-orange-500 font-medium py-2" onClick={() => setIsMenuOpen(false)}>Painel Admin</Link>}
                  <Link to="/my-orders" className="block text-zinc-400 hover:text-white py-2" onClick={() => setIsMenuOpen(false)}>Meus Pedidos</Link>
                  <Link to="/profile" className="block text-zinc-400 hover:text-white py-2" onClick={() => setIsMenuOpen(false)}>Perfil</Link>
                  <button onClick={handleSignOut} className="w-full text-left text-red-400 py-2 flex items-center">
                    <LogOut className="w-4 h-4 mr-2" /> Sair
                  </button>
                </>
              ) : (
                <Button onClick={login} variant="primary" className="w-full">Entrar com Google</Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export const Footer = () => (
  <footer className="bg-black border-t border-zinc-900 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <Briefcase className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">ServiceHub</span>
          </div>
          <p className="text-zinc-500 max-w-sm">
            A plataforma definitiva para encontrar e contratar os melhores profissionais para serviços digitais e físicos. Qualidade premium garantida.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Plataforma</h4>
          <ul className="space-y-2 text-zinc-500 text-sm">
            <li><Link to="/catalog" className="hover:text-orange-500 transition-colors">Catálogo de Serviços</Link></li>
            <li><Link to="/how-it-works" className="hover:text-orange-500 transition-colors">Como funciona</Link></li>
            <li><Link to="/pricing" className="hover:text-orange-500 transition-colors">Preços</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Suporte</h4>
          <ul className="space-y-2 text-zinc-500 text-sm">
            <li><Link to="/contact" className="hover:text-orange-500 transition-colors">Contato</Link></li>
            <li><Link to="/faq" className="hover:text-orange-500 transition-colors">FAQ</Link></li>
            <li><Link to="/terms" className="hover:text-orange-500 transition-colors">Termos de Uso</Link></li>
          </ul>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-zinc-900 text-center text-zinc-600 text-sm">
        &copy; {new Date().getFullYear()} ServiceHub Premium. Todos os direitos reservados.
      </div>
    </div>
  </footer>
);
