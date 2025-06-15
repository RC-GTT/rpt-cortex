
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const { login, signUp } = useAuth();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      let result;
      if (isSignUp) {
        result = await signUp(email, password);
      } else {
        result = await login(email, password);
      }

      if (result.error) {
        toast({
          title: "Error",
          description: result.error.message || "Authentication failed",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: isSignUp 
            ? "Account created! Welcome to the demo!" 
            : "Welcome back! Enjoy the chat demo!",
        });
        onClose();
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setEmail('');
    setPassword('');
  };

  const handleQuickDemo = () => {
    setEmail('demo@example.com');
    setPassword('demo123');
    setIsSignUp(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isSignUp ? 'Create Demo Account' : 'Sign In to Demo'}
          </DialogTitle>
          <DialogDescription>
            {isSignUp 
              ? 'Create a free account to try our AI chat demo. No credit card required!'
              : 'Sign in to access the AI chat demo and experience the future of conversation.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {isSignUp && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                💡 Quick start: Use any email and password to create your demo account instantly!
              </p>
            </div>
          )}
          
          <DialogFooter className="flex-col space-y-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processing...' : (isSignUp ? 'Create Demo Account' : 'Sign In to Demo')}
            </Button>
            
            {isSignUp && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleQuickDemo}
                className="w-full"
              >
                Quick Demo Setup
              </Button>
            )}
            
            <Button 
              type="button" 
              variant="ghost" 
              onClick={toggleMode}
              className="w-full"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Create demo account"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="w-full">
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
