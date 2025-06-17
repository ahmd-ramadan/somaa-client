export interface Region {
    region_id: number;
    capital_city_id: number; // Note: Typo in your JSON ("capital_city_id" vs "capital_city_id")
    code: string;
    name_ar: string;
    name_en: string;
    population: number;
}

export interface RegionsObject {
    [key: number]: Region; // Key is `region_id` as a number
    // Alternative if key should be a string:
    // [key: string]: Region; 
}

const AllRegions = {
    "1": {
      "region_id": 1,
      "capital_city_id": 3,
      "code": "RD",
      "name_ar": "منطقة الرياض",
      "name_en": "Riyadh",
      "population": 6777146
    },
    "2": {
      "region_id": 2,
      "capital_city_id": 6,
      "code": "MQ",
      "name_ar": "منطقة مكة المكرمة",
      "name_en": "Makkah",
      "population": 6915006
    },
    "3": {
      "region_id": 3,
      "capital_city_id": 14,
      "code": "MN",
      "name_ar": "منطقة المدينة المنورة",
      "name_en": "Madinah",
      "population": 1777933
    },
    "4": {
      "region_id": 4,
      "capital_city_id": 11,
      "code": "QA",
      "name_ar": "منطقة القصيم",
      "name_en": "Qassim",
      "population": 1215858
    },
    "5": {
      "region_id": 5,
      "capital_city_id": 13,
      "code": "SQ",
      "name_ar": "المنطقة الشرقية",
      "name_en": "Eastern Province",
      "population": 4105780
    },
    "6": {
      "region_id": 6,
      "capital_city_id": 15,
      "code": "AS",
      "name_ar": "منطقة عسير",
      "name_en": "Asir",
      "population": 1913392
    },
    "7": {
      "region_id": 7,
      "capital_city_id": 1,
      "code": "TB",
      "name_ar": "منطقة تبوك",
      "name_en": "Tabuk",
      "population": 791535
    },
    "8": {
      "region_id": 8,
      "capital_city_id": 10,
      "code": "HA",
      "name_ar": "منطقة حائل",
      "name_en": "Hail",
      "population": 597144
    },
    "9": {
      "region_id": 9,
      "capital_city_id": 2213,
      "code": "SH",
      "name_ar": "منطقة الحدود الشمالية",
      "name_en": "Northern Borders",
      "population": 320524
    },
    "10": {
      "region_id": 10,
      "capital_city_id": 17,
      "code": "GA",
      "name_ar": "منطقة جازان",
      "name_en": "Jazan",
      "population": 1365110
    },
    "11": {
      "region_id": 11,
      "capital_city_id": 3417,
      "code": "NG",
      "name_ar": "منطقة نجران",
      "name_en": "Najran",
      "population": 505652
    },
    "12": {
      "region_id": 12,
      "capital_city_id": 1542,
      "code": "BA",
      "name_ar": "منطقة الباحة",
      "name_en": "Bahah",
      "population": 411888
    },
    "13": {
      "region_id": 13,
      "capital_city_id": 2237,
      "code": "GO",
      "name_ar": "منطقة الجوف",
      "name_en": "Jawf",
      "population": 440009
    }
}