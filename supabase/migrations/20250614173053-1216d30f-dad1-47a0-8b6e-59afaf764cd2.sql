
-- Create colleges table to store educational institutions
CREATE TABLE public.colleges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  city_id UUID REFERENCES public.cities(id) NOT NULL,
  college_type TEXT DEFAULT 'university' CHECK (college_type IN ('university', 'engineering', 'medical', 'arts', 'commerce', 'polytechnic', 'other')),
  website TEXT,
  contact_phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update bus_stops table to add college reference
ALTER TABLE public.bus_stops 
ADD COLUMN college_id UUID REFERENCES public.colleges(id),
ADD COLUMN distance_to_college_meters INTEGER DEFAULT 0;

-- Enable Row Level Security for colleges (public read)
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;

-- Create policy for colleges (public read access)
CREATE POLICY "Colleges are viewable by everyone" ON public.colleges
  FOR SELECT USING (true);

-- Insert sample colleges for different cities
INSERT INTO public.colleges (name, address, city_id, college_type, latitude, longitude) 
SELECT 
  college_data.name,
  college_data.address,
  c.id,
  college_data.college_type,
  college_data.latitude,
  college_data.longitude
FROM (
  VALUES 
    ('Indian Institute of Technology Hyderabad', 'Kandi, Sangareddy, Telangana 502285', 'engineering', 17.5937, 78.1250),
    ('University of Hyderabad', 'Prof. C.R. Rao Rd, University of Hyderabad Campus, Hyderabad, Telangana 500046', 'university', 17.4569, 78.3306),
    ('IIIT Hyderabad', 'Raj Bhavan Road, Gachibowli, Hyderabad, Telangana 500032', 'engineering', 17.4453, 78.3499),
    ('Osmania University', 'University Rd, Hyderabad, Telangana 500007', 'university', 17.4126, 78.4071),
    ('JNTU Hyderabad', 'Kukatpally, Hyderabad, Telangana 500085', 'engineering', 17.4924, 78.3918),
    ('ISB Hyderabad', 'Gachibowli, Hyderabad, Telangana 500111', 'commerce', 17.4239, 78.3733),
    ('IIT Bombay', 'Powai, Mumbai, Maharashtra 400076', 'engineering', 19.1334, 72.9133),
    ('Mumbai University', 'Kalina, Santacruz East, Mumbai, Maharashtra 400098', 'university', 19.0728, 72.8826),
    ('IIT Delhi', 'Hauz Khas, New Delhi, Delhi 110016', 'engineering', 28.5450, 77.1923),
    ('Delhi University', 'University Enclave, Delhi 110007', 'university', 28.6906, 77.2072)
) AS college_data(name, address, college_type, latitude, longitude)
CROSS JOIN public.cities c
WHERE 
  (college_data.name LIKE '%Hyderabad%' OR college_data.name LIKE '%JNTU%' OR college_data.name LIKE '%IIIT%' OR college_data.name LIKE '%Osmania%' OR college_data.name LIKE '%ISB%') AND c.name = 'Hyderabad'
  OR (college_data.name LIKE '%Bombay%' OR college_data.name LIKE '%Mumbai%') AND c.name = 'Mumbai'
  OR (college_data.name LIKE '%Delhi%') AND c.name = 'Delhi';

-- Update existing bus stops to link them to nearby colleges
-- This is a simplified approach - in a real app you'd calculate actual distances
UPDATE public.bus_stops 
SET college_id = (
  SELECT c.id 
  FROM public.colleges c 
  WHERE c.city_id = bus_stops.city_id 
  ORDER BY RANDOM() 
  LIMIT 1
),
distance_to_college_meters = FLOOR(RANDOM() * 1000) + 100
WHERE city_id IS NOT NULL;

-- Insert sample bus stops near colleges for Hyderabad
INSERT INTO public.bus_stops (name, latitude, longitude, city_id, college_id, distance_to_college_meters, stop_type) 
SELECT 
  stop_data.name,
  stop_data.latitude,
  stop_data.longitude,
  c.id as city_id,
  col.id as college_id,
  stop_data.distance,
  'campus'
FROM (
  VALUES 
    ('IIT Hyderabad Main Gate', 17.5942, 78.1245, 'Indian Institute of Technology Hyderabad', 50),
    ('IIT Hyderabad Academic Block', 17.5935, 78.1255, 'Indian Institute of Technology Hyderabad', 200),
    ('University of Hyderabad Entrance', 17.4575, 78.3310, 'University of Hyderabad', 100),
    ('IIIT Hyderabad Gate', 17.4458, 78.3495, 'IIIT Hyderabad', 80),
    ('Osmania University Arts College', 17.4130, 78.4075, 'Osmania University', 150),
    ('JNTU Kukatpally Campus', 17.4920, 78.3915, 'JNTU Hyderabad', 120),
    ('ISB Main Campus', 17.4242, 78.3730, 'ISB Hyderabad', 90)
) AS stop_data(name, latitude, longitude, college_name, distance)
CROSS JOIN public.cities c
CROSS JOIN public.colleges col
WHERE c.name = 'Hyderabad' 
AND col.name = stop_data.college_name;
