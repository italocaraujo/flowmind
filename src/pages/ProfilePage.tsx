
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCheckin } from '@/hooks/useCheckin';
import { useTasks } from '@/hooks/useTasks';
import WellbeingChart from '@/components/dashboard/WellbeingChart';

const ProfilePage = () => {
  const { checkinHistory, getCheckinsByPeriod } = useCheckin();
  const { tasks } = useTasks();
  
  // Preparar dados para o gráfico mensal
  const monthlyChartData = getCheckinsByPeriod('month').map((checkin) => {
    // Contar tarefas concluídas no mesmo dia
    const dateStr = checkin.date.toISOString().split('T')[0];
    const tasksDone = tasks.filter(task => 
      task.completed && 
      task.dueDate && 
      task.dueDate.toISOString().split('T')[0] === dateStr
    ).length;
    
    return {
      date: checkin.date.toISOString(),
      emotion: checkin.emotion,
      energyLevel: checkin.energyLevel,
      tasksDone
    };
  });
  
  // Calcular estatísticas
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const checkinsCount = checkinHistory.length;
  
  // Encontrar emoção mais comum
  const emotionCounts: Record<string, number> = {};
  checkinHistory.forEach(checkin => {
    emotionCounts[checkin.emotion] = (emotionCounts[checkin.emotion] || 0) + 1;
  });
  const mostCommonEmotion = Object.entries(emotionCounts).reduce(
    (max, [emotion, count]) => count > max.count ? { emotion, count } : max,
    { emotion: '', count: 0 }
  ).emotion;

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-flowmind-900">Seu perfil</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estatísticas</CardTitle>
              <CardDescription>Um resumo da sua jornada</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Tarefas completadas</p>
                  <p className="text-2xl font-medium">{completedTasks} de {totalTasks}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div 
                      className="bg-flowmind-600 h-2.5 rounded-full" 
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Check-ins realizados</p>
                  <p className="text-2xl font-medium">{checkinsCount}</p>
                </div>
                
                {mostCommonEmotion && (
                  <div>
                    <p className="text-sm text-gray-500">Estado emocional mais comum</p>
                    <p className="text-lg font-medium">
                      {mostCommonEmotion === 'happy' ? 'Feliz' : 
                       mostCommonEmotion === 'calm' ? 'Calmo' : 
                       mostCommonEmotion === 'energetic' ? 'Energético' : 
                       mostCommonEmotion === 'neutral' ? 'Neutro' : 
                       mostCommonEmotion === 'tired' ? 'Cansado' : 
                       mostCommonEmotion === 'anxious' ? 'Ansioso' : 'Triste'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configurações</CardTitle>
              <CardDescription>Personalize sua experiência</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Notificações</p>
                <p className="text-xs text-gray-500">
                  Configure lembretes para check-ins e tarefas
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Dados e privacidade</p>
                <p className="text-xs text-gray-500">
                  Gerencie seus dados armazenados no FlowMind
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full text-flowmind-600" disabled>
                Disponível em breve
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {monthlyChartData.length > 0 && (
          <WellbeingChart data={monthlyChartData} period="month" />
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;
