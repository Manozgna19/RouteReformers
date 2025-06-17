
import React from 'react';
import { Navigation, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BusStop {
  id: string;
  name: string;
  distance: number; // in meters
  walkTime: number; // in minutes
  routes: string[];
}

interface StopCardProps {
  stop: BusStop;
  isGettingDirections: boolean;
  onGetDirections: (stop: BusStop) => void;
}

const StopCard: React.FC<StopCardProps> = ({ stop, isGettingDirections, onGetDirections }) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">{stop.name}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
            <div className="flex items-center space-x-1">
              <Navigation className="h-3 w-3" />
              <span>{stop.distance}m</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{stop.walkTime} min walk</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {stop.routes.map((route) => (
              <span 
                key={route} 
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium"
              >
                {route}
              </span>
            ))}
          </div>
          
          {/* Action Button */}
          <div className="mt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onGetDirections(stop)}
              disabled={isGettingDirections}
              className="w-full"
            >
              {isGettingDirections ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                  Getting Directions...
                </>
              ) : (
                <>
                  <Navigation className="h-3 w-3 mr-1" />
                  Get Directions
                  <ExternalLink className="h-2 w-2 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StopCard;
