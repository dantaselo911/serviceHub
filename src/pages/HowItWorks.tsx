import React from 'react';
import { Card, Button } from '../components/ui';
import { Search, FileText, CreditCard, CheckCircle2, MessageSquare, ShieldCheck, Zap, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "1. Explore e Encontre",
      description: "Navegue pelo nosso catálogo de serviços premium. Use filtros para encontrar exatamente o que você precisa, seja digital ou presencial."
    },
    {
      icon: FileText,
      title: "2. Solicite ou Contrate",
      description: "Contrate serviços de preço fixo instantaneamente ou solicite um orçamento personalizado para projetos sob medida."
    },
    {
      icon: CreditCard,
      title: "3. Pagamento Seguro",
      description: "Adicione saldo via PIX e pague com segurança. O valor fica retido na plataforma até que o serviço seja entregue."
    },
    {
      icon: MessageSquare,
      title: "4. Acompanhe via Chat",
      description: "Comunique-se diretamente com o prestador ou administrador através do nosso chat integrado para alinhar detalhes e tirar dúvidas."
    },
    {
      icon: CheckCircle2,
      title: "5. Receba e Avalie",
      description: "Após a conclusão do serviço, revise o trabalho entregue e libere o pagamento. Sua avaliação ajuda a manter a qualidade da comunidade."
    }
  ];

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold text-white mb-6">Como a ServiceHub Funciona</h1>
            <p className="text-xl text-zinc-500">
              Uma plataforma simplificada para conectar você aos melhores profissionais do mercado com total segurança e transparência.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-8 h-full bg-zinc-950 border-zinc-900 hover:border-orange-500/30 transition-all group">
                <div className="w-16 h-16 bg-orange-600/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-600/20 transition-colors">
                  <step.icon className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-zinc-500 leading-relaxed">{step.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="bg-zinc-950 rounded-3xl p-12 border border-zinc-900 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-600/10 to-transparent pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Por que escolher a ServiceHub?</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <ShieldCheck className="w-6 h-6 text-orange-500 mt-1" />
                  <div>
                    <h4 className="text-white font-bold">Segurança Garantida</h4>
                    <p className="text-zinc-500">Seu dinheiro só é liberado após a confirmação da entrega do serviço.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Zap className="w-6 h-6 text-orange-500 mt-1" />
                  <div>
                    <h4 className="text-white font-bold">Agilidade no Processo</h4>
                    <p className="text-zinc-500">Interface intuitiva e comunicação direta para acelerar seus projetos.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Star className="w-6 h-6 text-orange-500 mt-1" />
                  <div>
                    <h4 className="text-white font-bold">Qualidade Premium</h4>
                    <p className="text-zinc-500">Apenas os melhores profissionais são aceitos em nossa plataforma.</p>
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <Link to="/catalog">
                  <Button size="lg">Começar Agora</Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1600880212340-02d956ea3b85?auto=format&fit=crop&q=80&w=800" 
                alt="Equipe trabalhando" 
                className="rounded-2xl shadow-2xl border border-zinc-800"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
