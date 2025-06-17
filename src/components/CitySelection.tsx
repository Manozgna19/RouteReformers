
import React from 'react';
import { Button } from '@/components/ui/button';
import CitySelector from '@/components/CitySelector';

interface City {
  id: string;
  name: string;
  state: string;
  country: string;
}

interface CitySelectionProps {
  onCitySelected: (city: City) => void;
}

const CitySelection: React.FC<CitySelectionProps> = ({ onCitySelected }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Your City</h2>
      <CitySelector onCitySelected={onCitySelected} />
    </div>
  );
};

export default CitySelection;
