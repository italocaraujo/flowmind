
import React from 'react';
import Layout from '@/components/layout/Layout';
import TaskList from '@/components/tasks/TaskList';
import { useTasks } from '@/hooks/useTasks';
import { Link } from 'react-router-dom';
import { useCheckin } from '@/hooks/useCheckin';
import { getRecommendedTasks } from '@/utils/taskUtils';
import { Button } from '@/components/ui/button';

const TodayPage = () => {
  const { tasks, completeTask, postponeTask, deleteTask, isLoading: tasksLoading } = useTasks();
  const { todayCheckin, isLoading: checkinLoading } = useCheckin();
  
  // Filtrar tarefas para hoje
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Tarefas com prazo para hoje ou sem prazo (mas não concluídas)
  const todaysTasks = tasks.filter(task => {
    if (task.completed) return false;
    
    if (!task.dueDate) return true;
    
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    
    return taskDate <= today;
  });

  // Tarefas recomendadas com base no check-in
  const recommendedTasks = todayCheckin 
    ? getRecommendedTasks(todaysTasks, todayCheckin.emotion, todayCheckin.energyLevel, 3)
    : [];
  
  // Outras tarefas (que não estão nas recomendadas)
  const otherTasks = todaysTasks.filter(
    task => !recommendedTasks.some(rec => rec.id === task.id)
  );

  if (tasksLoading || checkinLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse-gentle">Carregando tarefas...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-flowmind-900">Hoje</h1>
          <p className="text-gray-600 mt-1">
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })}
          </p>
        </div>
        
        {!todayCheckin && (
          <div className="flowmind-card bg-flowmind-50 border-flowmind-100">
            <p className="text-flowmind-800">
              Você ainda não fez seu check-in de hoje. 
              Fazer o check-in ajuda a recomendar as melhores tarefas para seu momento.
            </p>
            <Link to="/" className="block mt-3">
              <Button className="btn-primary">
                Fazer Check-in
              </Button>
            </Link>
          </div>
        )}
        
        {recommendedTasks.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-flowmind-800">Recomendadas para você</h2>
            <TaskList 
              tasks={recommendedTasks}
              onCompleteTask={completeTask}
              onPostponeTask={postponeTask}
              onDeleteTask={deleteTask}
            />
          </div>
        )}
        
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-flowmind-800">
            {recommendedTasks.length > 0 ? 'Outras tarefas' : 'Tarefas para hoje'}
          </h2>
          <TaskList 
            tasks={otherTasks}
            onCompleteTask={completeTask}
            onPostponeTask={postponeTask}
            onDeleteTask={deleteTask}
            emptyMessage={recommendedTasks.length > 0 
              ? "Não há outras tarefas pendentes para hoje."
              : "Não há tarefas pendentes para hoje."
            }
            showAddButton={todaysTasks.length === 0}
            onAddTask={() => (window.location.href = '/tarefas')}
          />
        </div>
      </div>
    </Layout>
  );
};

export default TodayPage;
