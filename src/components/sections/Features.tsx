
import { useInView } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { 
  PenTool, 
  Smartphone, 
  Zap, 
  Shield, 
  Layout, 
  Code
} from 'lucide-react';

type Feature = {
  icon: JSX.Element;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: <PenTool size={24} />,
    title: 'Elegant Design',
    description: 'Thoughtfully crafted minimalist design that puts your content first.'
  },
  {
    icon: <Smartphone size={24} />,
    title: 'Responsive',
    description: 'Perfectly optimized for any device size, from mobile to desktop.'
  },
  {
    icon: <Zap size={24} />,
    title: 'High Performance',
    description: 'Lightning-fast load times and smooth interactions for an exceptional experience.'
  },
  {
    icon: <Shield size={24} />,
    title: 'Secure & Reliable',
    description: 'Built with security and reliability in mind, ensuring your data is safe.'
  },
  {
    icon: <Layout size={24} />,
    title: 'Intuitive Interface',
    description: 'User-friendly interface that makes navigation simple and intuitive.'
  },
  {
    icon: <Code size={24} />,
    title: 'Clean Code',
    description: 'Meticulously written code that is easy to customize and extend.'
  }
];

const Features = () => {
  const { ref, isInView } = useInView();
  
  return (
    <section id="features" className="py-24 bg-secondary/30" ref={ref}>
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-medium text-primary/90 mb-2">WHAT WE OFFER</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold tracking-tight text-foreground mb-4">
            Designed for Excellence
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Our framework combines elegant design with powerful functionality, providing everything you need to create beautiful experiences.
          </p>
        </div>
        
        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className={cn(
                "bg-white rounded-xl p-6 shadow-sm border border-border/50 transition-all duration-500 ease-out hover:shadow-md hover:-translate-y-1",
                isInView ? "opacity-100 transform-none" : "opacity-0 translate-y-8",
                "transition-all duration-500 ease-out",
                {
                  "delay-100": index % 3 === 0,
                  "delay-200": index % 3 === 1,
                  "delay-300": index % 3 === 2
                }
              )}
            >
              <div className="bg-primary/5 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-primary">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-foreground/80">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
