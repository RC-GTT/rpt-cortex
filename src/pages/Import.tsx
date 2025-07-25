
import React, { useState } from 'react';
import ImportPanel from '@/components/ImportPanel';
import { AnimatedTransition } from '@/components/AnimatedTransition';
import { useAnimateIn } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { WaitlistModal } from '@/components/waitlist/WaitlistModal';

const Import = () => {
  const showContent = useAnimateIn(false, 300);
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  
  return (
    <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
      <AnimatedTransition show={showContent} animation="slide-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Import Data</h1>
          <p className="text-muted-foreground mt-2">
            Add knowledge to your second brain from various sources
          </p>
          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsWaitlistModalOpen(true)}
              className="rounded-full"
            >
              Join Waitlist for Early Access
            </Button>
          </div>
        </div>
        
        <ImportPanel />
      </AnimatedTransition>
      
      <WaitlistModal isOpen={isWaitlistModalOpen} onClose={() => setIsWaitlistModalOpen(false)} />
    </div>
  );
};

export default Import;
