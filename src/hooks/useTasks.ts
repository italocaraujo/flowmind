
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '@/components/tasks/TaskItem';
import { useToast } from '@/components/ui/use-toast';

// Mock dos dados persistidos em localStorage
export const useTasks = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar tarefas do localStorage
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('flowmind-tasks');
      if (savedTasks) {
        // Converte datas string para objetos Date
        const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined
        }));
        setTasks(parsedTasks);
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      toast({
        title: "Erro ao carregar tarefas",
        description: "Não foi possível carregar suas tarefas salvas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Salvar tarefas no localStorage
  const saveTasks = (updatedTasks: Task[]) => {
    try {
      localStorage.setItem('flowmind-tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Erro ao salvar tarefas:', error);
      toast({
        title: "Erro ao salvar tarefas",
        description: "Não foi possível salvar suas alterações.",
        variant: "destructive",
      });
    }
  };

  // Adicionar tarefa
  const addTask = (taskData: Omit<Task, 'id' | 'completed' | 'postponedCount'>) => {
    const newTask: Task = {
      id: uuidv4(),
      ...taskData,
      completed: false,
      postponedCount: 0,
    };
    
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    
    toast({
      title: "Tarefa criada",
      description: "Sua nova tarefa foi adicionada com sucesso.",
    });
    
    return newTask;
  };

  // Completar tarefa
  const completeTask = (id: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    
    const task = updatedTasks.find(task => task.id === id);
    if (task) {
      toast({
        title: task.completed ? "Tarefa concluída" : "Tarefa reaberta",
        description: task.completed 
          ? "Parabéns por completar esta tarefa!" 
          : "A tarefa foi marcada como não concluída.",
      });
    }
  };

  // Adiar tarefa
  const postponeTask = (id: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === id 
        ? { 
            ...task, 
            postponedCount: (task.postponedCount || 0) + 1,
            dueDate: task.dueDate 
              ? new Date(task.dueDate.setDate(task.dueDate.getDate() + 1)) 
              : new Date(new Date().setDate(new Date().getDate() + 1))
          } 
        : task
    );
    
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    
    const task = updatedTasks.find(task => task.id === id);
    if (task) {
      if ((task.postponedCount || 0) > 2) {
        toast({
          title: "Tarefa adiada várias vezes",
          description: "Considere revisar esta tarefa ou dividi-la em partes menores.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Tarefa adiada",
          description: "A tarefa foi reagendada para o próximo dia útil.",
        });
      }
    }
  };

  // Excluir tarefa
  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    
    toast({
      title: "Tarefa excluída",
      description: "A tarefa foi removida com sucesso.",
    });
  };

  return {
    tasks,
    isLoading,
    addTask,
    completeTask,
    postponeTask,
    deleteTask,
  };
};
