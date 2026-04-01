import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, limit } from 'firebase/firestore';
import { Chat } from '../types';
import { ChatWindow } from '../components/Chat/ChatWindow';
import { MessageSquare, ShieldCheck, Clock, HelpCircle } from 'lucide-react';
import { Card } from '../components/ui';
import { motion } from 'motion/react';

export const SupportChat = () => {
  const { user } = useAuth();
  const [chatId, setChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const findOrCreateChat = async () => {
      try {
        const q = query(
          collection(db, 'chats'),
          where('userId', '==', user.uid),
          where('type', '==', 'support'),
          limit(1)
        );

        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          setChatId(snapshot.docs[0].id);
        } else {
          // Create new support chat
          const docRef = await addDoc(collection(db, 'chats'), {
            userId: user.uid,
            type: 'support',
            status: 'open',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          setChatId(docRef.id);
        }
      } catch (error) {
        console.error("Error finding/creating chat", error);
      } finally {
        setLoading(false);
      }
    };

    findOrCreateChat();
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Info */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-orange-500" />
                Central de Dúvidas
              </h1>
              <p className="text-zinc-500 mt-2">
                Fale diretamente com nossa equipe de suporte para tirar dúvidas sobre serviços, pagamentos ou orçamentos.
              </p>
            </div>

            <Card className="p-6 bg-zinc-900/50 border-zinc-800 space-y-6">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Suporte Especializado</h4>
                  <p className="text-xs text-zinc-500 mt-1">Nossa equipe é treinada para resolver qualquer problema técnico ou comercial.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Tempo de Resposta</h4>
                  <p className="text-xs text-zinc-500 mt-1">Respondemos em média em até 15 minutos durante o horário comercial.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <HelpCircle className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">FAQ Rápido</h4>
                  <p className="text-xs text-zinc-500 mt-1">Como funciona o saldo? O saldo é creditado via PIX e pode ser usado em qualquer serviço.</p>
                </div>
              </div>
            </Card>

            <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800 text-center">
              <p className="text-xs text-zinc-500">
                Horário de Atendimento: <br />
                <span className="text-zinc-300 font-medium">Segunda a Sexta, 08:00 às 18:00</span>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Chat Window */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="h-[600px] bg-zinc-900/20 rounded-2xl border border-zinc-800 border-dashed flex items-center justify-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 bg-zinc-800 rounded-full mb-4" />
                <div className="w-32 h-4 bg-zinc-800 rounded" />
              </div>
            </div>
          ) : chatId ? (
            <ChatWindow 
              chatId={chatId} 
              title="Suporte ServiceHub" 
              subtitle="Online agora" 
            />
          ) : (
            <div className="h-[600px] flex items-center justify-center text-zinc-500">
              Erro ao inicializar chat.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
