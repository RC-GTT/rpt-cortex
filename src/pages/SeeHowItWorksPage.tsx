
import { useState, useEffect } from 'react';
import { useAnimateIn } from '@/lib/animations';
import { 
  Play, 
  CheckCircle, 
  ArrowRight,
  Upload,
  Brain,
  Search,
  Lightbulb,
  Shield,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const StepCard = ({ 
  number, 
  title, 
  description, 
  icon,
  features 
}: { 
  number: number, 
  title: string, 
  description: string,
  icon: React.ReactNode,
  features: string[]
}) => {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
            {number}
          </div>
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-foreground/80 mb-4">{description}</p>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
              <span className="text-sm text-foreground/70">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

const SeeHowItWorksPage = () => {
  const [loading, setLoading] = useState(true);
  const showContent = useAnimateIn(false, 300);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const steps = [
    {
      number: 1,
      title: "Upload Your Data",
      description: "Import your documents, PDFs, notes, and data sources into our secure platform.",
      icon: <Upload className="w-6 h-6" />,
      features: [
        "Support for multiple file formats",
        "Bulk upload capabilities",
        "Automatic data validation",
        "Secure encryption during transfer"
      ]
    },
    {
      number: 2,
      title: "AI Analysis",
      description: "Our advanced AI algorithms analyze your data to identify risks and patterns.",
      icon: <Brain className="w-6 h-6" />,
      features: [
        "Machine learning risk detection",
        "Pattern recognition algorithms",
        "Predictive analytics",
        "Real-time processing"
      ]
    },
    {
      number: 3,
      title: "Smart Search & Discovery",
      description: "Find critical information instantly with intelligent search capabilities.",
      icon: <Search className="w-6 h-6" />,
      features: [
        "Natural language queries",
        "Semantic search technology",
        "Advanced filtering options",
        "Context-aware results"
      ]
    },
    {
      number: 4,
      title: "Generate Insights",
      description: "Get actionable recommendations and automated reports for better decision-making.",
      icon: <Lightbulb className="w-6 h-6" />,
      features: [
        "Automated risk assessments",
        "Custom report generation",
        "Actionable recommendations",
        "Trend analysis and forecasting"
      ]
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent -z-10"></div>
      <div className="absolute top-1/3 right-0 w-[300px] h-[300px] rounded-full bg-primary/5 blur-3xl -z-10"></div>
      <div className="absolute bottom-1/3 left-0 w-[250px] h-[250px] rounded-full bg-accent/5 blur-3xl -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-primary">
            See How It Works
          </h1>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto mb-8">
            Discover how Risk Pro Technology transforms your data into actionable insights through our intelligent risk management platform.
          </p>
          
          {/* Demo Video Placeholder */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center group cursor-pointer hover:from-primary/30 hover:to-accent/30 transition-all duration-300">
              <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
              <div className="relative z-10 flex items-center gap-3 text-white">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                  <Play className="w-8 h-8 ml-1" />
                </div>
                <span className="text-lg font-medium">Watch Demo Video</span>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Steps */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our 4-Step Process</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <StepCard {...step} />
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-primary/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Key Benefits */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Platform?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Enterprise Security</h3>
                <p className="text-foreground/80">
                  Bank-grade security with end-to-end encryption and compliance with industry standards.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
                <p className="text-foreground/80">
                  Process large datasets in seconds with our optimized AI algorithms and cloud infrastructure.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">AI-Powered</h3>
                <p className="text-foreground/80">
                  Advanced machine learning models trained on industry-specific risk patterns and scenarios.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-primary/5 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of companies already using Risk Pro Technology to transform their risk management processes.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="rounded-full px-8 py-6" asChild>
              <Link to="/">
                Join Waitlist
              </Link>
            </Button>
            
            <Button size="lg" variant="outline" className="rounded-full px-8 py-6" asChild>
              <Link to="/how">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeeHowItWorksPage;
