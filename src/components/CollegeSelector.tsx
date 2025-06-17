
import React, { useState, useEffect } from 'react';
import { GraduationCap, MapPin, Phone, Globe, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import CollegeCard from '@/components/CollegeCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

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

interface CollegeSelectorProps {
  cityId: string;
  onCollegeSelected: (college: College) => void;
}

const CollegeSelector: React.FC<CollegeSelectorProps> = ({ cityId, onCollegeSelected }) => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const { data, error } = await supabase
          .from('colleges')
          .select('*')
          .eq('city_id', cityId)
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
          setFilteredColleges(data || []);
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
  }, [cityId, toast]);

  useEffect(() => {
    const filtered = colleges.filter(college =>
      college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.college_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredColleges(filtered);
  }, [searchTerm, colleges]);

  const handleCollegeClick = (college: College) => {
    onCollegeSelected(college);
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
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
          <span>Select Your College</span>
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
        {filteredColleges.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredColleges.map((college) => (
              <div
                key={college.id}
                className="cursor-pointer transform hover:scale-105 transition-transform"
                onClick={() => handleCollegeClick(college)}
              >
                <CollegeCard 
                  college={college} 
                  showActions={false}
                />
              </div>
            ))}
          </div>
        ) : searchTerm ? (
          <div className="text-center py-8">
            <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No colleges found matching "{searchTerm}"</p>
            <p className="text-sm text-gray-500">Try adjusting your search terms</p>
          </div>
        ) : (
          <div className="text-center py-8">
            <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No colleges available in this city</p>
            <p className="text-sm text-gray-500">College data will be added soon</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CollegeSelector;
