
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TaskList from '@/components/tasks/TaskList';
import TaskForm from '@/components/tasks/TaskForm';
import { useTasks } from '@/hooks/useTasks';

const TasksPage = () => {
  const { tasks, addTask, completeTask, postponeTask, deleteTask, isLoading } = useTasks();
  const [isAddingTask, setIsAddingTask] = useState(false);
  
  const handleTaskSubmit = (taskData: any) => {
    addTask(taskData);
    setIsAddingTask(false);
  };
  
  if (isLoading) {
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-flowmind-900">Suas Tarefas</h1>
          {!isAddingTask && (
            <Button 
              onClick={() => setIsAddingTask(true)}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-1" />
              Nova Tarefa
            </Button>
          )}
        </div>
        
        {isAddingTask ? (
          <TaskForm 
            onSubmit={handleTaskSubmit} 
            onCancel={() => setIsAddingTask(false)} 
          />
        ) : (
          <TaskList 
            tasks={tasks}
            showAddButton={tasks.length === 0}
            onAddTask={() => setIsAddingTask(true)}
            onCompleteTask={completeTask}
            onPostponeTask={postponeTask}
            onDeleteTask={deleteTask}
            emptyMessage="Você não tem tarefas cadastradas. Adicione sua primeira tarefa!"
          />
        )}
      </div>
    </Layout>
  );
};

export default TasksPage;
