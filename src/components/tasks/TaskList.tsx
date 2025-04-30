
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TaskItem, { Task } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  emptyMessage?: string;
  showAddButton?: boolean;
  onAddTask?: () => void;
  onCompleteTask: (id: string) => void;
  onPostponeTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  emptyMessage = "Nenhuma tarefa encontrada.",
  showAddButton = false,
  onAddTask,
  onCompleteTask,
  onPostponeTask,
  onDeleteTask,
}) => {
  // Agrupar tarefas por status (incompletas primeiro, depois completas)
  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="space-y-6">
      {/* Tarefas incompletas */}
      <div className="space-y-3">
        {incompleteTasks.length > 0 ? (
          <>
            {incompleteTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onComplete={onCompleteTask}
                onPostpone={onPostponeTask}
                onDelete={onDeleteTask}
              />
            ))}
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>{emptyMessage}</p>
            
            {showAddButton && onAddTask && (
              <Button
                className="mt-4 btn-primary"
                onClick={onAddTask}
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Tarefa
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Tarefas completadas */}
      {completedTasks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-500 border-t border-gray-200 pt-4 mt-4">
            Concluídas ({completedTasks.length})
          </h3>
          {completedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onComplete={onCompleteTask}
              onPostpone={onPostponeTask}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      )}

      {/* Botão de adicionar tarefa (quando há tarefas ou quando não é para mostrar na mensagem de vazio) */}
      {showAddButton && onAddTask && tasks.length > 0 && (
        <div className="flex justify-center pt-4">
          <Button
            className="btn-primary"
            onClick={onAddTask}
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar Tarefa
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskList;
