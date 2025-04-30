
import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, Moon, Settings, Sun, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/hooks/use-theme';
import FocusModeButton from './FocusModeButton';

const Header: React.FC = () => {
  const isMobile = useIsMobile();
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className="w-full bg-background border-b border-border sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-md bg-flowmind-600 flex items-center justify-center">
            <span className="text-white font-bold">F</span>
          </div>
          {!isMobile && (
            <span className="font-bold text-lg text-foreground">FlowMind</span>
          )}
        </Link>

        <div className="flex items-center space-x-2">
          <FocusModeButton />
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Moon className="h-5 w-5 text-muted-foreground" />
            )}
          </Button>
          <Link to="/hoje">
            <Button variant="ghost" size="icon">
              <CalendarCheck className="h-5 w-5 text-flowmind-600" />
            </Button>
          </Link>
          <Link to="/perfil">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5 text-muted-foreground" />
            </Button>
          </Link>
          <Link to="/configuracoes">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5 text-muted-foreground" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
