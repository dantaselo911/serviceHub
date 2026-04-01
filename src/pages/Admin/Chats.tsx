import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, where, getDoc } from 'firebase/firestore';
import { Chat, UserProfile } from '../../types';
import { Card, Input, Badge, Button } from '../../components/ui';
import { Search, MessageSquare, ShoppingBag, Clock, User as UserIcon, Shield, ChevronRight, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChatWindow } from '../../components/Chat/ChatWindow';

export const AdminChats = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [users, setUsers] = useState<{ [uid: string]: UserProfile }>({});

  useEffect(() => {
    const q = query(collection(db, 'chats'), orderBy('updatedAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chatsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chat));
      setChats(chatsData);
      setLoading(false);

      // Fetch user profiles for chats
      const uids = Array.from(new Set(chatsData.map(c => c.userId)));
      const newUsers: { [uid: string]: UserProfile } = { ...users };
      
      for (const uid of uids) {
        if (!newUsers[uid]) {
          const userSnap = await getDoc(doc(db, 'users', uid));
          if (userSnap.exists()) {
            newUsers[uid] = userSnap.data() as UserProfile;
          }
        }
      }
      setUsers(newUsers);
    });

    return () => unsubscribe();
  }, []);

  const filteredChats = chats.filter(c => {
    const user = users[c.userId];
    const matchesSearch = user?.displayName.toLowerCase().includes(search.toLowerCase()) || 
                         user?.email.toLowerCase().includes(search.toLowerCase()) ||
                         c.lastMessage?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-8 space-y-8 bg-black min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Central de Atendimento</h1>
          <p className="text-zinc-500 mt-1">Gerencie todas as conversas de suporte e pedidos.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-200px)]">
        {/* Left Column: Chat List */}
        <div className="lg:col-span-1 flex flex-col space-y-4 h-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Buscar por cliente ou mensagem..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-zinc-900 border-zinc-800 text-white"
            />
          </div>

          <Card className="flex-grow overflow-y-auto bg-zinc-900/30 border-zinc-800 p-2 space-y-1 scrollbar-hide">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <MessageSquare className="w-8 h-8 text-zinc-700 mb-2" />
                <p className="text-sm text-zinc-500">Nenhuma conversa encontrada.</p>
              </div>
            ) : (
              filteredChats.map((chat) => {
                const user = users[chat.userId];
                const isActive = selectedChat?.id === chat.id;
                return (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={`w-full text-left p-4 rounded-xl transition-all flex items-center space-x-3 group ${
                      isActive 
                        ? 'bg-orange-600 shadow-lg shadow-orange-900/20' 
                        : 'bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800/50'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img 
                        src={user?.photoURL || 'https://via.placeholder.com/40'} 
                        className="w-12 h-12 rounded-full border-2 border-zinc-800" 
                        referrerPolicy="no-referrer"
                      />
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-zinc-900 ${chat.status === 'open' ? 'bg-green-500' : 'bg-zinc-500'}`} />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-bold truncate ${isActive ? 'text-white' : 'text-zinc-100'}`}>
                          {user?.displayName || 'Carregando...'}
                        </span>
                        <span className={`text-[10px] ${isActive ? 'text-orange-200' : 'text-zinc-500'}`}>
                          {chat.updatedAt?.toDate ? format(chat.updatedAt.toDate(), 'HH:mm', { locale: ptBR }) : ''}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className={`text-xs truncate ${isActive ? 'text-orange-100' : 'text-zinc-500'}`}>
                          {chat.lastMessage || 'Inicie a conversa...'}
                        </p>
                        {chat.type === 'order' && (
                          <ShoppingBag className={`w-3 h-3 ${isActive ? 'text-orange-200' : 'text-orange-500'}`} />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </Card>
        </div>

        {/* Right Column: Chat Window */}
        <div className="lg:col-span-2 h-full">
          {selectedChat ? (
            <div className="h-full flex flex-col">
              <ChatWindow 
                chatId={selectedChat.id} 
                title={users[selectedChat.userId]?.displayName || 'Conversa'} 
                subtitle={selectedChat.type === 'support' ? 'Suporte Geral' : `Pedido: ${selectedChat.orderId?.slice(0, 8)}`} 
              />
              <div className="mt-4 flex justify-end space-x-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-zinc-500 hover:text-white"
                  onClick={async () => {
                    const newStatus = selectedChat.status === 'open' ? 'closed' : 'open';
                    await updateDoc(doc(db, 'chats', selectedChat.id), { status: newStatus });
                    setSelectedChat({ ...selectedChat, status: newStatus });
                  }}
                >
                  {selectedChat.status === 'open' ? 'Fechar Conversa' : 'Reabrir Conversa'}
                </Button>
                {selectedChat.orderId && (
                  <Link to={`/admin/orders`}>
                    <Button variant="outline" size="sm">Ver Pedido</Button>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-zinc-800 rounded-2xl bg-zinc-900/10">
              <div className="p-6 bg-zinc-900 rounded-full mb-4">
                <MessageSquare className="w-12 h-12 text-zinc-700" />
              </div>
              <h3 className="text-xl font-bold text-zinc-600">Selecione uma Conversa</h3>
              <p className="text-sm text-zinc-700 max-w-xs mt-2">
                Escolha um chat na lista ao lado para visualizar o histórico e responder ao cliente.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
