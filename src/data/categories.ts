import { ServiceCategory } from '../types';

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  // 1. AC Technician & Gas Refill
  {
    id: 'ac-technician',
    name: 'AC Technician & Gas Refill',
    icon: '❄️',
    lucideIconName: 'Fan',
    description: 'AC Installation, gas refilling (R32/R410A), cooling repair, deep servicing & maintenance',
    popularServices: ['AC Deep Servicing', 'Gas Refilling (R32/R410A)', 'AC Installation & Uninstallation', 'PCB Circuit Repair', 'Cooling Coil Replacement'],
    badge: 'Popular',
  },
  // 2. Electrician & Wiring
  {
    id: 'electrician',
    name: 'Electrician & Wiring',
    icon: '⚡',
    lucideIconName: 'Zap',
    description: 'Switchboard wiring, short circuit fixes, fan repair, inverter setup & light fitting',
    popularServices: ['Short Circuit Repair', 'Switch & Socket Replacement', 'Ceiling Fan Installation', 'Inverter & Battery Wiring', 'MCB Tripping Resolution'],
    badge: 'Emergency',
  },
  // 3. CCTV & Security Installer
  {
    id: 'cctv-security',
    name: 'CCTV & Security Installer',
    icon: '📹',
    lucideIconName: 'Camera',
    description: 'HD/IP Camera installation, DVR/NVR setup, video door bells & biometric systems',
    popularServices: ['4-Channel CCTV Setup', 'IP Camera WiFi Configuration', 'DVR/Hard Disk Replacement', 'Biometric Access Control', 'Video Door Phone Setup'],
  },
  // 4. Plumber & Water Motor
  {
    id: 'plumber',
    name: 'Plumber & Water Motor',
    icon: '🔧',
    lucideIconName: 'Wrench',
    description: 'Pipe leakage repair, tap fixing, water motor pump, drain unclogging & sanitary setup',
    popularServices: ['Tap Leakage & Replacement', 'Water Motor Pump Repair', 'Blocked Drain Cleaning', 'Bathroom Sanitary Fitting', 'Overhead Water Tank Cleaning'],
    badge: 'High Demand',
  },
  // 5. Home Appliance Repair
  {
    id: 'home-appliance',
    name: 'Home Appliance Repair',
    icon: '🧺',
    lucideIconName: 'Tv',
    description: 'Washing machine, refrigerator, microwave oven, geyser & chimney repair',
    popularServices: ['Washing Machine Drum & Motor Repair', 'Refrigerator Gas Refill & Cooling', 'Microwave Magnetron Repair', 'Geyser Element Replacement', 'Kitchen Chimney Servicing'],
  },
  // 6. Taxi Driver & Cab
  {
    id: 'taxi-cab-service',
    name: 'Taxi Driver & Cab',
    icon: '🚖',
    lucideIconName: 'Car',
    description: 'Local city rides, outstation cabs, airport pick & drop, 24/7 emergency vehicle booking',
    popularServices: ['Airport Pick & Drop', 'Outstation Round Trip', 'Hourly City Rental', 'Sedan & SUV Booking', 'Emergency 24x7 Cab'],
    badge: '24x7 Cabs',
  },
  // 7. Tile & Marble Layer
  {
    id: 'tile-marble-layer',
    name: 'Tile & Marble Layer',
    icon: '🧱',
    lucideIconName: 'Layers',
    description: 'Vitrified tiles, Italian marble flooring, bathroom tiling, granite polishing & grouting',
    popularServices: ['Floor Tile Laying (Sq. Ft.)', 'Italian Marble Polishing', 'Bathroom Wall Tiling', 'Kitchen Granite Slab Fixing', 'Epoxy Grouting'],
  },
  // 8. Interior Designer
  {
    id: 'interior-designer',
    name: 'Interior Designer',
    icon: '🛋️',
    lucideIconName: 'Sparkles',
    description: '3D modular kitchen, wardrobe design, living room revamp, space planning & consultation',
    popularServices: ['3D Modular Kitchen Design', 'Full Home Interior Consultation', 'Custom Wardrobe & TV Unit', 'Lighting & False Ceiling Plan', 'Furniture Layout Design'],
    badge: 'Premium',
  },
  // 9. Aluminum Fabricator
  {
    id: 'aluminum-fabricator',
    name: 'Aluminum Fabricator',
    icon: '🪟',
    lucideIconName: 'Hammer',
    description: 'Aluminum sliding windows, office partitions, mosquito mesh, doors & ACP sheet work',
    popularServices: ['Sliding Window Fabrication', 'Office Glass Partition Work', 'Mosquito Mesh Aluminum Frame', 'Louvered Ventilation Windows', 'ACP Sheet Cladding'],
  },
  // 10. Glass Technician
  {
    id: 'glass-technician',
    name: 'Glass Technician',
    icon: '🪞',
    lucideIconName: 'Maximize2',
    description: 'Toughened glass partitions, shower cubicles, mirror beveling, spider fittings & railing',
    popularServices: ['Toughened Glass Installation', 'Bathroom Shower Enclosure', 'Designer LED Mirror Fitting', 'Balcony Glass Railing', 'Patch Fitting Glass Doors'],
  },
  // 11. Painter
  {
    id: 'painter',
    name: 'Painter',
    icon: '🎨',
    lucideIconName: 'Paintbrush',
    description: 'Interior & exterior painting, texture wall art, waterproofing, wood polish & putty work',
    popularServices: ['Full Home Fresh Painting', 'Royal Luxury Texture Wall', 'Waterproofing & Damp Proofing', 'PU Wood Polish', 'Rental Whitewash Package'],
  },
  // 12. Mehndi Artist
  {
    id: 'mehndi-artist',
    name: 'Mehndi Artist',
    icon: '🌿',
    lucideIconName: 'Flower2',
    description: 'Bridal mehndi, Arabic henna designs, engagement, festival & guest party packages',
    popularServices: ['Full Bridal Mehndi Package', 'Arabic Front & Back Hand', 'Engagement Special Design', 'Guest Group Mehndi (Hourly)', 'Organic Dark Henna Cone'],
  },
  // 13. Makeup Artist
  {
    id: 'makeup-artist',
    name: 'Makeup Artist',
    icon: '💄',
    lucideIconName: 'Sparkles',
    description: 'HD Bridal makeup, party look, hairstyling, saree draping & airbrush makeover',
    popularServices: ['HD Bridal Makeover', 'Engagement / Reception Look', 'Party & Festival Makeup', 'Hair Styling & Saree Draping', 'Airbrush Makeup'],
    badge: 'Trending',
  },
  // 14. Marriage Hall / Event Decorator
  {
    id: 'event-decorator',
    name: 'Marriage Hall / Event Decorator',
    icon: '🎪',
    lucideIconName: 'PartyPopper',
    description: 'Wedding stage setup, flower decoration, entry gate arches, lighting & mandap themes',
    popularServices: ['Grand Wedding Stage Decor', 'Fresh Flower Mandap & Entry', 'Haldi & Mehndi Theme Setup', 'Ambient Lighting & Truss', 'Balloon & Floral Photo Booth'],
  },
  // 15. Wallpaper & Panel Installer
  {
    id: 'wallpaper-panel-installer',
    name: 'Wallpaper & Panel Installer',
    icon: '📜',
    lucideIconName: 'Wallpaper',
    description: '3D luxury wallpapers, PVC wall panels, fluted charcoal louvers, acoustic padding',
    popularServices: ['Custom 3D Wallpaper Pasting', 'PVC Charcoal Fluted Louvers', 'Wooden Texture Wall Cladding', 'Acoustic Soundproofing Panels', 'Custom Wall Mural Fitting'],
  },
  // 16. False Ceiling Contractor
  {
    id: 'false-ceiling-contractor',
    name: 'False Ceiling Contractor',
    icon: '🏛️',
    lucideIconName: 'Building',
    description: 'Gypsum board ceiling, POP cove design, grid ceiling, wooden rafters & LED profile channels',
    popularServices: ['Gypsum Board Ceiling (Per Sq. Ft.)', 'POP Modern Cove & LED Profile', 'Commercial Grid Tile Ceiling', 'Wooden Louver Rafter Ceiling', 'Moisture Resistant Bathroom Ceiling'],
  },
  // 17. Key Lock Maker
  {
    id: 'key-lock-maker',
    name: 'Key Lock Maker',
    icon: '🔑',
    lucideIconName: 'Key',
    description: 'Emergency door lock opening, duplicate computerized keys, smart digital lock fixing',
    popularServices: ['Emergency Lockout Door Opening', 'Duplicate Computerized Key Making', 'Smart Biometric Lock Installation', 'Car Transponder Key Duplication', 'Heavy Master Padlock Servicing'],
    badge: 'Quick Emergency',
  },
  // 18. Inverter & Battery Mechanic
  {
    id: 'inverter-battery-mechanic',
    name: 'Inverter & Battery Mechanic',
    icon: '🔋',
    lucideIconName: 'BatteryCharging',
    description: 'Home inverter repair, tubular battery water top-up, backup load test & solar inverter setup',
    popularServices: ['Inverter PCB Repair & Servicing', 'Battery Acid & Distilled Water Refill', 'Inverter Wiring & MCB Connection', 'Solar Hybrid Inverter Installation', 'Battery Health & Backup Load Check'],
    badge: 'Essential',
  },
  // 19. Carpenter & Woodwork
  {
    id: 'carpenter-woodwork',
    name: 'Carpenter & Woodwork',
    icon: '🪚',
    lucideIconName: 'Hammer',
    description: 'Furniture repair, door latch & hinge fixing, modular wardrobe assembly, drawer channels & polish',
    popularServices: ['Door Lock & Hinge Repair', 'Bed & Wardrobe Assembly', 'Cabinet & Drawer Channel Fixing', 'Custom Wooden Furniture Making', 'Wood Polishing & Touch-up'],
    badge: 'High Demand',
  },
  // 20. Doorstep Bike Repair
  {
    id: 'doorstep-bike-repair',
    name: 'Doorstep Bike Repair',
    icon: '🏍️',
    lucideIconName: 'Bike',
    description: 'Two-wheeler doorstep servicing, engine oil change, puncture fix, brake adjustment & breakdown assistance',
    popularServices: ['Engine Oil Change & Filter Clean', 'Brake Pad & Cable Replacement', 'Doorstep Tubeless Puncture Fix', 'Carburetor & Spark Plug Tuning', 'Chain Lubrication & Tightening'],
    badge: 'At Your Door',
  },
  // 21. Home Tuition / Personal Tutor
  {
    id: 'home-tuition',
    name: 'Home Tuition / Personal Tutor',
    icon: '📚',
    lucideIconName: 'GraduationCap',
    description: 'Class 1-12 all subjects, CBSE/ICSE, competitive exams, spoken English & 1-on-1 home tutors',
    popularServices: [
      'Class 1st to 8th (All Subjects)',
      'Class 9th & 10th (Maths & Science)',
      'Class 11th & 12th (Physics/Chem/Maths)',
      'Spoken English & Communication',
      '1-on-1 Personalized Home Mentoring',
    ],
    badge: 'Education',
  },
  // 22. Goods Transport / Pickup (Chota Hathi)
  {
    id: 'goods-transport',
    name: 'Goods Transport / Pickup (Chota Hathi)',
    icon: '🚚',
    lucideIconName: 'Truck',
    description: 'Tata Ace (Chota Hathi), pickup vans, house shifting, commercial cargo & intra-city logistics',
    popularServices: [
      'Chota Hathi (Tata Ace) Local Trip',
      'House & Room Shifting',
      'Commercial Goods Delivery',
      'Inter-city Transport',
      'Urgent Cargo Pickup & Drop',
    ],
    badge: 'Logistics',
  },
  // 23. Cleaner / Maid
  {
    id: 'cleaner-maid',
    name: 'Cleaner / Maid',
    icon: '🧹',
    lucideIconName: 'Sparkles',
    description: 'Full house deep cleaning, daily maid, bathroom sanitization, kitchen degreasing & housekeeping',
    popularServices: [
      'Full Home Deep Cleaning',
      'Bathroom & Toilet Deep Clean',
      'Kitchen Deep Cleaning & Degreasing',
      'Daily House Maid & Floor Mopping',
      'Sofa & Carpet Shampoo Cleaning',
    ],
    badge: 'Cleaning',
  },
  // 24. Babysitter / Nurse
  {
    id: 'babysitter-nurse',
    name: 'Babysitter / Nurse',
    icon: '👶',
    lucideIconName: 'HeartHandshake',
    description: 'Certified infant care, professional babysitters, elderly patient nursing, day & night nanny assistance',
    popularServices: [
      'Infant & Toddler Babysitting',
      'Elderly Patient Care Assistant',
      'Post-Surgery Nursing Support',
      'Full-Day / 24-Hour Nanny',
      'Newborn Baby Care & Mother Assistance',
    ],
    badge: 'Care',
  },
  // 25. Packers & Movers Helper
  {
    id: 'packers-movers-helper',
    name: 'Packers & Movers Helper',
    icon: '📦',
    lucideIconName: 'Package',
    description: 'Household luggage packing, loading & unloading helpers, carton bubble wrapping, shifting manpower',
    popularServices: [
      'Loading & Unloading Helper',
      'Heavy Furniture Shifting & Dismantling',
      'Carton Box Bubble Packing & Taping',
      'Intra-City House Shifting Labor',
      'Luggage Transport & Relocation Assistance',
    ],
    badge: 'Moving',
  },
];
