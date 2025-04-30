
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import EmotionSelector, { Emotion } from './EmotionSelector';
import EnergySelector, { EnergyLevel } from './EnergySelector';

interface CheckinData {
  date: Date;
  emotion: Emotion;
  energyLevel: EnergyLevel;
  notes?: string;
}

interface DailyCheckinProps {
  onComplete: (data: CheckinData) => void;
  isLoading?: boolean;
}

const DailyCheckin: React.FC<DailyCheckinProps> = ({ onComplete, isLoading = false }) => {
  const { toast } = useToast();
  const [emotion, setEmotion] = useState<Emotion | null>(null);
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel | null>(null);
  const [notes, setNotes] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emotion || !energyLevel) {
      toast({
        title: "Informação incompleta",
        description: "Por favor, informe como você está se sentindo e seu nível de energia.",
        variant: "destructive",
      });
      return;
    }

    onComplete({
      date: new Date(),
      emotion,
      energyLevel,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-xl text-center text-flowmind-800">Check-in Diário</CardTitle>
          <CardDescription className="text-center">
            Como está você hoje? Vamos adaptar suas tarefas ao seu momento.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <EmotionSelector selectedEmotion={emotion} onSelect={setEmotion} />
          <EnergySelector value={energyLevel} onChange={setEnergyLevel} />
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium text-gray-700">
              Observações (opcional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Alguma observação sobre como você está se sentindo hoje?"
              className="flowmind-input h-24 resize-none"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Salvando..." : "Concluir Check-in"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default DailyCheckin;
