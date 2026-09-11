export interface IndianDistrict {
  id: string;
  name: string;
  hindiName: string;
  state: string;
  latitude: number;
  longitude: number;
  isMajorCity?: boolean;
}

export const STATE_DISTRICTS: Record<string, IndianDistrict[]> = {
  'Andhra Pradesh': [
    { id: 'ap_1', name: 'Visakhapatnam', hindiName: 'विशाखापट्टनम', state: 'Andhra Pradesh', latitude: 17.6868, longitude: 83.2185, isMajorCity: true },
    { id: 'ap_2', name: 'Vijayawada', hindiName: 'विजयवाड़ा', state: 'Andhra Pradesh', latitude: 16.5062, longitude: 80.6480, isMajorCity: true },
    { id: 'ap_3', name: 'Guntur', hindiName: 'गुंटूर', state: 'Andhra Pradesh', latitude: 16.3067, longitude: 80.4365 },
    { id: 'ap_4', name: 'Nellore', hindiName: 'नेल्लोर', state: 'Andhra Pradesh', latitude: 14.4426, longitude: 79.9865 },
    { id: 'ap_5', name: 'Kurnool', hindiName: 'कुरनूल', state: 'Andhra Pradesh', latitude: 15.8281, longitude: 78.0373 },
    { id: 'ap_6', name: 'Tirupati', hindiName: 'तिरुपति', state: 'Andhra Pradesh', latitude: 13.6288, longitude: 79.4192, isMajorCity: true },
    { id: 'ap_7', name: 'Kakinada', hindiName: 'काकीनाडा', state: 'Andhra Pradesh', latitude: 16.9891, longitude: 82.2475 },
    { id: 'ap_8', name: 'Rajahmundry', hindiName: 'राजमुंदरी', state: 'Andhra Pradesh', latitude: 17.0005, longitude: 81.8040 },
    { id: 'ap_9', name: 'Kadapa', hindiName: 'कडपा', state: 'Andhra Pradesh', latitude: 14.4673, longitude: 78.8242 },
    { id: 'ap_10', name: 'Anantapur', hindiName: 'अनंतपुर', state: 'Andhra Pradesh', latitude: 14.6819, longitude: 77.6006 },
    { id: 'ap_11', name: 'Amaravati', hindiName: 'अमरावती', state: 'Andhra Pradesh', latitude: 16.5417, longitude: 80.5150, isMajorCity: true },
    { id: 'ap_12', name: 'Eluru', hindiName: 'एलुरु', state: 'Andhra Pradesh', latitude: 16.7107, longitude: 81.0952 },
  ],
  'Arunachal Pradesh': [
    { id: 'ar_1', name: 'Itanagar', hindiName: 'ईटानगर', state: 'Arunachal Pradesh', latitude: 27.0844, longitude: 93.6053, isMajorCity: true },
    { id: 'ar_2', name: 'Tawang', hindiName: 'तवांग', state: 'Arunachal Pradesh', latitude: 27.5861, longitude: 91.8594 },
    { id: 'ar_3', name: 'Pasighat', hindiName: 'पासीघाट', state: 'Arunachal Pradesh', latitude: 28.0667, longitude: 95.3333 },
    { id: 'ar_4', name: 'Naharlagun', hindiName: 'नाहरलगुन', state: 'Arunachal Pradesh', latitude: 27.1084, longitude: 93.6946 },
    { id: 'ar_5', name: 'Ziro', hindiName: 'जीरो', state: 'Arunachal Pradesh', latitude: 27.5333, longitude: 93.8333 },
    { id: 'ar_6', name: 'Bomdila', hindiName: 'बोमडिला', state: 'Arunachal Pradesh', latitude: 27.2645, longitude: 92.4159 },
  ],
  'Assam': [
    { id: 'as_1', name: 'Guwahati (Kamrup)', hindiName: 'गुवाहाटी', state: 'Assam', latitude: 26.1445, longitude: 91.7362, isMajorCity: true },
    { id: 'as_2', name: 'Silchar (Cachar)', hindiName: 'सिलचर', state: 'Assam', latitude: 24.8333, longitude: 92.7789 },
    { id: 'as_3', name: 'Dibrugarh', hindiName: 'डिब्रूगढ़', state: 'Assam', latitude: 27.4728, longitude: 94.9120 },
    { id: 'as_4', name: 'Jorhat', hindiName: 'जोरहाट', state: 'Assam', latitude: 26.7509, longitude: 94.2037 },
    { id: 'as_5', name: 'Nagaon', hindiName: 'नगांव', state: 'Assam', latitude: 26.3467, longitude: 92.6840 },
    { id: 'as_6', name: 'Tinsukia', hindiName: 'तिनसुकिया', state: 'Assam', latitude: 27.4922, longitude: 95.3468 },
    { id: 'as_7', name: 'Tezpur', hindiName: 'तेजपुर', state: 'Assam', latitude: 26.6528, longitude: 92.7926 },
    { id: 'as_8', name: 'Bongaigaon', hindiName: 'बोंगाईगांव', state: 'Assam', latitude: 26.5028, longitude: 90.5592 },
  ],
  'Bihar': [
    { id: 'br_1', name: 'Patna', hindiName: 'पटना', state: 'Bihar', latitude: 25.5941, longitude: 85.1376, isMajorCity: true },
    { id: 'br_2', name: 'Gaya', hindiName: 'गया', state: 'Bihar', latitude: 24.7914, longitude: 85.0002, isMajorCity: true },
    { id: 'br_3', name: 'Bhagalpur', hindiName: 'भागलपुर', state: 'Bihar', latitude: 25.2425, longitude: 86.9842, isMajorCity: true },
    { id: 'br_4', name: 'Muzaffarpur', hindiName: 'मुजफ्फरपुर', state: 'Bihar', latitude: 26.1209, longitude: 85.3647, isMajorCity: true },
    { id: 'br_5', name: 'Purnia', hindiName: 'पूर्णिया', state: 'Bihar', latitude: 25.7771, longitude: 87.4753 },
    { id: 'br_6', name: 'Darbhanga', hindiName: 'दरभंगा', state: 'Bihar', latitude: 26.1542, longitude: 85.8918 },
    { id: 'br_7', name: 'Bihar Sharif (Nalanda)', hindiName: 'बिहार शरीफ', state: 'Bihar', latitude: 25.1982, longitude: 85.5149 },
    { id: 'br_8', name: 'Arrah (Bhojpur)', hindiName: 'आरा', state: 'Bihar', latitude: 25.5541, longitude: 84.6641 },
    { id: 'br_9', name: 'Begusarai', hindiName: 'बेगूसराय', state: 'Bihar', latitude: 25.4182, longitude: 86.1272 },
    { id: 'br_10', name: 'Katihar', hindiName: 'कटिहार', state: 'Bihar', latitude: 25.5541, longitude: 87.5684 },
    { id: 'br_11', name: 'Munger', hindiName: 'मुंगेर', state: 'Bihar', latitude: 25.3757, longitude: 86.4744 },
    { id: 'br_12', name: 'Chhapra (Saran)', hindiName: 'छपरा', state: 'Bihar', latitude: 25.7848, longitude: 84.7274 },
    { id: 'br_13', name: 'Samastipur', hindiName: 'समस्तीपुर', state: 'Bihar', latitude: 25.8628, longitude: 85.7811 },
    { id: 'br_14', name: 'Motihari (East Champaran)', hindiName: 'मोतिहारी', state: 'Bihar', latitude: 26.6469, longitude: 84.9089 },
    { id: 'br_15', name: 'Sasaram (Rohtas)', hindiName: 'सासाराम', state: 'Bihar', latitude: 24.9525, longitude: 84.0315 },
    { id: 'br_16', name: 'Bettiah (West Champaran)', hindiName: 'बेतिया', state: 'Bihar', latitude: 26.8024, longitude: 84.5028 },
    { id: 'br_17', name: 'Hajipur (Vaishali)', hindiName: 'हाजीपुर', state: 'Bihar', latitude: 25.6858, longitude: 85.2146 },
    { id: 'br_18', name: 'Siwan', hindiName: 'सीवान', state: 'Bihar', latitude: 26.2243, longitude: 84.3596 },
    { id: 'br_19', name: 'Buxar', hindiName: 'बक्सर', state: 'Bihar', latitude: 25.5647, longitude: 83.9777 },
    { id: 'br_20', name: 'Madhubani', hindiName: 'मधुबनी', state: 'Bihar', latitude: 26.3541, longitude: 86.0718 },
    { id: 'br_21', name: 'Saharsa', hindiName: 'सहरसा', state: 'Bihar', latitude: 25.8835, longitude: 86.6006 },
    { id: 'br_22', name: 'Sitamarhi', hindiName: 'सीतामढ़ी', state: 'Bihar', latitude: 26.5937, longitude: 85.4894 },
    { id: 'br_23', name: 'Nawada', hindiName: 'नवादा', state: 'Bihar', latitude: 24.8872, longitude: 85.5434 },
  ],
  'Chhattisgarh': [
    { id: 'cg_1', name: 'Raipur', hindiName: 'रायपुर', state: 'Chhattisgarh', latitude: 21.2514, longitude: 81.6296, isMajorCity: true },
    { id: 'cg_2', name: 'Bhilai - Durg', hindiName: 'भिलाई - दुर्ग', state: 'Chhattisgarh', latitude: 21.1938, longitude: 81.3509, isMajorCity: true },
    { id: 'cg_3', name: 'Bilaspur', hindiName: 'बिलासपुर', state: 'Chhattisgarh', latitude: 22.0797, longitude: 82.1409 },
    { id: 'cg_4', name: 'Korba', hindiName: 'कोरबा', state: 'Chhattisgarh', latitude: 22.3595, longitude: 82.7501 },
    { id: 'cg_5', name: 'Rajnandgaon', hindiName: 'राजनंदगांव', state: 'Chhattisgarh', latitude: 21.0973, longitude: 81.0367 },
    { id: 'cg_6', name: 'Jagdalpur (Bastar)', hindiName: 'जगदलपुर', state: 'Chhattisgarh', latitude: 19.0744, longitude: 82.0089 },
    { id: 'cg_7', name: 'Ambikapur (Surguja)', hindiName: 'अंबिकापुर', state: 'Chhattisgarh', latitude: 23.1186, longitude: 83.1979 },
    { id: 'cg_8', name: 'Raigarh', hindiName: 'रायगढ़', state: 'Chhattisgarh', latitude: 21.8974, longitude: 83.3950 },
  ],
  'Goa': [
    { id: 'ga_1', name: 'Panaji (North Goa)', hindiName: 'पणजी', state: 'Goa', latitude: 15.4909, longitude: 73.8278, isMajorCity: true },
    { id: 'ga_2', name: 'Margao (South Goa)', hindiName: 'मडगांव', state: 'Goa', latitude: 15.2736, longitude: 73.9582, isMajorCity: true },
    { id: 'ga_3', name: 'Vasco da Gama', hindiName: 'वास्को द गामा', state: 'Goa', latitude: 15.3982, longitude: 73.8113 },
    { id: 'ga_4', name: 'Mapusa', hindiName: 'मापुसा', state: 'Goa', latitude: 15.5937, longitude: 73.8142 },
    { id: 'ga_5', name: 'Ponda', hindiName: 'पोंडा', state: 'Goa', latitude: 15.4026, longitude: 74.0150 },
    { id: 'ga_6', name: 'Calangute - Candolim', hindiName: 'कलंगूट', state: 'Goa', latitude: 15.5439, longitude: 73.7553 },
  ],
  'Gujarat': [
    { id: 'gj_1', name: 'Ahmedabad', hindiName: 'अहमदाबाद', state: 'Gujarat', latitude: 23.0225, longitude: 72.5714, isMajorCity: true },
    { id: 'gj_2', name: 'Surat', hindiName: 'सूरत', state: 'Gujarat', latitude: 21.1702, longitude: 72.8311, isMajorCity: true },
    { id: 'gj_3', name: 'Vadodara', hindiName: 'वडोदरा', state: 'Gujarat', latitude: 22.3072, longitude: 73.1812, isMajorCity: true },
    { id: 'gj_4', name: 'Rajkot', hindiName: 'राजकोट', state: 'Gujarat', latitude: 22.3039, longitude: 70.8022, isMajorCity: true },
    { id: 'gj_5', name: 'Bhavnagar', hindiName: 'भावनगर', state: 'Gujarat', latitude: 21.7645, longitude: 72.1519 },
    { id: 'gj_6', name: 'Jamnagar', hindiName: 'जामनगर', state: 'Gujarat', latitude: 22.4707, longitude: 70.0577 },
    { id: 'gj_7', name: 'Gandhinagar', hindiName: 'गांधीनगर', state: 'Gujarat', latitude: 23.2156, longitude: 72.6369 },
    { id: 'gj_8', name: 'Junagadh', hindiName: 'जूनागढ़', state: 'Gujarat', latitude: 21.5222, longitude: 70.4579 },
    { id: 'gj_9', name: 'Anand', hindiName: 'आणंद', state: 'Gujarat', latitude: 22.5645, longitude: 72.9289 },
    { id: 'gj_10', name: 'Navsari', hindiName: 'नवसारी', state: 'Gujarat', latitude: 20.9467, longitude: 72.9520 },
    { id: 'gj_11', name: 'Morbi', hindiName: 'मोरबी', state: 'Gujarat', latitude: 22.8120, longitude: 70.8378 },
    { id: 'gj_12', name: 'Bharuch', hindiName: 'भरूच', state: 'Gujarat', latitude: 21.7051, longitude: 72.9959 },
    { id: 'gj_13', name: 'Mehsana', hindiName: 'मेहसाणा', state: 'Gujarat', latitude: 23.5880, longitude: 72.3693 },
    { id: 'gj_14', name: 'Vapi - Valsad', hindiName: 'वापी - वलसाड', state: 'Gujarat', latitude: 20.3893, longitude: 72.9106 },
  ],
  'Haryana': [
    { id: 'hr_1', name: 'Gurugram', hindiName: 'गुरुग्राम', state: 'Haryana', latitude: 28.4595, longitude: 77.0266, isMajorCity: true },
    { id: 'hr_2', name: 'Faridabad', hindiName: 'फरीदाबाद', state: 'Haryana', latitude: 28.4089, longitude: 77.3178, isMajorCity: true },
    { id: 'hr_3', name: 'Panipat', hindiName: 'पानीपत', state: 'Haryana', latitude: 29.3909, longitude: 76.9635 },
    { id: 'hr_4', name: 'Ambala', hindiName: 'अंबाला', state: 'Haryana', latitude: 30.3782, longitude: 76.7767 },
    { id: 'hr_5', name: 'Yamunanagar', hindiName: 'यमुनानगर', state: 'Haryana', latitude: 30.1290, longitude: 77.2674 },
    { id: 'hr_6', name: 'Rohtak', hindiName: 'रोहतक', state: 'Haryana', latitude: 28.8955, longitude: 76.6066 },
    { id: 'hr_7', name: 'Hisar', hindiName: 'हिसार', state: 'Haryana', latitude: 29.1492, longitude: 75.7217 },
    { id: 'hr_8', name: 'Karnal', hindiName: 'करनाल', state: 'Haryana', latitude: 29.6857, longitude: 76.9905 },
    { id: 'hr_9', name: 'Sonipat', hindiName: 'सोनीपत', state: 'Haryana', latitude: 28.9931, longitude: 77.0151 },
    { id: 'hr_10', name: 'Panchkula', hindiName: 'पंचकूला', state: 'Haryana', latitude: 30.6942, longitude: 76.8606 },
    { id: 'hr_11', name: 'Sirsa', hindiName: 'सिरसा', state: 'Haryana', latitude: 29.5349, longitude: 75.0298 },
    { id: 'hr_12', name: 'Rewari', hindiName: 'रेवाड़ी', state: 'Haryana', latitude: 28.1834, longitude: 76.6191 },
  ],
  'Himachal Pradesh': [
    { id: 'hp_1', name: 'Shimla', hindiName: 'शिमला', state: 'Himachal Pradesh', latitude: 31.1048, longitude: 77.1734, isMajorCity: true },
    { id: 'hp_2', name: 'Dharamshala (Kangra)', hindiName: 'धर्मशाला', state: 'Himachal Pradesh', latitude: 32.2190, longitude: 76.3234 },
    { id: 'hp_3', name: 'Mandi', hindiName: 'मंडी', state: 'Himachal Pradesh', latitude: 31.7087, longitude: 76.9320 },
    { id: 'hp_4', name: 'Solan', hindiName: 'सोलन', state: 'Himachal Pradesh', latitude: 30.9045, longitude: 77.0967 },
    { id: 'hp_5', name: 'Kullu - Manali', hindiName: 'कुल्लू - मनाली', state: 'Himachal Pradesh', latitude: 31.9579, longitude: 77.1095 },
    { id: 'hp_6', name: 'Hamirpur', hindiName: 'हमीरपुर', state: 'Himachal Pradesh', latitude: 31.6862, longitude: 76.5213 },
    { id: 'hp_7', name: 'Una', hindiName: 'ऊना', state: 'Himachal Pradesh', latitude: 31.4685, longitude: 76.2708 },
    { id: 'hp_8', name: 'Bilaspur', hindiName: 'बिलासपुर', state: 'Himachal Pradesh', latitude: 31.3326, longitude: 76.7589 },
  ],
  'Jharkhand': [
    { id: 'jh_2', name: 'Jamshedpur (East Singhbhum)', hindiName: 'जमशेदपुर (पूर्वी सिंहभूम)', state: 'Jharkhand', latitude: 22.8046, longitude: 86.2029, isMajorCity: true },
    { id: 'jh_1', name: 'Ranchi', hindiName: 'राँची', state: 'Jharkhand', latitude: 23.3441, longitude: 85.3096, isMajorCity: true },
    { id: 'jh_3', name: 'Dhanbad', hindiName: 'धनबाद', state: 'Jharkhand', latitude: 23.7957, longitude: 86.4304, isMajorCity: true },
    { id: 'jh_4', name: 'Bokaro Steel City', hindiName: 'बोकारो स्टील सिटी', state: 'Jharkhand', latitude: 23.6693, longitude: 86.1511 },
    { id: 'jh_5', name: 'Deoghar', hindiName: 'देवघर', state: 'Jharkhand', latitude: 24.4826, longitude: 86.7000 },
    { id: 'jh_6', name: 'Hazaribagh', hindiName: 'हजारीबाग', state: 'Jharkhand', latitude: 23.9925, longitude: 85.3637 },
    { id: 'jh_7', name: 'Giridih', hindiName: 'गिरिडीह', state: 'Jharkhand', latitude: 24.1869, longitude: 86.3092 },
    { id: 'jh_8', name: 'Ramgarh', hindiName: 'रामगढ़', state: 'Jharkhand', latitude: 23.6334, longitude: 85.5144 },
    { id: 'jh_9', name: 'Medininagar (Palamu)', hindiName: 'मेदिनीनगर', state: 'Jharkhand', latitude: 24.0402, longitude: 84.0722 },
  ],
  'Karnataka': [
    { id: 'ka_1', name: 'Bengaluru Urban', hindiName: 'बेंगलुरु अर्बन', state: 'Karnataka', latitude: 12.9716, longitude: 77.5946, isMajorCity: true },
    { id: 'ka_2', name: 'Mysuru', hindiName: 'मैसूरु', state: 'Karnataka', latitude: 12.2958, longitude: 76.6394, isMajorCity: true },
    { id: 'ka_3', name: 'Mangaluru (Dakshina Kannada)', hindiName: 'मंगलुरु', state: 'Karnataka', latitude: 12.9141, longitude: 74.8560, isMajorCity: true },
    { id: 'ka_4', name: 'Hubballi - Dharwad', hindiName: 'हुबली - धारवाड़', state: 'Karnataka', latitude: 15.3647, longitude: 75.1240, isMajorCity: true },
    { id: 'ka_5', name: 'Belagavi', hindiName: 'बेलगावी', state: 'Karnataka', latitude: 15.8497, longitude: 74.4977 },
    { id: 'ka_6', name: 'Kalaburagi (Gulbarga)', hindiName: 'कलबुर्गी', state: 'Karnataka', latitude: 17.3297, longitude: 76.8343 },
    { id: 'ka_7', name: 'Davanagere', hindiName: 'दावणगेरे', state: 'Karnataka', latitude: 14.4644, longitude: 75.9218 },
    { id: 'ka_8', name: 'Ballari', hindiName: 'बल्लारी', state: 'Karnataka', latitude: 15.1394, longitude: 76.9214 },
    { id: 'ka_9', name: 'Shivamogga', hindiName: 'शिवमोग्गा', state: 'Karnataka', latitude: 13.9299, longitude: 75.5681 },
    { id: 'ka_10', name: 'Tumakuru', hindiName: 'तुमकुरु', state: 'Karnataka', latitude: 13.3379, longitude: 77.1010 },
    { id: 'ka_11', name: 'Udupi - Manipal', hindiName: 'उडुपी - मनिपाल', state: 'Karnataka', latitude: 13.3409, longitude: 74.7421 },
    { id: 'ka_12', name: 'Hassan', hindiName: 'हासन', state: 'Karnataka', latitude: 13.0033, longitude: 76.1004 },
  ],
  'Kerala': [
    { id: 'kl_1', name: 'Thiruvananthapuram', hindiName: 'तिरुवनंतपुरम', state: 'Kerala', latitude: 8.5241, longitude: 76.9366, isMajorCity: true },
    { id: 'kl_2', name: 'Kochi (Ernakulam)', hindiName: 'कोच्चि', state: 'Kerala', latitude: 9.9312, longitude: 76.2673, isMajorCity: true },
    { id: 'kl_3', name: 'Kozhikode (Calicut)', hindiName: 'कोझिकोड', state: 'Kerala', latitude: 11.2588, longitude: 75.7804, isMajorCity: true },
    { id: 'kl_4', name: 'Thrissur', hindiName: 'त्रिशूर', state: 'Kerala', latitude: 10.5276, longitude: 76.2144 },
    { id: 'kl_5', name: 'Kollam', hindiName: 'कोल्लम', state: 'Kerala', latitude: 8.8932, longitude: 76.6141 },
    { id: 'kl_6', name: 'Palakkad', hindiName: 'पालक्काड़', state: 'Kerala', latitude: 10.7867, longitude: 76.6548 },
    { id: 'kl_7', name: 'Alappuzha', hindiName: 'अलप्पुझा', state: 'Kerala', latitude: 9.4981, longitude: 76.3388 },
    { id: 'kl_8', name: 'Kannur', hindiName: 'कन्नूर', state: 'Kerala', latitude: 11.8745, longitude: 75.3704 },
    { id: 'kl_9', name: 'Kottayam', hindiName: 'कोट्टायम', state: 'Kerala', latitude: 9.5916, longitude: 76.5222 },
    { id: 'kl_10', name: 'Malappuram', hindiName: 'मलप्पुरम', state: 'Kerala', latitude: 11.0510, longitude: 76.0711 },
  ],
  'Madhya Pradesh': [
    { id: 'mp_1', name: 'Bhopal', hindiName: 'भोपाल', state: 'Madhya Pradesh', latitude: 23.2599, longitude: 77.4126, isMajorCity: true },
    { id: 'mp_2', name: 'Indore', hindiName: 'इंदौर', state: 'Madhya Pradesh', latitude: 22.7196, longitude: 75.8577, isMajorCity: true },
    { id: 'mp_3', name: 'Gwalior', hindiName: 'ग्वालियर', state: 'Madhya Pradesh', latitude: 26.2183, longitude: 78.1828, isMajorCity: true },
    { id: 'mp_4', name: 'Jabalpur', hindiName: 'जबलपुर', state: 'Madhya Pradesh', latitude: 23.1815, longitude: 79.9864, isMajorCity: true },
    { id: 'mp_5', name: 'Ujjain', hindiName: 'उज्जैन', state: 'Madhya Pradesh', latitude: 23.1765, longitude: 75.7885 },
    { id: 'mp_6', name: 'Sagar', hindiName: 'सागर', state: 'Madhya Pradesh', latitude: 23.8388, longitude: 78.7378 },
    { id: 'mp_7', name: 'Dewas', hindiName: 'देवास', state: 'Madhya Pradesh', latitude: 22.9676, longitude: 76.0534 },
    { id: 'mp_8', name: 'Satna', hindiName: 'सतना', state: 'Madhya Pradesh', latitude: 24.6005, longitude: 80.8322 },
    { id: 'mp_9', name: 'Ratlam', hindiName: 'रतलाम', state: 'Madhya Pradesh', latitude: 23.3315, longitude: 75.0367 },
    { id: 'mp_10', name: 'Rewa', hindiName: 'रीवा', state: 'Madhya Pradesh', latitude: 24.5373, longitude: 81.3042 },
    { id: 'mp_11', name: 'Singrauli', hindiName: 'सिंगरौली', state: 'Madhya Pradesh', latitude: 24.1998, longitude: 82.6645 },
    { id: 'mp_12', name: 'Chhindwara', hindiName: 'छिंदवाड़ा', state: 'Madhya Pradesh', latitude: 22.0574, longitude: 78.9382 },
  ],
  'Maharashtra': [
    { id: 'mh_1', name: 'Mumbai City & Suburban', hindiName: 'मुंबई', state: 'Maharashtra', latitude: 19.0760, longitude: 72.8777, isMajorCity: true },
    { id: 'mh_2', name: 'Pune', hindiName: 'पुणे', state: 'Maharashtra', latitude: 18.5204, longitude: 73.8567, isMajorCity: true },
    { id: 'mh_3', name: 'Nagpur', hindiName: 'नागपुर', state: 'Maharashtra', latitude: 21.1458, longitude: 79.0882, isMajorCity: true },
    { id: 'mh_4', name: 'Thane', hindiName: 'ठाणे', state: 'Maharashtra', latitude: 19.2183, longitude: 72.9781, isMajorCity: true },
    { id: 'mh_5', name: 'Nashik', hindiName: 'नासिक', state: 'Maharashtra', latitude: 19.9975, longitude: 73.7898, isMajorCity: true },
    { id: 'mh_6', name: 'Chhatrapati Sambhajinagar (Aurangabad)', hindiName: 'छत्रपति संभाजीनगर', state: 'Maharashtra', latitude: 19.8762, longitude: 75.3433 },
    { id: 'mh_7', name: 'Solapur', hindiName: 'सोलापुर', state: 'Maharashtra', latitude: 17.6599, longitude: 75.9064 },
    { id: 'mh_8', name: 'Kolhapur', hindiName: 'कोल्हापुर', state: 'Maharashtra', latitude: 16.7050, longitude: 74.2433 },
    { id: 'mh_9', name: 'Navi Mumbai', hindiName: 'नवी मुंबई', state: 'Maharashtra', latitude: 19.0330, longitude: 73.0297, isMajorCity: true },
    { id: 'mh_10', name: 'Amravati', hindiName: 'अमरावती', state: 'Maharashtra', latitude: 20.9374, longitude: 77.7796 },
    { id: 'mh_11', name: 'Jalgaon', hindiName: 'जलगांव', state: 'Maharashtra', latitude: 21.0077, longitude: 75.5626 },
    { id: 'mh_12', name: 'Akola', hindiName: 'अकोला', state: 'Maharashtra', latitude: 20.7002, longitude: 77.0082 },
    { id: 'mh_13', name: 'Nanded', hindiName: 'नांदेड़', state: 'Maharashtra', latitude: 19.1383, longitude: 77.3210 },
    { id: 'mh_14', name: 'Sangli - Miraj', hindiName: 'सांगली', state: 'Maharashtra', latitude: 16.8524, longitude: 74.5815 },
    { id: 'mh_15', name: 'Latur', hindiName: 'लातूर', state: 'Maharashtra', latitude: 18.4088, longitude: 76.5604 },
    { id: 'mh_16', name: 'Ahmednagar', hindiName: 'अहमदनगर', state: 'Maharashtra', latitude: 19.0952, longitude: 74.7496 },
  ],
  'Manipur': [
    { id: 'mn_1', name: 'Imphal West', hindiName: 'इम्फाल वेस्ट', state: 'Manipur', latitude: 24.8170, longitude: 93.9368, isMajorCity: true },
    { id: 'mn_2', name: 'Imphal East', hindiName: 'इम्फाल ईस्ट', state: 'Manipur', latitude: 24.8123, longitude: 93.9610 },
    { id: 'mn_3', name: 'Churachandpur', hindiName: 'चुराचांदपुर', state: 'Manipur', latitude: 24.3333, longitude: 93.6833 },
    { id: 'mn_4', name: 'Thoubal', hindiName: 'थौबल', state: 'Manipur', latitude: 24.6333, longitude: 93.9833 },
    { id: 'mn_5', name: 'Bishnupur', hindiName: 'बिष्णुपुर', state: 'Manipur', latitude: 24.6333, longitude: 93.7667 },
  ],
  'Meghalaya': [
    { id: 'ml_1', name: 'East Khasi Hills (Shillong)', hindiName: 'शिलांग', state: 'Meghalaya', latitude: 25.5788, longitude: 91.8933, isMajorCity: true },
    { id: 'ml_2', name: 'West Garo Hills (Tura)', hindiName: 'तुरा', state: 'Meghalaya', latitude: 25.5144, longitude: 90.2030 },
    { id: 'ml_3', name: 'West Jaintia Hills (Jowai)', hindiName: 'जोवाई', state: 'Meghalaya', latitude: 25.4500, longitude: 92.2000 },
    { id: 'ml_4', name: 'Ri-Bhoi (Nongpoh)', hindiName: 'नोंगपोह', state: 'Meghalaya', latitude: 25.9000, longitude: 91.8833 },
  ],
  'Mizoram': [
    { id: 'mz_1', name: 'Aizawl', hindiName: 'आइजोल', state: 'Mizoram', latitude: 23.7271, longitude: 92.7176, isMajorCity: true },
    { id: 'mz_2', name: 'Lunglei', hindiName: 'लुंगलेई', state: 'Mizoram', latitude: 22.8833, longitude: 92.7333 },
    { id: 'mz_3', name: 'Champhai', hindiName: 'चम्फाई', state: 'Mizoram', latitude: 23.4667, longitude: 93.3333 },
    { id: 'mz_4', name: 'Kolasib', hindiName: 'कोलासिब', state: 'Mizoram', latitude: 24.2333, longitude: 92.6833 },
  ],
  'Nagaland': [
    { id: 'nl_1', name: 'Kohima', hindiName: 'कोहिमा', state: 'Nagaland', latitude: 25.6751, longitude: 94.1086, isMajorCity: true },
    { id: 'nl_2', name: 'Dimapur', hindiName: 'दीमापुर', state: 'Nagaland', latitude: 25.9090, longitude: 93.7270, isMajorCity: true },
    { id: 'nl_3', name: 'Mokokchung', hindiName: 'मोकोकचुंग', state: 'Nagaland', latitude: 26.3256, longitude: 94.5160 },
    { id: 'nl_4', name: 'Wokha', hindiName: 'वोखा', state: 'Nagaland', latitude: 26.1000, longitude: 94.2667 },
  ],
  'Odisha': [
    { id: 'od_1', name: 'Bhubaneswar (Khurda)', hindiName: 'भुवनेश्वर', state: 'Odisha', latitude: 20.2961, longitude: 85.8245, isMajorCity: true },
    { id: 'od_2', name: 'Cuttack', hindiName: 'कटक', state: 'Odisha', latitude: 20.4625, longitude: 85.8828, isMajorCity: true },
    { id: 'od_3', name: 'Rourkela (Sundargarh)', hindiName: 'राउरकेला', state: 'Odisha', latitude: 22.2604, longitude: 84.8536, isMajorCity: true },
    { id: 'od_4', name: 'Berhampur (Ganjam)', hindiName: 'बरहामपुर', state: 'Odisha', latitude: 19.3150, longitude: 84.7941 },
    { id: 'od_5', name: 'Sambalpur', hindiName: 'संबलपुर', state: 'Odisha', latitude: 21.4669, longitude: 83.9812 },
    { id: 'od_6', name: 'Puri', hindiName: 'पुरी', state: 'Odisha', latitude: 19.8135, longitude: 85.8312 },
    { id: 'od_7', name: 'Balasore', hindiName: 'बालेश्वर', state: 'Odisha', latitude: 21.4934, longitude: 86.9135 },
    { id: 'od_8', name: 'Bhadrak', hindiName: 'भद्रक', state: 'Odisha', latitude: 21.0544, longitude: 86.5147 },
  ],
  'Punjab': [
    { id: 'pb_1', name: 'Ludhiana', hindiName: 'लुधियाना', state: 'Punjab', latitude: 30.9010, longitude: 75.8573, isMajorCity: true },
    { id: 'pb_2', name: 'Amritsar', hindiName: 'अमृतसर', state: 'Punjab', latitude: 31.6340, longitude: 74.8723, isMajorCity: true },
    { id: 'pb_3', name: 'Jalandhar', hindiName: 'जालंधर', state: 'Punjab', latitude: 31.3260, longitude: 75.5762, isMajorCity: true },
    { id: 'pb_4', name: 'Patiala', hindiName: 'पटियाला', state: 'Punjab', latitude: 30.3398, longitude: 76.3869 },
    { id: 'pb_5', name: 'Bathinda', hindiName: 'बठिंडा', state: 'Punjab', latitude: 30.2110, longitude: 74.9455 },
    { id: 'pb_6', name: 'Mohali (SAS Nagar)', hindiName: 'मोहाली', state: 'Punjab', latitude: 30.7046, longitude: 76.7179, isMajorCity: true },
    { id: 'pb_7', name: 'Hoshiarpur', hindiName: 'होशियारपुर', state: 'Punjab', latitude: 31.5273, longitude: 75.9142 },
    { id: 'pb_8', name: 'Pathankot', hindiName: 'पठानकोट', state: 'Punjab', latitude: 32.2643, longitude: 75.6521 },
    { id: 'pb_9', name: 'Moga', hindiName: 'मोगा', state: 'Punjab', latitude: 30.8165, longitude: 75.1717 },
  ],
  'Rajasthan': [
    { id: 'rj_1', name: 'Jaipur', hindiName: 'जयपुर', state: 'Rajasthan', latitude: 26.9124, longitude: 75.7873, isMajorCity: true },
    { id: 'rj_2', name: 'Jodhpur', hindiName: 'जोधपुर', state: 'Rajasthan', latitude: 26.2389, longitude: 73.0243, isMajorCity: true },
    { id: 'rj_3', name: 'Kota', hindiName: 'कोटा', state: 'Rajasthan', latitude: 25.2138, longitude: 75.8648, isMajorCity: true },
    { id: 'rj_4', name: 'Bikaner', hindiName: 'बीकानेर', state: 'Rajasthan', latitude: 28.0229, longitude: 73.3119 },
    { id: 'rj_5', name: 'Ajmer', hindiName: 'अजमेर', state: 'Rajasthan', latitude: 26.4499, longitude: 74.6399 },
    { id: 'rj_6', name: 'Udaipur', hindiName: 'उदयपुर', state: 'Rajasthan', latitude: 24.5854, longitude: 73.7125, isMajorCity: true },
    { id: 'rj_7', name: 'Bhilwara', hindiName: 'भीलवाड़ा', state: 'Rajasthan', latitude: 25.3407, longitude: 74.6313 },
    { id: 'rj_8', name: 'Alwar', hindiName: 'अलवर', state: 'Rajasthan', latitude: 27.5530, longitude: 76.6346 },
    { id: 'rj_9', name: 'Sikar', hindiName: 'सीकर', state: 'Rajasthan', latitude: 27.6094, longitude: 75.1398 },
    { id: 'rj_10', name: 'Sri Ganganagar', hindiName: 'श्री गंगानगर', state: 'Rajasthan', latitude: 29.9038, longitude: 73.8772 },
    { id: 'rj_11', name: 'Bharatpur', hindiName: 'भरतपुर', state: 'Rajasthan', latitude: 27.2152, longitude: 77.5030 },
    { id: 'rj_12', name: 'Pali', hindiName: 'पाली', state: 'Rajasthan', latitude: 25.7711, longitude: 73.3234 },
  ],
  'Sikkim': [
    { id: 'sk_1', name: 'Gangtok (East Sikkim)', hindiName: 'गंगटोक', state: 'Sikkim', latitude: 27.3389, longitude: 88.6065, isMajorCity: true },
    { id: 'sk_2', name: 'Namchi (South Sikkim)', hindiName: 'नामची', state: 'Sikkim', latitude: 27.1667, longitude: 88.3500 },
    { id: 'sk_3', name: 'Gyalshing (West Sikkim)', hindiName: 'ग्यालशिंग', state: 'Sikkim', latitude: 27.2833, longitude: 88.2500 },
    { id: 'sk_4', name: 'Mangan (North Sikkim)', hindiName: 'मंगन', state: 'Sikkim', latitude: 27.5000, longitude: 88.5333 },
  ],
  'Tamil Nadu': [
    { id: 'tn_1', name: 'Chennai', hindiName: 'चेन्नई', state: 'Tamil Nadu', latitude: 13.0827, longitude: 80.2707, isMajorCity: true },
    { id: 'tn_2', name: 'Coimbatore', hindiName: 'कोयंबटूर', state: 'Tamil Nadu', latitude: 11.0168, longitude: 76.9558, isMajorCity: true },
    { id: 'tn_3', name: 'Madurai', hindiName: 'मदुरै', state: 'Tamil Nadu', latitude: 9.9252, longitude: 78.1198, isMajorCity: true },
    { id: 'tn_4', name: 'Tiruchirappalli (Trichy)', hindiName: 'तिरुचिरापल्ली', state: 'Tamil Nadu', latitude: 10.7905, longitude: 78.7047 },
    { id: 'tn_5', name: 'Salem', hindiName: 'सलेम', state: 'Tamil Nadu', latitude: 11.6643, longitude: 78.1460 },
    { id: 'tn_6', name: 'Tiruppur', hindiName: 'तिरुपुर', state: 'Tamil Nadu', latitude: 11.1085, longitude: 77.3411 },
    { id: 'tn_7', name: 'Erode', hindiName: 'इरोड', state: 'Tamil Nadu', latitude: 11.3410, longitude: 77.7172 },
    { id: 'tn_8', name: 'Tirunelveli', hindiName: 'तिरुनेलवेली', state: 'Tamil Nadu', latitude: 8.7139, longitude: 77.7567 },
    { id: 'tn_9', name: 'Vellore', hindiName: 'वेल्लोर', state: 'Tamil Nadu', latitude: 12.9165, longitude: 79.1325 },
    { id: 'tn_10', name: 'Thoothukudi', hindiName: 'थूथुकुडी', state: 'Tamil Nadu', latitude: 8.7642, longitude: 78.1348 },
    { id: 'tn_11', name: 'Thanjavur', hindiName: 'तंजौर', state: 'Tamil Nadu', latitude: 10.7870, longitude: 79.1378 },
  ],
  'Telangana': [
    { id: 'tg_1', name: 'Hyderabad - Secunderabad', hindiName: 'हैदराबाद', state: 'Telangana', latitude: 17.3850, longitude: 78.4867, isMajorCity: true },
    { id: 'tg_2', name: 'Warangal - Hanamkonda', hindiName: 'वारंगल', state: 'Telangana', latitude: 17.9689, longitude: 79.5941, isMajorCity: true },
    { id: 'tg_3', name: 'Nizamabad', hindiName: 'निजामाबाद', state: 'Telangana', latitude: 18.6725, longitude: 78.0941 },
    { id: 'tg_4', name: 'Karimnagar', hindiName: 'करीमनगर', state: 'Telangana', latitude: 18.4386, longitude: 79.1288 },
    { id: 'tg_5', name: 'Khammam', hindiName: 'खम्मम', state: 'Telangana', latitude: 17.2473, longitude: 80.1514 },
    { id: 'tg_6', name: 'Ramagundam', hindiName: 'रामागुंडम', state: 'Telangana', latitude: 18.7568, longitude: 79.4756 },
    { id: 'tg_7', name: 'Mahbubnagar', hindiName: 'महबूबनगर', state: 'Telangana', latitude: 16.7488, longitude: 77.9855 },
    { id: 'tg_8', name: 'Nalgonda', hindiName: 'नलगोंडा', state: 'Telangana', latitude: 17.0577, longitude: 79.2684 },
  ],
  'Tripura': [
    { id: 'tr_1', name: 'Agartala (West Tripura)', hindiName: 'अगरतला', state: 'Tripura', latitude: 23.8315, longitude: 91.2868, isMajorCity: true },
    { id: 'tr_2', name: 'Udaipur (Gomati)', hindiName: 'उदयपुर', state: 'Tripura', latitude: 23.5333, longitude: 91.4833 },
    { id: 'tr_3', name: 'Dharmanagar (North Tripura)', hindiName: 'धर्मनगर', state: 'Tripura', latitude: 24.3833, longitude: 92.1667 },
    { id: 'tr_4', name: 'Khowai', hindiName: 'खोवाई', state: 'Tripura', latitude: 24.0625, longitude: 91.6056 },
  ],
  'Uttar Pradesh': [
    { id: 'up_1', name: 'Lucknow', hindiName: 'लखनऊ', state: 'Uttar Pradesh', latitude: 26.8467, longitude: 80.9462, isMajorCity: true },
    { id: 'up_2', name: 'Kanpur', hindiName: 'कानपुर', state: 'Uttar Pradesh', latitude: 26.4499, longitude: 80.3319, isMajorCity: true },
    { id: 'up_3', name: 'Varanasi', hindiName: 'वाराणसी', state: 'Uttar Pradesh', latitude: 25.3176, longitude: 82.9739, isMajorCity: true },
    { id: 'up_4', name: 'Noida (Gautam Buddha Nagar)', hindiName: 'नोएडा', state: 'Uttar Pradesh', latitude: 28.5355, longitude: 77.3910, isMajorCity: true },
    { id: 'up_5', name: 'Ghaziabad', hindiName: 'गाजियाबाद', state: 'Uttar Pradesh', latitude: 28.6692, longitude: 77.4538, isMajorCity: true },
    { id: 'up_6', name: 'Agra', hindiName: 'आगरा', state: 'Uttar Pradesh', latitude: 27.1767, longitude: 78.0081, isMajorCity: true },
    { id: 'up_7', name: 'Prayagraj (Allahabad)', hindiName: 'प्रयागराज', state: 'Uttar Pradesh', latitude: 25.4358, longitude: 81.8463, isMajorCity: true },
    { id: 'up_8', name: 'Meerut', hindiName: 'मेरठ', state: 'Uttar Pradesh', latitude: 28.9845, longitude: 77.7064 },
    { id: 'up_9', name: 'Bareilly', hindiName: 'बरेली', state: 'Uttar Pradesh', latitude: 28.3670, longitude: 79.4304 },
    { id: 'up_10', name: 'Aligarh', hindiName: 'अलीगढ़', state: 'Uttar Pradesh', latitude: 27.8974, longitude: 78.0880 },
    { id: 'up_11', name: 'Moradabad', hindiName: 'मुरादाबाद', state: 'Uttar Pradesh', latitude: 28.8386, longitude: 78.7733 },
    { id: 'up_12', name: 'Saharanpur', hindiName: 'सहारनपुर', state: 'Uttar Pradesh', latitude: 29.9640, longitude: 77.5460 },
    { id: 'up_13', name: 'Gorakhpur', hindiName: 'गोरखपुर', state: 'Uttar Pradesh', latitude: 26.7606, longitude: 83.3732 },
    { id: 'up_14', name: 'Firozabad', hindiName: 'फिरोजाबाद', state: 'Uttar Pradesh', latitude: 27.1591, longitude: 78.3957 },
    { id: 'up_15', name: 'Jhansi', hindiName: 'झांसी', state: 'Uttar Pradesh', latitude: 25.4484, longitude: 78.5685 },
    { id: 'up_16', name: 'Muzaffarnagar', hindiName: 'मुजफ्फरनगर', state: 'Uttar Pradesh', latitude: 29.4727, longitude: 77.7085 },
    { id: 'up_17', name: 'Mathura', hindiName: 'मथुरा', state: 'Uttar Pradesh', latitude: 27.4924, longitude: 77.6737 },
    { id: 'up_18', name: 'Ayodhya (Faizabad)', hindiName: 'अयोध्या', state: 'Uttar Pradesh', latitude: 26.7922, longitude: 82.1998 },
    { id: 'up_19', name: 'Greater Noida', hindiName: 'ग्रेटर नोएडा', state: 'Uttar Pradesh', latitude: 28.4744, longitude: 77.5040 },
  ],
  'Uttarakhand': [
    { id: 'uk_1', name: 'Dehradun', hindiName: 'देहरादून', state: 'Uttarakhand', latitude: 30.3165, longitude: 78.0322, isMajorCity: true },
    { id: 'uk_2', name: 'Haridwar', hindiName: 'हरिद्वार', state: 'Uttarakhand', latitude: 29.9457, longitude: 78.1642, isMajorCity: true },
    { id: 'uk_3', name: 'Roorkee', hindiName: 'रुड़की', state: 'Uttarakhand', latitude: 29.8543, longitude: 77.8880 },
    { id: 'uk_4', name: 'Haldwani - Kathgodam', hindiName: 'हल्द्वानी', state: 'Uttarakhand', latitude: 29.2183, longitude: 79.5130 },
    { id: 'uk_5', name: 'Nainital', hindiName: 'नैनीताल', state: 'Uttarakhand', latitude: 29.3919, longitude: 79.4542 },
    { id: 'uk_6', name: 'Rudrapur (Udham Singh Nagar)', hindiName: 'रुद्रपुर', state: 'Uttarakhand', latitude: 28.9800, longitude: 79.4000 },
    { id: 'uk_7', name: 'Rishikesh', hindiName: 'ऋषिकेश', state: 'Uttarakhand', latitude: 30.0869, longitude: 78.2676 },
    { id: 'uk_8', name: 'Almora', hindiName: 'अल्मोड़ा', state: 'Uttarakhand', latitude: 29.5971, longitude: 79.6591 },
  ],
  'West Bengal': [
    { id: 'wb_1', name: 'Kolkata', hindiName: 'कोलकाता', state: 'West Bengal', latitude: 22.5726, longitude: 88.3639, isMajorCity: true },
    { id: 'wb_2', name: 'Howrah', hindiName: 'हावड़ा', state: 'West Bengal', latitude: 22.5958, longitude: 88.2636, isMajorCity: true },
    { id: 'wb_3', name: 'North 24 Parganas (Barasat/Salt Lake)', hindiName: 'उत्तर 24 परगना', state: 'West Bengal', latitude: 22.7230, longitude: 88.4810 },
    { id: 'wb_4', name: 'South 24 Parganas (Jadavpur/Sonarpur)', hindiName: 'दक्षिण 24 परगना', state: 'West Bengal', latitude: 22.4200, longitude: 88.4100 },
    { id: 'wb_5', name: 'Siliguri (Darjeeling)', hindiName: 'सिलीगुड़ी', state: 'West Bengal', latitude: 26.7271, longitude: 88.3953, isMajorCity: true },
    { id: 'wb_6', name: 'Asansol (Paschim Bardhaman)', hindiName: 'आसनसोल', state: 'West Bengal', latitude: 23.6739, longitude: 86.9524 },
    { id: 'wb_7', name: 'Durgapur', hindiName: 'दुर्गापुर', state: 'West Bengal', latitude: 23.5204, longitude: 87.3119 },
    { id: 'wb_8', name: 'Bardhaman', hindiName: 'बर्दवान', state: 'West Bengal', latitude: 23.2324, longitude: 87.8615 },
    { id: 'wb_9', name: 'Malda', hindiName: 'मालदा', state: 'West Bengal', latitude: 25.0108, longitude: 88.1411 },
    { id: 'wb_10', name: 'Kharagpur (Paschim Medinipur)', hindiName: 'खड़गपुर', state: 'West Bengal', latitude: 22.3460, longitude: 87.2320 },
  ],
  // Union Territories
  'Delhi (NCT)': [
    { id: 'dl_1', name: 'Central Delhi (Connaught Place)', hindiName: 'सेंट्रल दिल्ली', state: 'Delhi (NCT)', latitude: 28.6139, longitude: 77.2090, isMajorCity: true },
    { id: 'dl_2', name: 'South Delhi (Saket / Hauz Khas / Lajpat Nagar)', hindiName: 'साउथ दिल्ली', state: 'Delhi (NCT)', latitude: 28.5245, longitude: 77.2066, isMajorCity: true },
    { id: 'dl_3', name: 'North Delhi (Civil Lines / Model Town)', hindiName: 'नॉर्थ दिल्ली', state: 'Delhi (NCT)', latitude: 28.6892, longitude: 77.2081 },
    { id: 'dl_4', name: 'West Delhi (Janakpuri / Rajouri Garden)', hindiName: 'वेस्ट दिल्ली', state: 'Delhi (NCT)', latitude: 28.6219, longitude: 77.0878 },
    { id: 'dl_5', name: 'East Delhi (Laxmi Nagar / Mayur Vihar)', hindiName: 'ईस्ट दिल्ली', state: 'Delhi (NCT)', latitude: 28.6280, longitude: 77.2950 },
    { id: 'dl_6', name: 'Rohini & Pitampura (North West Delhi)', hindiName: 'रोहिणी', state: 'Delhi (NCT)', latitude: 28.7495, longitude: 77.0565 },
    { id: 'dl_7', name: 'Dwarka (South West Delhi)', hindiName: 'द्वारका', state: 'Delhi (NCT)', latitude: 28.5921, longitude: 77.0460 },
  ],
  'Jammu and Kashmir': [
    { id: 'jk_1', name: 'Srinagar', hindiName: 'श्रीनगर', state: 'Jammu and Kashmir', latitude: 34.0837, longitude: 74.7973, isMajorCity: true },
    { id: 'jk_2', name: 'Jammu', hindiName: 'जम्मू', state: 'Jammu and Kashmir', latitude: 32.7266, longitude: 74.8570, isMajorCity: true },
    { id: 'jk_3', name: 'Anantnag', hindiName: 'अनंतनाग', state: 'Jammu and Kashmir', latitude: 33.7311, longitude: 75.1522 },
    { id: 'jk_4', name: 'Baramulla', hindiName: 'बारामूला', state: 'Jammu and Kashmir', latitude: 34.1980, longitude: 74.3636 },
    { id: 'jk_5', name: 'Udhampur', hindiName: 'उधमपुर', state: 'Jammu and Kashmir', latitude: 32.9250, longitude: 75.1417 },
  ],
  'Ladakh': [
    { id: 'la_1', name: 'Leh', hindiName: 'लेह', state: 'Ladakh', latitude: 34.1526, longitude: 77.5771, isMajorCity: true },
    { id: 'la_2', name: 'Kargil', hindiName: 'कारगिल', state: 'Ladakh', latitude: 34.5539, longitude: 76.1349 },
  ],
  'Chandigarh': [
    { id: 'ch_1', name: 'Chandigarh Central (Sector 17)', hindiName: 'चंडीगढ़', state: 'Chandigarh', latitude: 30.7333, longitude: 76.7794, isMajorCity: true },
    { id: 'ch_2', name: 'Manimajra & IT Park', hindiName: 'मनीमाजरा', state: 'Chandigarh', latitude: 30.7189, longitude: 76.8400 },
  ],
  'Puducherry': [
    { id: 'py_1', name: 'Puducherry', hindiName: 'पुडुचेरी', state: 'Puducherry', latitude: 11.9416, longitude: 79.8083, isMajorCity: true },
    { id: 'py_2', name: 'Karaikal', hindiName: 'कराईकल', state: 'Puducherry', latitude: 10.9254, longitude: 79.8380 },
  ],
  'Dadra and Nagar Haveli and Daman and Diu': [
    { id: 'dd_1', name: 'Daman', hindiName: 'दमन', state: 'Dadra and Nagar Haveli and Daman and Diu', latitude: 20.4283, longitude: 72.8397, isMajorCity: true },
    { id: 'dd_2', name: 'Silvassa', hindiName: 'सिलवासा', state: 'Dadra and Nagar Haveli and Daman and Diu', latitude: 20.2763, longitude: 73.0083 },
  ],
  'Andaman and Nicobar Islands': [
    { id: 'an_1', name: 'Port Blair', hindiName: 'पोर्ट ब्लेयर', state: 'Andaman and Nicobar Islands', latitude: 11.6234, longitude: 92.7265, isMajorCity: true },
  ],
  'Lakshadweep': [
    { id: 'ld_1', name: 'Kavaratti', hindiName: 'कवरत्ती', state: 'Lakshadweep', latitude: 10.5667, longitude: 72.6417, isMajorCity: true },
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
