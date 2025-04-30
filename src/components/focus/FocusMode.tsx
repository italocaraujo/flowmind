
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Focus, Timer, ArrowLeft, Check } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import PomodoroTimer from './PomodoroTimer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FocusModeProps {
  onExit: () => void;
}

const FocusMode: React.FC<FocusModeProps> = ({ onExit }) => {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState<string>('pomodoro');
  const [goals, setGoals] = useState<string[]>([]);
  const [newGoal, setNewGoal] = useState<string>('');
  
  const handleAddGoal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newGoal.trim()) {
      setGoals([...goals, newGoal.trim()]);
      setNewGoal('');
    }
  };
  
  const handleCompleteGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };
  
  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="bg-muted p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <Focus className="h-5 w-5 text-flowmind-600" />
          <span className="font-medium text-lg">Modo Foco</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onExit}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Sair
        </Button>
      </div>
      
      <div className="flex-1 container max-w-5xl mx-auto p-4 overflow-y-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Timer Section */}
          <div className="space-y-6">
            <Tabs 
              defaultValue="pomodoro" 
              value={selectedTab}
              onValueChange={setSelectedTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="pomodoro">
                  <Timer className="h-4 w-4 mr-1" /> Pomodoro
                </TabsTrigger>
                <TabsTrigger value="simple">
                  <Focus className="h-4 w-4 mr-1" /> Simples
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="pomodoro" className="mt-4">
                <PomodoroTimer />
              </TabsContent>
              
              <TabsContent value="simple" className="mt-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground mb-6">
                      Modo foco simples ativado. Minimize distrações e concentre-se nas suas tarefas.
                    </p>
                    <Focus className="h-12 w-12 text-flowmind-600 mx-auto" />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            {/* Ambience selector can be added here in the future */}
          </div>
          
          {/* Focus Goals */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Objetivos da Sessão</h2>
            
            <form onSubmit={handleAddGoal} className="flex gap-2">
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Adicionar objetivo para esta sessão..."
                className="flowmind-input flex-1"
              />
              <Button type="submit">Adicionar</Button>
            </form>
            
            <div className="space-y-2 mt-4">
              {goals.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Adicione objetivos para esta sessão de foco
                </p>
              ) : (
                goals.map((goal, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-card border rounded-md"
                  >
                    <span>{goal}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleCompleteGoal(index)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusMode;
