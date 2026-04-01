import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { Message, Chat } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { Send, Paperclip, Loader2, User as UserIcon, Shield } from 'lucide-react';
import { Button, Input, Card } from '../ui';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ChatWindowProps {
  chatId: string;
  title: string;
  subtitle?: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ chatId, title, subtitle }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, `chats/${chatId}/messages`),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(msgs);
      setLoading(false);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [chatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setSending(true);
    try {
      const messageText = newMessage.trim();
      setNewMessage('');

      await addDoc(collection(db, `chats/${chatId}/messages`), {
        chatId,
        senderId: user.uid,
        text: messageText,
        createdAt: serverTimestamp(),
      });

      // Update chat last message
      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: messageText,
        lastMessageAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error sending message", error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] bg-zinc-950 rounded-2xl border border-zinc-800">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-4" />
        <p className="text-zinc-500">Carregando conversa...</p>
      </div>
    );
  }

  return (
    <Card className="flex flex-col h-[600px] bg-zinc-950 border-zinc-800 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{title}</h3>
            {subtitle && <p className="text-xs text-zinc-500">{subtitle}</p>}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
            <div className="p-3 bg-zinc-900 rounded-full">
              <Send className="w-6 h-6 text-zinc-700" />
            </div>
            <p className="text-zinc-500 text-sm">Inicie a conversa enviando uma mensagem abaixo.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === user?.uid;
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    isMe
                      ? 'bg-orange-600 text-white rounded-tr-none shadow-lg shadow-orange-900/20'
                      : 'bg-zinc-800 text-zinc-100 rounded-tl-none'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                  <div
                    className={`text-[10px] mt-1 opacity-50 ${
                      isMe ? 'text-right' : 'text-left'
                    }`}
                  >
                    {msg.createdAt?.toDate ? format(msg.createdAt.toDate(), 'HH:mm', { locale: ptBR }) : '...'}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-800 bg-zinc-900/30">
        <div className="flex items-center space-x-2">
          <Button type="button" variant="ghost" size="sm" className="text-zinc-500 hover:text-white p-2">
            <Paperclip className="w-5 h-5" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-grow bg-zinc-950 border-zinc-800 text-white focus:ring-orange-500/50"
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="bg-orange-600 hover:bg-orange-700 text-white p-2 h-10 w-10 flex items-center justify-center rounded-xl"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </form>
    </Card>
  );
};
