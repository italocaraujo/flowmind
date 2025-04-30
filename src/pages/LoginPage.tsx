
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulando autenticação
    setTimeout(() => {
      setIsLoading(false);
      
      // Neste MVP, apenas simulamos o login/registro
      localStorage.setItem('flowmind-user', JSON.stringify({ email, name: name || email.split('@')[0] }));
      
      toast({
        title: isLogin ? "Login realizado" : "Cadastro concluído",
        description: isLogin 
          ? "Bem-vindo de volta ao FlowMind!" 
          : "Sua conta foi criada com sucesso!",
      });
      
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-flowmind-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="h-16 w-16 rounded-xl bg-flowmind-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">F</span>
          </div>
          <h1 className="text-3xl font-bold text-flowmind-900">FlowMind</h1>
          <p className="text-gray-600 mt-2">Organize suas tarefas com bem-estar mental</p>
        </div>
        
        <Card className="w-full">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>{isLogin ? 'Entrar' : 'Criar uma conta'}</CardTitle>
              <CardDescription>
                {isLogin 
                  ? 'Faça login para acessar suas tarefas'
                  : 'Crie uma conta para começar a usar o FlowMind'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Nome
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flowmind-input"
                    placeholder="Seu nome"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flowmind-input"
                  placeholder="seu@email.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flowmind-input"
                  placeholder="********"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full btn-primary"
                disabled={isLoading || !email || !password}
              >
                {isLoading
                  ? "Processando..."
                  : isLogin
                    ? "Entrar"
                    : "Cadastrar"}
              </Button>
              
              <Button
                type="button"
                variant="link"
                className="text-flowmind-600"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin
                  ? "Não tem uma conta? Cadastre-se"
                  : "Já tem uma conta? Entre"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
