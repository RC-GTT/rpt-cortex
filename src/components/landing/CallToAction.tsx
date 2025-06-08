
import { Button } from '@/components/ui/button';
import { AnimatedTransition } from '@/components/AnimatedTransition';
import { useState } from 'react';
import { WaitlistModal } from '../waitlist/WaitlistModal';
import { Link } from 'react-router-dom';

interface CallToActionProps {
  show: boolean;
}

export const CallToAction = ({ show }: CallToActionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <AnimatedTransition show={show} animation="slide-up" duration={600}>
      <div className="py-16 md:py-24 text-primary-foreground rounded-2xl text-center bg-blue-600">
        <h2 className="text-4xl font-bold mb-4 md:text-7xl">Get Started Today!</h2>
        <p className="text-xl mb-10">Ready to transform your risk management?</p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            size="lg" 
            variant="outline" 
            className="rounded-full px-8 py-6 text-base font-medium bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10 transition-all duration-300"
            onClick={() => setIsModalOpen(true)}
          >
            Contact Us
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="rounded-full px-8 py-6 text-base font-medium bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10 transition-all duration-300"
            asChild
          >
            <Link to="/see-how-it-works">
              See How it Works
            </Link>
          </Button>
        </div>
      </div>

      <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </AnimatedTransition>
  );
};
