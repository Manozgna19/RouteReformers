
import React from 'react';
import { Bus, MapPin, Clock, Navigation } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const QuickActions: React.FC = () => {
  const actions = [
    {
      icon: Bus,
      title: 'Live Buses',
      description: 'Track buses in real-time',
      color: 'bg-blue-500 hover:bg-blue-600',
      link: '/map'
    },
    {
      icon: Navigation,
      title: 'Find College',
      description: 'Get directions to colleges',
      color: 'bg-green-500 hover:bg-green-600',
      link: '/planner'
    },
    {
      icon: MapPin,
      title: 'Nearby Stops',
      description: 'Find stops near you',
      color: 'bg-purple-500 hover:bg-purple-600',
      link: '/map'
    },
    {
      icon: Clock,
      title: 'Timetables',
      description: 'Bus schedules',
      color: 'bg-orange-500 hover:bg-orange-600',
      link: '/timetable'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action, index) => (
        <Link key={index} to={action.link}>
          <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mx-auto mb-3 transition-colors`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default QuickActions;
