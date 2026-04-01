import React from 'react';
import { Card } from '../components/ui';
import { motion } from 'motion/react';

export const Terms = () => {
  return (
    <div className="min-h-screen bg-black pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold text-white mb-8">Termos de Uso</h1>
          <p className="text-zinc-500 mb-12">Última atualização: 01 de Abril de 2026</p>

          <Card className="p-10 bg-zinc-950 border-zinc-900 space-y-8 text-zinc-400 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e utilizar a plataforma ServiceHub, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Descrição do Serviço</h2>
              <p>
                A ServiceHub é uma plataforma que conecta clientes a prestadores de serviços. Atuamos como intermediários, facilitando a comunicação, o pagamento e a entrega dos serviços contratados.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Cadastro e Segurança</h2>
              <p>
                Para utilizar certas funcionalidades, você deve se cadastrar utilizando sua conta Google. Você é responsável por manter a segurança de sua conta e por todas as atividades que ocorrem sob ela.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Pagamentos e Saldo</h2>
              <p>
                A plataforma utiliza um sistema de saldo pré-pago. Os usuários adicionam fundos via PIX. Ao contratar um serviço, o valor correspondente é retido pela plataforma e liberado ao prestador somente após a confirmação da entrega pelo cliente ou após o prazo de garantia.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Cancelamentos e Estornos</h2>
              <p>
                Cancelamentos podem ser solicitados através do nosso canal de suporte. O estorno do saldo será avaliado caso a caso, dependendo do estágio de execução do serviço contratado.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Conduta do Usuário</h2>
              <p>
                Você concorda em utilizar a plataforma de forma ética e legal. É proibido o uso da ServiceHub para atividades fraudulentas, ilegais ou que violem os direitos de terceiros.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Limitação de Responsabilidade</h2>
              <p>
                A ServiceHub não se responsabiliza por danos diretos ou indiretos resultantes do uso da plataforma ou da qualidade dos serviços prestados por terceiros, embora façamos o melhor para verificar todos os profissionais.
              </p>
            </section>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
