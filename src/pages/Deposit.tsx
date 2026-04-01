import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button, Input } from '../components/ui';
import { Wallet, QrCode, Copy, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

export const Deposit = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<{ qrcodeUrl: string, copyPaste: string, transactionId: string } | null>(null);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount < 1) {
      toast.error('Valor mínimo para depósito é R$ 1,00');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/payments/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: numAmount,
          description: `Depósito ServiceHub - ${user?.email}`,
          payerName: user?.displayName || 'Cliente',
          payerDocument: '12345678900', // In a real app, we'd ask for this
        }),
      });

      const data = await response.json();
      if (data.success) {
        setPixData(data);
        toast.success('QR Code gerado com sucesso!');
      } else {
        toast.error(data.error || 'Erro ao gerar QR Code');
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Código copiado!');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white tracking-tight mb-4">Adicionar Saldo</h1>
        <p className="text-zinc-400 max-w-lg mx-auto">
          Adicione saldo à sua conta para contratar serviços de forma rápida e segura via PIX.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-8 bg-zinc-900/50 border-zinc-800">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Wallet className="w-6 h-6 text-orange-500" />
            </div>
            <h2 className="text-xl font-bold text-white">Novo Depósito</h2>
          </div>

          <form onSubmit={handleDeposit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Valor do Depósito (R$)</label>
              <Input
                type="number"
                step="0.01"
                min="1"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-2xl font-bold py-6 bg-zinc-950 border-zinc-800 text-white"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[10, 50, 100].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val.toString())}
                  className="py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all text-sm font-medium"
                >
                  + R$ {val}
                </button>
              ))}
            </div>

            <Button
              type="submit"
              className="w-full py-6 text-lg"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                'Gerar PIX'
              )}
            </Button>
          </form>

          <div className="mt-8 p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-zinc-500 mt-0.5" />
            <p className="text-xs text-zinc-500 leading-relaxed">
              O saldo será creditado automaticamente após a confirmação do pagamento. 
              Certifique-se de realizar o pagamento do valor exato gerado.
            </p>
          </div>
        </Card>

        <AnimatePresence mode="wait">
          {pixData ? (
            <motion.div
              key="pix-result"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-8 bg-zinc-900/50 border-zinc-800 text-center h-full flex flex-col justify-center">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center p-3 bg-green-500/10 rounded-full mb-4">
                    <QrCode className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Pague com PIX</h3>
                  <p className="text-sm text-zinc-400">Escaneie o QR Code abaixo ou copie o código.</p>
                </div>

                <div className="bg-white p-4 rounded-2xl inline-block mx-auto mb-8 shadow-2xl shadow-white/5">
                  <img src={pixData.qrcodeUrl} alt="PIX QR Code" className="w-48 h-48" />
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      readOnly
                      value={pixData.copyPaste}
                      className="pr-12 bg-zinc-950 border-zinc-800 text-zinc-400 text-xs py-4"
                    />
                    <button
                      onClick={() => copyToClipboard(pixData.copyPaste)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-zinc-500 hover:text-white transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-center space-x-2 text-zinc-500 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Aguardando pagamento...</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="pix-placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hidden md:flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-zinc-800 rounded-2xl"
            >
              <div className="p-4 bg-zinc-900 rounded-full mb-4">
                <Wallet className="w-12 h-12 text-zinc-700" />
              </div>
              <h3 className="text-lg font-bold text-zinc-600">Aguardando Valor</h3>
              <p className="text-sm text-zinc-700 max-w-xs">
                Insira o valor desejado e clique em "Gerar PIX" para visualizar as instruções de pagamento.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
