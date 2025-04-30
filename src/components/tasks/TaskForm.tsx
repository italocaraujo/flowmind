
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { EnergyLevel } from '../checkin/EnergySelector';
import { Task } from './TaskItem';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'completed' | 'postponedCount'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel, isLoading = false }) => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>('medium');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe um título para a tarefa.",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      energyLevel,
      priority,
    });
  };

  return (
    <Card className="w-full animate-fade-in">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-xl">Nova Tarefa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-gray-700">
              Título*
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="O que você precisa fazer?"
              className="flowmind-input"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
              Descrição (opcional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes sobre a tarefa..."
              className="flowmind-input h-20 resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="dueDate" className="text-sm font-medium text-gray-700">
              Data Limite (opcional)
            </label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="flowmind-input"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Nível de Energia Necessário
            </label>
            <div className="flex space-x-2">
              {['low', 'medium', 'high'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setEnergyLevel(level as EnergyLevel)}
                  className={`
                    flex-1 py-2 px-3 rounded-md transition-all
                    ${energyLevel === level ? 'border-flowmind-500 ring-1 ring-flowmind-500' : 'border border-gray-300'}
                    bg-energy-${level}
                  `}
                >
                  <span className="text-xs font-medium">
                    {level === 'low' ? 'Baixo' : level === 'medium' ? 'Médio' : 'Alto'}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Prioridade
            </label>
            <div className="flex space-x-2">
              {[
                { value: 'low', label: 'Baixa', color: 'bg-green-100 border-green-300' },
                { value: 'medium', label: 'Média', color: 'bg-yellow-100 border-yellow-300' },
                { value: 'high', label: 'Alta', color: 'bg-red-100 border-red-300' },
              ].map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value as 'high' | 'medium' | 'low')}
                  className={`
                    flex-1 py-2 px-3 rounded-md transition-all
                    ${p.color}
                    ${priority === p.value ? 'ring-1 ring-offset-1 ring-flowmind-500' : 'opacity-70 hover:opacity-100'}
                  `}
                >
                  <span className="text-xs font-medium">{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="ghost"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Salvando..." : "Salvar Tarefa"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TaskForm;
