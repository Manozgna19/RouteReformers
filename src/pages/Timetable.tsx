import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bus, Clock, MapPin, Filter, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSimulatedBusTracker } from '@/hooks/useSimulatedBusTracker';

const Timetable = () => {
  const [selectedRoute, setSelectedRoute] = useState('all');
  const [selectedCollege, setSelectedCollege] = useState('all');
  const liveBuses = useSimulatedBusTracker(selectedRoute);

  const colleges = [
    'JNTU Hyderabad',
    'MIT World Peace University',
    'RV College of Engineering',
    'VJTI Mumbai',
    'College of Engineering Pune'
  ];

  const routes = [
    {
      id: '219',
      name: 'JNTU to Secunderabad',
      color: 'blue',
      colleges: ['JNTU Hyderabad'],
      operator: 'TSRTC',
      frequency: '8 mins',
      operatingHours: '5:30 AM - 11:30 PM',
      fare: '₹15-25',
      weekdayTimes: ['5:30', '5:38', '5:46', '5:54', '6:02', '6:10', '6:18', '6:26', '6:34', '6:42', '6:50', '6:58'],
      weekendTimes: ['6:00', '6:10', '6:20', '6:30', '6:40', '6:50', '7:00', '7:10', '7:20', '7:30', '7:40', '7:50']
    },
    {
      id: '288K',
      name: 'JNTU to Koti',
      color: 'green',
      colleges: ['JNTU Hyderabad'],
      operator: 'TSRTC',
      frequency: '12 mins',
      operatingHours: '6:00 AM - 10:00 PM',
      fare: '₹12-20',
      weekdayTimes: ['6:00', '6:12', '6:24', '6:36', '6:48', '7:00', '7:12', '7:24', '7:36', '7:48', '8:00', '8:12'],
      weekendTimes: ['6:30', '6:45', '7:00', '7:15', '7:30', '7:45', '8:00', '8:15', '8:30', '8:45', '9:00', '9:15']
    },
    {
      id: '347',
      name: 'MIT to Pune Station',
      color: 'blue',
      colleges: ['MIT World Peace University'],
      operator: 'PMPML',
      frequency: '10 mins',
      operatingHours: '5:45 AM - 11:00 PM',
      fare: '₹8-15',
      weekdayTimes: ['5:45', '5:55', '6:05', '6:15', '6:25', '6:35', '6:45', '6:55', '7:05', '7:15', '7:25', '7:35'],
      weekendTimes: ['6:15', '6:30', '6:45', '7:00', '7:15', '7:30', '7:45', '8:00', '8:15', '8:30', '8:45', '9:00']
    },
    {
      id: '152',
      name: 'MIT to Hadapsar',
      color: 'green',
      colleges: ['MIT World Peace University'],
      operator: 'PMPML',
      frequency: '15 mins',
      operatingHours: '6:00 AM - 10:30 PM',
      fare: '₹5-12',
      weekdayTimes: ['6:00', '6:15', '6:30', '6:45', '7:00', '7:15', '7:30', '7:45', '8:00', '8:15', '8:30', '8:45'],
      weekendTimes: ['6:30', '6:50', '7:10', '7:30', '7:50', '8:10', '8:30', '8:50', '9:10', '9:30', '9:50', '10:10']
    },
    {
      id: '201E',
      name: 'RV College to Majestic',
      color: 'blue',
      colleges: ['RV College of Engineering'],
      operator: 'BMTC',
      frequency: '6 mins',
      operatingHours: '5:30 AM - 11:45 PM',
      fare: '₹10-18',
      weekdayTimes: ['5:30', '5:36', '5:42', '5:48', '5:54', '6:00', '6:06', '6:12', '6:18', '6:24', '6:30', '6:36'],
      weekendTimes: ['6:00', '6:08', '6:16', '6:24', '6:32', '6:40', '6:48', '6:56', '7:04', '7:12', '7:20', '7:28']
    },
    {
      id: 'G4',
      name: 'RV College to Banashankari',
      color: 'purple',
      colleges: ['RV College of Engineering'],
      operator: 'BMTC',
      frequency: '10 mins',
      operatingHours: '6:00 AM - 10:00 PM',
      fare: '₹8-15',
      weekdayTimes: ['6:00', '6:10', '6:20', '6:30', '6:40', '6:50', '7:00', '7:10', '7:20', '7:30', '7:40', '7:50'],
      weekendTimes: ['6:30', '6:45', '7:00', '7:15', '7:30', '7:45', '8:00', '8:15', '8:30', '8:45', '9:00', '9:15']
    },
    {
      id: '44',
      name: 'VJTI to CST',
      color: 'blue',
      colleges: ['VJTI Mumbai'],
      operator: 'BEST',
      frequency: '5 mins',
      operatingHours: '5:00 AM - 12:00 AM',
      fare: '₹5-15',
      weekdayTimes: ['5:00', '5:05', '5:10', '5:15', '5:20', '5:25', '5:30', '5:35', '5:40', '5:45', '5:50', '5:55'],
      weekendTimes: ['5:30', '5:40', '5:50', '6:00', '6:10', '6:20', '6:30', '6:40', '6:50', '7:00', '7:10', '7:20']
    },
    {
      id: '85',
      name: 'VJTI to Bandra',
      color: 'green',
      colleges: ['VJTI Mumbai'],
      operator: 'BEST',
      frequency: '8 mins',
      operatingHours: '5:30 AM - 11:30 PM',
      fare: '₹8-20',
      weekdayTimes: ['5:30', '5:38', '5:46', '5:54', '6:02', '6:10', '6:18', '6:26', '6:34', '6:42', '6:50', '6:58'],
      weekendTimes: ['6:00', '6:12', '6:24', '6:36', '6:48', '7:00', '7:12', '7:24', '7:36', '7:48', '8:00', '8:12']
    }
  ];

  const filteredRoutes = routes.filter(route => {
    const matchesRoute = selectedRoute === 'all' || route.id === selectedRoute;
    const matchesCollege = selectedCollege === 'all' || route.colleges.includes(selectedCollege);
    return matchesRoute && matchesCollege;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Bus className="h-8 w-8 text-orange-600" />
              <span className="text-xl font-bold text-gray-800">RouteReformers</span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/planner" className="text-gray-600 hover:text-orange-600 transition-colors">Route Planner</Link>
              <Link to="/map" className="text-gray-600 hover:text-orange-600 transition-colors">Map View</Link>
              <Link to="/timetable" className="text-orange-600 font-semibold">Timetables</Link>
              <Link to="/feedback" className="text-gray-600 hover:text-orange-600 transition-colors">Feedback</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Live Tracking Advice Banner */}
        <div className="mb-6">
          <div className="flex items-center gap-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg shadow-sm">
            <Navigation className="text-blue-600 w-7 h-7" />
            <div>
              <div className="font-semibold text-blue-800">
                Live Bus Tracking is <span className="underline underline-offset-2 decoration-blue-600">not available</span> in this timetable.
              </div>
              <div className="text-sm text-blue-700 mt-1">
                For real-time GPS bus positions and estimated arrivals, use your local operator's official app or website:
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>
                    <a href="https://pass.tsrtclive.com/" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">
                      TSRTC Live Tracking
                    </a>
                  </li>
                  <li>
                    <a href="https://www.pmpml.org/avl/" target="_blank" rel="noopener noreferrer" className="text-green-700 underline">
                      PMPML AVL
                    </a>
                  </li>
                  <li>
                    <a href="https://www.mybmtc.com/live-tracking" target="_blank" rel="noopener noreferrer" className="text-purple-700 underline">
                      BMTC Live Tracking
                    </a>
                  </li>
                  <li>
                    <a href="https://bestundertaking.com/LMS" target="_blank" rel="noopener noreferrer" className="text-orange-700 underline">
                      BEST Live Bus Map
                    </a>
                  </li>
                </ul>
                Check the bus ID or route in those apps for live arrival times, as shown in real-time tracking maps.
              </div>
            </div>
          </div>
        </div>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Indian Bus Timetables</h1>
          <p className="text-xl text-gray-600">Check schedules for TSRTC, PMPML, BMTC, and BEST buses</p>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-6 w-6 text-orange-600" />
              <span>Filter Timetables</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Route</label>
                <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select route" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Routes</SelectItem>
                    {routes.map((route) => (
                      <SelectItem key={route.id} value={route.id}>
                        {route.operator} #{route.id} - {route.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">College</label>
                <Select value={selectedCollege} onValueChange={setSelectedCollege}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select college" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Colleges</SelectItem>
                    {colleges.map((college) => (
                      <SelectItem key={college} value={college}>
                        {college}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timetables */}
        <div className="space-y-6">
          {filteredRoutes.map((route) => (
            <Card key={route.id} className="shadow-lg border-l-4 border-orange-400">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      route.color === 'blue' ? 'bg-blue-100' :
                      route.color === 'green' ? 'bg-green-100' : 'bg-purple-100'
                    }`}>
                      <Bus className={`h-6 w-6 ${
                        route.color === 'blue' ? 'text-blue-600' :
                        route.color === 'green' ? 'text-green-600' : 'text-purple-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{route.operator} #{route.id}</h3>
                      <p className="text-gray-600">{route.name}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                      <Clock className="h-4 w-4" />
                      <span>Every {route.frequency}</span>
                    </div>
                    <p className="text-sm text-gray-600">{route.operatingHours}</p>
                    <p className="text-sm font-semibold text-orange-600">{route.fare}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {route.colleges.map((college) => (
                    <span key={college} className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                      <MapPin className="h-3 w-3 inline mr-1" />
                      {college}
                    </span>
                  ))}
                </div>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="weekday" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="weekday">Weekdays</TabsTrigger>
                    <TabsTrigger value="weekend">Weekends</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="weekday" className="mt-6">
                    <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-2">
                      {route.weekdayTimes.map((time, index) => (
                        <div key={index} className="text-center p-2 bg-orange-50 rounded text-sm font-medium text-gray-800 border border-orange-200">
                          {time}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-4">
                      Peak hours (7-9 AM, 5-7 PM): More frequent service with {route.operator} buses
                    </p>
                  </TabsContent>
                  
                  <TabsContent value="weekend" className="mt-6">
                    <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-2">
                      {route.weekendTimes.map((time, index) => (
                        <div key={index} className="text-center p-2 bg-orange-50 rounded text-sm font-medium text-gray-800 border border-orange-200">
                          {time}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-4">
                      Weekend service with reduced frequency - Plan accordingly
                    </p>
                  </TabsContent>
                </Tabs>
                
                {liveBuses.length > 0 && selectedRoute === route.id && (
                  <div className="mt-6 pt-4 border-t border-orange-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2.5 animate-pulse"></div>
                      Live Bus Status
                    </h4>
                    <div className="space-y-2 p-4 bg-orange-50 rounded-lg border border-orange-100">
                      <p className="text-sm text-gray-700">
                        Currently tracking <span className="font-bold text-gray-900">{liveBuses.length}</span> active buses for route <span className="font-bold text-gray-900">#{route.id}</span>.
                      </p>
                      <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700 pl-2">
                        {liveBuses.map(bus => (
                          <li key={bus.id}>
                            Bus <span className="font-semibold">{bus.id.split('-').pop()}</span> is at <span className="font-bold text-gray-900">{Math.round(bus.progress * 100)}%</span> of its journey.
                          </li>
                        ))}
                      </ul>
                      <div className="pt-2">
                        <Link to="/map">
                          <Button variant="outline" size="sm" className="border-green-400 hover:bg-green-50 text-green-700 shadow-sm">
                            <Navigation className="h-4 w-4 mr-2" />
                            View on Live Map
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 flex flex-wrap gap-2">
                  <Link to="/planner">
                    <Button variant="outline" size="sm" className="border-orange-300 hover:bg-orange-50">
                      Plan Route with {route.operator} #{route.id}
                    </Button>
                  </Link>
                  <Link to="/map">
                    <Button variant="outline" size="sm" className="border-orange-300 hover:bg-orange-50">
                      View on Map
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRoutes.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Bus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No routes found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters to see available Indian bus routes.</p>
              <Button onClick={() => {
                setSelectedRoute('all');
                setSelectedCollege('all');
              }} className="bg-orange-600 hover:bg-orange-700">
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Timetable;
