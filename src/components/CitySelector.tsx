
import React, { useState, useEffect } from 'react';
import { MapPin, Check, GraduationCap, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface College {
  id: string;
  name: string;
  college_type: string;
  address: string;
}

interface City {
  id: string;
  name: string;
  state: string;
  country: string;
  colleges?: College[];
  college_count?: number;
}

interface CitySelectorProps {
  onCitySelected: (city: City) => void;
  selectedCityId?: string;
}

const CitySelector: React.FC<CitySelectorProps> = ({ onCitySelected, selectedCityId }) => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCitiesWithColleges = async () => {
      try {
        // Fetch cities with college counts
        const { data: citiesData, error: citiesError } = await supabase
          .from('cities')
          .select(`
            *,
            colleges (
              id,
              name,
              college_type,
              address
            )
          `)
          .eq('is_active', true)
          .order('name');

        if (citiesError) {
          toast({
            title: "Error",
            description: "Failed to load cities and colleges",
            variant: "destructive"
          });
        } else {
          // Process the data to include college counts
          const processedCities = citiesData?.map(city => ({
            ...city,
            college_count: city.colleges?.length || 0,
            colleges: city.colleges?.slice(0, 3) // Show only first 3 colleges for preview
          })) || [];

          // Sort by college count (descending) then by name
          processedCities.sort((a, b) => {
            if (b.college_count !== a.college_count) {
              return b.college_count - a.college_count;
            }
            return a.name.localeCompare(b.name);
          });

          setCities(processedCities);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCitiesWithColleges();
  }, [toast]);

  const getCollegeTypeColor = (type: string) => {
    const colors = {
      'engineering': 'bg-blue-100 text-blue-800',
      'medical': 'bg-red-100 text-red-800',
      'university': 'bg-purple-100 text-purple-800',
      'arts': 'bg-green-100 text-green-800',
      'commerce': 'bg-orange-100 text-orange-800',
      'polytechnic': 'bg-cyan-100 text-cyan-800',
      'other': 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <GraduationCap className="h-6 w-6 text-blue-600" />
          <span>Select Your City</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Choose a city to find bus routes to colleges and educational institutions
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {cities.map((city) => (
          <div
            key={city.id}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
              selectedCityId === city.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 hover:shadow-sm'
            }`}
            onClick={() => onCitySelected(city)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
                      <span>{city.name}</span>
                      {city.college_count > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {city.college_count} {city.college_count === 1 ? 'College' : 'Colleges'}
                        </Badge>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600">{city.state}, {city.country}</p>
                  </div>
                </div>
                
                {city.colleges && city.colleges.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-medium text-gray-700 flex items-center space-x-1">
                      <Building2 className="h-3 w-3" />
                      <span>Featured Colleges:</span>
                    </p>
                    <div className="space-y-1">
                      {city.colleges.map((college) => (
                        <div key={college.id} className="flex items-center justify-between">
                          <span className="text-xs text-gray-600 truncate max-w-[200px]">
                            {college.name}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs px-2 py-0 ${getCollegeTypeColor(college.college_type)}`}
                          >
                            {college.college_type}
                          </Badge>
                        </div>
                      ))}
                      {city.college_count > 3 && (
                        <p className="text-xs text-blue-600 font-medium">
                          +{city.college_count - 3} more colleges
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {city.college_count === 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    Transit routes available - college data coming soon
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {selectedCityId === city.id && (
                  <Check className="h-5 w-5 text-blue-600" />
                )}
                <MapPin className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        ))}
        
        {cities.length === 0 && (
          <div className="text-center py-8">
            <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No cities available at the moment</p>
            <p className="text-sm text-gray-500">Please check back later</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CitySelector;
