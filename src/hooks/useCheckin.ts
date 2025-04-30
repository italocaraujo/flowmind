
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Emotion } from '@/components/checkin/EmotionSelector';
import { EnergyLevel } from '@/components/checkin/EnergySelector';

export interface CheckinData {
  date: Date;
  emotion: Emotion;
  energyLevel: EnergyLevel;
  notes?: string;
}

export const useCheckin = () => {
  const { toast } = useToast();
  const [checkinHistory, setCheckinHistory] = useState<CheckinData[]>([]);
  const [todayCheckin, setTodayCheckin] = useState<CheckinData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se a data é hoje
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Carregar histórico de check-ins
  useEffect(() => {
    try {
      const savedCheckins = localStorage.getItem('flowmind-checkins');
      if (savedCheckins) {
        const parsedCheckins = JSON.parse(savedCheckins).map((checkin: any) => ({
          ...checkin,
          date: new Date(checkin.date)
        }));
        setCheckinHistory(parsedCheckins);
        
        // Verificar se há um check-in de hoje
        const todaysCheckin = parsedCheckins.find((c: CheckinData) => isToday(c.date));
        if (todaysCheckin) {
          setTodayCheckin(todaysCheckin);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar check-ins:', error);
      toast({
        title: "Erro ao carregar histórico",
        description: "Não foi possível carregar seu histórico de check-ins.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Salvar check-ins no localStorage
  const saveCheckins = (updatedCheckins: CheckinData[]) => {
    try {
      localStorage.setItem('flowmind-checkins', JSON.stringify(updatedCheckins));
    } catch (error) {
      console.error('Erro ao salvar check-ins:', error);
      toast({
        title: "Erro ao salvar dados",
        description: "Não foi possível salvar seu check-in.",
        variant: "destructive",
      });
    }
  };

  // Fazer check-in
  const doCheckin = (data: CheckinData) => {
    // Criar um novo array de check-ins
    let newCheckins: CheckinData[];
    
    if (todayCheckin) {
      // Se já existe um check-in hoje, substitui ele
      newCheckins = checkinHistory.map(c => 
        isToday(c.date) ? { ...data, date: new Date() } : c
      );
    } else {
      // Caso contrário, adiciona um novo
      newCheckins = [...checkinHistory, { ...data, date: new Date() }];
    }
    
    setCheckinHistory(newCheckins);
    setTodayCheckin({ ...data, date: new Date() });
    saveCheckins(newCheckins);
    
    toast({
      title: todayCheckin ? "Check-in atualizado" : "Check-in realizado",
      description: todayCheckin 
        ? "Seu check-in de hoje foi atualizado." 
        : "Seu check-in de hoje foi registrado com sucesso.",
    });
  };

  // Obter check-ins de um período específico (semana ou mês)
  const getCheckinsByPeriod = (period: 'week' | 'month') => {
    const today = new Date();
    const startDate = new Date();
    
    if (period === 'week') {
      startDate.setDate(today.getDate() - 7);
    } else {
      startDate.setMonth(today.getMonth() - 1);
    }
    
    return checkinHistory.filter(checkin => 
      checkin.date >= startDate && checkin.date <= today
    ).sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  return {
    checkinHistory,
    todayCheckin,
    isLoading,
    doCheckin,
    getCheckinsByPeriod,
  };
};
