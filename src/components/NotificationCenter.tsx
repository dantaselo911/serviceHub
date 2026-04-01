import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc, deleteDoc, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Notification } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button } from './ui';
import { Bell, BellOff, Check, Trash2, ExternalLink, X, Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export const NotificationCenter = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
      setNotifications(notifs);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notifications', id));
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.read);
    for (const n of unread) {
      await markAsRead(n.id);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-zinc-400 hover:text-white transition-colors focus:outline-none"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-orange-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-zinc-950">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 md:w-96 z-50 origin-top-right"
            >
              <Card className="bg-zinc-900 border-zinc-800 shadow-2xl overflow-hidden">
                <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                  <h3 className="font-bold text-white">Notificações</h3>
                  <div className="flex gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[10px] uppercase tracking-wider text-orange-500 hover:text-orange-400 font-bold"
                      >
                        Ler todas
                      </button>
                    )}
                    <button onClick={() => setIsOpen(false)}>
                      <X className="w-4 h-4 text-zinc-500 hover:text-white" />
                    </button>
                  </div>
                </div>

                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                  {loading ? (
                    <div className="p-8 text-center text-zinc-500 text-sm">Carregando...</div>
                  ) : notifications.length === 0 ? (
                    <div className="p-12 text-center space-y-3">
                      <BellOff className="w-10 h-10 text-zinc-800 mx-auto" />
                      <p className="text-zinc-500 text-sm">Nenhuma notificação por aqui.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-zinc-800">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-4 transition-colors hover:bg-zinc-800/50 relative group ${
                            !n.read ? 'bg-orange-500/5' : ''
                          }`}
                        >
                          <div className="flex gap-3">
                            <div className="mt-1">{getIcon(n.type)}</div>
                            <div className="flex-grow space-y-1">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className={`text-sm font-bold ${!n.read ? 'text-white' : 'text-zinc-300'}`}>
                                  {n.title}
                                </h4>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {!n.read && (
                                    <button
                                      onClick={() => markAsRead(n.id)}
                                      className="p-1 text-zinc-500 hover:text-green-500"
                                      title="Marcar como lida"
                                    >
                                      <Check className="w-3 h-3" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => deleteNotification(n.id)}
                                    className="p-1 text-zinc-500 hover:text-red-500"
                                    title="Excluir"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-xs text-zinc-400 leading-relaxed">
                                {n.message}
                              </p>
                              <div className="flex items-center justify-between pt-1">
                                <span className="text-[10px] text-zinc-600">
                                  {n.createdAt ? formatDistanceToNow(n.createdAt.toDate(), { 
                                    addSuffix: true,
                                    locale: ptBR 
                                  }) : 'Agora'}
                                </span>
                                {n.link && (
                                  <button
                                    onClick={() => {
                                      navigate(n.link!);
                                      setIsOpen(false);
                                      markAsRead(n.id);
                                    }}
                                    className="text-[10px] font-bold text-orange-500 hover:text-orange-400 flex items-center gap-1"
                                  >
                                    Ver mais
                                    <ExternalLink className="w-2 h-2" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-3 bg-zinc-950 border-t border-zinc-800 text-center">
                  <button 
                    onClick={() => {
                      navigate('/my-orders');
                      setIsOpen(false);
                    }}
                    className="text-[10px] uppercase tracking-wider text-zinc-500 hover:text-white font-bold"
                  >
                    Ver todas as atividades
                  </button>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
