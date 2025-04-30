
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { Emotion } from '../checkin/EmotionSelector';
import { EnergyLevel } from '../checkin/EnergySelector';

export interface CheckinData {
  date: string;
  emotion: Emotion;
  energyLevel: EnergyLevel;
  tasksDone?: number;
}

interface WellbeingChartProps {
  data: CheckinData[];
  period: 'week' | 'month';
}

// Mapeamento de emoções para valores numéricos para o gráfico
const emotionMapping = {
  'happy': 3,
  'calm': 2,
  'energetic': 2,
  'neutral': 1,
  'tired': 0,
  'anxious': -1,
  'sad': -2
};

// Mapeamento de níveis de energia para valores numéricos
const energyMapping = {
  'high': 2,
  'medium': 1,
  'low': 0
};

// Transformar dados para renderização no gráfico
const transformDataForChart = (data: CheckinData[]) => {
  return data.map(item => ({
    date: new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    emotion: emotionMapping[item.emotion],
    energy: energyMapping[item.energyLevel],
    tasksDone: item.tasksDone || 0
  }));
};

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const emotionValue = payload[0].value;
    const emotionText = Object.entries(emotionMapping).find(([_, val]) => val === emotionValue)?.[0] || '';
    
    const energyValue = payload[1].value;
    const energyText = Object.entries(energyMapping).find(([_, val]) => val === energyValue)?.[0] || '';
    
    const tasksDone = payload[2]?.value || 0;

    return (
      <div className="bg-white p-2 border rounded-md shadow-sm">
        <p className="text-xs font-semibold">{label}</p>
        <p className="text-xs text-gray-600">
          Emoção: {emotionText.charAt(0).toUpperCase() + emotionText.slice(1)}
        </p>
        <p className="text-xs text-gray-600">
          Energia: {energyText === 'low' ? 'Baixa' : energyText === 'medium' ? 'Média' : 'Alta'}
        </p>
        <p className="text-xs text-gray-600">
          Tarefas concluídas: {tasksDone}
        </p>
      </div>
    );
  }

  return null;
};

const WellbeingChart: React.FC<WellbeingChartProps> = ({ data, period }) => {
  const chartData = transformDataForChart(data);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Seu bem-estar ao longo do tempo</CardTitle>
        <CardDescription>
          {period === 'week' 
            ? 'Dados da última semana' 
            : 'Dados do último mês'}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickMargin={8}
            />
            <YAxis 
              hide={true}
              domain={[-3, 3]} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="emotion" fill="#a1c6ea" radius={[4, 4, 0, 0]} />
            <Bar dataKey="energy" fill="#9BE8D8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="tasksDone" fill="#FFD6A5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default WellbeingChart;
