
import React, { useState, useEffect } from 'react';
import { GraduationCap, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CollegeCard from '@/components/CollegeCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface City {
  id: string;
  name: string;
  state: string;
  country: string;
}

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

interface CollegeListProps {
  selectedCity: City;
  onBackToCity: () => void;
}

const CollegeList: React.FC<CollegeListProps> = ({ selectedCity, onBackToCity }) => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [isGettingDirections, setIsGettingDirections] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('colleges')
          .select('*')
          .eq('city_id', selectedCity.id)
          .eq('is_active', true)
          .order('name');

        if (error) {
          toast({
            title: "Error",
            description: "Failed to load colleges",
            variant: "destructive"
          });
        } else {
          setColleges(data || []);
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

    fetchColleges();
  }, [selectedCity.id, toast]);

  const handleGetDirections = (college: College) => {
    setIsGettingDirections(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Create a Google Maps directions URL
          const destination = college.latitude && college.longitude 
            ? `${college.latitude},${college.longitude}`
            : encodeURIComponent(college.name + ', ' + college.address);
            
          const directionsUrl = `https://www.google.com/maps/dir/${latitude},${longitude}/${destination}`;
          
          // Open in new tab
          window.open(directionsUrl, '_blank');
          
          toast({
            title: "Directions opened",
            description: `Google Maps directions to ${college.name} opened in a new tab.`,
          });
          
          setIsGettingDirections(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          
          // Fallback: open Google Maps search for the college
          const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(college.name + ', ' + college.address)}`;
          window.open(searchUrl, '_blank');
          
          toast({
            title: "Location access denied",
            description: "Opened college location in Google Maps. You can get directions from there.",
            variant: "destructive"
          });
          
          setIsGettingDirections(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      // Geolocation not supported - fallback to Google Maps search
      const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(college.name + ', ' + college.address)}`;
      window.open(searchUrl, '_blank');
      
      toast({
        title: "Geolocation not supported",
        description: "Opened college location in Google Maps.",
      });
      
      setIsGettingDirections(false);
    }
  };

  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.college_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Choose Your College</h2>
          <p className="text-gray-600">Select a college in {selectedCity.name} to get directions</p>
        </div>
        <Button variant="outline" onClick={onBackToCity}>
          Change City
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            <span>Colleges in {selectedCity.name}</span>
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search colleges by name, type, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          ) : filteredColleges.length > 0 ? (
            <div className="space-y-4">
              {filteredColleges.map((college) => (
                <CollegeCard
                  key={college.id}
                  college={college}
                  onGetDirections={handleGetDirections}
                  isGettingDirections={isGettingDirections}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No colleges found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CollegeList;
