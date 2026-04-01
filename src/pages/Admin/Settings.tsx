import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Card, Button, Input } from '../../components/ui';
import { Save, Globe, Mail, Phone, MapPin, Shield, Bell, Settings as SettingsIcon } from 'lucide-react';
import { toast } from 'sonner';

export const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'ServiceHub Premium',
    contactEmail: 'contato@servicehub.com',
    contactPhone: '(11) 99999-9999',
    address: 'Av. Paulista, 1000 - São Paulo, SP',
    maintenanceMode: false,
    enableReviews: true,
    enableNotifications: true,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'general'));
        if (docSnap.exists()) {
          setSettings(docSnap.data() as any);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'general'), settings);
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar configurações.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-white">Carregando...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Configurações</h1>
        <p className="text-zinc-400 mt-1">Gerencie as preferências globais da plataforma.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-zinc-900/50 border-zinc-800 space-y-6">
            <div className="flex items-center gap-2 text-orange-500 mb-2">
              <Globe className="w-5 h-5" />
              <h2 className="font-bold text-white">Informações Gerais</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Nome do Site</label>
                <Input
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="bg-zinc-950 border-zinc-800 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Email de Contato</label>
                <Input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="bg-zinc-950 border-zinc-800 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Telefone</label>
                <Input
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  className="bg-zinc-950 border-zinc-800 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Endereço</label>
                <Input
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="bg-zinc-950 border-zinc-800 text-white"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-zinc-900/50 border-zinc-800 space-y-6">
            <div className="flex items-center gap-2 text-orange-500 mb-2">
              <Shield className="w-5 h-5" />
              <h2 className="font-bold text-white">Sistema e Segurança</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-950 border border-zinc-800">
                <div className="flex items-center gap-3">
                  <SettingsIcon className="w-5 h-5 text-zinc-500" />
                  <div>
                    <div className="text-sm font-medium text-white">Modo Manutenção</div>
                    <div className="text-xs text-zinc-500">Desativa o acesso público ao site</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${settings.maintenanceMode ? 'bg-orange-600' : 'bg-zinc-800'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.maintenanceMode ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-950 border border-zinc-800">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-zinc-500" />
                  <div>
                    <div className="text-sm font-medium text-white">Notificações Ativas</div>
                    <div className="text-xs text-zinc-500">Habilita o sistema de alertas em tempo real</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, enableNotifications: !settings.enableNotifications })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${settings.enableNotifications ? 'bg-orange-600' : 'bg-zinc-800'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.enableNotifications ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-950 border border-zinc-800">
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-zinc-500" />
                  <div>
                    <div className="text-sm font-medium text-white">Avaliações Ativas</div>
                    <div className="text-xs text-zinc-500">Permite que clientes avaliem os serviços</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, enableReviews: !settings.enableReviews })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${settings.enableReviews ? 'bg-orange-600' : 'bg-zinc-800'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.enableReviews ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={saving}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-lg"
          >
            {saving ? 'Salvando...' : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Salvar Configurações
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

const Star = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
