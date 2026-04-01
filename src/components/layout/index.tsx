import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui';
import { Menu, X, LayoutDashboard, Briefcase, FileText, LogOut } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
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
    <header className="sticky top-0 z-50">
      {/* Title bar / brand bar */}
      <div className="win-titlebar" style={{ minHeight: 28 }}>
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 flex items-center justify-center"
            style={{ background: '#ff6600', border: '1px solid #882200' }}
          >
            <Briefcase className="text-white w-3 h-3" />
          </div>
          <span className="text-white text-sm font-bold tracking-wide" style={{ fontFamily: 'Tahoma, Arial, sans-serif' }}>
            ServiceHub
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <button className="win-btn w-5 h-4 p-0 text-xs leading-none flex items-center justify-center" aria-label="Minimize">_</button>
          <button className="win-btn w-5 h-4 p-0 text-xs leading-none flex items-center justify-center" aria-label="Maximize">□</button>
          <button
            className="win-btn w-5 h-4 p-0 text-xs leading-none flex items-center justify-center font-bold"
            aria-label="Close"
            style={{ background: '#aa0000', color: '#fff' }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Menu bar */}
      <nav className="win-menubar flex items-center justify-between px-2" style={{ background: '#d4d0c8' }}>
        <div className="hidden md:flex items-center gap-0">
          <Link
            to="/"
            className="px-3 py-0.5 text-xs hover:bg-[#000080] hover:text-white no-underline text-black"
            style={{ textDecoration: 'none', fontFamily: 'Tahoma, Arial, sans-serif' }}
          >
            Arquivo
          </Link>
          <Link
            to="/catalog"
            className="px-3 py-0.5 text-xs hover:bg-[#000080] hover:text-white no-underline text-black"
            style={{ textDecoration: 'none', fontFamily: 'Tahoma, Arial, sans-serif' }}
          >
            Serviços
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="px-3 py-0.5 text-xs hover:bg-[#000080] hover:text-white no-underline"
              style={{ textDecoration: 'none', color: '#800000', fontFamily: 'Tahoma, Arial, sans-serif', fontWeight: 'bold' }}
            >
              Admin
            </Link>
          )}
          {user && (
            <Link
              to="/my-orders"
              className="px-3 py-0.5 text-xs hover:bg-[#000080] hover:text-white no-underline text-black"
              style={{ textDecoration: 'none', fontFamily: 'Tahoma, Arial, sans-serif' }}
            >
              Pedidos
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center gap-1">
          {user ? (
            <>
              <NotificationCenter />
              <div className="flex items-center gap-1 win-sunken px-2 py-0.5 mr-1">
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-4 h-4 rounded-none"
                  style={{ border: '1px solid #808080' }}
                />
                <span className="text-xs" style={{ fontFamily: 'Tahoma, Arial, sans-serif' }}>
                  {user.displayName.split(' ')[0]}
                </span>
              </div>
              <Link
                to="/profile"
                className="win-btn text-xs py-0 px-2"
                style={{ textDecoration: 'none' }}
              >
                Perfil
              </Link>
              <button onClick={handleSignOut} className="win-btn text-xs py-0 px-2 flex items-center gap-1">
                <LogOut className="w-3 h-3" /> Sair
              </button>
            </>
          ) : (
            <Button onClick={login} variant="primary" size="sm" className="text-xs py-0.5 px-3">
              Entrar com Google
            </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="win-btn p-1"
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{ background: '#d4d0c8', borderBottom: '2px solid #404040' }}
          >
            <div className="px-3 py-2 flex flex-col gap-1">
              <Link to="/catalog" className="win-btn text-xs text-left justify-start" style={{ textDecoration: 'none' }} onClick={() => setIsMenuOpen(false)}>
                Serviços
              </Link>
              {user ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ fontFamily: 'Tahoma, Arial, sans-serif' }}>Notificações</span>
                    <NotificationCenter />
                  </div>
                  {isAdmin && (
                    <Link to="/admin" className="win-btn text-xs text-left justify-start" style={{ textDecoration: 'none', color: '#800000' }} onClick={() => setIsMenuOpen(false)}>
                      Painel Admin
                    </Link>
                  )}
                  <Link to="/my-orders" className="win-btn text-xs text-left justify-start" style={{ textDecoration: 'none' }} onClick={() => setIsMenuOpen(false)}>
                    Meus Pedidos
                  </Link>
                  <Link to="/profile" className="win-btn text-xs text-left justify-start" style={{ textDecoration: 'none' }} onClick={() => setIsMenuOpen(false)}>
                    Perfil
                  </Link>
                  <button onClick={handleSignOut} className="win-btn text-xs flex items-center gap-1" style={{ color: '#800000' }}>
                    <LogOut className="w-3 h-3" /> Sair
                  </button>
                </>
              ) : (
                <Button onClick={login} variant="primary" size="sm" className="w-full">
                  Entrar com Google
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Address bar */}
      <div
        className="hidden md:flex items-center gap-2 px-2 py-1"
        style={{ background: '#d4d0c8', borderBottom: '1px solid #808080' }}
      >
        <span className="text-xs" style={{ fontFamily: 'Tahoma, Arial, sans-serif', color: '#444' }}>Endereço:</span>
        <div
          className="win-sunken flex-1 flex items-center px-2"
          style={{ background: '#fff', minHeight: 20 }}
        >
          <span className="text-xs" style={{ fontFamily: 'Tahoma, Arial, sans-serif', color: '#000080' }}>
            http://servicehub.com.br/
          </span>
        </div>
        <button className="win-btn text-xs px-3 py-0">Ir</button>
      </div>
    </header>
  );
};

export const Footer = () => (
  <footer style={{ background: '#d4d0c8', borderTop: '2px solid #404040' }}>
    {/* Status bar style footer */}
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1 md:col-span-2">
          <div
            className="win-panel p-3 mb-3"
          >
            <div className="win-titlebar mb-2">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 flex items-center justify-center" style={{ background: '#ff6600' }}>
                  <Briefcase className="text-white w-2.5 h-2.5" />
                </div>
                <span className="text-white text-xs font-bold">ServiceHub</span>
              </div>
            </div>
            <p className="text-xs px-1" style={{ fontFamily: 'Tahoma, Arial, sans-serif', lineHeight: 1.5 }}>
              A plataforma definitiva para encontrar e contratar os melhores profissionais para serviços digitais e físicos. Qualidade premium garantida.
            </p>
          </div>
        </div>

        <div>
          <div className="win-panel">
            <div className="win-titlebar">
              <span className="text-white text-xs font-bold">Plataforma</span>
            </div>
            <ul className="p-2 space-y-1 text-xs" style={{ fontFamily: 'Tahoma, Arial, sans-serif' }}>
              <li><Link to="/catalog" className="text-[#0000ff] hover:text-[#ff0000]">Catálogo de Serviços</Link></li>
              <li><Link to="/how-it-works" className="text-[#0000ff] hover:text-[#ff0000]">Como funciona</Link></li>
              <li><Link to="/pricing" className="text-[#0000ff] hover:text-[#ff0000]">Preços</Link></li>
            </ul>
          </div>
        </div>

        <div>
          <div className="win-panel">
            <div className="win-titlebar">
              <span className="text-white text-xs font-bold">Suporte</span>
            </div>
            <ul className="p-2 space-y-1 text-xs" style={{ fontFamily: 'Tahoma, Arial, sans-serif' }}>
              <li><Link to="/contact" className="text-[#0000ff] hover:text-[#ff0000]">Contato</Link></li>
              <li><Link to="/faq" className="text-[#0000ff] hover:text-[#ff0000]">FAQ</Link></li>
              <li><Link to="/terms" className="text-[#0000ff] hover:text-[#ff0000]">Termos de Uso</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    {/* Windows status bar */}
    <div className="win-statusbar">
      <div className="win-sunken px-3 py-0.5 text-xs flex items-center gap-1">
        <span style={{ color: '#000080' }}>&#128994;</span>
        Pronto
      </div>
      <div className="win-sunken px-3 py-0.5 text-xs ml-auto">
        &copy; {new Date().getFullYear()} ServiceHub Premium
      </div>
    </div>
  </footer>
);
