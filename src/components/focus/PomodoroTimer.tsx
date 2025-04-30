
import React from 'react';
import { usePomodoro, TimerMode } from '@/hooks/use-pomodoro';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Play, Pause, RotateCcw, Coffee } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PomodoroTimer: React.FC = () => {
  const {
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
  } = usePomodoro();

  const getProgressPercent = (): number => {
    let totalSeconds;
    switch (mode) {
      case 'focus':
        totalSeconds = settings.focusDuration * 60;
        break;
      case 'shortBreak':
        totalSeconds = settings.shortBreakDuration * 60;
        break;
      case 'longBreak':
        totalSeconds = settings.longBreakDuration * 60;
        break;
    }
    
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  // Extrair do hook para uso local
  const timeLeft = mode === 'focus' 
    ? settings.focusDuration * 60 - (formattedTime().split(':')[0] * 60 + formattedTime().split(':')[1] * 1)
    : mode === 'shortBreak'
    ? settings.shortBreakDuration * 60 - (formattedTime().split(':')[0] * 60 + formattedTime().split(':')[1] * 1)
    : settings.longBreakDuration * 60 - (formattedTime().split(':')[0] * 60 + formattedTime().split(':')[1] * 1);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-flowmind-800 dark:text-flowmind-200">
          {mode === 'focus' ? 'Modo Foco' : mode === 'shortBreak' ? 'Pausa Curta' : 'Pausa Longa'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="relative flex justify-center items-center">
          <div className="w-48 h-48 rounded-full flex items-center justify-center bg-muted overflow-hidden">
            <div
              className="absolute bottom-0 left-0 right-0 bg-flowmind-600 transition-all duration-1000"
              style={{ height: `${getProgressPercent()}%` }}
            ></div>
            <div className="relative z-10 text-5xl font-bold text-flowmind-900 dark:text-white">
              {formattedTime()}
            </div>
          </div>
        </div>

        {/* Mode Selector */}
        <Tabs
          defaultValue="focus"
          value={mode}
          className="w-full"
          onValueChange={(value) => switchMode(value as TimerMode)}
        >
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="focus" disabled={status !== 'idle' && status !== 'completed'}>
              Foco
            </TabsTrigger>
            <TabsTrigger value="shortBreak" disabled={status !== 'idle' && status !== 'completed'}>
              Pausa Curta
            </TabsTrigger>
            <TabsTrigger value="longBreak" disabled={status !== 'idle' && status !== 'completed'}>
              Pausa Longa
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex justify-center gap-2">
          {status === 'idle' && (
            <Button onClick={startTimer} size="lg" className="gap-2">
              <Play className="h-4 w-4" /> Iniciar
            </Button>
          )}
          
          {status === 'running' && (
            <Button onClick={pauseTimer} size="lg" className="gap-2">
              <Pause className="h-4 w-4" /> Pausar
            </Button>
          )}
          
          {status === 'paused' && (
            <Button onClick={resumeTimer} size="lg" className="gap-2">
              <Play className="h-4 w-4" /> Continuar
            </Button>
          )}
          
          {status !== 'idle' && (
            <Button onClick={resetTimer} variant="outline" size="lg" className="gap-2">
              <RotateCcw className="h-4 w-4" /> Redefinir
            </Button>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t p-4">
        <div className="text-sm text-muted-foreground">
          Sessões concluídas: {sessionsCompleted}
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Clock className="h-4 w-4 mr-1" /> Configurações
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configurações do Pomodoro</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="focusDuration">Tempo de foco (min)</Label>
                <Input
                  id="focusDuration"
                  type="number"
                  min="1"
                  max="120"
                  value={settings.focusDuration}
                  onChange={(e) => updateSettings({ focusDuration: parseInt(e.target.value) || 25 })}
                  disabled={status === 'running'}
                />
              </div>
              
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="shortBreakDuration">Pausa curta (min)</Label>
                <Input
                  id="shortBreakDuration"
                  type="number"
                  min="1"
                  max="30"
                  value={settings.shortBreakDuration}
                  onChange={(e) => updateSettings({ shortBreakDuration: parseInt(e.target.value) || 5 })}
                  disabled={status === 'running'}
                />
              </div>
              
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="longBreakDuration">Pausa longa (min)</Label>
                <Input
                  id="longBreakDuration"
                  type="number"
                  min="1"
                  max="60"
                  value={settings.longBreakDuration}
                  onChange={(e) => updateSettings({ longBreakDuration: parseInt(e.target.value) || 15 })}
                  disabled={status === 'running'}
                />
              </div>
              
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="sessionsUntilLongBreak">Sessões até pausa longa</Label>
                <Input
                  id="sessionsUntilLongBreak"
                  type="number"
                  min="1"
                  max="10"
                  value={settings.sessionsUntilLongBreak}
                  onChange={(e) => updateSettings({ sessionsUntilLongBreak: parseInt(e.target.value) || 4 })}
                  disabled={status === 'running'}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default PomodoroTimer;
