
import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StopCard from './StopCard';
import { useDirections } from '@/hooks/useDirections';

interface BusStop {
  id: string;
  name: string;
  distance: number; // in meters
  walkTime: number; // in minutes
  routes: string[];
}

const NearbyStops: React.FC = () => {
  const [nearbyStops, setNearbyStops] = useState<BusStop[]>([]);
  const { isGettingDirections, getDirections } = useDirections();

  useEffect(() => {
    // Simulate nearby stops data
    const stops: BusStop[] = [
      {
        id: 'stop1',
        name: 'JNTU Main Gate',
        distance: 150,
        walkTime: 2,
        routes: ['142K', '218', '290']
      },
      {
        id: 'stop2',
        name: 'Kukatpally Housing Board',
        distance: 450,
        walkTime: 6,
        routes: ['219', '288K', '10KJ']
      },
      {
        id: 'stop3',
        name: 'KPHB Colony',
        distance: 680,
        walkTime: 9,
        routes: ['5K', '113M', '142']
      },
      {
        id: 'stop4',
        name: 'Miyapur Metro Station',
        distance: 1200,
        walkTime: 15,
        routes: ['218', '290', '219L']
      }
    ];

    setNearbyStops(stops);
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          <span>Nearby Bus Stops</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {nearbyStops.map((stop) => (
          <StopCard
            key={stop.id}
            stop={stop}
            isGettingDirections={isGettingDirections === stop.id}
            onGetDirections={getDirections}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default NearbyStops;
