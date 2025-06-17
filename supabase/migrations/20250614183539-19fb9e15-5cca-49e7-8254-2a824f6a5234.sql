
-- Insert comprehensive list of colleges in Hyderabad
INSERT INTO public.colleges (name, address, city_id, college_type, is_active) 
SELECT 
  college_data.name,
  college_data.address,
  c.id,
  college_data.college_type,
  true
FROM (
  VALUES 
    -- Universities and Central Institutions
    ('Osmania University', 'University Road, Hyderabad, Telangana 500007', 'university'),
    ('Indian Institute of Technology Hyderabad', 'Kandi, Sangareddy, Telangana 502285', 'engineering'),
    ('Footwear Design and Development Institute', 'Anantapur Road, Hyderabad, Telangana', 'other'),
    ('Tata Institute of Fundamental Research', 'Survey No. 36/P, Gopanpally Village, Hyderabad, Telangana 500046', 'university'),
    ('Birla Institute of Technology and Science, Pilani – Hyderabad', 'Jawahar Nagar, Kapra Mandal, Medchal, Hyderabad, Telangana 500078', 'engineering'),
    ('English and Foreign Languages University', 'Osmania University Campus, Hyderabad, Telangana 500007', 'arts'),
    ('International Institute of Information Technology, Hyderabad (IIIT-H)', 'Raj Bhavan Road, Gachibowli, Hyderabad, Telangana 500032', 'engineering'),
    ('Jawaharlal Nehru Technological University (JNTU)', 'Kukatpally, Hyderabad, Telangana 500085', 'engineering'),
    ('NALSAR University of Law', 'Justice City, Shameerpet, Hyderabad, Telangana 500101', 'other'),
    ('Professor Jayashankar Telangana State Agricultural University', 'Rajendranagar, Hyderabad, Telangana 500030', 'university'),
    ('Dr. B.R. Ambedkar Open University', 'Road No. 46, Jubilee Hills, Hyderabad, Telangana 500033', 'university'),
    ('Tata Institute of Social Sciences, Hyderabad', 'ICT Campus, Hyderabad, Telangana', 'university'),
    ('Indian School of Business (ISB)', 'Gachibowli, Hyderabad, Telangana 500111', 'commerce'),
    ('Woxsen University', 'Sadasivpet, Kamkole, Hyderabad, Telangana 502345', 'university'),
    ('Maulana Azad National Urdu University', 'Gachibowli, Hyderabad, Telangana 500032', 'university'),
    ('Nizam''s Institute of Medical Sciences', 'Panjagutta, Hyderabad, Telangana 500082', 'medical'),
    ('GITAM University Hyderabad Campus', 'Rudraram, Patancheru Mandal, Medak, Telangana 502329', 'university'),
    ('Potti Sreeramulu Telugu University', 'Public Gardens, Nampally, Hyderabad, Telangana 500004', 'arts'),
    ('Institute of Chartered Financial Analysts of India (ICFAI)', 'ICFAI Foundation for Higher Education, Donthanapally, Shankarapally Road, Hyderabad, Telangana 501203', 'commerce'),
    ('Mahindra University', 'Survey No. 62/1A, Bahadurpally Jeedimetla, Hyderabad, Telangana 500043', 'university'),
    ('University of Hyderabad', 'Prof. C.R. Rao Road, University of Hyderabad Campus, Hyderabad, Telangana 500046', 'university'),
    ('Symbiosis International University', 'Survey No. 28, Lavelle Road, Hyderabad, Telangana', 'university'),
    ('Anurag University', 'Venkatapur, Ghatkesar, Medchal, Hyderabad, Telangana 501301', 'engineering'),
    ('Malla Reddy University', 'Maisammaguda, Dhulapally, Medchal, Hyderabad, Telangana 500100', 'university'),

    -- Research Centres and Institutes
    ('Administrative Staff College of India', 'Raj Bhavan Road, Khairatabad, Hyderabad, Telangana 500082', 'other'),
    ('Centre for Cellular and Molecular Biology (CCMB)', 'Uppal Road, Hyderabad, Telangana 500007', 'other'),
    ('Defence Research & Development Laboratory (DRDL)', 'Kanchanbagh, Hyderabad, Telangana 500058', 'other'),
    ('Indian Institute of Chemical Technology (IICT)', 'Uppal Road, Tarnaka, Hyderabad, Telangana 500007', 'other'),
    ('International Crops Research Institute for the Semi-Arid Tropics (ICRISAT)', 'Patancheru, Hyderabad, Telangana 502324', 'other'),
    ('National Institute of Fashion Technology (NIFT), Hyderabad', 'Madhapur, Hyderabad, Telangana 500081', 'other'),
    ('National Institute of Nutrition (NIN), Tarnaka', 'Jamai-Osmania, Tarnaka, Hyderabad, Telangana 500007', 'other'),
    ('National Institute of Pharmaceutical Education and Research (NIPER), Hyderabad', 'Balanagar, Hyderabad, Telangana 500037', 'other'),
    ('National Institute of Rural Development (NIRD)', 'Rajendranagar, Hyderabad, Telangana 500030', 'other'),
    ('Indian Statistical Institute', 'Street Number 8, Habsiguda, Hyderabad, Telangana 500007', 'other'),

    -- Private Engineering Colleges
    ('Chaitanya Bharathi Institute of Technology (CBIT)', 'Gandipet, Hyderabad, Telangana 500075', 'engineering'),
    ('CMR Institute of Technology', 'Kandlakoya, Medchal Road, Hyderabad, Telangana 501401', 'engineering'),
    ('CVR College of Engineering', 'Vastunagar, Mangalpalli, Ibrahimpatnam, Hyderabad, Telangana 501510', 'engineering'),
    ('CVSR College of Engineering', 'Ghatkesar, Hyderabad, Telangana 501301', 'engineering'),
    ('Deccan College of Engineering and Technology', 'Darussalam, Aghapura, Hyderabad, Telangana 500001', 'engineering'),
    ('Gokaraju Rangaraju Institute of Engineering and Technology (GRIET)', 'Bachupally, Kukatpally, Hyderabad, Telangana 500090', 'engineering'),
    ('Institute Of Aeronautical Engineering', 'Dundigal, Hyderabad, Telangana 500043', 'engineering'),
    ('J. B. Institute of Engineering and Technology', 'Yenkapally Village, Moinabad Mandal, Hyderabad, Telangana 500075', 'engineering'),
    ('Keshav Memorial Institute of Technology (KMIT)', 'Narayanguda, Hyderabad, Telangana 500029', 'engineering'),
    ('Mahatma Gandhi Institute of Technology (MGIT)', 'Kokapet, Gandipet, Hyderabad, Telangana 500075', 'engineering'),
    ('Malla Reddy Engineering College', 'Maisammaguda, Dhulapally, Secunderabad, Telangana 500100', 'engineering'),
    ('Lords Institute of Engineering and Technology', 'Himayatsagar, Hyderabad, Telangana 500091', 'engineering'),
    ('Malla Reddy College of Engineering and Technology', 'Maisammaguda, Dhulapally, Secunderabad, Telangana 500100', 'engineering'),
    ('MLR Institute of Technology', 'Laxma Reddy Avenue, Dundigal, Hyderabad, Telangana 500043', 'engineering'),
    ('Maturi Venkata Subba Rao Engineering College (MVSR)', 'Nadergul, Hyderabad, Telangana 501510', 'engineering'),
    ('Methodist College of Engineering and Technology', 'Abids, Hyderabad, Telangana 500001', 'engineering'),
    ('Muffakham Jah College of Engineering and Technology', 'Road No. 3, Banjara Hills, Hyderabad, Telangana 500034', 'engineering'),
    ('Padmasri Dr. B.V Raju Institute of Technology (BVRIT)', 'Vishnupur, Narsapur, Medak, Telangana 502313', 'engineering'),
    ('Sreenidhi Institute of Science and Technology', 'Yamnampet, Ghatkesar, Hyderabad, Telangana 501301', 'engineering'),
    ('TRR College of Engineering', 'Patancheru, Hyderabad, Telangana 502319', 'engineering'),
    ('Vardhaman College of Engineering', 'Kacharam, Shamshabad, Hyderabad, Telangana 501218', 'engineering'),
    ('Vasavi College of Engineering', 'Ibrahim Bagh, Hyderabad, Telangana 500031', 'engineering'),
    ('Vidya Jyothi Institute of Technology (VJIT)', 'Aziz Nagar Gate, Hyderabad, Telangana 500075', 'engineering'),
    ('Vignan Institute of Technology and Aeronautical Engineering', 'Deshmukhi, Pochampally, Hyderabad, Telangana 508284', 'engineering'),
    ('Vignana Bharathi Institute of Technology', 'Aushapur, Ghatkesar, Hyderabad, Telangana 501301', 'engineering'),
    ('VNR Vignana Jyothi Institute of Engineering and Technology', 'Bachupally, Nizampet, Hyderabad, Telangana 500090', 'engineering'),

    -- Design Colleges
    ('ICAT Design & Media College', 'Madhapur, Hyderabad, Telangana 500081', 'other'),

    -- Medical Colleges
    ('Deccan College of Medical Sciences', 'Kanchanbagh, DMRL X Roads, Hyderabad, Telangana 500058', 'medical'),
    ('Kamineni Institute of Medical Sciences', 'Narketpally, Nalgonda, Telangana 508254', 'medical'),
    ('Osmania Medical College', 'Koti, Hyderabad, Telangana 500095', 'medical'),
    ('Shadan Institute of Medical Sciences', 'Himayatsagar Road, Hyderabad, Telangana 500008', 'medical'),
    ('Malla Reddy Medical College for Women', 'Suraram, Jeedimetla, Hyderabad, Telangana 500055', 'medical'),
    ('Malla Reddy Institute of Medical Sciences', 'Suraram, Jeedimetla, Hyderabad, Telangana 500055', 'medical'),
    ('Malla Reddy Dental College for Women', 'Suraram, Jeedimetla, Hyderabad, Telangana 500055', 'medical'),
    ('Malla Reddy Institute of Dental Sciences', 'Suraram, Jeedimetla, Hyderabad, Telangana 500055', 'medical'),
    ('Panineeya Institute of Dental Sciences', 'Kamala Nagar, Dilsukhnagar, Hyderabad, Telangana 500060', 'medical'),

    -- Other Degree Colleges
    ('Andhra Vidyalaya College of Arts, Science and Commerce', 'Himayatnagar, Hyderabad, Telangana 500029', 'arts'),
    ('Bhavan''s Vivekananda College', 'Sainikpuri, Secunderabad, Telangana 500094', 'arts'),
    ('City College, Hyderabad', 'Narayanguda, Hyderabad, Telangana 500029', 'arts'),
    ('Nizam College', 'Basheerbagh, Hyderabad, Telangana 500001', 'arts'),
    ('Tapasya College of Commerce and Management', 'Punjagutta, Hyderabad, Telangana 500082', 'commerce'),
    ('Wesley Degree College, Secunderabad', 'Wesley College Campus, Secunderabad, Telangana 500003', 'arts'),
    ('Avinash College of Commerce', 'Himayatnagar, Hyderabad, Telangana 500029', 'commerce'),
    ('Loyola Academy Degree and PG College', 'Old Alwal, Secunderabad, Telangana 500010', 'arts')
) AS college_data(name, address, college_type)
CROSS JOIN public.cities c
WHERE c.name = 'Hyderabad' AND c.state = 'Telangana';

-- Also insert some bus stops near major colleges for better route coverage
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
    ('Osmania University Main Gate', 17.4130, 78.4075, 'Osmania University', 100),
    ('JNTU Kukatpally Main Gate', 17.4920, 78.3915, 'Jawaharlal Nehru Technological University (JNTU)', 80),
    ('ISB Campus Stop', 17.4242, 78.3730, 'Indian School of Business (ISB)', 120),
    ('CBIT Main Gate', 17.3850, 78.3747, 'Chaitanya Bharathi Institute of Technology (CBIT)', 90),
    ('MGIT Campus', 17.3915, 78.3415, 'Mahatma Gandhi Institute of Technology (MGIT)', 110),
    ('Vasavi College Stop', 17.4086, 78.4617, 'Vasavi College of Engineering', 95),
    ('GRIET Bachupally', 17.5135, 78.3480, 'Gokaraju Rangaraju Institute of Engineering and Technology (GRIET)', 85),
    ('NIMS Panjagutta', 17.4311, 78.4480, 'Nizam''s Institute of Medical Sciences', 75),
    ('University of Hyderabad Gate', 17.4575, 78.3310, 'University of Hyderabad', 150),
    ('BITS Pilani Hyderabad', 17.5449, 78.5717, 'Birla Institute of Technology and Science, Pilani – Hyderabad', 130)
) AS stop_data(name, latitude, longitude, college_name, distance)
CROSS JOIN public.cities c
CROSS JOIN public.colleges col
WHERE c.name = 'Hyderabad' 
AND col.name = stop_data.college_name;
