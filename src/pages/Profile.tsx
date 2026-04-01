import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button, Input } from '../components/ui';
import { User, Mail, Shield, Calendar, LogOut, Edit2, Save, X, CheckCircle2, Wallet, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'sonner';
import { Badge } from '../components/ui';
import { Link } from 'react-router-dom';

export const Profile = () => {
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const handleSave = async () => {
    if (!displayName.trim()) {
      toast.error('O nome não pode estar vazio.');
      return;
    }

    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: displayName.trim()
      });
      toast.success('Perfil atualizado com sucesso!');
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar perfil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white tracking-tight">Meu Perfil</h1>
          <Button 
            variant="ghost" 
            onClick={signOut}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair da Conta
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Avatar & Basic Info */}
          <Card className="p-8 bg-zinc-900/50 border-zinc-800 text-center space-y-6">
            <div className="relative inline-block">
              <img 
                src={user.photoURL} 
                alt={user.displayName} 
                className="w-32 h-32 rounded-full border-4 border-orange-500/20 mx-auto"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-zinc-900 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-white">{user.displayName}</h2>
              <p className="text-zinc-500 text-sm">{user.email}</p>
            </div>

            <Badge variant={user.role === 'admin' ? 'success' : 'default'} className="uppercase tracking-widest text-[10px]">
              {user.role === 'admin' ? 'Administrador' : 'Cliente Premium'}
            </Badge>

            <div className="pt-6 border-t border-zinc-800 space-y-4">
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 text-center">
                <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Saldo em Conta</div>
                <div className="text-2xl font-bold text-orange-500 mb-3">R$ {(user.balance || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                <Link to="/deposit">
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="w-4 h-4 mr-2" /> Adicionar Saldo
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-between text-sm text-zinc-500">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Membro desde
                </span>
                <span className="text-zinc-300">
                  {user.createdAt ? format(new Date(user.createdAt), "MMMM 'de' yyyy", { locale: ptBR }) : 'Recentemente'}
                </span>
              </div>
            </div>
          </Card>

          {/* Right Column: Edit Profile */}
          <Card className="md:col-span-2 p-8 bg-zinc-900/50 border-zinc-800 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-orange-500" />
                Informações Pessoais
              </h3>
              {!isEditing ? (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                  className="text-zinc-400 hover:text-white"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setIsEditing(false);
                      setDisplayName(user.displayName);
                    }}
                    className="text-zinc-400 hover:text-white"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Salvando...' : 'Salvar'}
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-500">Nome de Exibição</label>
                {isEditing ? (
                  <Input 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="bg-zinc-950 border-zinc-800 text-white"
                  />
                ) : (
                  <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-white font-medium">
                    {user.displayName}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-500">Endereço de Email</label>
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-500 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-500">Nível de Acesso</label>
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-500 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  {user.role === 'admin' ? 'Administrador do Sistema' : 'Cliente'}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-zinc-800">
              <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Segurança</h4>
              <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
                <p className="text-sm text-zinc-400">
                  Sua conta está vinculada ao Google. Para alterar sua senha ou foto de perfil principal, acesse as configurações da sua conta Google.
                </p>
                <Button 
                  variant="ghost" 
                  className="mt-4 text-orange-500 hover:text-orange-400 p-0 h-auto font-bold text-xs uppercase tracking-wider"
                  onClick={() => window.open('https://myaccount.google.com/', '_blank')}
                >
                  Gerenciar Conta Google
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
