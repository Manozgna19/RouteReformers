
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface BusStop {
  id: string;
  name: string;
  distance: number;
  walkTime: number;
  routes: string[];
}

export const useDirections = () => {
  const [isGettingDirections, setIsGettingDirections] = useState<string | null>(null);
  const { toast } = useToast();

  const getDirections = (stop: BusStop) => {
    setIsGettingDirections(stop.id);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Create a Google Maps directions URL for walking
          const directionsUrl = `https://www.google.com/maps/dir/${latitude},${longitude}/${encodeURIComponent(stop.name)}/data=!3m1!4b1!4m2!4m1!3e2`;
          
          // Open in new tab
          window.open(directionsUrl, '_blank');
          
          toast({
            title: "Walking directions opened",
            description: `Directions to ${stop.name} opened in Google Maps.`,
          });
          
          setIsGettingDirections(null);
        },
        (error) => {
          console.error('Geolocation error:', error);
          
          // Fallback: open Google Maps search for the stop
          const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(stop.name)}`;
          window.open(searchUrl, '_blank');
          
          toast({
            title: "Location access denied",
            description: "Opened stop location in Google Maps.",
            variant: "destructive"
          });
          
          setIsGettingDirections(null);
        }
      );
    } else {
      // Geolocation not supported
      const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(stop.name)}`;
      window.open(searchUrl, '_blank');
      
      toast({
        title: "Geolocation not supported",
        description: "Opened stop location in Google Maps.",
      });
      
      setIsGettingDirections(null);
    }
  };

  return {
    isGettingDirections,
    getDirections
  };
};
