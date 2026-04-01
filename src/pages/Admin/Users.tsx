import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, limit, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { UserProfile } from '../../types';
import { Card, Input, Badge, Button } from '../../components/ui';
import { Search, User, Mail, Shield, ShieldAlert, MoreVertical, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const AdminUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(100));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const uList = snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id } as UserProfile));
      setUsers(uList);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleToggleAdmin = async (user: UserProfile) => {
    if (window.confirm(`Tem certeza que deseja ${user.role === 'admin' ? 'remover' : 'tornar'} este usuário como administrador?`)) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          role: user.role === 'admin' ? 'client' : 'admin'
        });
        toast.success('Permissão de usuário atualizada com sucesso!');
      } catch (error) {
        console.error(error);
        toast.error('Erro ao atualizar permissão.');
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.displayName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Usuários</h1>
          <p className="text-zinc-400 mt-1">Gerencie os usuários e permissões da plataforma.</p>
        </div>
      </div>

      <Card className="p-6 bg-zinc-900/50 border-zinc-800">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Buscar usuários por nome ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-zinc-950 border-zinc-800 text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 text-sm">
                <th className="pb-4 font-medium px-4">Usuário</th>
                <th className="pb-4 font-medium px-4">Papel</th>
                <th className="pb-4 font-medium px-4">Cadastro</th>
                <th className="pb-4 font-medium px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredUsers.map((user) => (
                <tr key={user.uid} className="text-zinc-300 hover:bg-zinc-800/30 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName} className="w-10 h-10 rounded-full border border-zinc-800" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                          <User className="w-5 h-5 text-zinc-500" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-white">{user.displayName}</div>
                        <div className="text-xs text-zinc-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={user.role === 'admin' ? 'success' : 'default'} className="uppercase text-[10px] tracking-wider">
                      {user.role === 'admin' ? (
                        <span className="flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Admin
                        </span>
                      ) : (
                        'Cliente'
                      )}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-sm text-zinc-500">
                    {user.createdAt ? format(user.createdAt.toDate(), "dd/MM/yyyy", { locale: ptBR }) : 'N/A'}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleAdmin(user)}
                        className="text-zinc-400 hover:text-orange-500 hover:bg-orange-500/10"
                        title={user.role === 'admin' ? 'Remover Admin' : 'Tornar Admin'}
                      >
                        {user.role === 'admin' ? <ShieldAlert className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedUser(user)}
                        className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 bg-zinc-900 border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Detalhes do Usuário</h2>
              <Button variant="ghost" size="sm" onClick={() => setSelectedUser(null)}>
                <X className="w-5 h-5 text-zinc-400" />
              </Button>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col items-center text-center space-y-3">
                {selectedUser.photoURL ? (
                  <img src={selectedUser.photoURL} alt={selectedUser.displayName} className="w-24 h-24 rounded-full border-2 border-orange-500/20" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center">
                    <User className="w-12 h-12 text-zinc-500" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedUser.displayName}</h3>
                  <p className="text-zinc-400 text-sm">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                  <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Papel</div>
                  <div className="text-sm font-medium text-white capitalize">{selectedUser.role}</div>
                </div>
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                  <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">ID do Usuário</div>
                  <div className="text-xs font-mono text-zinc-400 truncate">{selectedUser.uid}</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">Data de Cadastro</span>
                  <span className="text-zinc-300">
                    {selectedUser.createdAt ? format(selectedUser.createdAt.toDate(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">Status da Conta</span>
                  <span className="flex items-center gap-1 text-green-500">
                    <CheckCircle2 className="w-4 h-4" />
                    Ativa
                  </span>
                </div>
              </div>

              <Button
                onClick={() => setSelectedUser(null)}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white"
              >
                Fechar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
