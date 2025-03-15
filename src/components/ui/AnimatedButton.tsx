
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  target?: string;
  rel?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const AnimatedButton = ({
  children,
  onClick,
  className,
  variant = 'primary',
  size = 'md',
  href,
  target,
  rel,
  icon,
  iconPosition = 'right',
  fullWidth = false,
  disabled = false,
  type = 'button',
}: AnimatedButtonProps) => {
  const [isHovering, setIsHovering] = useState(false);
  
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 tracking-tight relative overflow-hidden';
  
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:shadow-md shadow-sm',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  };
  
  const sizes = {
    sm: 'text-xs px-3 py-1.5 h-8',
    md: 'text-sm px-4 py-2 h-10',
    lg: 'text-base px-5 py-2.5 h-12',
  };
  
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);
  
  const Component = href ? 'a' : 'button';
  
  const buttonProps = {
    onClick,
    className: cn(
      baseStyles,
      variants[variant],
      sizes[size],
      fullWidth ? 'w-full' : '',
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      className
    ),
    href,
    target,
    rel,
    disabled,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    type: Component === 'button' ? type : undefined,
  };
  
  return (
    <Component {...buttonProps}>
      {iconPosition === 'left' && icon && (
        <span className={cn("mr-2", isHovering ? "-translate-x-0.5 opacity-100" : "translate-x-0 opacity-80", "transition-all duration-300 ease-out")}>
          {icon}
        </span>
      )}
      
      <span className="relative z-10">
        {children}
        <span className={cn(
          "absolute inset-0 w-full h-0.5 bg-white/30 bottom-0 left-0 transition-all duration-300",
          isHovering ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0",
          variant !== 'primary' && "bg-primary/20"
        )} />
      </span>
      
      {iconPosition === 'right' && icon && (
        <span className={cn("ml-2", isHovering ? "translate-x-0.5 opacity-100" : "translate-x-0 opacity-80", "transition-all duration-300 ease-out")}>
          {icon}
        </span>
      )}
      
      <span className={cn(
        "absolute inset-0 w-full h-full bg-black/5 transition-all duration-500 ease-out transform origin-left",
        isHovering ? "scale-x-100" : "scale-x-0",
        variant !== 'primary' && "bg-primary/5"
      )} />
    </Component>
  );
};

export default AnimatedButton;
