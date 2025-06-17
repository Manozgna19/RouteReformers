
-- Create cities table for supported cities
CREATE TABLE public.cities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT,
  country TEXT DEFAULT 'India',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  phone TEXT,
  full_name TEXT,
  selected_city_id UUID REFERENCES public.cities(id),
  notification_preferences JSONB DEFAULT '{"push": true, "sms": false}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bus routes table
CREATE TABLE public.bus_routes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  route_number TEXT NOT NULL,
  route_name TEXT NOT NULL,
  city_id UUID REFERENCES public.cities(id) NOT NULL,
  operator TEXT,
  color TEXT DEFAULT '#2563eb',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bus stops table
CREATE TABLE public.bus_stops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  city_id UUID REFERENCES public.cities(id) NOT NULL,
  stop_type TEXT DEFAULT 'regular' CHECK (stop_type IN ('major', 'regular', 'campus')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create route stops mapping (many-to-many relationship)
CREATE TABLE public.route_stops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  route_id UUID REFERENCES public.bus_routes(id) ON DELETE CASCADE,
  stop_id UUID REFERENCES public.bus_stops(id) ON DELETE CASCADE,
  stop_sequence INTEGER NOT NULL,
  estimated_time_minutes INTEGER DEFAULT 0,
  UNIQUE(route_id, stop_sequence)
);

-- Create tickets table for digital passes
CREATE TABLE public.tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  route_id UUID REFERENCES public.bus_routes(id),
  ticket_type TEXT DEFAULT 'single' CHECK (ticket_type IN ('single', 'day_pass', 'weekly_pass', 'monthly_pass')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired', 'cancelled')),
  qr_code TEXT,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  activated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rides history table
CREATE TABLE public.rides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  route_id UUID REFERENCES public.bus_routes(id),
  ticket_id UUID REFERENCES public.tickets(id),
  source_stop_id UUID REFERENCES public.bus_stops(id),
  destination_stop_id UUID REFERENCES public.bus_stops(id),
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'cancelled', 'in_progress')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bus_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bus_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;

-- Create policies for cities (public read)
CREATE POLICY "Cities are viewable by everyone" ON public.cities
  FOR SELECT USING (true);

-- Create policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for bus routes (public read)
CREATE POLICY "Bus routes are viewable by everyone" ON public.bus_routes
  FOR SELECT USING (true);

-- Create policies for bus stops (public read)
CREATE POLICY "Bus stops are viewable by everyone" ON public.bus_stops
  FOR SELECT USING (true);

-- Create policies for route stops (public read)
CREATE POLICY "Route stops are viewable by everyone" ON public.route_stops
  FOR SELECT USING (true);

-- Create policies for tickets
CREATE POLICY "Users can view own tickets" ON public.tickets
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own tickets" ON public.tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tickets" ON public.tickets
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for rides
CREATE POLICY "Users can view own rides" ON public.rides
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own rides" ON public.rides
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert sample cities
INSERT INTO public.cities (name, state) VALUES 
('Mumbai', 'Maharashtra'),
('Lucknow', 'Uttar Pradesh'),
('Bhopal', 'Madhya Pradesh'),
('Hyderabad', 'Telangana'),
('Pune', 'Maharashtra'),
('Bangalore', 'Karnataka'),
('Delhi', 'Delhi'),
('Chennai', 'Tamil Nadu');

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone'
  );
  RETURN new;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
