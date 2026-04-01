import React from 'react';
import { Card, Button } from '../components/ui';
import { Check, ShieldCheck, Zap, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export const Pricing = () => {
  return (
    <div className="min-h-screen bg-black pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold text-white mb-6">Preços Transparentes</h1>
            <p className="text-xl text-zinc-500">
              Na ServiceHub, você paga pelo que contrata. Sem taxas ocultas ou mensalidades surpresa.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <Card className="p-10 bg-zinc-950 border-zinc-900 flex flex-col">
            <h3 className="text-2xl font-bold text-white mb-4">Serviços Digitais</h3>
            <div className="text-4xl font-bold text-white mb-6">Preço Fixo</div>
            <p className="text-zinc-500 mb-8">Ideal para serviços padronizados com entregas claras.</p>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center text-zinc-400"><Check className="w-5 h-5 text-orange-500 mr-2" /> Pagamento Único</li>
              <li className="flex items-center text-zinc-400"><Check className="w-5 h-5 text-orange-500 mr-2" /> Prazo Definido</li>
              <li className="flex items-center text-zinc-400"><Check className="w-5 h-5 text-orange-500 mr-2" /> Revisões Inclusas</li>
              <li className="flex items-center text-zinc-400"><Check className="w-5 h-5 text-orange-500 mr-2" /> Suporte via Chat</li>
            </ul>
            <Link to="/catalog?type=digital">
              <Button variant="outline" className="w-full">Ver Serviços Digitais</Button>
            </Link>
          </Card>

          <Card className="p-10 bg-zinc-950 border-orange-500/50 shadow-2xl shadow-orange-950/10 relative flex flex-col">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest">Mais Procurado</div>
            <h3 className="text-2xl font-bold text-white mb-4">Projetos Customizados</h3>
            <div className="text-4xl font-bold text-white mb-6">Sob Orçamento</div>
            <p className="text-zinc-500 mb-8">Para projetos complexos que exigem análise técnica.</p>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center text-zinc-400"><Check className="w-5 h-5 text-orange-500 mr-2" /> Análise de Briefing</li>
              <li className="flex items-center text-zinc-400"><Check className="w-5 h-5 text-orange-500 mr-2" /> Escopo Flexível</li>
              <li className="flex items-center text-zinc-400"><Check className="w-5 h-5 text-orange-500 mr-2" /> Atendimento Exclusivo</li>
              <li className="flex items-center text-zinc-400"><Check className="w-5 h-5 text-orange-500 mr-2" /> Cronograma Personalizado</li>
            </ul>
            <Link to="/catalog">
              <Button className="w-full">Solicitar Orçamento</Button>
            </Link>
          </Card>

          <Card className="p-10 bg-zinc-950 border-zinc-900 flex flex-col">
            <h3 className="text-2xl font-bold text-white mb-4">Serviços Físicos</h3>
            <div className="text-4xl font-bold text-white mb-6">Visita Técnica</div>
            <p className="text-zinc-500 mb-8">Reformas e manutenções com avaliação no local.</p>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center text-zinc-400"><Check className="w-5 h-5 text-orange-500 mr-2" /> Avaliação Presencial</li>
              <li className="flex items-center text-zinc-400"><Check className="w-5 h-5 text-orange-500 mr-2" /> Orçamento Detalhado</li>
              <li className="flex items-center text-zinc-400"><Check className="w-5 h-5 text-orange-500 mr-2" /> Garantia de Serviço</li>
              <li className="flex items-center text-zinc-400"><Check className="w-5 h-5 text-orange-500 mr-2" /> Profissionais Verificados</li>
            </ul>
            <Link to="/catalog?type=physical">
              <Button variant="outline" className="w-full">Ver Serviços Físicos</Button>
            </Link>
          </Card>
        </div>

        <Card className="p-12 bg-zinc-950 border-zinc-900 text-center">
          <ShieldCheck className="w-12 h-12 text-orange-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Sua Segurança é nossa Prioridade</h2>
          <p className="text-zinc-500 max-w-2xl mx-auto mb-10">
            Utilizamos um sistema de saldo protegido. Seu pagamento só é liberado ao prestador após você confirmar a entrega e satisfação com o serviço.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center text-zinc-400"><Zap className="w-4 h-4 text-orange-500 mr-2" /> Sem Taxas Mensais</div>
            <div className="flex items-center text-zinc-400"><Zap className="w-4 h-4 text-orange-500 mr-2" /> Sem Taxas de Adesão</div>
            <div className="flex items-center text-zinc-400"><Zap className="w-4 h-4 text-orange-500 mr-2" /> Sem Fidelidade</div>
          </div>
        </Card>
      </div>
    </div>
  );
};
