import React from 'react';
import { Card } from '../components/ui';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';

export const FAQ = () => {
  const faqs = [
    {
      q: "Como faço para contratar um serviço?",
      a: "Basta navegar pelo catálogo, escolher o serviço desejado, preencher o briefing e realizar o pagamento. Se for um serviço sob orçamento, você solicita o valor e aguarda o retorno do prestador."
    },
    {
      q: "O pagamento é seguro?",
      a: "Sim! Utilizamos um sistema de saldo em conta. Você adiciona fundos via PIX e o valor fica retido na plataforma até que você confirme o recebimento do serviço."
    },
    {
      q: "Como funciona o chat?",
      a: "Após a contratação ou solicitação de orçamento, um chat exclusivo é aberto entre você e o administrador/prestador para alinhar todos os detalhes do projeto."
    },
    {
      q: "Posso cancelar um pedido?",
      a: "Sim, desde que o serviço ainda não tenha sido iniciado. Entre em contato com o suporte para solicitar o cancelamento e estorno do saldo."
    },
    {
      q: "Como me torno um prestador?",
      a: "Atualmente, a ServiceHub seleciona prestadores de forma manual para garantir a qualidade. Se você tem interesse, entre em contato através do nosso e-mail de suporte."
    },
    {
      q: "Qual o prazo de entrega dos serviços?",
      a: "Cada serviço possui um prazo estimado exibido em sua página de detalhes. O prazo exato será alinhado via chat após a contratação."
    }
  ];

  return (
    <div className="min-h-screen bg-black pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold text-white mb-8">Perguntas Frequentes</h1>
          <p className="text-zinc-500 mb-12">Tudo o que você precisa saber sobre a ServiceHub.</p>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden transition-all hover:border-zinc-800">
                <summary className="flex items-center justify-between p-8 cursor-pointer list-none">
                  <span className="text-xl font-semibold text-white">{faq.q}</span>
                  <Plus className="w-6 h-6 text-zinc-500 group-open:rotate-45 transition-transform" />
                </summary>
                <div className="px-8 pb-8 text-zinc-400 leading-relaxed text-lg">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
