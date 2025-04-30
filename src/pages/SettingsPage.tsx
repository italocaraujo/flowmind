
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/hooks/use-theme';
import PomodoroSettings from '@/components/settings/PomodoroSettings';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  // Função para simular reset da conta
  const handleResetAccount = () => {
    toast.success("Configurações redefinidas", {
      description: "Todas as suas configurações foram restauradas para o padrão."
    });
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-flowmind-900 dark:text-flowmind-100">Configurações</h1>
          <p className="text-muted-foreground mt-1">
            Personalize o FlowMind de acordo com suas preferências
          </p>
        </div>
        
        <Tabs defaultValue="general">
          <TabsList className="w-full grid grid-cols-2 mb-6">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Switch 
                    id="dark-mode" 
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                  />
                  <Label htmlFor="dark-mode">Modo Escuro</Label>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Conta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col gap-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">E-mail</p>
                    <p>usuario@exemplo.com</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Membro desde</p>
                    <p>Abril 2023</p>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button variant="destructive" onClick={handleResetAccount}>
                    Redefinir configurações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pomodoro">
            <PomodoroSettings />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SettingsPage;
