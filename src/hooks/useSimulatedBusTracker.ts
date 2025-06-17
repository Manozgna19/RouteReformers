
import { useState, useEffect } from 'react';

export interface SimulatedBus {
  id: string;
  routeId: string;
  progress: number; // 0.0 to 1.0, representing position along the route
  direction: 'forward' | 'backward';
}

const SIMULATION_INTERVAL = 3000; // Update every 3 seconds
const BUS_SPEED = 0.05; // Progress made per interval

/**
 * A custom hook to simulate live bus tracking data for given routes.
 * @param routeIds The ID(s) of the route(s) to track. Can be a single ID or an array of IDs.
 * @returns An array of simulated buses with their live progress.
 */
export const useSimulatedBusTracker = (routeIds: string | string[] | null) => {
  const [buses, setBuses] = useState<SimulatedBus[]>([]);

  useEffect(() => {
    const routesToTrack = Array.isArray(routeIds)
      ? routeIds
      : routeIds && routeIds !== 'all'
      ? [routeIds]
      : [];

    if (routesToTrack.length === 0) {
      setBuses([]);
      return;
    }

    // Initialize a consistent number of buses for the selected route(s)
    const initialBuses: SimulatedBus[] = [];
    routesToTrack.forEach(routeId => {
      // Use a simple hash to get a consistent bus count for a route
      const busCount = 2 + (routeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 2); // 2 to 3 buses

      for (let i = 0; i < busCount; i++) {
        initialBuses.push({
          id: `${routeId}-bus-${i + 1}`,
          routeId: routeId,
          progress: Math.random(),
          direction: Math.random() > 0.5 ? 'forward' : 'backward',
        });
      }
    });
    setBuses(initialBuses);

    const intervalId = setInterval(() => {
      setBuses(currentBuses =>
        currentBuses.map(bus => {
          let newProgress = bus.progress;
          if (bus.direction === 'forward') {
            newProgress += BUS_SPEED;
            if (newProgress >= 1.0) {
              newProgress = 1.0;
              return { ...bus, progress: newProgress, direction: 'backward' as const };
            }
          } else {
            newProgress -= BUS_SPEED;
            if (newProgress <= 0.0) {
              newProgress = 0.0;
              return { ...bus, progress: newProgress, direction: 'forward' as const };
            }
          }
          return { ...bus, progress: newProgress };
        })
      );
    }, SIMULATION_INTERVAL);

    return () => clearInterval(intervalId);
  }, [JSON.stringify(routeIds)]);

  return buses;
};
