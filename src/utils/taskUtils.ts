
import { Task } from "@/components/tasks/TaskItem";
import { Emotion } from "@/components/checkin/EmotionSelector";
import { EnergyLevel } from "@/components/checkin/EnergySelector";

// Função para recomendar tarefas com base no estado atual do usuário
export const getRecommendedTasks = (
  tasks: Task[],
  emotion: Emotion,
  energyLevel: EnergyLevel,
  maxRecommendations: number = 3
): Task[] => {
  // Filtrar tarefas não concluídas
  const incompleteTasks = tasks.filter(task => !task.completed);
  
  if (incompleteTasks.length === 0) return [];
  
  // Criar pontuação para cada tarefa com base no estado do usuário
  const scoredTasks = incompleteTasks.map(task => {
    let score = 0;
    
    // Pontuação baseada na compatibilidade de energia
    if (task.energyLevel === energyLevel) {
      score += 3;
    } else if (
      (energyLevel === 'high' && task.energyLevel === 'medium') ||
      (energyLevel === 'medium' && ['low', 'high'].includes(task.energyLevel))
    ) {
      score += 1;
    } else if (energyLevel === 'low' && task.energyLevel === 'low') {
      score += 2; // Quando com energia baixa, prefira tarefas de baixa energia
    }
    
    // Ajuste com base na emoção
    if (['happy', 'energetic'].includes(emotion)) {
      // Com emoções positivas, aumenta pontuação para tarefas de maior energia
      if (task.energyLevel === 'high') score += 1;
    } else if (['sad', 'tired'].includes(emotion)) {
      // Com emoções de baixa energia, aumenta pontuação para tarefas mais leves
      if (task.energyLevel === 'low') score += 2;
    } else if (emotion === 'anxious') {
      // Com ansiedade, tarefas de prioridade alta podem aumentar a ansiedade
      if (task.priority === 'low') score += 1;
    }
    
    // Ajuste com base na prioridade
    if (task.priority === 'high') score += 2;
    else if (task.priority === 'medium') score += 1;
    
    // Penalidade para tarefas adiadas muitas vezes
    if (task.postponedCount) {
      score += Math.min(task.postponedCount, 3); // Aumenta a chance de tarefas adiadas aparecerem
    }
    
    // Verifica datas de vencimento
    if (task.dueDate) {
      const today = new Date();
      const dueDate = new Date(task.dueDate);
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) score += 3; // Vence hoje ou amanhã
      else if (diffDays <= 3) score += 2; // Vence nos próximos 3 dias
      else if (diffDays <= 7) score += 1; // Vence na semana
    }
    
    return { task, score };
  });
  
  // Ordenar tarefas pela pontuação (decrescente)
  const sortedTasks = scoredTasks.sort((a, b) => b.score - a.score);
  
  // Retornar as N tarefas mais recomendadas
  return sortedTasks.slice(0, maxRecommendations).map(item => item.task);
};

// Função para gerar feedback com base nas tarefas concluídas
export const generateDailySummary = (
  completedTasks: Task[], 
  pendingTasks: Task[],
  emotion: Emotion
) => {
  const completionRate = pendingTasks.length > 0 
    ? Math.round((completedTasks.length / (completedTasks.length + pendingTasks.length)) * 100) 
    : completedTasks.length > 0 ? 100 : 0;
  
  let message = "";
  
  if (completionRate >= 80) {
    message = "Incrível! Você teve um dia super produtivo.";
  } else if (completionRate >= 50) {
    message = "Bom trabalho! Você completou mais da metade das suas tarefas.";
  } else if (completionRate > 0) {
    message = "Você fez progresso hoje, isso já é uma vitória!";
  } else if (pendingTasks.length > 0) {
    message = "Hoje foi um dia difícil, mas amanhã é uma nova chance.";
  } else {
    message = "Sem tarefas para hoje. Que tal adicionar algumas para amanhã?";
  }
  
  // Personalizar com base na emoção
  if (emotion === 'tired' || emotion === 'sad') {
    message += " Lembre-se que descansar também é produtivo.";
  } else if (emotion === 'anxious') {
    message += " Respire fundo e celebre cada pequeno progresso.";
  } else if (emotion === 'happy' || emotion === 'energetic') {
    message += " Continue com esse ânimo!";
  }
  
  return {
    completionRate,
    message,
    completedCount: completedTasks.length,
    pendingCount: pendingTasks.length
  };
};
