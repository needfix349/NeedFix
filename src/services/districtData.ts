export interface IndianDistrict {
  id: string;
  name: string;
  hindiName?: string;
  state: string;
  latitude: number;
  longitude: number;
  isMajorCity?: boolean;
}

export const STATE_DISTRICTS: Record<string, IndianDistrict[]> = {
  'Andhra Pradesh': [
    { id: 'ap_1', name: 'Visakhapatnam', state: 'Andhra Pradesh', latitude: 17.6868, longitude: 83.2185, isMajorCity: true },
    { id: 'ap_2', name: 'Vijayawada', state: 'Andhra Pradesh', latitude: 16.5062, longitude: 80.6480, isMajorCity: true },
    { id: 'ap_3', name: 'Guntur', state: 'Andhra Pradesh', latitude: 16.3067, longitude: 80.4365 },
    { id: 'ap_4', name: 'Nellore', state: 'Andhra Pradesh', latitude: 14.4426, longitude: 79.9865 },
    { id: 'ap_5', name: 'Kurnool', state: 'Andhra Pradesh', latitude: 15.8281, longitude: 78.0373 },
    { id: 'ap_6', name: 'Tirupati', state: 'Andhra Pradesh', latitude: 13.6288, longitude: 79.4192, isMajorCity: true },
    { id: 'ap_7', name: 'Kakinada', state: 'Andhra Pradesh', latitude: 16.9891, longitude: 82.2475 },
    { id: 'ap_8', name: 'Rajahmundry', state: 'Andhra Pradesh', latitude: 17.0005, longitude: 81.8040 },
    { id: 'ap_9', name: 'Kadapa', state: 'Andhra Pradesh', latitude: 14.4673, longitude: 78.8242 },
    { id: 'ap_10', name: 'Anantapur', state: 'Andhra Pradesh', latitude: 14.6819, longitude: 77.6006 },
    { id: 'ap_11', name: 'Amaravati', state: 'Andhra Pradesh', latitude: 16.5417, longitude: 80.5150, isMajorCity: true },
    { id: 'ap_12', name: 'Eluru', state: 'Andhra Pradesh', latitude: 16.7107, longitude: 81.0952 },
  ],
  'Arunachal Pradesh': [
    { id: 'ar_1', name: 'Itanagar', state: 'Arunachal Pradesh', latitude: 27.0844, longitude: 93.6053, isMajorCity: true },
    { id: 'ar_2', name: 'Tawang', state: 'Arunachal Pradesh', latitude: 27.5861, longitude: 91.8594 },
    { id: 'ar_3', name: 'Pasighat', state: 'Arunachal Pradesh', latitude: 28.0667, longitude: 95.3333 },
    { id: 'ar_4', name: 'Naharlagun', state: 'Arunachal Pradesh', latitude: 27.1084, longitude: 93.6946 },
    { id: 'ar_5', name: 'Ziro', state: 'Arunachal Pradesh', latitude: 27.5333, longitude: 93.8333 },
    { id: 'ar_6', name: 'Bomdila', state: 'Arunachal Pradesh', latitude: 27.2645, longitude: 92.4159 },
  ],
  'Assam': [
    { id: 'as_1', name: 'Guwahati (Kamrup)', state: 'Assam', latitude: 26.1445, longitude: 91.7362, isMajorCity: true },
    { id: 'as_2', name: 'Silchar (Cachar)', state: 'Assam', latitude: 24.8333, longitude: 92.7789 },
    { id: 'as_3', name: 'Dibrugarh', state: 'Assam', latitude: 27.4728, longitude: 94.9120 },
    { id: 'as_4', name: 'Jorhat', state: 'Assam', latitude: 26.7509, longitude: 94.2037 },
    { id: 'as_5', name: 'Nagaon', state: 'Assam', latitude: 26.3467, longitude: 92.6840 },
    { id: 'as_6', name: 'Tinsukia', state: 'Assam', latitude: 27.4922, longitude: 95.3468 },
    { id: 'as_7', name: 'Tezpur', state: 'Assam', latitude: 26.6528, longitude: 92.7926 },
    { id: 'as_8', name: 'Bongaigaon', state: 'Assam', latitude: 26.5028, longitude: 90.5592 },
  ],
  'Bihar': [
    { id: 'br_1', name: 'Patna', state: 'Bihar', latitude: 25.5941, longitude: 85.1376, isMajorCity: true },
    { id: 'br_2', name: 'Gaya', state: 'Bihar', latitude: 24.7914, longitude: 85.0002, isMajorCity: true },
    { id: 'br_3', name: 'Bhagalpur', state: 'Bihar', latitude: 25.2425, longitude: 86.9842, isMajorCity: true },
    { id: 'br_4', name: 'Muzaffarpur', state: 'Bihar', latitude: 26.1209, longitude: 85.3647, isMajorCity: true },
    { id: 'br_5', name: 'Purnia', state: 'Bihar', latitude: 25.7771, longitude: 87.4753 },
    { id: 'br_6', name: 'Darbhanga', state: 'Bihar', latitude: 26.1542, longitude: 85.8918 },
    { id: 'br_7', name: 'Bihar Sharif (Nalanda)', state: 'Bihar', latitude: 25.1982, longitude: 85.5149 },
    { id: 'br_8', name: 'Arrah (Bhojpur)', state: 'Bihar', latitude: 25.5541, longitude: 84.6641 },
    { id: 'br_9', name: 'Begusarai', state: 'Bihar', latitude: 25.4182, longitude: 86.1272 },
    { id: 'br_10', name: 'Katihar', state: 'Bihar', latitude: 25.5541, longitude: 87.5684 },
    { id: 'br_11', name: 'Munger', state: 'Bihar', latitude: 25.3757, longitude: 86.4744 },
    { id: 'br_12', name: 'Chhapra (Saran)', state: 'Bihar', latitude: 25.7848, longitude: 84.7274 },
    { id: 'br_13', name: 'Samastipur', state: 'Bihar', latitude: 25.8628, longitude: 85.7811 },
    { id: 'br_14', name: 'Motihari (East Champaran)', state: 'Bihar', latitude: 26.6469, longitude: 84.9089 },
    { id: 'br_15', name: 'Sasaram (Rohtas)', state: 'Bihar', latitude: 24.9525, longitude: 84.0315 },
    { id: 'br_16', name: 'Bettiah (West Champaran)', state: 'Bihar', latitude: 26.8024, longitude: 84.5028 },
    { id: 'br_17', name: 'Hajipur (Vaishali)', state: 'Bihar', latitude: 25.6858, longitude: 85.2146 },
    { id: 'br_18', name: 'Siwan', state: 'Bihar', latitude: 26.2243, longitude: 84.3596 },
    { id: 'br_19', name: 'Buxar', state: 'Bihar', latitude: 25.5647, longitude: 83.9777 },
    { id: 'br_20', name: 'Madhubani', state: 'Bihar', latitude: 26.3541, longitude: 86.0718 },
    { id: 'br_21', name: 'Saharsa', state: 'Bihar', latitude: 25.8835, longitude: 86.6006 },
    { id: 'br_22', name: 'Sitamarhi', state: 'Bihar', latitude: 26.5937, longitude: 85.4894 },
    { id: 'br_23', name: 'Nawada', state: 'Bihar', latitude: 24.8872, longitude: 85.5434 },
  ],
  'Chhattisgarh': [
    { id: 'cg_1', name: 'Raipur', state: 'Chhattisgarh', latitude: 21.2514, longitude: 81.6296, isMajorCity: true },
    { id: 'cg_2', name: 'Bhilai - Durg', state: 'Chhattisgarh', latitude: 21.1938, longitude: 81.3509, isMajorCity: true },
    { id: 'cg_3', name: 'Bilaspur', state: 'Chhattisgarh', latitude: 22.0797, longitude: 82.1409 },
    { id: 'cg_4', name: 'Korba', state: 'Chhattisgarh', latitude: 22.3595, longitude: 82.7501 },
    { id: 'cg_5', name: 'Rajnandgaon', state: 'Chhattisgarh', latitude: 21.0973, longitude: 81.0367 },
    { id: 'cg_6', name: 'Jagdalpur (Bastar)', state: 'Chhattisgarh', latitude: 19.0744, longitude: 82.0089 },
    { id: 'cg_7', name: 'Ambikapur (Surguja)', state: 'Chhattisgarh', latitude: 23.1186, longitude: 83.1979 },
    { id: 'cg_8', name: 'Raigarh', state: 'Chhattisgarh', latitude: 21.8974, longitude: 83.3950 },
  ],
  'Goa': [
    { id: 'ga_1', name: 'Panaji (North Goa)', state: 'Goa', latitude: 15.4909, longitude: 73.8278, isMajorCity: true },
    { id: 'ga_2', name: 'Margao (South Goa)', state: 'Goa', latitude: 15.2736, longitude: 73.9582, isMajorCity: true },
    { id: 'ga_3', name: 'Vasco da Gama', state: 'Goa', latitude: 15.3982, longitude: 73.8113 },
    { id: 'ga_4', name: 'Mapusa', state: 'Goa', latitude: 15.5937, longitude: 73.8142 },
    { id: 'ga_5', name: 'Ponda', state: 'Goa', latitude: 15.4026, longitude: 74.0150 },
    { id: 'ga_6', name: 'Calangute - Candolim', state: 'Goa', latitude: 15.5439, longitude: 73.7553 },
  ],
  'Gujarat': [
    { id: 'gj_1', name: 'Ahmedabad', state: 'Gujarat', latitude: 23.0225, longitude: 72.5714, isMajorCity: true },
    { id: 'gj_2', name: 'Surat', state: 'Gujarat', latitude: 21.1702, longitude: 72.8311, isMajorCity: true },
    { id: 'gj_3', name: 'Vadodara', state: 'Gujarat', latitude: 22.3072, longitude: 73.1812, isMajorCity: true },
    { id: 'gj_4', name: 'Rajkot', state: 'Gujarat', latitude: 22.3039, longitude: 70.8022, isMajorCity: true },
    { id: 'gj_5', name: 'Bhavnagar', state: 'Gujarat', latitude: 21.7645, longitude: 72.1519 },
    { id: 'gj_6', name: 'Jamnagar', state: 'Gujarat', latitude: 22.4707, longitude: 70.0577 },
    { id: 'gj_7', name: 'Gandhinagar', state: 'Gujarat', latitude: 23.2156, longitude: 72.6369 },
    { id: 'gj_8', name: 'Junagadh', state: 'Gujarat', latitude: 21.5222, longitude: 70.4579 },
    { id: 'gj_9', name: 'Anand', state: 'Gujarat', latitude: 22.5645, longitude: 72.9289 },
    { id: 'gj_10', name: 'Navsari', state: 'Gujarat', latitude: 20.9467, longitude: 72.9520 },
    { id: 'gj_11', name: 'Morbi', state: 'Gujarat', latitude: 22.8120, longitude: 70.8378 },
    { id: 'gj_12', name: 'Bharuch', state: 'Gujarat', latitude: 21.7051, longitude: 72.9959 },
    { id: 'gj_13', name: 'Mehsana', state: 'Gujarat', latitude: 23.5880, longitude: 72.3693 },
    { id: 'gj_14', name: 'Vapi - Valsad', state: 'Gujarat', latitude: 20.3893, longitude: 72.9106 },
  ],
  'Haryana': [
    { id: 'hr_1', name: 'Gurugram', state: 'Haryana', latitude: 28.4595, longitude: 77.0266, isMajorCity: true },
    { id: 'hr_2', name: 'Faridabad', state: 'Haryana', latitude: 28.4089, longitude: 77.3178, isMajorCity: true },
    { id: 'hr_3', name: 'Panipat', state: 'Haryana', latitude: 29.3909, longitude: 76.9635 },
    { id: 'hr_4', name: 'Ambala', state: 'Haryana', latitude: 30.3782, longitude: 76.7767 },
    { id: 'hr_5', name: 'Yamunanagar', state: 'Haryana', latitude: 30.1290, longitude: 77.2674 },
    { id: 'hr_6', name: 'Rohtak', state: 'Haryana', latitude: 28.8955, longitude: 76.6066 },
    { id: 'hr_7', name: 'Hisar', state: 'Haryana', latitude: 29.1492, longitude: 75.7217 },
    { id: 'hr_8', name: 'Karnal', state: 'Haryana', latitude: 29.6857, longitude: 76.9905 },
    { id: 'hr_9', name: 'Sonipat', state: 'Haryana', latitude: 28.9931, longitude: 77.0151 },
    { id: 'hr_10', name: 'Panchkula', state: 'Haryana', latitude: 30.6942, longitude: 76.8606 },
    { id: 'hr_11', name: 'Sirsa', state: 'Haryana', latitude: 29.5349, longitude: 75.0298 },
    { id: 'hr_12', name: 'Rewari', state: 'Haryana', latitude: 28.1834, longitude: 76.6191 },
  ],
  'Himachal Pradesh': [
    { id: 'hp_1', name: 'Shimla', state: 'Himachal Pradesh', latitude: 31.1048, longitude: 77.1734, isMajorCity: true },
    { id: 'hp_2', name: 'Dharamshala (Kangra)', state: 'Himachal Pradesh', latitude: 32.2190, longitude: 76.3234 },
    { id: 'hp_3', name: 'Mandi', state: 'Himachal Pradesh', latitude: 31.7087, longitude: 76.9320 },
    { id: 'hp_4', name: 'Solan', state: 'Himachal Pradesh', latitude: 30.9045, longitude: 77.0967 },
    { id: 'hp_5', name: 'Kullu - Manali', state: 'Himachal Pradesh', latitude: 31.9579, longitude: 77.1095 },
    { id: 'hp_6', name: 'Hamirpur', state: 'Himachal Pradesh', latitude: 31.6862, longitude: 76.5213 },
    { id: 'hp_7', name: 'Una', state: 'Himachal Pradesh', latitude: 31.4685, longitude: 76.2708 },
    { id: 'hp_8', name: 'Bilaspur', state: 'Himachal Pradesh', latitude: 31.3326, longitude: 76.7589 },
  ],
  'Jharkhand': [
    { id: 'jh_2', name: 'Jamshedpur (East Singhbhum)', state: 'Jharkhand', latitude: 22.8046, longitude: 86.2029, isMajorCity: true },
    { id: 'jh_1', name: 'Ranchi', state: 'Jharkhand', latitude: 23.3441, longitude: 85.3096, isMajorCity: true },
    { id: 'jh_3', name: 'Dhanbad', state: 'Jharkhand', latitude: 23.7957, longitude: 86.4304, isMajorCity: true },
    { id: 'jh_4', name: 'Bokaro Steel City', state: 'Jharkhand', latitude: 23.6693, longitude: 86.1511 },
    { id: 'jh_5', name: 'Deoghar', state: 'Jharkhand', latitude: 24.4826, longitude: 86.7000 },
    { id: 'jh_6', name: 'Hazaribagh', state: 'Jharkhand', latitude: 23.9925, longitude: 85.3637 },
    { id: 'jh_7', name: 'Giridih', state: 'Jharkhand', latitude: 24.1869, longitude: 86.3092 },
    { id: 'jh_8', name: 'Ramgarh', state: 'Jharkhand', latitude: 23.6334, longitude: 85.5144 },
    { id: 'jh_9', name: 'Medininagar (Palamu)', state: 'Jharkhand', latitude: 24.0402, longitude: 84.0722 },
  ],
  'Karnataka': [
    { id: 'ka_1', name: 'Bengaluru Urban', state: 'Karnataka', latitude: 12.9716, longitude: 77.5946, isMajorCity: true },
    { id: 'ka_2', name: 'Mysuru', state: 'Karnataka', latitude: 12.2958, longitude: 76.6394, isMajorCity: true },
    { id: 'ka_3', name: 'Mangaluru (Dakshina Kannada)', state: 'Karnataka', latitude: 12.9141, longitude: 74.8560, isMajorCity: true },
    { id: 'ka_4', name: 'Hubballi - Dharwad', state: 'Karnataka', latitude: 15.3647, longitude: 75.1240, isMajorCity: true },
    { id: 'ka_5', name: 'Belagavi', state: 'Karnataka', latitude: 15.8497, longitude: 74.4977 },
    { id: 'ka_6', name: 'Kalaburagi (Gulbarga)', state: 'Karnataka', latitude: 17.3297, longitude: 76.8343 },
    { id: 'ka_7', name: 'Davanagere', state: 'Karnataka', latitude: 14.4644, longitude: 75.9218 },
    { id: 'ka_8', name: 'Ballari', state: 'Karnataka', latitude: 15.1394, longitude: 76.9214 },
    { id: 'ka_9', name: 'Shivamogga', state: 'Karnataka', latitude: 13.9299, longitude: 75.5681 },
    { id: 'ka_10', name: 'Tumakuru', state: 'Karnataka', latitude: 13.3379, longitude: 77.1010 },
    { id: 'ka_11', name: 'Udupi - Manipal', state: 'Karnataka', latitude: 13.3409, longitude: 74.7421 },
    { id: 'ka_12', name: 'Hassan', state: 'Karnataka', latitude: 13.0033, longitude: 76.1004 },
  ],
  'Kerala': [
    { id: 'kl_1', name: 'Thiruvananthapuram', state: 'Kerala', latitude: 8.5241, longitude: 76.9366, isMajorCity: true },
    { id: 'kl_2', name: 'Kochi (Ernakulam)', state: 'Kerala', latitude: 9.9312, longitude: 76.2673, isMajorCity: true },
    { id: 'kl_3', name: 'Kozhikode (Calicut)', state: 'Kerala', latitude: 11.2588, longitude: 75.7804, isMajorCity: true },
    { id: 'kl_4', name: 'Thrissur', state: 'Kerala', latitude: 10.5276, longitude: 76.2144 },
    { id: 'kl_5', name: 'Kollam', state: 'Kerala', latitude: 8.8932, longitude: 76.6141 },
    { id: 'kl_6', name: 'Palakkad', state: 'Kerala', latitude: 10.7867, longitude: 76.6548 },
    { id: 'kl_7', name: 'Alappuzha', state: 'Kerala', latitude: 9.4981, longitude: 76.3388 },
    { id: 'kl_8', name: 'Kannur', state: 'Kerala', latitude: 11.8745, longitude: 75.3704 },
    { id: 'kl_9', name: 'Kottayam', state: 'Kerala', latitude: 9.5916, longitude: 76.5222 },
    { id: 'kl_10', name: 'Malappuram', state: 'Kerala', latitude: 11.0510, longitude: 76.0711 },
  ],
  'Madhya Pradesh': [
    { id: 'mp_1', name: 'Bhopal', state: 'Madhya Pradesh', latitude: 23.2599, longitude: 77.4126, isMajorCity: true },
    { id: 'mp_2', name: 'Indore', state: 'Madhya Pradesh', latitude: 22.7196, longitude: 75.8577, isMajorCity: true },
    { id: 'mp_3', name: 'Gwalior', state: 'Madhya Pradesh', latitude: 26.2183, longitude: 78.1828, isMajorCity: true },
    { id: 'mp_4', name: 'Jabalpur', state: 'Madhya Pradesh', latitude: 23.1815, longitude: 79.9864, isMajorCity: true },
    { id: 'mp_5', name: 'Ujjain', state: 'Madhya Pradesh', latitude: 23.1765, longitude: 75.7885 },
    { id: 'mp_6', name: 'Sagar', state: 'Madhya Pradesh', latitude: 23.8388, longitude: 78.7378 },
    { id: 'mp_7', name: 'Dewas', state: 'Madhya Pradesh', latitude: 22.9676, longitude: 76.0534 },
    { id: 'mp_8', name: 'Satna', state: 'Madhya Pradesh', latitude: 24.6005, longitude: 80.8322 },
    { id: 'mp_9', name: 'Ratlam', state: 'Madhya Pradesh', latitude: 23.3315, longitude: 75.0367 },
    { id: 'mp_10', name: 'Rewa', state: 'Madhya Pradesh', latitude: 24.5373, longitude: 81.3042 },
    { id: 'mp_11', name: 'Singrauli', state: 'Madhya Pradesh', latitude: 24.1998, longitude: 82.6645 },
    { id: 'mp_12', name: 'Chhindwara', state: 'Madhya Pradesh', latitude: 22.0574, longitude: 78.9382 },
  ],
  'Maharashtra': [
    { id: 'mh_1', name: 'Mumbai City & Suburban', state: 'Maharashtra', latitude: 19.0760, longitude: 72.8777, isMajorCity: true },
    { id: 'mh_2', name: 'Pune', state: 'Maharashtra', latitude: 18.5204, longitude: 73.8567, isMajorCity: true },
    { id: 'mh_3', name: 'Nagpur', state: 'Maharashtra', latitude: 21.1458, longitude: 79.0882, isMajorCity: true },
    { id: 'mh_4', name: 'Thane', state: 'Maharashtra', latitude: 19.2183, longitude: 72.9781, isMajorCity: true },
    { id: 'mh_5', name: 'Nashik', state: 'Maharashtra', latitude: 19.9975, longitude: 73.7898, isMajorCity: true },
    { id: 'mh_6', name: 'Chhatrapati Sambhajinagar (Aurangabad)', state: 'Maharashtra', latitude: 19.8762, longitude: 75.3433 },
    { id: 'mh_7', name: 'Solapur', state: 'Maharashtra', latitude: 17.6599, longitude: 75.9064 },
    { id: 'mh_8', name: 'Kolhapur', state: 'Maharashtra', latitude: 16.7050, longitude: 74.2433 },
    { id: 'mh_9', name: 'Navi Mumbai', state: 'Maharashtra', latitude: 19.0330, longitude: 73.0297, isMajorCity: true },
    { id: 'mh_10', name: 'Amravati', state: 'Maharashtra', latitude: 20.9374, longitude: 77.7796 },
    { id: 'mh_11', name: 'Jalgaon', state: 'Maharashtra', latitude: 21.0077, longitude: 75.5626 },
    { id: 'mh_12', name: 'Akola', state: 'Maharashtra', latitude: 20.7002, longitude: 77.0082 },
    { id: 'mh_13', name: 'Nanded', state: 'Maharashtra', latitude: 19.1383, longitude: 77.3210 },
    { id: 'mh_14', name: 'Sangli - Miraj', state: 'Maharashtra', latitude: 16.8524, longitude: 74.5815 },
    { id: 'mh_15', name: 'Latur', state: 'Maharashtra', latitude: 18.4088, longitude: 76.5604 },
    { id: 'mh_16', name: 'Ahmednagar', state: 'Maharashtra', latitude: 19.0952, longitude: 74.7496 },
  ],
  'Manipur': [
    { id: 'mn_1', name: 'Imphal West', state: 'Manipur', latitude: 24.8170, longitude: 93.9368, isMajorCity: true },
    { id: 'mn_2', name: 'Imphal East', state: 'Manipur', latitude: 24.8123, longitude: 93.9610 },
    { id: 'mn_3', name: 'Churachandpur', state: 'Manipur', latitude: 24.3333, longitude: 93.6833 },
    { id: 'mn_4', name: 'Thoubal', state: 'Manipur', latitude: 24.6333, longitude: 93.9833 },
    { id: 'mn_5', name: 'Bishnupur', state: 'Manipur', latitude: 24.6333, longitude: 93.7667 },
  ],
  'Meghalaya': [
    { id: 'ml_1', name: 'East Khasi Hills (Shillong)', state: 'Meghalaya', latitude: 25.5788, longitude: 91.8933, isMajorCity: true },
    { id: 'ml_2', name: 'West Garo Hills (Tura)', state: 'Meghalaya', latitude: 25.5144, longitude: 90.2030 },
    { id: 'ml_3', name: 'West Jaintia Hills (Jowai)', state: 'Meghalaya', latitude: 25.4500, longitude: 92.2000 },
    { id: 'ml_4', name: 'Ri-Bhoi (Nongpoh)', state: 'Meghalaya', latitude: 25.9000, longitude: 91.8833 },
  ],
  'Mizoram': [
    { id: 'mz_1', name: 'Aizawl', state: 'Mizoram', latitude: 23.7271, longitude: 92.7176, isMajorCity: true },
    { id: 'mz_2', name: 'Lunglei', state: 'Mizoram', latitude: 22.8833, longitude: 92.7333 },
    { id: 'mz_3', name: 'Champhai', state: 'Mizoram', latitude: 23.4667, longitude: 93.3333 },
    { id: 'mz_4', name: 'Kolasib', state: 'Mizoram', latitude: 24.2333, longitude: 92.6833 },
  ],
  'Nagaland': [
    { id: 'nl_1', name: 'Kohima', state: 'Nagaland', latitude: 25.6751, longitude: 94.1086, isMajorCity: true },
    { id: 'nl_2', name: 'Dimapur', state: 'Nagaland', latitude: 25.9090, longitude: 93.7270, isMajorCity: true },
    { id: 'nl_3', name: 'Mokokchung', state: 'Nagaland', latitude: 26.3256, longitude: 94.5160 },
    { id: 'nl_4', name: 'Wokha', state: 'Nagaland', latitude: 26.1000, longitude: 94.2667 },
  ],
  'Odisha': [
    { id: 'od_1', name: 'Bhubaneswar (Khurda)', state: 'Odisha', latitude: 20.2961, longitude: 85.8245, isMajorCity: true },
    { id: 'od_2', name: 'Cuttack', state: 'Odisha', latitude: 20.4625, longitude: 85.8828, isMajorCity: true },
    { id: 'od_3', name: 'Rourkela (Sundargarh)', state: 'Odisha', latitude: 22.2604, longitude: 84.8536, isMajorCity: true },
    { id: 'od_4', name: 'Berhampur (Ganjam)', state: 'Odisha', latitude: 19.3150, longitude: 84.7941 },
    { id: 'od_5', name: 'Sambalpur', state: 'Odisha', latitude: 21.4669, longitude: 83.9812 },
    { id: 'od_6', name: 'Puri', state: 'Odisha', latitude: 19.8135, longitude: 85.8312 },
    { id: 'od_7', name: 'Balasore', state: 'Odisha', latitude: 21.4934, longitude: 86.9135 },
    { id: 'od_8', name: 'Bhadrak', state: 'Odisha', latitude: 21.0544, longitude: 86.5147 },
  ],
  'Punjab': [
    { id: 'pb_1', name: 'Ludhiana', state: 'Punjab', latitude: 30.9010, longitude: 75.8573, isMajorCity: true },
    { id: 'pb_2', name: 'Amritsar', state: 'Punjab', latitude: 31.6340, longitude: 74.8723, isMajorCity: true },
    { id: 'pb_3', name: 'Jalandhar', state: 'Punjab', latitude: 31.3260, longitude: 75.5762, isMajorCity: true },
    { id: 'pb_4', name: 'Patiala', state: 'Punjab', latitude: 30.3398, longitude: 76.3869 },
    { id: 'pb_5', name: 'Bathinda', state: 'Punjab', latitude: 30.2110, longitude: 74.9455 },
    { id: 'pb_6', name: 'Mohali (SAS Nagar)', state: 'Punjab', latitude: 30.7046, longitude: 76.7179, isMajorCity: true },
    { id: 'pb_7', name: 'Hoshiarpur', state: 'Punjab', latitude: 31.5273, longitude: 75.9142 },
    { id: 'pb_8', name: 'Pathankot', state: 'Punjab', latitude: 32.2643, longitude: 75.6521 },
    { id: 'pb_9', name: 'Moga', state: 'Punjab', latitude: 30.8165, longitude: 75.1717 },
  ],
  'Rajasthan': [
    { id: 'rj_1', name: 'Jaipur', state: 'Rajasthan', latitude: 26.9124, longitude: 75.7873, isMajorCity: true },
    { id: 'rj_2', name: 'Jodhpur', state: 'Rajasthan', latitude: 26.2389, longitude: 73.0243, isMajorCity: true },
    { id: 'rj_3', name: 'Kota', state: 'Rajasthan', latitude: 25.2138, longitude: 75.8648, isMajorCity: true },
    { id: 'rj_4', name: 'Bikaner', state: 'Rajasthan', latitude: 28.0229, longitude: 73.3119 },
    { id: 'rj_5', name: 'Ajmer', state: 'Rajasthan', latitude: 26.4499, longitude: 74.6399 },
    { id: 'rj_6', name: 'Udaipur', state: 'Rajasthan', latitude: 24.5854, longitude: 73.7125, isMajorCity: true },
    { id: 'rj_7', name: 'Bhilwara', state: 'Rajasthan', latitude: 25.3407, longitude: 74.6313 },
    { id: 'rj_8', name: 'Alwar', state: 'Rajasthan', latitude: 27.5530, longitude: 76.6346 },
    { id: 'rj_9', name: 'Sikar', state: 'Rajasthan', latitude: 27.6094, longitude: 75.1398 },
    { id: 'rj_10', name: 'Sri Ganganagar', state: 'Rajasthan', latitude: 29.9038, longitude: 73.8772 },
    { id: 'rj_11', name: 'Bharatpur', state: 'Rajasthan', latitude: 27.2152, longitude: 77.5030 },
    { id: 'rj_12', name: 'Pali', state: 'Rajasthan', latitude: 25.7711, longitude: 73.3234 },
  ],
  'Sikkim': [
    { id: 'sk_1', name: 'Gangtok (East Sikkim)', state: 'Sikkim', latitude: 27.3389, longitude: 88.6065, isMajorCity: true },
    { id: 'sk_2', name: 'Namchi (South Sikkim)', state: 'Sikkim', latitude: 27.1667, longitude: 88.3500 },
    { id: 'sk_3', name: 'Gyalshing (West Sikkim)', state: 'Sikkim', latitude: 27.2833, longitude: 88.2500 },
    { id: 'sk_4', name: 'Mangan (North Sikkim)', state: 'Sikkim', latitude: 27.5000, longitude: 88.5333 },
  ],
  'Tamil Nadu': [
    { id: 'tn_1', name: 'Chennai', state: 'Tamil Nadu', latitude: 13.0827, longitude: 80.2707, isMajorCity: true },
    { id: 'tn_2', name: 'Coimbatore', state: 'Tamil Nadu', latitude: 11.0168, longitude: 76.9558, isMajorCity: true },
    { id: 'tn_3', name: 'Madurai', state: 'Tamil Nadu', latitude: 9.9252, longitude: 78.1198, isMajorCity: true },
    { id: 'tn_4', name: 'Tiruchirappalli (Trichy)', state: 'Tamil Nadu', latitude: 10.7905, longitude: 78.7047 },
    { id: 'tn_5', name: 'Salem', state: 'Tamil Nadu', latitude: 11.6643, longitude: 78.1460 },
    { id: 'tn_6', name: 'Tiruppur', state: 'Tamil Nadu', latitude: 11.1085, longitude: 77.3411 },
    { id: 'tn_7', name: 'Erode', state: 'Tamil Nadu', latitude: 11.3410, longitude: 77.7172 },
    { id: 'tn_8', name: 'Tirunelveli', state: 'Tamil Nadu', latitude: 8.7139, longitude: 77.7567 },
    { id: 'tn_9', name: 'Vellore', state: 'Tamil Nadu', latitude: 12.9165, longitude: 79.1325 },
    { id: 'tn_10', name: 'Thoothukudi', state: 'Tamil Nadu', latitude: 8.7642, longitude: 78.1348 },
    { id: 'tn_11', name: 'Thanjavur', state: 'Tamil Nadu', latitude: 10.7870, longitude: 79.1378 },
  ],
  'Telangana': [
    { id: 'tg_1', name: 'Hyderabad - Secunderabad', state: 'Telangana', latitude: 17.3850, longitude: 78.4867, isMajorCity: true },
    { id: 'tg_2', name: 'Warangal - Hanamkonda', state: 'Telangana', latitude: 17.9689, longitude: 79.5941, isMajorCity: true },
    { id: 'tg_3', name: 'Nizamabad', state: 'Telangana', latitude: 18.6725, longitude: 78.0941 },
    { id: 'tg_4', name: 'Karimnagar', state: 'Telangana', latitude: 18.4386, longitude: 79.1288 },
    { id: 'tg_5', name: 'Khammam', state: 'Telangana', latitude: 17.2473, longitude: 80.1514 },
    { id: 'tg_6', name: 'Ramagundam', state: 'Telangana', latitude: 18.7568, longitude: 79.4756 },
    { id: 'tg_7', name: 'Mahbubnagar', state: 'Telangana', latitude: 16.7488, longitude: 77.9855 },
    { id: 'tg_8', name: 'Nalgonda', state: 'Telangana', latitude: 17.0577, longitude: 79.2684 },
  ],
  'Tripura': [
    { id: 'tr_1', name: 'Agartala (West Tripura)', state: 'Tripura', latitude: 23.8315, longitude: 91.2868, isMajorCity: true },
    { id: 'tr_2', name: 'Udaipur (Gomati)', state: 'Tripura', latitude: 23.5333, longitude: 91.4833 },
    { id: 'tr_3', name: 'Dharmanagar (North Tripura)', state: 'Tripura', latitude: 24.3833, longitude: 92.1667 },
    { id: 'tr_4', name: 'Khowai', state: 'Tripura', latitude: 24.0625, longitude: 91.6056 },
  ],
  'Uttar Pradesh': [
    { id: 'up_1', name: 'Lucknow', state: 'Uttar Pradesh', latitude: 26.8467, longitude: 80.9462, isMajorCity: true },
    { id: 'up_2', name: 'Kanpur', state: 'Uttar Pradesh', latitude: 26.4499, longitude: 80.3319, isMajorCity: true },
    { id: 'up_3', name: 'Varanasi', state: 'Uttar Pradesh', latitude: 25.3176, longitude: 82.9739, isMajorCity: true },
    { id: 'up_4', name: 'Noida (Gautam Buddha Nagar)', state: 'Uttar Pradesh', latitude: 28.5355, longitude: 77.3910, isMajorCity: true },
    { id: 'up_5', name: 'Ghaziabad', state: 'Uttar Pradesh', latitude: 28.6692, longitude: 77.4538, isMajorCity: true },
    { id: 'up_6', name: 'Agra', state: 'Uttar Pradesh', latitude: 27.1767, longitude: 78.0081, isMajorCity: true },
    { id: 'up_7', name: 'Prayagraj (Allahabad)', state: 'Uttar Pradesh', latitude: 25.4358, longitude: 81.8463, isMajorCity: true },
    { id: 'up_8', name: 'Meerut', state: 'Uttar Pradesh', latitude: 28.9845, longitude: 77.7064 },
    { id: 'up_9', name: 'Bareilly', state: 'Uttar Pradesh', latitude: 28.3670, longitude: 79.4304 },
    { id: 'up_10', name: 'Aligarh', state: 'Uttar Pradesh', latitude: 27.8974, longitude: 78.0880 },
    { id: 'up_11', name: 'Moradabad', state: 'Uttar Pradesh', latitude: 28.8386, longitude: 78.7733 },
    { id: 'up_12', name: 'Saharanpur', state: 'Uttar Pradesh', latitude: 29.9640, longitude: 77.5460 },
    { id: 'up_13', name: 'Gorakhpur', state: 'Uttar Pradesh', latitude: 26.7606, longitude: 83.3732 },
    { id: 'up_14', name: 'Firozabad', state: 'Uttar Pradesh', latitude: 27.1591, longitude: 78.3957 },
    { id: 'up_15', name: 'Jhansi', state: 'Uttar Pradesh', latitude: 25.4484, longitude: 78.5685 },
    { id: 'up_16', name: 'Muzaffarnagar', state: 'Uttar Pradesh', latitude: 29.4727, longitude: 77.7085 },
    { id: 'up_17', name: 'Mathura', state: 'Uttar Pradesh', latitude: 27.4924, longitude: 77.6737 },
    { id: 'up_18', name: 'Ayodhya (Faizabad)', state: 'Uttar Pradesh', latitude: 26.7922, longitude: 82.1998 },
    { id: 'up_19', name: 'Greater Noida', state: 'Uttar Pradesh', latitude: 28.4744, longitude: 77.5040 },
  ],
  'Uttarakhand': [
    { id: 'uk_1', name: 'Dehradun', state: 'Uttarakhand', latitude: 30.3165, longitude: 78.0322, isMajorCity: true },
    { id: 'uk_2', name: 'Haridwar', state: 'Uttarakhand', latitude: 29.9457, longitude: 78.1642, isMajorCity: true },
    { id: 'uk_3', name: 'Roorkee', state: 'Uttarakhand', latitude: 29.8543, longitude: 77.8880 },
    { id: 'uk_4', name: 'Haldwani - Kathgodam', state: 'Uttarakhand', latitude: 29.2183, longitude: 79.5130 },
    { id: 'uk_5', name: 'Nainital', state: 'Uttarakhand', latitude: 29.3919, longitude: 79.4542 },
    { id: 'uk_6', name: 'Rudrapur (Udham Singh Nagar)', state: 'Uttarakhand', latitude: 28.9800, longitude: 79.4000 },
    { id: 'uk_7', name: 'Rishikesh', state: 'Uttarakhand', latitude: 30.0869, longitude: 78.2676 },
    { id: 'uk_8', name: 'Almora', state: 'Uttarakhand', latitude: 29.5971, longitude: 79.6591 },
  ],
  'West Bengal': [
    { id: 'wb_1', name: 'Kolkata', state: 'West Bengal', latitude: 22.5726, longitude: 88.3639, isMajorCity: true },
    { id: 'wb_2', name: 'Howrah', state: 'West Bengal', latitude: 22.5958, longitude: 88.2636, isMajorCity: true },
    { id: 'wb_3', name: 'North 24 Parganas (Barasat/Salt Lake)', state: 'West Bengal', latitude: 22.7230, longitude: 88.4810 },
    { id: 'wb_4', name: 'South 24 Parganas (Jadavpur/Sonarpur)', state: 'West Bengal', latitude: 22.4200, longitude: 88.4100 },
    { id: 'wb_5', name: 'Siliguri (Darjeeling)', state: 'West Bengal', latitude: 26.7271, longitude: 88.3953, isMajorCity: true },
    { id: 'wb_6', name: 'Asansol (Paschim Bardhaman)', state: 'West Bengal', latitude: 23.6739, longitude: 86.9524 },
    { id: 'wb_7', name: 'Durgapur', state: 'West Bengal', latitude: 23.5204, longitude: 87.3119 },
    { id: 'wb_8', name: 'Bardhaman', state: 'West Bengal', latitude: 23.2324, longitude: 87.8615 },
    { id: 'wb_9', name: 'Malda', state: 'West Bengal', latitude: 25.0108, longitude: 88.1411 },
    { id: 'wb_10', name: 'Kharagpur (Paschim Medinipur)', state: 'West Bengal', latitude: 22.3460, longitude: 87.2320 },
  ],
  // Union Territories
  'Delhi (NCT)': [
    { id: 'dl_1', name: 'Central Delhi (Connaught Place)', state: 'Delhi (NCT)', latitude: 28.6139, longitude: 77.2090, isMajorCity: true },
    { id: 'dl_2', name: 'South Delhi (Saket / Hauz Khas / Lajpat Nagar)', state: 'Delhi (NCT)', latitude: 28.5245, longitude: 77.2066, isMajorCity: true },
    { id: 'dl_3', name: 'North Delhi (Civil Lines / Model Town)', state: 'Delhi (NCT)', latitude: 28.6892, longitude: 77.2081 },
    { id: 'dl_4', name: 'West Delhi (Janakpuri / Rajouri Garden)', state: 'Delhi (NCT)', latitude: 28.6219, longitude: 77.0878 },
    { id: 'dl_5', name: 'East Delhi (Laxmi Nagar / Mayur Vihar)', state: 'Delhi (NCT)', latitude: 28.6280, longitude: 77.2950 },
    { id: 'dl_6', name: 'Rohini & Pitampura (North West Delhi)', state: 'Delhi (NCT)', latitude: 28.7495, longitude: 77.0565 },
    { id: 'dl_7', name: 'Dwarka (South West Delhi)', state: 'Delhi (NCT)', latitude: 28.5921, longitude: 77.0460 },
  ],
  'Jammu and Kashmir': [
    { id: 'jk_1', name: 'Srinagar', state: 'Jammu and Kashmir', latitude: 34.0837, longitude: 74.7973, isMajorCity: true },
    { id: 'jk_2', name: 'Jammu', state: 'Jammu and Kashmir', latitude: 32.7266, longitude: 74.8570, isMajorCity: true },
    { id: 'jk_3', name: 'Anantnag', state: 'Jammu and Kashmir', latitude: 33.7311, longitude: 75.1522 },
    { id: 'jk_4', name: 'Baramulla', state: 'Jammu and Kashmir', latitude: 34.1980, longitude: 74.3636 },
    { id: 'jk_5', name: 'Udhampur', state: 'Jammu and Kashmir', latitude: 32.9250, longitude: 75.1417 },
  ],
  'Ladakh': [
    { id: 'la_1', name: 'Leh', state: 'Ladakh', latitude: 34.1526, longitude: 77.5771, isMajorCity: true },
    { id: 'la_2', name: 'Kargil', state: 'Ladakh', latitude: 34.5539, longitude: 76.1349 },
  ],
  'Chandigarh': [
    { id: 'ch_1', name: 'Chandigarh Central (Sector 17)', state: 'Chandigarh', latitude: 30.7333, longitude: 76.7794, isMajorCity: true },
    { id: 'ch_2', name: 'Manimajra & IT Park', state: 'Chandigarh', latitude: 30.7189, longitude: 76.8400 },
  ],
  'Puducherry': [
    { id: 'py_1', name: 'Puducherry', state: 'Puducherry', latitude: 11.9416, longitude: 79.8083, isMajorCity: true },
    { id: 'py_2', name: 'Karaikal', state: 'Puducherry', latitude: 10.9254, longitude: 79.8380 },
  ],
  'Dadra and Nagar Haveli and Daman and Diu': [
    { id: 'dd_1', name: 'Daman', state: 'Dadra and Nagar Haveli and Daman and Diu', latitude: 20.4283, longitude: 72.8397, isMajorCity: true },
    { id: 'dd_2', name: 'Silvassa', state: 'Dadra and Nagar Haveli and Daman and Diu', latitude: 20.2763, longitude: 73.0083 },
  ],
  'Andaman and Nicobar Islands': [
    { id: 'an_1', name: 'Port Blair', state: 'Andaman and Nicobar Islands', latitude: 11.6234, longitude: 92.7265, isMajorCity: true },
  ],
  'Lakshadweep': [
    { id: 'ld_1', name: 'Kavaratti', state: 'Lakshadweep', latitude: 10.5667, longitude: 72.6417, isMajorCity: true },
  ],
};

// Flattened list of all Indian districts
export const ALL_INDIAN_DISTRICTS: IndianDistrict[] = Object.values(STATE_DISTRICTS).flat();

// Helper to get all districts of a state
export function getDistrictsForState(stateName: string): IndianDistrict[] {
  if (!stateName) return [];
  const normalized = stateName.trim().toLowerCase();

  // Try exact or case-insensitive match
  for (const [st, districts] of Object.entries(STATE_DISTRICTS)) {
    if (st.toLowerCase() === normalized) {
      return districts;
    }
  }

  // Substring match (e.g. "Delhi" matching "Delhi (NCT)" or "Uttar Pradesh" matching "UP")
  for (const [st, districts] of Object.entries(STATE_DISTRICTS)) {
    if (st.toLowerCase().includes(normalized) || normalized.includes(st.toLowerCase())) {
      return districts;
    }
  }

  return [];
}

// Search across all districts (by English, Hindi, or state)
export function searchAllDistricts(query: string, maxResults = 10): IndianDistrict[] {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();

  return ALL_INDIAN_DISTRICTS.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.hindiName.toLowerCase().includes(q) ||
      d.state.toLowerCase().includes(q)
  ).slice(0, maxResults);
}
