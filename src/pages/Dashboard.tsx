
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import DailyCheckin from '@/components/checkin/DailyCheckin';
import RecommendedTasks from '@/components/dashboard/RecommendedTasks';
import WellbeingChart, { CheckinData } from '@/components/dashboard/WellbeingChart';
import { useCheckin } from '@/hooks/useCheckin';
import { useTasks } from '@/hooks/useTasks';
import { getRecommendedTasks, generateDailySummary } from '@/utils/taskUtils';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { todayCheckin, doCheckin, getCheckinsByPeriod, isLoading: checkinLoading } = useCheckin();
  const { tasks, completeTask, postponeTask, deleteTask, isLoading: tasksLoading } = useTasks();
  const [checkinMode, setCheckinMode] = useState<boolean>(!todayCheckin);
  
  // Preparar dados para o gráfico
  const chartData = getCheckinsByPeriod('week').map((checkin): CheckinData => {
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

  // Obter tarefas recomendadas com base no check-in de hoje
  const recommendedTasks = todayCheckin 
    ? getRecommendedTasks(tasks, todayCheckin.emotion, todayCheckin.energyLevel, 3)
    : [];
  
  // Calcular estatísticas diárias
  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  const dailySummary = todayCheckin 
    ? generateDailySummary(completedTasks, pendingTasks, todayCheckin.emotion)
    : { completionRate: 0, message: "Faça seu check-in para ver um resumo personalizado.", completedCount: 0, pendingCount: 0 };
  
  // Handler para completar o check-in
  const handleCheckinComplete = (data: any) => {
    doCheckin(data);
    setCheckinMode(false);
  };
  
  if (tasksLoading || checkinLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse-gentle">Carregando...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {checkinMode ? (
        <DailyCheckin onComplete={handleCheckinComplete} />
      ) : (
        <div className="space-y-6">
          {/* Resumo do dia */}
          <div className="flowmind-card animate-fade-in">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-medium text-flowmind-800">
                  {todayCheckin ? `Olá! Você está se sentindo ${todayCheckin.emotion === 'happy' ? 'feliz' : 
                                     todayCheckin.emotion === 'calm' ? 'calmo' : 
                                     todayCheckin.emotion === 'energetic' ? 'energético' : 
                                     todayCheckin.emotion === 'neutral' ? 'neutro' : 
                                     todayCheckin.emotion === 'tired' ? 'cansado' : 
                                     todayCheckin.emotion === 'anxious' ? 'ansioso' : 'triste'} hoje.` 
                   : 'Boas-vindas ao FlowMind'}
                </h2>
                <p className="text-gray-600 mt-1">{dailySummary.message}</p>
              </div>
              <Button 
                variant="ghost" 
                className="text-sm text-flowmind-600 hover:text-flowmind-700" 
                onClick={() => setCheckinMode(true)}
              >
                {todayCheckin ? 'Atualizar' : 'Fazer Check-in'}
              </Button>
            </div>
            
            {dailySummary.completedCount > 0 || dailySummary.pendingCount > 0 ? (
              <div className="mt-4 flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-flowmind-600 h-2.5 rounded-full" 
                    style={{ width: `${dailySummary.completionRate}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {dailySummary.completionRate}%
                </span>
              </div>
            ) : null}
          </div>
          
          {/* Tarefas recomendadas */}
          <RecommendedTasks
            tasks={recommendedTasks}
            currentEmotion={todayCheckin?.emotion}
            currentEnergy={todayCheckin?.energyLevel}
            onCompleteTask={completeTask}
            onPostponeTask={postponeTask}
            onDeleteTask={deleteTask}
          />
          
          {/* Link para todas as tarefas */}
          <div className="flex justify-center">
            <Link to="/tarefas">
              <Button variant="outline" className="text-flowmind-600 border-flowmind-200">
                Ver todas as tarefas
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {/* Gráfico de bem-estar (se houver dados suficientes) */}
          {chartData.length > 1 && (
            <WellbeingChart data={chartData} period="week" />
          )}
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
