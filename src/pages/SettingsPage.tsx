
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { Switch } from '@/components/ui/switch';

const SettingsPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  
  useEffect(() => {
    // Carregar dados do usuário do localStorage
    const userDataStr = localStorage.getItem('flowmind-user');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        setUserName(userData.name || '');
        setUserEmail(userData.email || '');
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    }
  }, []);
  
  const handleUpdateProfile = () => {
    // Atualizar dados no localStorage
    const userDataStr = localStorage.getItem('flowmind-user');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        const updatedUser = { ...userData, name: userName };
        localStorage.setItem('flowmind-user', JSON.stringify(updatedUser));
        
        toast({
          title: "Perfil atualizado",
          description: "Suas informações foram atualizadas com sucesso.",
        });
      } catch (error) {
        console.error('Erro ao atualizar dados do usuário:', error);
        toast({
          title: "Erro ao atualizar",
          description: "Não foi possível atualizar suas informações.",
          variant: "destructive",
        });
      }
    }
  };
  
  const handleClearData = () => {
    if (confirm("Tem certeza que deseja apagar todos seus dados? Esta ação não pode ser desfeita.")) {
      // Limpar dados do localStorage, mas manter o usuário logado
      localStorage.removeItem('flowmind-tasks');
      localStorage.removeItem('flowmind-checkins');
      
      toast({
        title: "Dados apagados",
        description: "Todos os seus dados de tarefas e check-ins foram removidos.",
      });
      
      // Redirecionar para a página inicial
      navigate('/');
    }
  };
  
  const handleLogout = () => {
    // Remover dados do usuário para "deslogar"
    localStorage.removeItem('flowmind-user');
    navigate('/login');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-foreground">Configurações</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>Atualize suas informações pessoais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Nome
              </label>
              <input
                id="name"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="flowmind-input"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="flowmind-input"
                disabled
              />
              <p className="text-xs text-muted-foreground">
                O email não pode ser alterado nesta versão do aplicativo.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleUpdateProfile}
              className="btn-primary"
            >
              Salvar alterações
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Preferências</CardTitle>
            <CardDescription>Configure aspectos do aplicativo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                <div>
                  <p className="text-sm font-medium">Modo {theme === 'dark' ? 'escuro' : 'claro'}</p>
                  <p className="text-xs text-muted-foreground">Alterna entre tema claro e escuro</p>
                </div>
              </div>
              <Switch 
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Lembretes</p>
                <p className="text-xs text-muted-foreground">Notificações para check-in diário</p>
              </div>
              <Button variant="outline" disabled>
                Disponível em breve
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Dados e privacidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full text-amber-600 border-amber-200 hover:text-amber-700 hover:bg-amber-50"
              onClick={handleClearData}
            >
              Apagar todos os dados
            </Button>
            
            <Separator />
            
            <Button 
              variant="outline" 
              className="w-full text-red-600 border-red-200 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              Sair da conta
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SettingsPage;
