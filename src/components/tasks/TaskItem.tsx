
import React from 'react';
import { Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnergyLevel } from '../checkin/EnergySelector';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  energyLevel: EnergyLevel;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  postponedCount?: number;
}

interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
  onPostpone: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onComplete, onPostpone, onDelete }) => {
  const priorityColors = {
    high: 'bg-red-50 border-red-200',
    medium: 'bg-yellow-50 border-yellow-200',
    low: 'bg-green-50 border-green-200',
  };

  const energyColors = {
    low: 'bg-energy-low',
    medium: 'bg-energy-medium',
    high: 'bg-energy-high',
  };

  return (
    <div className={`flowmind-card ${task.completed ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <button
            onClick={() => onComplete(task.id)}
            className={`w-6 h-6 rounded-full border ${
              task.completed 
                ? 'bg-flowmind-600 border-flowmind-600 text-white' 
                : 'border-gray-300 hover:border-flowmind-500'
            } flex items-center justify-center`}
          >
            {task.completed && <Check className="h-4 w-4" />}
          </button>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            <div className="flex gap-1">
              <div 
                className={`h-4 w-4 rounded-sm ${energyColors[task.energyLevel]}`} 
                title={`Energia ${task.energyLevel === 'low' ? 'Baixa' : task.energyLevel === 'medium' ? 'Média' : 'Alta'}`} 
              />
              <div 
                className={`h-4 w-4 rounded-full ${
                  task.priority === 'high' 
                    ? 'bg-red-400' 
                    : task.priority === 'medium' 
                    ? 'bg-yellow-400' 
                    : 'bg-green-400'
                }`} 
                title={`Prioridade ${
                  task.priority === 'high' 
                    ? 'Alta' 
                    : task.priority === 'medium' 
                    ? 'Média' 
                    : 'Baixa'
                }`} 
              />
            </div>
          </div>
          
          {task.description && (
            <p className={`text-sm mt-1 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
              {task.description}
            </p>
          )}
          
          {task.dueDate && (
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              <span>{new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
            </div>
          )}
          
          {task.postponedCount && task.postponedCount > 0 && (
            <div className="mt-1 text-xs text-orange-600">
              Adiada {task.postponedCount} {task.postponedCount === 1 ? 'vez' : 'vezes'}
            </div>
          )}
          
          {!task.completed && (
            <div className="flex gap-2 mt-3">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onPostpone(task.id)}
              >
                Adiar
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => onDelete(task.id)}
              >
                Excluir
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
