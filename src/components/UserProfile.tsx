
import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, Settings, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import CitySelector from './CitySelector';

interface Profile {
  id: string;
  full_name: string;
  phone: string;
  selected_city_id: string | null;
  notification_preferences: any;
}

interface City {
  id: string;
  name: string;
  state: string;
  country: string;
}

const UserProfile: React.FC = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showCitySelector, setShowCitySelector] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            *,
            cities (
              id, name, state, country
            )
          `)
          .eq('id', user.id)
          .single();

        if (error) {
          toast({
            title: "Error",
            description: "Failed to load profile",
            variant: "destructive"
          });
        } else {
          setProfile(data);
          if (data.cities) {
            setSelectedCity(data.cities);
          }
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

    fetchProfile();
  }, [user, toast]);

  const handleCitySelected = async (city: City) => {
    if (!user || !profile) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ selected_city_id: city.id })
        .eq('id', user.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update city selection",
          variant: "destructive"
        });
      } else {
        setSelectedCity(city);
        setProfile({ ...profile, selected_city_id: city.id });
        setShowCitySelector(false);
        toast({
          title: "Success",
          description: `City updated to ${city.name}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showCitySelector) {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          onClick={() => setShowCitySelector(false)}
          className="mb-4"
        >
          ← Back to Profile
        </Button>
        <CitySelector 
          onCitySelected={handleCitySelected}
          selectedCityId={selectedCity?.id}
        />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5 text-blue-600" />
          <span>Profile</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <Input
              value={profile?.full_name || ''}
              readOnly
              className="bg-gray-50"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <Input
              value={user?.email || ''}
              readOnly
              className="bg-gray-50"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700">Phone</label>
            <Input
              value={profile?.phone || ''}
              readOnly
              className="bg-gray-50"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700">Selected City</label>
            <div className="flex items-center space-x-2">
              <Input
                value={selectedCity ? `${selectedCity.name}, ${selectedCity.state}` : 'No city selected'}
                readOnly
                className="bg-gray-50"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCitySelector(true)}
                disabled={updating}
              >
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex space-x-2 pt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setShowCitySelector(true)}
            disabled={updating}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
