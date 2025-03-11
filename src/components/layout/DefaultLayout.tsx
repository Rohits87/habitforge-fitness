
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { cn } from '@/lib/utils';

type DefaultLayoutProps = {
  children: React.ReactNode;
  className?: string;
  noFooter?: boolean;
  fullWidth?: boolean;
};

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ 
  children, 
  className,
  noFooter = false,
  fullWidth = false
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={cn(
        "flex-1 pt-24 pb-12",
        fullWidth ? "w-full" : "container mx-auto px-4 md:px-6",
        className
      )}>
        {children}
      </main>
      {!noFooter && <Footer />}
    </div>
  );
};

export default DefaultLayout;
