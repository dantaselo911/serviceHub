import React from 'react';
import { Card } from '../components/ui';
import { motion } from 'motion/react';

export const Privacy = () => {
  return (
    <div className="min-h-screen bg-black pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold text-white mb-8">Política de Privacidade</h1>
          <p className="text-zinc-500 mb-12">Última atualização: 01 de Abril de 2026</p>

          <Card className="p-10 bg-zinc-950 border-zinc-900 space-y-8 text-zinc-400 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Coleta de Informações</h2>
              <p>
                Coletamos informações básicas de perfil quando você faz login através do Google, como seu nome, e-mail e foto de perfil. Também coletamos dados sobre suas transações e interações no chat para garantir a segurança e qualidade do serviço.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Uso das Informações</h2>
              <p>
                As informações coletadas são utilizadas para:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>Processar seus pedidos e pagamentos;</li>
                <li>Facilitar a comunicação entre clientes e prestadores;</li>
                <li>Melhorar nossa plataforma e serviços;</li>
                <li>Enviar notificações importantes sobre sua conta ou pedidos.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Proteção de Dados</h2>
              <p>
                Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados contra acesso não autorizado, alteração, divulgação ou destruição. Seus dados de pagamento são processados de forma segura através de nossos parceiros.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Compartilhamento de Informações</h2>
              <p>
                Não vendemos seus dados pessoais a terceiros. Compartilhamos informações apenas com prestadores de serviços necessários para a execução dos pedidos contratados ou quando exigido por lei.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Seus Direitos</h2>
              <p>
                Você tem o direito de acessar, corrigir ou excluir seus dados pessoais a qualquer momento através das configurações de sua conta ou entrando em contato com nosso suporte.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Cookies</h2>
              <p>
                Utilizamos cookies para melhorar sua experiência de navegação e lembrar suas preferências. Você pode gerenciar as configurações de cookies em seu navegador.
              </p>
            </section>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
