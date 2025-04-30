
import { useState, useEffect, useRef } from 'react';
import { toast } from '@/components/ui/sonner';

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';
export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

interface PomodoroSettings {
  focusDuration: number; // minutos
  shortBreakDuration: number; // minutos
  longBreakDuration: number; // minutos
  sessionsUntilLongBreak: number;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
};

export const usePomodoro = () => {
  const [settings, setSettings] = useState<PomodoroSettings>(() => {
    const saved = localStorage.getItem('flowmind-pomodoro-settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });
  
  const [mode, setMode] = useState<TimerMode>('focus');
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [timeLeft, setTimeLeft] = useState(settings.focusDuration * 60);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const timerRef = useRef<number | null>(null);

  // Efeito para salvar as configurações
  useEffect(() => {
    localStorage.setItem('flowmind-pomodoro-settings', JSON.stringify(settings));
  }, [settings]);

  // Efeito para lidar com o timer
  useEffect(() => {
    if (status === 'running') {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [status]);

  // Lidar com a conclusão do temporizador
  const handleTimerComplete = () => {
    setStatus('completed');
    
    // Toque um som e mostre uma notificação
    const audio = new Audio('/notification.mp3');
    audio.play().catch(e => console.log('Erro ao reproduzir som:', e));
    
    if (mode === 'focus') {
      const newSessionsCompleted = sessionsCompleted + 1;
      setSessionsCompleted(newSessionsCompleted);
      
      toast.success("Sessão de foco concluída!", {
        description: "É hora de fazer uma pausa!"
      });
      
      // Determine se deve ser uma pausa curta ou longa
      if (newSessionsCompleted % settings.sessionsUntilLongBreak === 0) {
        switchMode('longBreak');
      } else {
        switchMode('shortBreak');
      }
    } else {
      toast.success("Pausa concluída!", {
        description: "Vamos voltar ao foco!"
      });
      switchMode('focus');
    }
  };

  // Alternar entre os modos
  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setStatus('idle');
    
    // Definir o tempo com base no modo
    switch (newMode) {
      case 'focus':
        setTimeLeft(settings.focusDuration * 60);
        break;
      case 'shortBreak':
        setTimeLeft(settings.shortBreakDuration * 60);
        break;
      case 'longBreak':
        setTimeLeft(settings.longBreakDuration * 60);
        break;
    }
  };

  // Iniciar o temporizador
  const startTimer = () => {
    setStatus('running');
  };

  // Pausar o temporizador
  const pauseTimer = () => {
    setStatus('paused');
  };

  // Continuar o temporizador
  const resumeTimer = () => {
    setStatus('running');
  };

  // Redefinir o temporizador
  const resetTimer = () => {
    setStatus('idle');
    // Redefinir o tempo com base no modo atual
    switch (mode) {
      case 'focus':
        setTimeLeft(settings.focusDuration * 60);
        break;
      case 'shortBreak':
        setTimeLeft(settings.shortBreakDuration * 60);
        break;
      case 'longBreak':
        setTimeLeft(settings.longBreakDuration * 60);
        break;
    }
  };

  // Atualizar as configurações
  const updateSettings = (newSettings: Partial<PomodoroSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      
      // Se o temporizador estiver inativo, atualize imediatamente o tempo restante
      if (status === 'idle') {
        switch (mode) {
          case 'focus':
            setTimeLeft(updated.focusDuration * 60);
            break;
          case 'shortBreak':
            setTimeLeft(updated.shortBreakDuration * 60);
            break;
          case 'longBreak':
            setTimeLeft(updated.longBreakDuration * 60);
            break;
        }
      }
      
      return updated;
    });
  };

  // Formatar o tempo para exibição (MM:SS)
  const formattedTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    timeLeft,
    formattedTime,
    mode,
    status,
    sessionsCompleted,
    settings,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    switchMode,
    updateSettings,
  };
};
