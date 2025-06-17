
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bus, User } from 'lucide-react';
import CitySelection from '@/components/CitySelection';
import CollegeList from '@/components/CollegeList';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface City {
  id: string;
  name: string;
  state: string;
  country: string;
}

const RoutePlanner = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [showCitySelector, setShowCitySelector] = useState(true);
  const [showColleges, setShowColleges] = useState(false);

  useEffect(() => {
    const loadUserPreferences = async () => {
      if (!user) return;

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select(`
            selected_city_id,
            cities (
              id,
              name,
              state,
              country
            )
          `)
          .eq('id', user.id)
          .single();

        if (profile?.cities) {
          setSelectedCity(profile.cities as City);
          setShowCitySelector(false);
          setShowColleges(true);
        }
      } catch (error) {
        console.log('No saved city preference found');
      }
    };

    loadUserPreferences();
  }, [user]);

  const handleCitySelected = async (city: City) => {
    setSelectedCity(city);
    setShowCitySelector(false);
    setShowColleges(true);
    
    // Save city preference to user profile
    if (user) {
      try {
        await supabase
          .from('profiles')
          .update({ selected_city_id: city.id })
          .eq('id', user.id);
      } catch (error) {
        console.error('Error saving city preference:', error);
      }
    }
  };

  const handleBackToCity = () => {
    setSelectedCity(null);
    setShowCitySelector(true);
    setShowColleges(false);
  };

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
              <Link to="/planner" className="text-blue-600 font-semibold">Route Planner</Link>
              <Link to="/feedback" className="text-gray-600 hover:text-blue-600 transition-colors">Feedback</Link>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user?.email}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Find Your College</h1>
          <p className="text-xl text-gray-600">Get direct directions to colleges in your city</p>
        </div>

        {/* Step 1: City Selection */}
        {showCitySelector && (
          <CitySelection onCitySelected={handleCitySelected} />
        )}

        {/* Step 2: College Selection with Direct Directions */}
        {showColleges && selectedCity && (
          <CollegeList 
            selectedCity={selectedCity}
            onBackToCity={handleBackToCity}
          />
        )}
      </div>
    </div>
  );
};

export default RoutePlanner;
