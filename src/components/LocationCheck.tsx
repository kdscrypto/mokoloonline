import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function LocationCheck({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkLocation = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('check-location');
        
        if (error) throw error;
        
        if (!data.allowed) {
          setError(data.message);
        }
      } catch (err) {
        console.error('Erreur lors de la vérification de la localisation:', err);
        setError("Une erreur est survenue lors de la vérification de votre localisation");
      } finally {
        setIsLoading(false);
      }
    };

    checkLocation();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Accès Refusé</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return children;
}