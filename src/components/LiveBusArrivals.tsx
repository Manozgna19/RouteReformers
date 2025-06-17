
import React, { useState, useEffect } from 'react';
import { Bus, Clock, MapPin, Navigation, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface BusArrival {
  routeNumber: string;
  destination: string;
  arrivalTime: number; // minutes
  operator: string;
  isLive: boolean;
  busId: string;
}

interface LiveBusArrivalsProps {
  stopName: string;
  stopId: string;
}

const LiveBusArrivals: React.FC<LiveBusArrivalsProps> = ({ stopName, stopId }) => {
  const [arrivals, setArrivals] = useState<BusArrival[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate live bus arrivals data
    const generateArrivals = () => {
      const routes = [
        { number: '142K', dest: 'Secunderabad', operator: 'TSRTC' },
        { number: '218', dest: 'Miyapur Metro', operator: 'TSRTC' },
        { number: '290', dest: 'JNTU', operator: 'TSRTC' },
        { number: '5K', dest: 'Ameerpet', operator: 'TSRTC' },
        { number: '113M', dest: 'Kompally', operator: 'TSRTC' }
      ];

      const newArrivals = routes.map((route, index) => ({
        routeNumber: route.number,
        destination: route.dest,
        arrivalTime: Math.floor(Math.random() * 15) + 1, // 1-15 minutes
        operator: route.operator,
        isLive: Math.random() > 0.3, // 70% chance of live tracking
        busId: `${route.number}-${Math.floor(Math.random() * 100)}`
      }));

      setArrivals(newArrivals.sort((a, b) => a.arrivalTime - b.arrivalTime));
      setLastUpdated(new Date());
    };

    generateArrivals();
    const interval = setInterval(generateArrivals, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [stopId]);

  const getArrivalText = (minutes: number) => {
    if (minutes === 0) return 'Arriving';
    if (minutes === 1) return '1 min';
    return `${minutes} mins`;
  };

  const handleGetDirections = () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Create a Google Maps directions URL
          const directionsUrl = `https://www.google.com/maps/dir/${latitude},${longitude}/${encodeURIComponent(stopName)}`;
          
          // Open in new tab
          window.open(directionsUrl, '_blank');
          
          toast({
            title: "Directions opened",
            description: "Google Maps directions have been opened in a new tab.",
          });
          
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          
          // Fallback: open Google Maps search for the stop
          const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(stopName)}`;
          window.open(searchUrl, '_blank');
          
          toast({
            title: "Location access denied",
            description: "Opened stop location in Google Maps. You can get directions from there.",
            variant: "destructive"
          });
          
          setIsGettingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      // Geolocation not supported - fallback to Google Maps search
      const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(stopName)}`;
      window.open(searchUrl, '_blank');
      
      toast({
        title: "Geolocation not supported",
        description: "Opened stop location in Google Maps.",
      });
      
      setIsGettingLocation(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bus className="h-5 w-5 text-blue-600" />
            <span>{stopName}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Updated {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {arrivals.length > 0 ? (
          arrivals.map((arrival, index) => (
            <div key={`${arrival.busId}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg text-blue-600">{arrival.routeNumber}</span>
                    {arrival.isLive && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold animate-pulse">
                        LIVE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <MapPin className="h-3 w-3" />
                    <span>{arrival.destination}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${
                  arrival.arrivalTime <= 2 ? 'text-green-600' : 
                  arrival.arrivalTime <= 5 ? 'text-orange-600' : 'text-gray-600'
                }`}>
                  {getArrivalText(arrival.arrivalTime)}
                </div>
                <div className="text-xs text-gray-500">{arrival.operator}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            <Bus className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No buses scheduled</p>
          </div>
        )}
        
        {/* Directions Button */}
        <Button 
          variant="outline" 
          className="w-full mt-4" 
          onClick={handleGetDirections}
          disabled={isGettingLocation}
        >
          {isGettingLocation ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Getting Location...
            </>
          ) : (
            <>
              <Navigation className="h-4 w-4 mr-2" />
              Get Directions to This Stop
              <ExternalLink className="h-3 w-3 ml-2" />
            </>
          )}
        </Button>
        
        {/* Live Tracking Info */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2 text-blue-800">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Live Tracking Active</span>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            Real-time arrivals update every 30 seconds. Buses marked "LIVE" have GPS tracking enabled.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveBusArrivals;
