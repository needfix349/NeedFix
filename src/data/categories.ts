import { ServiceCategory } from '../types';

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  // 1. AC Technician & Gas Refill
  {
    id: 'ac-technician',
    name: 'AC Technician & Gas Refill',
    icon: '❄️',
    lucideIconName: 'Fan',
    description: 'Split & window AC repair, deep jet pump servicing, R32/R410A gas refilling & PCB repair',
    popularServices: ['AC Deep Jet Servicing', 'Gas Refilling (R32/R410A)', 'AC Installation & Uninstallation', 'PCB Circuit Board Repair', 'Cooling Coil Replacement'],
    badge: 'Popular',
  },
  // 2. Electrician & Wiring
  {
    id: 'electrician',
    name: 'Electrician & Wiring',
    icon: '⚡',
    lucideIconName: 'Zap',
    description: 'Complete home electrical wiring, switchboard fixing, short circuits, MCB repair & lighting',
    popularServices: ['Short Circuit Repair', 'Switch & Socket Replacement', 'Ceiling Fan Installation', 'MCB Tripping Resolution', 'Full House Electrical Rewiring'],
    badge: 'Emergency',
  },
  // 3. Plumber (Repair & Installation)
  {
    id: 'plumber',
    name: 'Plumber (Repair & Installation)',
    icon: '🔧',
    lucideIconName: 'Wrench',
    description: 'Tap leakage repair, water pipe fitting, pipeline blockage, sanitary ware & flush cistern repair',
    popularServices: ['Tap Leakage & Replacement', 'Concealed Pipe Leak Detection', 'Drain & Bathroom Unclogging', 'Sanitary & Commode Fitting', 'Overhead Pipeline Repair'],
    badge: 'High Demand',
  },
  // 4. Home Appliance Repair
  {
    id: 'home-appliance',
    name: 'Home Appliance Repair',
    icon: '🧺',
    lucideIconName: 'Tv',
    description: 'Double door refrigerator cooling, front & top load washing machine, microwave & chimney repair',
    popularServices: ['Washing Machine Drum & Motor Repair', 'Refrigerator Gas Refill & Compressor', 'Microwave Heating Repair', 'Kitchen Chimney Deep Clean & Repair', 'Geyser Element Replacement'],
    badge: 'Essential',
  },
  // 5. CCTV & Security Installer
  {
    id: 'cctv-security',
    name: 'CCTV & Security Installer',
    icon: '📹',
    lucideIconName: 'Camera',
    description: 'HD & IP CCTV cameras, WiFi smart cameras, DVR/NVR configuration, mobile live view & intercom',
    popularServices: ['4-Channel & 8-Channel CCTV Setup', 'WiFi Smart PTZ Camera Installation', 'DVR Hard Drive & Power Supply Repair', 'Video Door Phone (VDP) Setup', 'Biometric Access Control'],
  },
  // 6. Taxi Driver & Cab
  {
    id: 'taxi-cab-service',
    name: 'Taxi Driver & Cab',
    icon: '🚖',
    lucideIconName: 'Car',
    description: 'Local city rides, outstation round trips, airport drop/pickup & verified experienced drivers',
    popularServices: ['Airport Pick & Drop', 'Outstation Round Trip Cabs', 'Full Day City Rental (8hr/80km)', 'Sedan & SUV Cab Booking', 'Emergency 24x7 Cab Service'],
    badge: '24x7 Available',
  },
  // 7. Makeup Artist
  {
    id: 'makeup-artist',
    name: 'Makeup Artist',
    icon: '💄',
    lucideIconName: 'Sparkles',
    description: 'HD bridal makeup, airbrush makeup, party & reception makeover, saree draping & hairstyling',
    popularServices: ['HD Bridal Makeover Package', 'Engagement & Reception Makeup', 'Party & Festival Glam Makeover', 'Professional Hair Styling', 'Airbrush Makeup'],
    badge: 'Trending',
  },
  // 8. Mehndi Artist
  {
    id: 'mehndi-artist',
    name: 'Mehndi Artist',
    icon: '🌿',
    lucideIconName: 'Flower2',
    description: 'Bridal mehndi, intricate Arabic designs, Rajasthani traditional, baby shower & guest henna cones',
    popularServices: ['Full Hand Bridal Mehndi Package', 'Designer Arabic Front & Back Hand', 'Engagement Special Henna', 'Family & Guest Group Mehndi (Hourly)', 'Organic 100% Dark Stain Henna'],
    badge: 'Specialist',
  },
  // 9. Car Mechanic
  {
    id: 'car-mechanic',
    name: 'Car Mechanic',
    icon: '🚗',
    lucideIconName: 'Car',
    description: 'Doorstep car servicing, brake pad replacement, battery jumpstart, clutch & engine diagnostics',
    popularServices: ['Doorstep Periodic Car Service', 'Engine Oil & Filter Change', 'Brake Pad Replacement & Bleeding', 'Clutch Overhaul & Plate Change', 'Car Battery Jumpstart & Replacement'],
  },
  // 10. Carpenter & Woodwork
  {
    id: 'carpenter-woodwork',
    name: 'Carpenter & Woodwork',
    icon: '🪚',
    lucideIconName: 'Hammer',
    description: 'Door lock & hinge repair, custom modular wardrobe, bed assembly, modular kitchen woodwork & polish',
    popularServices: ['Door Lock, Latch & Hinge Repair', 'Bed, Sofa & Wardrobe Assembly', 'Cabinet & Drawer Telescopic Channels', 'Custom Furniture Fabrication', 'Wood Polish & PU Finish'],
  },
  // 11. Painter
  {
    id: 'painter',
    name: 'Painter',
    icon: '🎨',
    lucideIconName: 'Paintbrush',
    description: 'Interior & exterior house painting, royal texture walls, waterproofing damp cure & putty work',
    popularServices: ['Full Home Fresh Painting', 'Royal Luxury Texture Feature Wall', 'Waterproofing & Wall Seepage Fix', 'Rental Whitewash Package', 'Door & Window Enamel Painting'],
  },
  // 12. RO Technician
  {
    id: 'ro-technician',
    name: 'RO Technician',
    icon: '💧',
    lucideIconName: 'Droplets',
    description: 'Water purifier filter replacement, RO membrane repair, TDS calibration & installation',
    popularServices: ['Full RO Filter Kit Replacement', 'RO Booster Pump & SMPS Repair', 'Membrane Replacement & TDS Tune', 'Water Purifier Uninstallation/Install', 'UV & Alkaline Mineral Cartridge Add'],
  },
  // 13. Doorstep Bike Repair
  {
    id: 'doorstep-bike-repair',
    name: 'Doorstep Bike Repair',
    icon: '🏍️',
    lucideIconName: 'Bike',
    description: 'Doorstep two-wheeler servicing, engine oil change, tubeless puncture, brake adjust & tuning',
    popularServices: ['Doorstep General Bike Service', 'Engine Oil Change & Filter Clean', 'Tubeless Tire Puncture Repair', 'Brake Shoes & Cable Replacement', 'Chain Lubrication & Carburetor Tune'],
    badge: 'At Doorstep',
  },
  // 14. Mobile Repair
  {
    id: 'mobile-repair',
    name: 'Mobile Repair',
    icon: '📱',
    lucideIconName: 'Smartphone',
    description: 'Screen/display glass replacement, battery change, charging port fix & motherboard repair',
    popularServices: ['Original OLED/LCD Screen Change', 'Battery Health Replacement', 'Charging Port & Mic Repair', 'Water Damage Restoration', 'Camera & Speaker Repair'],
  },
  // 15. Mason / Civil Contractor
  {
    id: 'mason-civil-contractor',
    name: 'Mason / Civil Contractor',
    icon: '🧱',
    lucideIconName: 'Building2',
    description: 'Brick masonry, wall plastering, concrete repair, room partition & home renovation contractor',
    popularServices: ['Brickwork & Wall Construction', 'Sand & Cement Plastering Work', 'Tile & Marble Base Concrete Laying', 'Wall Dismantling & Structural Fix', 'Waterproofing Plaster Application'],
  },
  // 16. Tile & Marble Layer
  {
    id: 'tile-marble-layer',
    name: 'Tile & Marble Layer',
    icon: '🪨',
    lucideIconName: 'Layers',
    description: 'Vitrified floor tiles, Italian marble laying, kitchen granite counter slabs & epoxy grouting',
    popularServices: ['Vitrified Floor Tile Laying', 'Italian Marble Laying & Mirror Polish', 'Bathroom Wall & Floor Tiling', 'Kitchen Granite Countertop Fitting', 'Epoxy Waterproof Grouting'],
  },
  // 17. Water Tank Cleaning
  {
    id: 'water-tank-cleaning',
    name: 'Water Tank Cleaning',
    icon: '🚰',
    lucideIconName: 'Sparkles',
    description: 'Underground & overhead Sintex tank high-pressure jet cleaning, sludge vacuum & UV sterilization',
    popularServices: ['Overhead Sintex Tank Jet Cleaning', 'Underground Sump Deep Clean & Sludge Pump', 'UV Antibacterial Tank Treatment', 'Chemical Free Mechanized Sanitization', 'Pipeline Flushing & Bio-cleaning'],
  },
  // 18. Inverter & Battery Mechanic
  {
    id: 'inverter-battery-mechanic',
    name: 'Inverter & Battery Mechanic',
    icon: '🔋',
    lucideIconName: 'BatteryCharging',
    description: 'Home inverter PCB repair, tubular battery distilled water refill, backup test & solar hybrid setup',
    popularServices: ['Inverter PCB Board Repair', 'Tubular Battery Acid & Water Topup', 'Inverter Wiring & Dedicated MCB', 'Battery Backup Load Capacity Test', 'Solar Inverter & Panel Wiring'],
  },
  // 19. Laptop / Computer Repair
  {
    id: 'laptop-computer-repair',
    name: 'Laptop / Computer Repair',
    icon: '💻',
    lucideIconName: 'Laptop',
    description: 'Laptop motherboard chip level repair, screen & keyboard replacement, SSD upgrade & OS install',
    popularServices: ['Motherboard Chip-Level Repair', 'Laptop Screen & Hinge Replacement', 'High-Speed SSD Upgrade & RAM Boost', 'Keyboard & Trackpad Replacement', 'Windows / Mac OS Fresh Install & Antivirus'],
  },
  // 20. Welder & Welding Work
  {
    id: 'welder-welding-work',
    name: 'Welder & Welding Work',
    icon: '👨‍🏭',
    lucideIconName: 'Flame',
    description: 'Iron safety gates, window safety grills, balcony railing, shed structure & on-site arc welding',
    popularServices: ['Iron Main Gate & Railing Welding', 'Window Safety Grill Fabrication', 'Shed Tin Structure Welding', 'Broken Hinge & Door Frame Re-welding', 'Stainless Steel (SS) Railing Work'],
  },
  // 21. Cleaner / Maid
  {
    id: 'cleaner-maid',
    name: 'Cleaner / Maid',
    icon: '🧹',
    lucideIconName: 'Sparkles',
    description: 'Full house deep cleaning, kitchen grease removal, bathroom sanitization & regular maid support',
    popularServices: ['Full Home Deep Cleaning', 'Bathroom & Toilet Tile Scrub Clean', 'Modular Kitchen Degreasing', 'Sofa & Carpet Foam Shampooing', 'Balcony & Floor Scrubbing Machine'],
  },
  // 22. Packers & Movers Helper
  {
    id: 'packers-movers-helper',
    name: 'Packers & Movers Helper',
    icon: '📦',
    lucideIconName: 'Package',
    description: 'Household shifting helpers, heavy furniture loading/unloading, bubble wrap carton packing',
    popularServices: ['Loading & Unloading Helpers', 'Bubble Wrap & Corrugated Carton Packing', 'Heavy Furniture Dismantling & Shifting', 'Local Intra-City Relocation Labor', 'Luggage & Fragile Goods Packing'],
  },
  // 23. False Ceiling Contractor
  {
    id: 'false-ceiling-contractor',
    name: 'False Ceiling Contractor',
    icon: '🏛️',
    lucideIconName: 'Building',
    description: 'Gypsum board false ceiling, modern POP cove lighting, grid ceiling & acoustic channels',
    popularServices: ['Gypsum Board Ceiling (Per Sq. Ft.)', 'POP Modern Cove & LED Profile', 'Commercial Grid Tile Ceiling', 'Wooden Louver Rafter Ceiling', 'Moisture Resistant Bathroom Ceiling'],
  },
  // 24. Aluminum Fabricator
  {
    id: 'aluminum-fabricator',
    name: 'Aluminum Fabricator',
    icon: '🪟',
    lucideIconName: 'Hammer',
    description: 'Aluminum sliding windows, office toughened glass partitions, mosquito net frames & doors',
    popularServices: ['Sliding Window Fabrication (2 & 3 Track)', 'Office Partition & Aluminum Doors', 'Stainless Steel Mosquito Net Mesh', 'Louvered Bathroom Windows', 'ACP Sheet Exterior Cladding'],
  },
  // 25. Wallpaper & Panel Installer
  {
    id: 'wallpaper-panel-installer',
    name: 'Wallpaper & Panel Installer',
    icon: '📜',
    lucideIconName: 'Wallpaper',
    description: '3D customized wallpapers, PVC fluted charcoal louvers, acoustic wall padding & wainscoting',
    popularServices: ['Custom 3D Wallpaper Pasting', 'PVC Charcoal Fluted Louvers', 'Wooden Texture Wall Cladding', 'Acoustic Soundproofing Wall Panels', 'Custom Wall Mural & Border Fitting'],
  },
  // 26. Goods Transport / Pickup (Chota Hathi)
  {
    id: 'goods-transport',
    name: 'Goods Transport / Pickup (Chota Hathi)',
    icon: '🚚',
    lucideIconName: 'Truck',
    description: 'Tata Ace (Chota Hathi), pickup vehicles, room shifting, commercial cargo delivery & mini trucks',
    popularServices: ['Chota Hathi (Tata Ace) Local Trip', 'House & Room Shifting Transport', 'Commercial Shop Goods Delivery', 'Inter-City Highway Cargo Pickup', 'Urgent Doorstep Logistics Truck'],
  },
  // 27. Key Lock Maker
  {
    id: 'key-lock-maker',
    name: 'Key Lock Maker',
    icon: '🔑',
    lucideIconName: 'Key',
    description: 'Emergency door lock opening, duplicate computerized keys, smart digital lock installation',
    popularServices: ['Emergency Lockout Door Opening', 'Duplicate Computerized Key Making', 'Smart Biometric Lock Installation', 'Car Transponder Key Duplication', 'Heavy Master Padlock Servicing'],
    badge: 'Emergency',
  },
  // 28. Interior Designer
  {
    id: 'interior-designer',
    name: 'Interior Designer',
    icon: '🛋️',
    lucideIconName: 'Sparkles',
    description: 'Modular kitchen 3D layout, bedroom luxury wardrobe, living room makeover & full architecture',
    popularServices: ['3D Modular Kitchen Design', 'Full Home Interior Consultation', 'Custom Wardrobe & TV Unit Plan', 'Lighting & False Ceiling Architecture', 'Complete Residential Turnkey Project'],
  },
  // 29. Babysitter / Nurse
  {
    id: 'babysitter-nurse',
    name: 'Babysitter / Nurse',
    icon: '👶',
    lucideIconName: 'HeartHandshake',
    description: 'Experienced infant babysitting, elderly patient attendant, post-operative nursing & nanny',
    popularServices: ['Infant & Toddler Day Care Babysitting', 'Elderly Patient Bedside Nursing Attendant', 'Post-Surgery Home Care Support', 'Full-Day 12-Hour / 24-Hour Nanny', 'Mother & Newborn Care Assistance'],
  },
  // 30. Marriage Hall / Event Decorator
  {
    id: 'event-decorator',
    name: 'Marriage Hall / Event Decorator',
    icon: '🎪',
    lucideIconName: 'PartyPopper',
    description: 'Grand wedding stage decoration, fresh flower mandap setup, haldi/mehndi themes & ambient lighting',
    popularServices: ['Grand Wedding Stage & Floral Backdrop', 'Fresh Flower Mandap & Entry Arch', 'Haldi & Mehndi Traditional Theme Setup', 'DJ Truss, Spotlights & Ambient Lighting', 'Balloon & Theme Birthday Party Decor'],
  },
];
