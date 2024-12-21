import React, { useEffect } from 'react';

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
      console.info('Tentative de chargement de la publicité Google AdSense:', {
        slot,
        format,
        layout
      });
      
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      
      console.info('Push AdSense réussi pour le slot:', slot);
    } catch (err) {
      console.error('Erreur lors du chargement de la publicité Google AdSense:', err);
    }
  }, [slot, format, layout]);

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