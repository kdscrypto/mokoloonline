import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface GoogleAdProps {
  slot: string;
  format?: 'auto' | 'fluid';
  layout?: string;
  className?: string;
}

export function GoogleAd({ slot, format = 'auto', layout, className = '' }: GoogleAdProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('Error loading Google Ad:', err);
    }
  }, []);

  return (
    <div className={`google-ad ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-2990055052325980"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
        data-ad-layout={layout}
      />
    </div>
  );
}