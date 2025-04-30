
import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Header: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <header className="w-full bg-white border-b border-border sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-md bg-flowmind-600 flex items-center justify-center">
            <span className="text-white font-bold">F</span>
          </div>
          {!isMobile && (
            <span className="font-bold text-lg text-flowmind-900">FlowMind</span>
          )}
        </Link>

        <div className="flex items-center space-x-2">
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
