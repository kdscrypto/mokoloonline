import React from 'react';

interface StepCardProps {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  reverse?: boolean;
}

export function StepCard({ title, description, image, imageAlt, reverse = false }: StepCardProps) {
  return (
    <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center`}>
      <div className="w-full md:w-1/2">
        <img 
          src={image} 
          alt={imageAlt} 
          className="rounded-lg shadow-lg object-cover h-64 w-full"
        />
      </div>
      <div className="w-full md:w-1/2 space-y-4">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}