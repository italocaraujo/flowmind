
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Focus } from 'lucide-react';
import FocusMode from '@/components/focus/FocusMode';
import { useIsMobile } from '@/hooks/use-mobile';

const FocusModeButton: React.FC = () => {
  const [isFocusModeActive, setIsFocusModeActive] = useState(false);
  const isMobile = useIsMobile();

  const handleActivateFocusMode = () => {
    setIsFocusModeActive(true);
  };

  const handleExitFocusMode = () => {
    setIsFocusModeActive(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleActivateFocusMode}
        title="Ativar Modo Foco"
      >
        <Focus className="h-5 w-5 text-flowmind-600" />
      </Button>

      {isFocusModeActive && <FocusMode onExit={handleExitFocusMode} />}
    </>
  );
};

export default FocusModeButton;
