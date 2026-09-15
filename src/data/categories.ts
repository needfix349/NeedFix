import { ServiceCategory } from '../types';

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  // 1. AC Technician & Gas Refill
  {
    id: 'ac-technician',
    name: 'AC Technician & Gas Refill',
    hindiName: 'एसी तकनीशियन एवं गैस रीफिल',
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
    hindiName: 'इलेक्ट्रीशियन एवं वायरिंग',
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
    hindiName: 'सीसीटीवी एवं सुरक्षा इंस्टॉलर',
    icon: '📹',
    lucideIconName: 'Camera',
    description: 'HD/IP Camera installation, DVR/NVR setup, video door bells & biometric systems',
    popularServices: ['4-Channel CCTV Setup', 'IP Camera WiFi Configuration', 'DVR/Hard Disk Replacement', 'Biometric Access Control', 'Video Door Phone Setup'],
  },
  // 4. Plumber & Water Motor
  {
    id: 'plumber',
    name: 'Plumber & Water Motor',
    hindiName: 'प्लंबर एवं वाटर मोटर',
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
    hindiName: 'घरेलू उपकरण मरम्मत',
    icon: '🧺',
    lucideIconName: 'Tv',
    description: 'Washing machine, refrigerator, microwave oven, geyser & chimney repair',
    popularServices: ['Washing Machine Drum & Motor Repair', 'Refrigerator Gas Refill & Cooling', 'Microwave Magnetron Repair', 'Geyser Element Replacement', 'Kitchen Chimney Servicing'],
  },
  // 6. Taxi Driver & Cab
  {
    id: 'taxi-cab-service',
    name: 'Taxi Driver & Cab',
    hindiName: 'टैक्सी ड्राइवर एवं कैब',
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
    hindiName: 'टाइल एवं मार्बल लेयर',
    icon: '🧱',
    lucideIconName: 'Layers',
    description: 'Vitrified tiles, Italian marble flooring, bathroom tiling, granite polishing & grouting',
    popularServices: ['Floor Tile Laying (Sq. Ft.)', 'Italian Marble Polishing', 'Bathroom Wall Tiling', 'Kitchen Granite Slab Fixing', 'Epoxy Grouting'],
  },
  // 8. Interior Designer
  {
    id: 'interior-designer',
    name: 'Interior Designer',
    hindiName: 'इंटीरियर डिजाइनर',
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
    hindiName: 'एल्युमिनियम फैब्रिकेटर',
    icon: '🪟',
    lucideIconName: 'Hammer',
    description: 'Aluminum sliding windows, office partitions, mosquito mesh, doors & ACP sheet work',
    popularServices: ['Sliding Window Fabrication', 'Office Glass Partition Work', 'Mosquito Mesh Aluminum Frame', 'Louvered Ventilation Windows', 'ACP Sheet Cladding'],
  },
  // 10. Glass Technician
  {
    id: 'glass-technician',
    name: 'Glass Technician',
    hindiName: 'ग्लास तकनीशियन',
    icon: '🪞',
    lucideIconName: 'Maximize2',
    description: 'Toughened glass partitions, shower cubicles, mirror beveling, spider fittings & railing',
    popularServices: ['Toughened Glass Installation', 'Bathroom Shower Enclosure', 'Designer LED Mirror Fitting', 'Balcony Glass Railing', 'Patch Fitting Glass Doors'],
  },
  // 11. Painter
  {
    id: 'painter',
    name: 'Painter',
    hindiName: 'पेंटर',
    icon: '🎨',
    lucideIconName: 'Paintbrush',
    description: 'Interior & exterior painting, texture wall art, waterproofing, wood polish & putty work',
    popularServices: ['Full Home Fresh Painting', 'Royal Luxury Texture Wall', 'Waterproofing & Damp Proofing', 'PU Wood Polish', 'Rental Whitewash Package'],
  },
  // 12. Mehndi Artist
  {
    id: 'mehndi-artist',
    name: 'Mehndi Artist',
    hindiName: 'मेहंदी आर्टिस्ट',
    icon: '🌿',
    lucideIconName: 'Flower2',
    description: 'Bridal mehndi, Arabic henna designs, engagement, festival & guest party packages',
    popularServices: ['Full Bridal Mehndi Package', 'Arabic Front & Back Hand', 'Engagement Special Design', 'Guest Group Mehndi (Hourly)', 'Organic Dark Henna Cone'],
  },
  // 13. Makeup Artist
  {
    id: 'makeup-artist',
    name: 'Makeup Artist',
    hindiName: 'मेकअप आर्टिस्ट',
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
    hindiName: 'मैरिज हॉल / इवेंट डेकोरेटर',
    icon: '🎪',
    lucideIconName: 'PartyPopper',
    description: 'Wedding stage setup, flower decoration, entry gate arches, lighting & mandap themes',
    popularServices: ['Grand Wedding Stage Decor', 'Fresh Flower Mandap & Entry', 'Haldi & Mehndi Theme Setup', 'Ambient Lighting & Truss', 'Balloon & Floral Photo Booth'],
  },
  // 15. Wallpaper & Panel Installer
  {
    id: 'wallpaper-panel-installer',
    name: 'Wallpaper & Panel Installer',
    hindiName: 'वॉलपेपर एवं पैनल इंस्टॉलर',
    icon: '📜',
    lucideIconName: 'Wallpaper',
    description: '3D luxury wallpapers, PVC wall panels, fluted charcoal louvers, acoustic padding',
    popularServices: ['Custom 3D Wallpaper Pasting', 'PVC Charcoal Fluted Louvers', 'Wooden Texture Wall Cladding', 'Acoustic Soundproofing Panels', 'Custom Wall Mural Fitting'],
  },
  // 16. False Ceiling Contractor
  {
    id: 'false-ceiling-contractor',
    name: 'False Ceiling Contractor',
    hindiName: 'फॉल्स सीलिंग ठेकेदार',
    icon: '🏛️',
    lucideIconName: 'Building',
    description: 'Gypsum board ceiling, POP cove design, grid ceiling, wooden rafters & LED profile channels',
    popularServices: ['Gypsum Board Ceiling (Per Sq. Ft.)', 'POP Modern Cove & LED Profile', 'Commercial Grid Tile Ceiling', 'Wooden Louver Rafter Ceiling', 'Moisture Resistant Bathroom Ceiling'],
  },
  // 17. Key Lock Maker
  {
    id: 'key-lock-maker',
    name: 'Key Lock Maker',
    hindiName: 'चाबी एवं ताला बनाने वाले',
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
    hindiName: 'इन्वर्टर एवं बैटरी मैकेनिक',
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
    hindiName: 'बढ़ई एवं लकड़ी का काम',
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
    hindiName: 'डोरस्टेप बाइक रिपेयर',
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
    hindiName: 'होम ट्यूशन / पर्सनल ट्यूटर',
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
    hindiName: 'गुड्स ट्रांसपोर्ट / पिकअप (छोटा हाथी)',
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
];
