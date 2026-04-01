import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Input } from '../components/ui';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.');
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold text-white mb-6">Entre em Contato</h1>
            <p className="text-xl text-zinc-500">
              Estamos aqui para ajudar. Escolha o melhor canal para falar conosco.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="p-8 bg-zinc-950 border-zinc-900">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-600/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">E-mail</h4>
                  <p className="text-zinc-500 text-sm">contato@servicehub.com.br</p>
                  <p className="text-zinc-500 text-sm">suporte@servicehub.com.br</p>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-zinc-950 border-zinc-900">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-600/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Telefone</h4>
                  <p className="text-zinc-500 text-sm">+55 (11) 99999-9999</p>
                  <p className="text-zinc-500 text-sm">Seg - Sex, 9h às 18h</p>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-zinc-950 border-zinc-900">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-600/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Endereço</h4>
                  <p className="text-zinc-500 text-sm">Av. Paulista, 1000 - Bela Vista</p>
                  <p className="text-zinc-500 text-sm">São Paulo - SP, 01310-100</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-10 bg-zinc-950 border-zinc-900 h-full">
              <h3 className="text-2xl font-bold text-white mb-8">Envie uma Mensagem</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Nome Completo</label>
                    <Input placeholder="Seu nome" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">E-mail</label>
                    <Input type="email" placeholder="seu@email.com" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Assunto</label>
                  <Input placeholder="Como podemos ajudar?" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Mensagem</label>
                  <textarea 
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all min-h-[150px] resize-none"
                    placeholder="Sua mensagem detalhada..."
                    required
                  />
                </div>
                <Button type="submit" className="w-full py-6 text-lg group">
                  <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  Enviar Mensagem
                </Button>
              </form>
            </Card>
          </div>
        </div>

        {/* Live Support CTA */}
        <div className="mt-20 text-center">
          <Card className="p-12 bg-orange-600/5 border-orange-600/20">
            <MessageSquare className="w-12 h-12 text-orange-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Precisa de ajuda imediata?</h2>
            <p className="text-zinc-500 mb-8 max-w-xl mx-auto">
              Nossos consultores estão online agora mesmo para tirar suas dúvidas e ajudar você a encontrar o melhor serviço.
            </p>
            <Link to="/support">
              <Button size="lg" className="px-10">Iniciar Chat ao Vivo</Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};
