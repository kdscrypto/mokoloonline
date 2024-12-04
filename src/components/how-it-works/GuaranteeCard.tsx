import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface GuaranteeCardProps {
  title: string;
  description: string;
}

export function GuaranteeCard({ title, description }: GuaranteeCardProps) {
  return (
    <div className="bg-background p-6 rounded-lg shadow-sm">
      <div className="flex items-start gap-4">
        <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
        <div>
          <h3 className="font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}