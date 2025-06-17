import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bus, MapPin, Navigation, Locate, Clock, Route, Info, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSimulatedBusTracker } from '@/hooks/useSimulatedBusTracker';
import { useToast } from '@/components/ui/use-toast';
import LiveBusArrivals from '@/components/LiveBusArrivals';

const MapView = () => {
  const [selectedCollege, setSelectedCollege] = useState('jntu-hyderabad');
  const [selectedRoute, setSelectedRoute] = useState('all');
  const [userLocation, setUserLocation] = useState<{x: number, y: number} | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [selectedStop, setSelectedStop] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Expanded to include more colleges across India
  const colleges = [
    // Hyderabad
    { id: 'jntu-hyderabad', name: 'JNTU Hyderabad', city: 'Hyderabad', x: 78, y: 45 },
    { id: 'cvr-college', name: 'CVR College', city: 'Hyderabad', x: 80, y: 47 },
    { id: 'vasavi-college', name: 'Vasavi College', city: 'Hyderabad', x: 76, y: 43 },
    { id: 'cbit', name: 'CBIT', city: 'Hyderabad', x: 82, y: 49 },
    
    // Mumbai
    { id: 'vjti', name: 'VJTI', city: 'Mumbai', x: 72, y: 19 },
    { id: 'kj-somaiya', name: 'KJ Somaiya', city: 'Mumbai', x: 74, y: 21 },
    
    // Pune
    { id: 'mit-pune', name: 'MIT Pune', city: 'Pune', x: 73, y: 18 },
    { id: 'coep', name: 'COEP', city: 'Pune', x: 71, y: 20 },
    { id: 'vit-pune', name: 'VIT Pune', city: 'Pune', x: 75, y: 18 },
    
    // Bangalore
    { id: 'rv-bangalore', name: 'RV College', city: 'Bangalore', x: 77, y: 12 },
    { id: 'bms-college', name: 'BMS College', city: 'Bangalore', x: 79, y: 14 },
    { id: 'pes-university', name: 'PES University', city: 'Bangalore', x: 75, y: 10 },
    
    // Delhi
    { id: 'dtu', name: 'DTU', city: 'Delhi', x: 77, y: 28 },
    { id: 'nsit', name: 'NSIT', city: 'Delhi', x: 79, y: 30 },
    
    // Chennai
    { id: 'anna-university', name: 'Anna University', city: 'Chennai', x: 80, y: 13 },
    { id: 'vit-chennai', name: 'VIT Chennai', city: 'Chennai', x: 82, y: 11 }
  ];

  const busStops = {
    'jntu-hyderabad': [
      { id: 1, name: 'JNTU Main Gate', x: 78, y: 45, type: 'campus' },
      { id: 2, name: 'Kukatpally Housing Board', x: 73, y: 40, type: 'major' },
      { id: 3, name: 'KPHB Colony', x: 68, y: 35, type: 'regular' },
      { id: 4, name: 'Miyapur Metro Station', x: 63, y: 30, type: 'major' },
      { id: 5, name: 'Bachupally', x: 83, y: 50, type: 'regular' }
    ],
    'cvr-college': [
      { id: 1, name: 'CVR College Gate', x: 80, y: 47, type: 'campus' },
      { id: 2, name: 'Vastunagar', x: 75, y: 42, type: 'regular' },
      { id: 3, name: 'Mangalpally', x: 70, y: 37, type: 'regular' },
      { id: 4, name: 'Shamshabad', x: 65, y: 32, type: 'major' }
    ],
    'vasavi-college': [
      { id: 1, name: 'Vasavi College', x: 76, y: 43, type: 'campus' },
      { id: 2, name: 'Ibrahimpatnam', x: 71, y: 38, type: 'regular' },
      { id: 3, name: 'LB Nagar', x: 66, y: 33, type: 'major' }
    ],
    'cbit': [
      { id: 1, name: 'CBIT Gandipet', x: 82, y: 49, type: 'campus' },
      { id: 2, name: 'Gandipet', x: 77, y: 44, type: 'regular' },
      { id: 3, name: 'Narsingi', x: 72, y: 39, type: 'regular' }
    ],
    'vjti': [
      { id: 1, name: 'VJTI Matunga', x: 72, y: 19, type: 'campus' },
      { id: 2, name: 'Dadar', x: 67, y: 14, type: 'major' },
      { id: 3, name: 'CST', x: 62, y: 9, type: 'major' },
      { id: 4, name: 'Kurla', x: 77, y: 24, type: 'regular' }
    ],
    'kj-somaiya': [
      { id: 1, name: 'KJ Somaiya', x: 74, y: 21, type: 'campus' },
      { id: 2, name: 'Vidyavihar', x: 69, y: 16, type: 'regular' },
      { id: 3, name: 'Ghatkopar', x: 64, y: 11, type: 'major' }
    ],
    'mit-pune': [
      { id: 1, name: 'MIT WPU Campus', x: 73, y: 18, type: 'campus' },
      { id: 2, name: 'Loni Kalbhor', x: 78, y: 23, type: 'regular' },
      { id: 3, name: 'Hadapsar', x: 83, y: 28, type: 'major' },
      { id: 4, name: 'Pune Station', x: 68, y: 13, type: 'major' }
    ],
    'coep': [
      { id: 1, name: 'COEP', x: 71, y: 20, type: 'campus' },
      { id: 2, name: 'Shivaji Nagar', x: 66, y: 15, type: 'major' },
      { id: 3, name: 'Pune Station', x: 61, y: 10, type: 'major' }
    ],
    'vit-pune': [
      { id: 1, name: 'VIT Pune', x: 75, y: 18, type: 'campus' },
      { id: 2, name: 'Bibwewadi', x: 70, y: 13, type: 'regular' },
      { id: 3, name: 'Swargate', x: 65, y: 8, type: 'major' }
    ],
    'rv-bangalore': [
      { id: 1, name: 'RV College Main Gate', x: 77, y: 12, type: 'campus' },
      { id: 2, name: 'Jayanagar 4th Block', x: 72, y: 7, type: 'major' },
      { id: 3, name: 'Banashankari', x: 67, y: 2, type: 'regular' },
      { id: 4, name: 'Majestic Bus Stand', x: 62, y: 17, type: 'major' },
      { id: 5, name: 'BTM Layout', x: 82, y: 17, type: 'regular' }
    ],
    'bms-college': [
      { id: 1, name: 'BMS College', x: 79, y: 14, type: 'campus' },
      { id: 2, name: 'Basavanagudi', x: 74, y: 9, type: 'regular' },
      { id: 3, name: 'Lalbagh', x: 69, y: 4, type: 'major' }
    ],
    'pes-university': [
      { id: 1, name: 'PES University', x: 75, y: 10, type: 'campus' },
      { id: 2, name: 'Electronics City', x: 70, y: 5, type: 'major' },
      { id: 3, name: 'Silk Board', x: 80, y: 15, type: 'regular' }
    ],
    'dtu': [
      { id: 1, name: 'DTU', x: 77, y: 28, type: 'campus' },
      { id: 2, name: 'Rohini Sector 9', x: 72, y: 23, type: 'major' },
      { id: 3, name: 'Kashmere Gate', x: 67, y: 18, type: 'major' }
    ],
    'nsit': [
      { id: 1, name: 'NSIT', x: 79, y: 30, type: 'campus' },
      { id: 2, name: 'Dwarka Sector 9', x: 74, y: 25, type: 'major' },
      { id: 3, name: 'New Delhi', x: 69, y: 20, type: 'major' }
    ],
    'anna-university': [
      { id: 1, name: 'Anna University', x: 80, y: 13, type: 'campus' },
      { id: 2, name: 'Guindy', x: 75, y: 8, type: 'regular' },
      { id: 3, name: 'Chennai Central', x: 70, y: 3, type: 'major' }
    ],
    'vit-chennai': [
      { id: 1, name: 'VIT Chennai', x: 82, y: 11, type: 'campus' },
      { id: 2, name: 'Kelambakkam', x: 77, y: 6, type: 'regular' },
      { id: 3, name: 'Tambaram', x: 72, y: 1, type: 'major' }
    ]
  };

  const routes = {
    'jntu-hyderabad': [
      { id: '219', color: 'blue', name: 'TSRTC - JNTU to Secunderabad', operator: 'TSRTC' },
      { id: '288K', color: 'green', name: 'TSRTC - JNTU to Koti', operator: 'TSRTC' },
      { id: '10KJ', color: 'purple', name: 'TSRTC - JNTU to Jubilee Hills', operator: 'TSRTC' }
    ],
    'cvr-college': [
      { id: '142K', color: 'blue', name: 'TSRTC - CVR to Secunderabad', operator: 'TSRTC' },
      { id: '218', color: 'green', name: 'TSRTC - CVR to Miyapur', operator: 'TSRTC' }
    ],
    'vasavi-college': [
      { id: '5K', color: 'blue', name: 'TSRTC - Vasavi to Secunderabad', operator: 'TSRTC' },
      { id: '142', color: 'green', name: 'TSRTC - Vasavi to Ameerpet', operator: 'TSRTC' }
    ],
    'cbit': [
      { id: '218', color: 'blue', name: 'TSRTC - CBIT to Mehdipatnam', operator: 'TSRTC' },
      { id: '5K', color: 'green', name: 'TSRTC - CBIT to Tolichowki', operator: 'TSRTC' }
    ],
    'vjti': [
      { id: 'A74', color: 'blue', name: 'BEST - VJTI to CST', operator: 'BEST' },
      { id: '171', color: 'green', name: 'BEST - VJTI to Bandra', operator: 'BEST' }
    ],
    'kj-somaiya': [
      { id: '302', color: 'blue', name: 'BEST - Somaiya to Dadar', operator: 'BEST' },
      { id: '421', color: 'green', name: 'BEST - Somaiya to Kurla', operator: 'BEST' }
    ],
    'mit-pune': [
      { id: '4', color: 'blue', name: 'PMPML - MIT to Pune Station', operator: 'PMPML' },
      { id: '152', color: 'green', name: 'PMPML - MIT to Hadapsar', operator: 'PMPML' }
    ],
    'coep': [
      { id: '1', color: 'blue', name: 'PMPML - COEP to Station', operator: 'PMPML' },
      { id: '2', color: 'green', name: 'PMPML - COEP to Deccan', operator: 'PMPML' }
    ],
    'vit-pune': [
      { id: '3', color: 'blue', name: 'PMPML - VIT to Station', operator: 'PMPML' },
      { id: '65', color: 'green', name: 'PMPML - VIT to Swargate', operator: 'PMPML' }
    ],
    'rv-bangalore': [
      { id: 'G4', color: 'blue', name: 'BMTC - RV to Majestic', operator: 'BMTC' },
      { id: '415', color: 'green', name: 'BMTC - RV to Koramangala', operator: 'BMTC' }
    ],
    'bms-college': [
      { id: '201', color: 'blue', name: 'BMTC - BMS to Majestic', operator: 'BMTC' },
      { id: 'G4', color: 'green', name: 'BMTC - BMS to Basavanagudi', operator: 'BMTC' }
    ],
    'pes-university': [
      { id: '335E', color: 'blue', name: 'BMTC - PES to Majestic', operator: 'BMTC' },
      { id: '500K', color: 'green', name: 'BMTC - PES to Silk Board', operator: 'BMTC' }
    ],
    'dtu': [
      { id: '764', color: 'blue', name: 'DTC - DTU to Kashmere Gate', operator: 'DTC' },
      { id: '883', color: 'green', name: 'DTC - DTU to Rohini', operator: 'DTC' }
    ],
    'nsit': [
      { id: '522', color: 'blue', name: 'DTC - NSIT to New Delhi', operator: 'DTC' },
      { id: '764', color: 'green', name: 'DTC - NSIT to Dwarka', operator: 'DTC' }
    ],
    'anna-university': [
      { id: '23G', color: 'blue', name: 'MTC - Anna to Central', operator: 'MTC' },
      { id: '21G', color: 'green', name: 'MTC - Anna to Guindy', operator: 'MTC' }
    ],
    'vit-chennai': [
      { id: '21G', color: 'blue', name: 'MTC - VIT to Central', operator: 'MTC' },
      { id: '555', color: 'green', name: 'MTC - VIT to Tambaram', operator: 'MTC' }
    ]
  };

  const routeDetailsMap = useMemo(() => {
    const map: { [key: string]: any } = {};
    for (const collegeId in routes) {
      for (const route of routes[collegeId]) {
        map[route.id] = {
          ...route,
          collegeId: collegeId,
        };
      }
    }
    return map;
  }, []);

  const routeIdsToTrack = selectedRoute === 'all'
    ? routes[selectedCollege]?.map(r => r.id) || []
    : selectedRoute;
  const liveBuses = useSimulatedBusTracker(routeIdsToTrack);

  const getCurrentBusStops = () => {
    return busStops[selectedCollege] || [];
  };

  const getCurrentRoutes = () => {
    return routes[selectedCollege] || [];
  };

  const filteredRoutes = getCurrentRoutes().filter(route => 
    selectedRoute === 'all' || route.id === selectedRoute
  );

  const getPointOnQuadraticBezier = (p0: {x: number, y: number}, p1: {x: number, y: number}, p2: {x: number, y: number}, t: number) => {
    const x = Math.pow(1 - t, 2) * p0.x + 2 * (1 - t) * t * p1.x + Math.pow(t, 2) * p2.x;
    const y = Math.pow(1 - t, 2) * p0.y + 2 * (1 - t) * t * p1.y + Math.pow(t, 2) * p2.y;
    return { x, y };
  };

  const getBusIcon = (routeInfo: any, busId: string) => {
    // Create variety of bus types based on operator and route
    const busNumber = parseInt(busId.split('-')[1]) || 1;
    const operator = routeInfo.operator;
    
    // Different bus styles based on operator and number
    if (operator === 'TSRTC') {
      // Telangana State RTC buses - typically government buses
      return busNumber % 2 === 0 ? '🚌' : '🚍';
    } else if (operator === 'BEST') {
      // Mumbai BEST buses - red colored
      return busNumber % 3 === 0 ? '🚐' : '🚌';
    } else if (operator === 'PMPML') {
      // Pune buses - modern city buses
      return busNumber % 2 === 0 ? '🚍' : '🚌';
    } else if (operator === 'BMTC') {
      // Bangalore buses - Volvo and regular
      return busNumber % 3 === 0 ? '🚐' : busNumber % 2 === 0 ? '🚍' : '🚌';
    } else if (operator === 'DTC') {
      // Delhi buses - mix of CNG and regular
      return busNumber % 2 === 0 ? '🚌' : '🚍';
    } else if (operator === 'MTC') {
      // Chennai buses
      return busNumber % 3 === 0 ? '🚐' : '🚌';
    }
    
    return '🚌'; // Default bus
  };

  const findMyLocation = () => {
    setLocationLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const mockX = 60 + Math.random() * 30;
          const mockY = 10 + Math.random() * 40;
          
          setUserLocation({ x: mockX, y: mockY });
          setLocationLoading(false);
          
          toast({
            title: "Location found",
            description: "Your location has been marked on the map.",
          });
          
          console.log('User location found:', { 
            lat: position.coords.latitude, 
            lng: position.coords.longitude,
            mockMapPosition: { x: mockX, y: mockY }
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          setUserLocation({ x: 75, y: 25 });
          setLocationLoading(false);
          
          toast({
            title: "Location access denied",
            description: "Using a default location on the map.",
            variant: "destructive"
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser');
      setUserLocation({ x: 75, y: 25 });
      setLocationLoading(false);
      
      toast({
        title: "Geolocation not supported",
        description: "Using a default location on the map.",
        variant: "destructive"
      });
    }
  };

  const getNearbyBuses = () => {
    if (!userLocation) return [];
    
    return liveBuses.filter(bus => {
      const routeInfo = routeDetailsMap[bus.routeId];
      if (!routeInfo) return false;

      const stops = busStops[routeInfo.collegeId];
      if (!stops || stops.length < 2) return false;

      const startStop = stops[0];
      const endStop = stops[stops.length - 1];
      const p0 = { x: startStop.x, y: startStop.y };
      const p2 = { x: endStop.x, y: endStop.y };
      const p1 = { x: (startStop.x + endStop.x) / 2, y: (startStop.y + endStop.y) / 2 - 10 };
      
      const busPosition = getPointOnQuadraticBezier(p0, p1, p2, bus.progress);
      
      const distance = Math.sqrt(
        Math.pow(busPosition.x - userLocation.x, 2) + 
        Math.pow(busPosition.y - userLocation.y, 2)
      );
      
      return distance < 15;
    });
  };

  const nearbyBuses = getNearbyBuses();

  const handleGetDirectionsToArea = () => {
    const college = colleges.find(c => c.id === selectedCollege);
    if (!college) return;
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Create a Google Maps directions URL
          const directionsUrl = `https://www.google.com/maps/dir/${latitude},${longitude}/${encodeURIComponent(college.name + ' ' + college.city)}`;
          
          // Open in new tab
          window.open(directionsUrl, '_blank');
          
          toast({
            title: "Directions opened",
            description: `Directions to ${college.name} opened in Google Maps.`,
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          
          // Fallback: open Google Maps search
          const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(college.name + ' ' + college.city)}`;
          window.open(searchUrl, '_blank');
          
          toast({
            title: "Location access denied",
            description: "Opened area location in Google Maps.",
            variant: "destructive"
          });
        }
      );
    }
  };

  if (selectedStop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        {/* Navigation */}
        <nav className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2">
                <Bus className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-800">RouteReformers</span>
              </Link>
              <div className="hidden md:flex items-center space-x-6">
                <Link to="/planner" className="text-gray-600 hover:text-blue-600 transition-colors">Route Planner</Link>
                <Link to="/map" className="text-blue-600 font-semibold">Map View</Link>
                <Link to="/timetable" className="text-gray-600 hover:text-blue-600 transition-colors">Timetables</Link>
                <Link to="/feedback" className="text-gray-600 hover:text-blue-600 transition-colors">Feedback</Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          <Button 
            onClick={() => setSelectedStop(null)}
            variant="outline"
            className="mb-6"
          >
            ← Back to Map
          </Button>
          <LiveBusArrivals stopName={selectedStop} stopId={selectedStop} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Bus className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">RouteReformers</span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/planner" className="text-gray-600 hover:text-blue-600 transition-colors">Route Planner</Link>
              <Link to="/map" className="text-blue-600 font-semibold">Map View</Link>
              <Link to="/timetable" className="text-gray-600 hover:text-blue-600 transition-colors">Timetables</Link>
              <Link to="/feedback" className="text-gray-600 hover:text-blue-600 transition-colors">Feedback</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Live Bus Tracker</h1>
            <p className="text-lg text-gray-600">Track buses in real-time around your area</p>
            
            {/* Simulation Notice */}
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start space-x-2">
              <Info className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-amber-800 font-medium">Demo Mode: Simulated Data</p>
                <p className="text-amber-700">This tracker uses simulated bus movements for demonstration. In a real implementation, this would connect to actual GPS tracking systems.</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedCollege} onValueChange={setSelectedCollege}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hyderabad-header" disabled className="font-semibold text-blue-600">📍 Hyderabad</SelectItem>
                <SelectItem value="jntu-hyderabad">JNTU Area</SelectItem>
                <SelectItem value="cvr-college">CVR College Area</SelectItem>
                <SelectItem value="vasavi-college">Vasavi College Area</SelectItem>
                <SelectItem value="cbit">CBIT Area</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedRoute} onValueChange={setSelectedRoute}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter routes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Routes</SelectItem>
                {getCurrentRoutes().map((route) => (
                  <SelectItem key={route.id} value={route.id}>
                    {route.id} - {route.operator}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handleGetDirectionsToArea}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Navigation className="h-4 w-4" />
              <span>Directions to Area</span>
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Map and Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Live Map */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] relative overflow-hidden shadow-xl">
              <CardContent className="p-0 h-full relative">
                {/* Mock Map Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-green-100">
                  {/* Grid pattern for map feel */}
                  <div className="absolute inset-0 opacity-20">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>
                  
                  {/* Route lines */}
                  <svg className="absolute inset-0 w-full h-full">
                    {filteredRoutes.map((route, index) => {
                      const stops = getCurrentBusStops();
                      if (stops.length < 2) return null;
                      
                      const startStop = stops[0];
                      const endStop = stops[stops.length - 1];
                      
                      return (
                        <path
                          key={route.id}
                          d={`M ${startStop.x}% ${startStop.y}% Q ${(startStop.x + endStop.x) / 2}% ${(startStop.y + endStop.y) / 2 - 10}% ${endStop.x}% ${endStop.y}%`}
                          stroke={route.color === 'blue' ? '#2563eb' : route.color === 'green' ? '#16a34a' : '#7c3aed'}
                          strokeWidth="3"
                          fill="none"
                          strokeDasharray={index % 2 === 0 ? "0" : "5,5"}
                          className="drop-shadow-sm"
                        />
                      );
                    })}
                  </svg>
                  
                  {/* User Location */}
                  {userLocation && (
                    <div
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30"
                      style={{ left: `${userLocation.x}%`, top: `${userLocation.y}%` }}
                    >
                      <div className="relative">
                        <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                        <div className="absolute -inset-2 bg-blue-600/20 rounded-full animate-ping"></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Live Buses with Enhanced Visuals */}
                  {liveBuses.map(bus => {
                    const routeInfo = routeDetailsMap[bus.routeId];
                    if (!routeInfo) return null;

                    const stops = busStops[routeInfo.collegeId];
                    if (!stops || stops.length < 2) return null;

                    const startStop = stops[0];
                    const endStop = stops[stops.length - 1];

                    const p0 = { x: startStop.x, y: startStop.y };
                    const p2 = { x: endStop.x, y: endStop.y };
                    const p1 = { x: (startStop.x + endStop.x) / 2, y: (startStop.y + endStop.y) / 2 - 10 };
                    
                    const busPosition = getPointOnQuadraticBezier(p0, p1, p2, bus.progress);
                    const isNearby = nearbyBuses.some(nb => nb.id === bus.id);
                    const busIcon = getBusIcon(routeInfo, bus.id);
                    
                    return (
                      <div
                        key={bus.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-3000 ease-linear"
                        style={{ left: `${busPosition.x}%`, top: `${busPosition.y}%`, zIndex: 20 }}
                      >
                        <div className="relative group cursor-pointer">
                          {/* Enhanced Bus Visualization */}
                          <div className={`relative text-2xl ${isNearby ? 'animate-bounce' : ''} hover:scale-110 transition-transform duration-200`}>
                            <div className="relative">
                              {/* Bus emoji with shadow effect */}
                              <span 
                                className="block drop-shadow-lg"
                                style={{ 
                                  filter: `hue-rotate(${routeInfo.color === 'blue' ? '0deg' : routeInfo.color === 'green' ? '120deg' : '270deg'}) brightness(1.1)`,
                                }}
                              >
                                {busIcon}
                              </span>
                              
                              {/* Route number overlay */}
                              <div className={`absolute -bottom-1 -right-1 text-xs font-bold text-white px-1 rounded-full ${
                                routeInfo.color === 'blue' ? 'bg-blue-600' : 
                                routeInfo.color === 'green' ? 'bg-green-600' : 'bg-purple-600'
                              }`}>
                                {routeInfo.id.length > 3 ? routeInfo.id.slice(0, 3) : routeInfo.id}
                              </div>
                            </div>
                            
                            {/* Nearby indicator with enhanced effect */}
                            {isNearby && (
                              <>
                                <div className="absolute -inset-3 bg-green-500/30 rounded-full animate-ping"></div>
                                <div className="absolute -inset-2 bg-green-400/40 rounded-full animate-pulse"></div>
                              </>
                            )}
                          </div>
                          
                          {/* Enhanced tooltip */}
                          <div className="absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 bg-white px-3 py-2 rounded-lg shadow-xl text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 border border-gray-200">
                            <div className="text-center">
                              <div className="font-bold text-gray-800">{routeInfo.operator} #{routeInfo.id}</div>
                              <div className="text-gray-600 text-xs">{routeInfo.name.split(' - ')[1]}</div>
                              {isNearby && <div className="text-green-600 font-semibold">🎯 Near You!</div>}
                            </div>
                            {/* Tooltip arrow */}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Bus Stops */}
                  {getCurrentBusStops().map((stop) => (
                    <div
                      key={stop.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                      style={{ left: `${stop.x}%`, top: `${stop.y}%` }}
                      onClick={() => setSelectedStop(stop.name)}
                    >
                      <div className={`w-4 h-4 rounded-full shadow-lg transition-transform group-hover:scale-125 ${
                        stop.type === 'major' ? 'bg-red-500' :
                        stop.type === 'campus' ? 'bg-orange-500' : 'bg-gray-500'
                      }`}>
                      </div>
                      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        {stop.name}
                        <div className="text-blue-600">Click for live arrivals</div>
                      </div>
                    </div>
                  ))}
                  
                  {/* College marker */}
                  {colleges.filter(c => c.id === selectedCollege).map((college) => (
                    <div
                      key={college.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${college.x}%`, top: `${college.y}%` }}
                    >
                      <div className="w-8 h-8 bg-orange-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Current Location Button */}
                <div className="absolute bottom-4 left-4">
                  <Button 
                    onClick={findMyLocation}
                    disabled={locationLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {locationLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Locate className="h-4 w-4 mr-2" />
                    )}
                    {locationLoading ? 'Finding...' : 'My Location'}
                  </Button>
                </div>

                {/* Live Update Indicator with Simulation Notice */}
                <div className="absolute top-4 left-4 space-y-2">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>DEMO LIVE</span>
                    </div>
                  </div>
                  <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Simulated Data
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Nearby Buses */}
            {userLocation && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Bus className="h-4 w-4 mr-2 text-blue-600" />
                    Nearby Buses ({nearbyBuses.length})
                  </h3>
                  {nearbyBuses.length > 0 ? (
                    <div className="space-y-2">
                      {nearbyBuses.map(bus => {
                        const routeInfo = routeDetailsMap[bus.routeId];
                        const busIcon = getBusIcon(routeInfo, bus.id);
                        return (
                          <div key={bus.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{busIcon}</span>
                              <div>
                                <span className="font-medium">{routeInfo.operator} #{routeInfo.id}</span>
                                <div className="text-xs text-gray-600">Approaching</div>
                              </div>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${
                              routeInfo.color === 'blue' ? 'bg-blue-500' : 
                              routeInfo.color === 'green' ? 'bg-green-500' : 'bg-purple-500'
                            }`}></div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">No buses nearby</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Active Routes */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Route className="h-4 w-4 mr-2 text-blue-600" />
                  Active Routes
                </h3>
                <div className="space-y-2">
                  {filteredRoutes.map(route => (
                    <div key={route.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                      <div className={`w-3 h-3 rounded-full ${
                        route.color === 'blue' ? 'bg-blue-500' : 
                        route.color === 'green' ? 'bg-green-500' : 'bg-purple-500'
                      }`}></div>
                      <div>
                        <div className="font-medium text-sm">{route.id}</div>
                        <div className="text-xs text-gray-600">{route.operator}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Live Update Stats */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-blue-600" />
                  Simulation Stats
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Buses tracked:</span>
                    <span className="font-medium">{liveBuses.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last update:</span>
                    <span className="font-medium">Just now</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Update frequency:</span>
                    <span className="font-medium">3 seconds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data type:</span>
                    <span className="font-medium text-amber-600">Simulated</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
