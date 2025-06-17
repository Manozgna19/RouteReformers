
import React from 'react';
import { GraduationCap, MapPin, Phone, Globe, Building2, Navigation, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface College {
  id: string;
  name: string;
  address: string;
  college_type: string;
  website?: string;
  contact_phone?: string;
  latitude?: number;
  longitude?: number;
}

interface CollegeCardProps {
  college: College;
  onFindRoute?: (college: College) => void;
  onGetDirections?: (college: College) => void;
  showActions?: boolean;
  isGettingDirections?: boolean;
}

const CollegeCard: React.FC<CollegeCardProps> = ({ 
  college, 
  onFindRoute, 
  onGetDirections,
  showActions = true,
  isGettingDirections = false
}) => {
  const getCollegeTypeColor = (type: string) => {
    const colors = {
      'engineering': 'bg-blue-100 text-blue-800 border-blue-200',
      'medical': 'bg-red-100 text-red-800 border-red-200',
      'university': 'bg-purple-100 text-purple-800 border-purple-200',
      'arts': 'bg-green-100 text-green-800 border-green-200',
      'commerce': 'bg-orange-100 text-orange-800 border-orange-200',
      'polytechnic': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'other': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  const getCollegeIcon = (type: string) => {
    switch (type) {
      case 'engineering':
      case 'polytechnic':
        return <Building2 className="h-4 w-4" />;
      case 'medical':
        return <GraduationCap className="h-4 w-4" />;
      default:
        return <GraduationCap className="h-4 w-4" />;
    }
  };

  // If this is for the detailed college list view
  if (onGetDirections) {
    return (
      <div className="p-6 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-gray-50 transition-all duration-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{college.name}</h3>
                <Badge 
                  variant="outline" 
                  className={`mt-1 ${getCollegeTypeColor(college.college_type)}`}
                >
                  {college.college_type.charAt(0).toUpperCase() + college.college_type.slice(1)}
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 mb-2">
              <MapPin className="h-4 w-4" />
              <p className="text-sm">{college.address}</p>
            </div>
            {college.contact_phone && (
              <div className="text-sm text-gray-600">
                <strong>Phone:</strong> {college.contact_phone}
              </div>
            )}
            {college.website && (
              <div className="text-sm text-blue-600 hover:text-blue-800">
                <a href={college.website} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1">
                  <span>Visit Website</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
          
          <div className="flex flex-col space-y-2 lg:ml-6">
            <Button 
              onClick={() => onGetDirections(college)}
              disabled={isGettingDirections}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isGettingDirections ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Getting Directions...
                </>
              ) : (
                <>
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                  <ExternalLink className="h-3 w-3 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Original compact card view
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                {getCollegeIcon(college.college_type)}
                <h3 className="font-semibold text-gray-800 text-sm">
                  {college.name}
                </h3>
              </div>
              
              <Badge 
                variant="outline" 
                className={`text-xs mb-2 ${getCollegeTypeColor(college.college_type)}`}
              >
                {college.college_type.charAt(0).toUpperCase() + college.college_type.slice(1)}
              </Badge>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600 text-xs leading-relaxed">
                {college.address}
              </span>
            </div>

            {college.contact_phone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 text-xs">
                  {college.contact_phone}
                </span>
              </div>
            )}

            {college.website && (
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-gray-400" />
                <a 
                  href={college.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-xs hover:underline"
                >
                  Visit Website
                </a>
              </div>
            )}
          </div>

          {showActions && onFindRoute && (
            <div className="pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onFindRoute(college)}
                className="w-full text-xs"
              >
                Find Bus Route
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CollegeCard;
