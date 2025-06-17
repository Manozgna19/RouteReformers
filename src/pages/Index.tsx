import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bus, MapPin, GraduationCap, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CitySelector from '@/components/CitySelector';
import CollegeSelector from '@/components/CollegeSelector';
import BusRoutes from '@/components/BusRoutes';
import { useAuth } from '@/hooks/useAuth';
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

const Index = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'city' | 'college' | 'routes'>('city');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);

  // Load user's saved city preference
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
          setCurrentStep('college');
        }
      } catch (error) {
        console.log('No saved city preference found');
      }
    };

    loadUserPreferences();
  }, [user]);

  const handleCitySelected = async (city: City) => {
    setSelectedCity(city);
    
    // Save city preference to user profile
    if (user) {
      try {
        await supabase
          .from('profiles')
          .update({ selected_city_id: city.id })
          .eq('id', user.id);
        
        toast({
          title: "City Selected",
          description: `${city.name} has been set as your preferred city.`,
        });
      } catch (error) {
        console.error('Error saving city preference:', error);
      }
    }
    
    setCurrentStep('college');
  };

  const handleCollegeSelected = (college: College) => {
    setSelectedCollege(college);
    setCurrentStep('routes');
  };

  const handleBackToCity = () => {
    setSelectedCity(null);
    setSelectedCollege(null);
    setCurrentStep('city');
  };

  const handleBackToCollege = () => {
    setSelectedCollege(null);
    setCurrentStep('college');
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bus className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">RouteReformers</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6">
                <Link to="/planner" className="text-gray-600 hover:text-blue-600 transition-colors">Route Planner</Link>
                <Link to="/feedback" className="text-gray-600 hover:text-blue-600 transition-colors">Feedback</Link>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user?.email}</span>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              currentStep === 'city' ? 'bg-blue-100 text-blue-800' : 
              selectedCity ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              <MapPin className="h-4 w-4" />
              <span className="font-medium">1. Select City</span>
            </div>
            <div className={`w-8 h-0.5 ${selectedCity ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              currentStep === 'college' ? 'bg-blue-100 text-blue-800' : 
              selectedCollege ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              <GraduationCap className="h-4 w-4" />
              <span className="font-medium">2. Choose College</span>
            </div>
            <div className={`w-8 h-0.5 ${selectedCollege ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              currentStep === 'routes' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
            }`}>
              <Bus className="h-4 w-4" />
              <span className="font-medium">3. Find Routes</span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 'city' && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to RouteReformers</h1>
              <p className="text-xl text-gray-600">Find the best bus routes to your college</p>
            </div>
            <CitySelector onCitySelected={handleCitySelected} />
          </div>
        )}

        {currentStep === 'college' && selectedCity && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Choose Your College</h1>
              <p className="text-lg text-gray-600">
                Select your destination in {selectedCity.name}, {selectedCity.state}
              </p>
              <Button variant="outline" onClick={handleBackToCity} className="mt-4">
                Change City
              </Button>
            </div>
            <CollegeSelector 
              cityId={selectedCity.id} 
              onCollegeSelected={handleCollegeSelected}
            />
          </div>
        )}

        {currentStep === 'routes' && selectedCity && selectedCollege && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Bus Routes</h1>
              <p className="text-lg text-gray-600">
                Routes to {selectedCollege.name}
              </p>
              <div className="flex justify-center space-x-4 mt-4">
                <Button variant="outline" onClick={handleBackToCollege}>
                  Change College
                </Button>
                <Button variant="outline" onClick={handleBackToCity}>
                  Change City
                </Button>
              </div>
            </div>
            <BusRoutes 
              college={selectedCollege}
              cityId={selectedCity.id}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
