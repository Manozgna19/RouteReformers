
import React, { useState, useEffect } from 'react';
import { Bus, Clock, MapPin, Navigation, User, IndianRupee } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface College {
  id: string;
  name: string;
  address: string;
  college_type: string;
}

interface BusRoute {
  id: string;
  route_number: string;
  route_name: string;
  operator: string;
  color: string;
  estimatedTime: number;
  frequency: number;
  fare: number;
  stops: number;
}

interface BusRoutesProps {
  college: College;
  cityId: string;
}

const BusRoutes: React.FC<BusRoutesProps> = ({ college, cityId }) => {
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [nearbyStops, setNearbyStops] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRoutesAndStops = async () => {
      try {
        console.log('Fetching routes for city:', cityId);
        
        // Fetch bus stops near the college
        const { data: stops, error: stopsError } = await supabase
          .from('bus_stops')
          .select('*')
          .eq('college_id', college.id)
          .order('distance_to_college_meters');

        if (stopsError) {
          console.error('Error fetching stops:', stopsError);
        } else {
          console.log('Found bus stops:', stops);
          setNearbyStops(stops || []);
        }

        // Fetch bus routes in the city
        const { data: routesData, error: routesError } = await supabase
          .from('bus_routes')
          .select('*')
          .eq('city_id', cityId)
          .eq('is_active', true)
          .order('route_number');

        if (routesError) {
          console.error('Error fetching routes:', routesError);
          toast({
            title: "Error",
            description: "Failed to load bus routes",
            variant: "destructive"
          });
        } else {
          console.log('Found bus routes:', routesData);
          // Enhance routes with simulated operational data
          const enhancedRoutes = (routesData || []).map((route) => {
            // Generate realistic operational data based on route characteristics
            const routeLength = route.route_name.length; // Use route name length as a proxy for route complexity
            const baseTime = 20;
            const timeVariation = Math.floor(routeLength / 10) * 5; // Longer route names = longer routes
            
            return {
              ...route,
              estimatedTime: baseTime + timeVariation + Math.floor(Math.random() * 15), // 20-50 minutes
              frequency: 6 + Math.floor(Math.random() * 12), // 6-18 minutes frequency
              fare: 15 + Math.floor(Math.random() * 20), // ₹15-35 fare range
              stops: 8 + Math.floor(Math.random() * 15) // 8-23 stops
            };
          });
          
          setRoutes(enhancedRoutes);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRoutesAndStops();
  }, [college.id, cityId, toast]);

  const getNextDeparture = () => {
    const now = new Date();
    const nextDeparture = new Date(now.getTime() + (Math.random() * 15 + 5) * 60000); // Random 5-20 minutes
    return nextDeparture.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-24 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* College Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800">{college.name}</h3>
              <p className="text-gray-600">{college.address}</p>
              <Badge variant="outline" className="mt-2">
                {college.college_type.charAt(0).toUpperCase() + college.college_type.slice(1)}
              </Badge>
            </div>
          </div>
          {nearbyStops.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800 font-medium">
                🎯 {nearbyStops.length} bus stop{nearbyStops.length !== 1 ? 's' : ''} found near this college
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bus Routes */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
          <Bus className="h-6 w-6 text-blue-600" />
          <span>Available TSRTC Bus Routes</span>
        </h2>

        {routes.length > 0 ? (
          <div className="grid gap-4">
            {routes.map((route) => (
              <Card key={route.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between space-y-4 lg:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: route.color }}
                        >
                          {route.route_number}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-800">
                              Route {route.route_number}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {route.operator}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 leading-tight">{route.route_name}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-blue-600 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-600">Travel Time</p>
                            <p className="font-semibold text-gray-800 text-sm">{route.estimatedTime} mins</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <IndianRupee className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-600">Fare</p>
                            <p className="font-semibold text-gray-800 text-sm">₹{route.fare}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-purple-600 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-600">Stops</p>
                            <p className="font-semibold text-gray-800 text-sm">{route.stops}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Navigation className="h-4 w-4 text-orange-600 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-600">Frequency</p>
                            <p className="font-semibold text-gray-800 text-sm">Every {route.frequency} mins</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Next departure:</strong> {getNextDeparture()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 lg:ml-6 lg:w-32">
                      <Link to="/map">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm">
                          Track Live
                          <Navigation className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                      <Link to="/planner">
                        <Button variant="outline" className="w-full text-sm">
                          Plan Route
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Bus className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Routes Available</h3>
              <p className="text-gray-500">
                Bus route information for this college will be available soon.
              </p>
              <div className="mt-4">
                <Link to="/planner">
                  <Button>
                    Try Route Planner
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BusRoutes;
