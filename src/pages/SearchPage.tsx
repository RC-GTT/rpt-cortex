
import React from 'react';
import Search from '@/components/search';
import { AnimatedTransition } from '@/components/AnimatedTransition';
import { useAnimateIn } from '@/lib/animations';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Brain, Lock } from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import { useState } from 'react';

const SearchPage = () => {
  const showContent = useAnimateIn(false, 300);
  const { user, loading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  if (loading) {
    return (
      <div className="max-w-full mx-auto px-4 pt-24 pb-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className="max-w-4xl mx-auto px-4 pt-24 pb-6">
          <AnimatedTransition show={showContent} animation="slide-up">
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <MessageCircle className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <h1 className="text-4xl font-bold">Demo Our AI Chat</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Experience the power of conversational AI. Sign in to start chatting with your personal AI assistant.
                </p>
              </div>

              <Card className="max-w-md mx-auto">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-2">
                    <Lock className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <CardTitle>Sign In Required</CardTitle>
                  <CardDescription>
                    Create a free account or sign in to access the chat demo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="w-full"
                    size="lg"
                  >
                    Sign In to Demo Chat
                  </Button>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="text-center space-y-2">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full w-fit mx-auto">
                    <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold">Intelligent Responses</h3>
                  <p className="text-sm text-muted-foreground">
                    Get smart, contextual answers powered by advanced AI
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full w-fit mx-auto">
                    <MessageCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold">Natural Conversation</h3>
                  <p className="text-sm text-muted-foreground">
                    Chat naturally like you would with a human assistant
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-full w-fit mx-auto">
                    <Lock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold">Secure & Private</h3>
                  <p className="text-sm text-muted-foreground">
                    Your conversations are protected and secure
                  </p>
                </div>
              </div>
            </div>
          </AnimatedTransition>
        </div>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </>
    );
  }
  
  return (
    <div className="max-w-full mx-auto px-4 pt-24 pb-6">
      <AnimatedTransition show={showContent} animation="slide-up">
        <Search />
      </AnimatedTransition>
    </div>
  );
};

export default SearchPage;
