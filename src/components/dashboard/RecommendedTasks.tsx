
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TaskItem, { Task } from '../tasks/TaskItem';
import { EnergyLevel } from '../checkin/EnergySelector';
import { Emotion } from '../checkin/EmotionSelector';

interface RecommendedTasksProps {
  tasks: Task[];
  currentEmotion?: Emotion;
  currentEnergy?: EnergyLevel;
  onCompleteTask: (id: string) => void;
  onPostponeTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

// Função para obter uma mensagem motivacional com base no estado do usuário
const getMotivationalMessage = (emotion?: Emotion, energy?: EnergyLevel) => {
  if (!emotion || !energy) return "Aqui estão suas tarefas recomendadas para hoje.";
  
  if (emotion === 'happy' && energy === 'high') {
    return "Você está com energia e bom humor! Ótimo momento para tarefas desafiadoras.";
  } else if (emotion === 'tired' || energy === 'low') {
    return "É importante respeitar seu corpo e mente. Foque nas tarefas mais leves hoje.";
  } else if (emotion === 'anxious') {
    return "Respirar fundo ajuda com a ansiedade. Começar com pequenas tarefas pode trazer sensação de progresso.";
  } else if (emotion === 'sad') {
    return "Seja gentil consigo mesmo hoje. Complete uma tarefa de cada vez, sem pressa.";
  }
  
  return "Escolhemos estas tarefas baseadas em como você está se sentindo hoje.";
};

const RecommendedTasks: React.FC<RecommendedTasksProps> = ({
  tasks,
  currentEmotion,
  currentEnergy,
  onCompleteTask,
  onPostponeTask,
  onDeleteTask,
}) => {
  const motivationalMessage = getMotivationalMessage(currentEmotion, currentEnergy);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Sugestões para hoje</CardTitle>
        <CardDescription>{motivationalMessage}</CardDescription>
      </CardHeader>
      <CardContent>
        {tasks.length > 0 ? (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onComplete={onCompleteTask}
                onPostpone={onPostponeTask}
                onDelete={onDeleteTask}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>Nenhuma tarefa recomendada para hoje.</p>
            <p className="text-sm mt-2">
              Adicione novas tarefas ou complete seu check-in diário para recebermos recomendações.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendedTasks;
