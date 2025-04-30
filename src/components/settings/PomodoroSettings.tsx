
import React from 'react';
import { usePomodoro } from '@/hooks/use-pomodoro';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

const PomodoroSettings: React.FC = () => {
  const { settings, updateSettings } = usePomodoro();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Pomodoro</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="focusDuration">Tempo de foco</Label>
            <span className="text-sm text-muted-foreground">{settings.focusDuration} minutos</span>
          </div>
          <Slider
            id="focusDuration"
            min={5}
            max={120}
            step={5}
            value={[settings.focusDuration]}
            onValueChange={(value) => updateSettings({ focusDuration: value[0] })}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="shortBreakDuration">Pausa curta</Label>
            <span className="text-sm text-muted-foreground">{settings.shortBreakDuration} minutos</span>
          </div>
          <Slider
            id="shortBreakDuration"
            min={1}
            max={15}
            step={1}
            value={[settings.shortBreakDuration]}
            onValueChange={(value) => updateSettings({ shortBreakDuration: value[0] })}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="longBreakDuration">Pausa longa</Label>
            <span className="text-sm text-muted-foreground">{settings.longBreakDuration} minutos</span>
          </div>
          <Slider
            id="longBreakDuration"
            min={5}
            max={30}
            step={5}
            value={[settings.longBreakDuration]}
            onValueChange={(value) => updateSettings({ longBreakDuration: value[0] })}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="sessionsUntilLongBreak">Sessões até pausa longa</Label>
            <span className="text-sm text-muted-foreground">{settings.sessionsUntilLongBreak} sessões</span>
          </div>
          <Slider
            id="sessionsUntilLongBreak"
            min={1}
            max={8}
            step={1}
            value={[settings.sessionsUntilLongBreak]}
            onValueChange={(value) => updateSettings({ sessionsUntilLongBreak: value[0] })}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PomodoroSettings;
