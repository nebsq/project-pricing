
import { useState } from 'react';
import { useInView } from '@/lib/animations';
import { cn } from '@/lib/utils';
import AnimatedButton from '../ui/AnimatedButton';
import { Mail, Send, MessageSquare, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  const { ref, isInView } = useInView();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would handle form submission here
    console.log('Form submitted:', formState);
    alert('Thanks for your message! This is a demo, so the form doesn\'t actually submit.');
  };
  
  const contactInfo = [
    {
      icon: <MessageSquare size={20} />,
      label: 'Chat with us',
      value: 'support@blankcanvas.com'
    },
    {
      icon: <Phone size={20} />,
      label: 'Call us',
      value: '+1 (555) 123-4567'
    },
    {
      icon: <MapPin size={20} />,
      label: 'Visit us',
      value: '123 Design Street, Creativity City'
    }
  ];
  
  return (
    <section id="contact" className="py-24 bg-secondary/30" ref={ref}>
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-medium text-primary/90 mb-2">GET IN TOUCH</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold tracking-tight text-foreground mb-4">
              Let's Start a Conversation
            </h2>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              Have questions or ready to begin your journey? Reach out to us.
            </p>
          </div>
          
          {/* Contact card */}
          <div 
            className={cn(
              "bg-white rounded-xl shadow-sm border border-border/50 overflow-hidden",
              isInView ? "opacity-100 transform-none" : "opacity-0 translate-y-8",
              "transition-all duration-700 ease-out"
            )}
          >
            {/* Contact info */}
            <div className="px-6 py-8 sm:px-8 md:px-10 border-b border-border/50">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {contactInfo.map((item, index) => (
                  <div 
                    key={item.label}
                    className={cn(
                      "flex flex-col",
                      isInView ? "opacity-100 transform-none" : "opacity-0 translate-y-4",
                      "transition-all duration-500 ease-out",
                      {
                        "delay-100": index === 0,
                        "delay-200": index === 1,
                        "delay-300": index === 2
                      }
                    )}
                  >
                    <div className="flex items-center text-primary mb-1.5">
                      {item.icon}
                      <span className="ml-2 text-sm font-medium">{item.label}</span>
                    </div>
                    <span className="text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Contact form */}
            <form onSubmit={handleSubmit} className="px-6 py-8 sm:px-8 md:px-10">
              <div className="grid grid-cols-1 gap-6">
                <div
                  className={cn(
                    "grid grid-cols-1 sm:grid-cols-2 gap-6",
                    isInView ? "opacity-100 transform-none" : "opacity-0 translate-y-4",
                    "transition-all duration-500 ease-out delay-400"
                  )}
                >
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground/80 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300 ease-out"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground/80 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300 ease-out"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div
                  className={cn(
                    "",
                    isInView ? "opacity-100 transform-none" : "opacity-0 translate-y-4",
                    "transition-all duration-500 ease-out delay-500"
                  )}
                >
                  <label htmlFor="message" className="block text-sm font-medium text-foreground/80 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300 ease-out"
                    placeholder="How can we help you?"
                    required
                  />
                </div>
                
                <div
                  className={cn(
                    "flex justify-end",
                    isInView ? "opacity-100 transform-none" : "opacity-0 translate-y-4",
                    "transition-all duration-500 ease-out delay-600"
                  )}
                >
                  <AnimatedButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    icon={<Send size={16} />}
                  >
                    Send Message
                  </AnimatedButton>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
