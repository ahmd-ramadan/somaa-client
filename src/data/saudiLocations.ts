export interface ISaudiLocation {
    id: string;
    name: string;
    nameAr: string;
    lat: number;
    lng: number;
    cities: {
        id: string;
        name: string;
        nameAr: string;
        lat: number;
        lng: number;
        districts: {
            id: string;
            name: string;
            nameAr: string;
            lat: number;
            lng: number;
        }[];
    }[];
}

export const saudiLocations: ISaudiLocation[] = [
    {
        id: "riyadh",
        name: "Riyadh Region",
        nameAr: "منطقة الرياض",
        lat: 24.7136,
        lng: 46.6753,
        cities: [
            {
                id: "riyadh_city",
                name: "Riyadh",
                nameAr: "الرياض",
                lat: 24.7136,
                lng: 46.6753,
                districts: [
                    { id: "olaya", name: "Olaya", nameAr: "حي العليا", lat: 24.7065, lng: 46.6842 },
                    { id: "malaz", name: "Malaz", nameAr: "حي الملز", lat: 24.6778, lng: 46.6993 },
                    { id: "north_riyadh", name: "North Riyadh", nameAr: "شمال الرياض", lat: 24.8133, lng: 46.7219 },
                    { id: "south_riyadh", name: "South Riyadh", nameAr: "جنوب الرياض", lat: 24.6011, lng: 46.6805 },
                    { id: "al_nakheel", name: "Al Nakheel", nameAr: "حي النخيل", lat: 24.7604, lng: 46.6423 },
                    { id: "al_wizarat", name: "Al Wizarat", nameAr: "حي الوزارات", lat: 24.6874, lng: 46.6890 }
                ]
            },
            {
                id: "diriyah",
                name: "Diriyah",
                nameAr: "الدرعية",
                lat: 24.7373,
                lng: 46.5727,
                districts: [
                    { id: "old_diriyah", name: "Old Diriyah", nameAr: "الدرعية القديمة", lat: 24.7373, lng: 46.5727 },
                    { id: "new_diriyah", name: "New Diriyah", nameAr: "الدرعية الجديدة", lat: 24.7532, lng: 46.5561 },
                    { id: "al_samhan", name: "Al Samhan", nameAr: "حي السمحان", lat: 24.7214, lng: 46.5892 }
                ]
            },
            {
                id: "kharj",
                name: "Al Kharj",
                nameAr: "الخرج",
                lat: 24.1449,
                lng: 47.3059,
                districts: [
                    { id: "kharj_center", name: "Al Kharj Center", nameAr: "وسط الخرج", lat: 24.1449, lng: 47.3059 },
                    { id: "kharj_north", name: "North Al Kharj", nameAr: "شمال الخرج", lat: 24.1783, lng: 47.3021 },
                    { id: "al_saylah", name: "Al Saylah", nameAr: "حي السيلة", lat: 24.1325, lng: 47.2907 }
                ]
            },
            {
                id: "dawadmi",
                name: "Dawadmi",
                nameAr: "الدوادمي",
                lat: 24.5049,
                lng: 44.3924,
                districts: [
                    { id: "dawadmi_center", name: "Dawadmi Center", nameAr: "وسط الدوادمي", lat: 24.5049, lng: 44.3924 },
                    { id: "al_khaldiyah", name: "Al Khaldiyah", nameAr: "حي الخالدية", lat: 24.5187, lng: 44.4012 }
                ]
            },
            {
                id: "afif",
                name: "Afif",
                nameAr: "عفيف",
                lat: 23.9065,
                lng: 42.9206,
                districts: [
                    { id: "afif_center", name: "Afif Center", nameAr: "وسط عفيف", lat: 23.9065, lng: 42.9206 }
                ]
            },
            {
                id: "shagra",
                name: "Shagra",
                nameAr: "شقراء",
                lat: 25.2489,
                lng: 45.2635,
                districts: [
                    { id: "shagra_center", name: "Shagra Center", nameAr: "وسط شقراء", lat: 25.2489, lng: 45.2635 }
                ]
            },
            {
                id: "rumah",
                name: "Rumah",
                nameAr: "رماح",
                lat: 25.6774,
                lng: 45.7416,
                districts: [
                    { id: "rumah_center", name: "Rumah Center", nameAr: "وسط رماح", lat: 25.6774, lng: 45.7416 }
                ]
            },
            {
                id: "huraymila",
                name: "Huraymila",
                nameAr: "حريملاء",
                lat: 25.1308,
                lng: 46.1226,
                districts: [
                    { id: "huraymila_center", name: "Huraymila Center", nameAr: "وسط حريملاء", lat: 25.1308, lng: 46.1226 }
                ]
            }
        ]
    },
    {
        id: "makkah",
        name: "Makkah Region",
        nameAr: "منطقة مكة المكرمة",
        lat: 21.3891,
        lng: 39.8579,
        cities: [
            {
                id: "makkah_city",
                name: "Makkah",
                nameAr: "مكة المكرمة",
                lat: 21.3891,
                lng: 39.8579,
                districts: [
                    { id: "al_haram", name: "Al Haram", nameAr: "الحرم", lat: 21.4225, lng: 39.8262 },
                    { id: "al_aziziyah", name: "Al Aziziyah", nameAr: "العزيزية", lat: 21.4333, lng: 39.8000 },
                    { id: "al_andalus", name: "Al Andalus", nameAr: "الأندلس", lat: 21.5500, lng: 39.1667 },
                    { id: "al_awali", name: "Al Awali", nameAr: "العوالي", lat: 21.3667, lng: 39.9500 },
                    { id: "al_shisha", name: "Al Shisha", nameAr: "الششة", lat: 21.4167, lng: 39.8167 }
                ]
            },
            {
                id: "jeddah",
                name: "Jeddah",
                nameAr: "جدة",
                lat: 21.5433,
                lng: 39.1728,
                districts: [
                    { id: "al_balad", name: "Al Balad", nameAr: "البلد", lat: 21.5433, lng: 39.1728 },
                    { id: "al_hamra", name: "Al Hamra", nameAr: "الحمراء", lat: 21.5786, lng: 39.1517 },
                    { id: "al_rehab", name: "Al Rehab", nameAr: "الرحاب", lat: 21.6167, lng: 39.1500 },
                    { id: "al_salamah", name: "Al Salamah", nameAr: "السلامة", lat: 21.5833, lng: 39.1667 },
                    { id: "al_rawdah", name: "Al Rawdah", nameAr: "الروضة", lat: 21.6000, lng: 39.1333 }
                ]
            },
            {
                id: "taif",
                name: "Taif",
                nameAr: "الطائف",
                lat: 21.4373,
                lng: 40.5127,
                districts: [
                    { id: "taif_center", name: "Taif Center", nameAr: "وسط الطائف", lat: 21.4373, lng: 40.5127 },
                    { id: "al_hawiyah", name: "Al Hawiyah", nameAr: "الحوية", lat: 21.4500, lng: 40.5333 },
                    { id: "al_ruddaf", name: "Al Ruddaf", nameAr: "الردف", lat: 21.4167, lng: 40.5000 }
                ]
            },
            {
                id: "rabigh",
                name: "Rabigh",
                nameAr: "رابغ",
                lat: 22.7986,
                lng: 39.0347,
                districts: [
                    { id: "rabigh_center", name: "Rabigh Center", nameAr: "وسط رابغ", lat: 22.7986, lng: 39.0347 },
                    { id: "al_balad_rabigh", name: "Al Balad", nameAr: "البلد", lat: 22.8000, lng: 39.0333 }
                ]
            },
            {
                id: "khulais",
                name: "Khulais",
                nameAr: "خليص",
                lat: 22.1167,
                lng: 39.2833,
                districts: [
                    { id: "khulais_center", name: "Khulais Center", nameAr: "وسط خليص", lat: 22.1167, lng: 39.2833 }
                ]
            },
            {
                id: "al_lith",
                name: "Al Lith",
                nameAr: "الليث",
                lat: 20.1500,
                lng: 40.2833,
                districts: [
                    { id: "al_lith_center", name: "Al Lith Center", nameAr: "وسط الليث", lat: 20.1500, lng: 40.2833 }
                ]
            },
            {
                id: "al_qunfudhah",
                name: "Al Qunfudhah",
                nameAr: "القنفذة",
                lat: 19.1264,
                lng: 41.0789,
                districts: [
                    { id: "al_qunfudhah_center", name: "Al Qunfudhah Center", nameAr: "وسط القنفذة", lat: 19.1264, lng: 41.0789 }
                ]
            },
            {
                id: "al_jumum",
                name: "Al Jumum",
                nameAr: "الجموم",
                lat: 21.9167,
                lng: 39.7333,
                districts: [
                    { id: "al_jumum_center", name: "Al Jumum Center", nameAr: "وسط الجموم", lat: 21.9167, lng: 39.7333 }
                ]
            }
        ]
    },
    {
        id: "madinah",
        name: "Madinah Region",
        nameAr: "منطقة المدينة المنورة",
        lat: 24.5247,
        lng: 39.5692,
        cities: [
            {
                id: "madinah_city",
                name: "Madinah",
                nameAr: "المدينة المنورة",
                lat: 24.5247,
                lng: 39.5692,
                districts: [
                    { id: "al_haram_madinah", name: "Al Haram", nameAr: "الحرم", lat: 24.4675, lng: 39.6111 },
                    { id: "al_ansar", name: "Al Ansar", nameAr: "الأنصار", lat: 24.5000, lng: 39.5667 },
                    { id: "al_awali", name: "Al Awali", nameAr: "العوالي", lat: 24.5167, lng: 39.5833 },
                    { id: "al_aziziyah_madinah", name: "Al Aziziyah", nameAr: "العزيزية", lat: 24.4833, lng: 39.6000 },
                    { id: "al_manakhah", name: "Al Manakhah", nameAr: "المناخة", lat: 24.4667, lng: 39.6000 }
                ]
            },
            {
                id: "yanbu",
                name: "Yanbu",
                nameAr: "ينبع",
                lat: 24.0895,
                lng: 38.0618,
                districts: [
                    { id: "yanbu_industrial", name: "Yanbu Industrial", nameAr: "ينبع الصناعية", lat: 23.9983, lng: 38.2297 },
                    { id: "yanbu_al_bahr", name: "Yanbu Al Bahr", nameAr: "ينبع البحر", lat: 24.0895, lng: 38.0618 },
                    { id: "al_nakheel_yanbu", name: "Al Nakheel", nameAr: "النخيل", lat: 24.0833, lng: 38.0667 }
                ]
            },
            {
                id: "al_ula",
                name: "Al Ula",
                nameAr: "العلا",
                lat: 26.6085,
                lng: 37.9232,
                districts: [
                    { id: "al_ula_center", name: "Al Ula Center", nameAr: "وسط العلا", lat: 26.6085, lng: 37.9232 },
                    { id: "al_mabiyat", name: "Al Mabiyat", nameAr: "المابيات", lat: 26.6333, lng: 37.9167 }
                ]
            },
            {
                id: "badr",
                name: "Badr",
                nameAr: "بدر",
                lat: 23.7833,
                lng: 38.7833,
                districts: [
                    { id: "badr_center", name: "Badr Center", nameAr: "وسط بدر", lat: 23.7833, lng: 38.7833 }
                ]
            },
            {
                id: "khaybar",
                name: "Khaybar",
                nameAr: "خيبر",
                lat: 25.6969,
                lng: 39.2922,
                districts: [
                    { id: "khaybar_center", name: "Khaybar Center", nameAr: "وسط خيبر", lat: 25.6969, lng: 39.2922 }
                ]
            },
            {
                id: "al_hanakiyah",
                name: "Al Hanakiyah",
                nameAr: "الحناكية",
                lat: 24.2500,
                lng: 39.8667,
                districts: [
                    { id: "al_hanakiyah_center", name: "Al Hanakiyah Center", nameAr: "وسط الحناكية", lat: 24.2500, lng: 39.8667 }
                ]
            }
        ]
    },
    {
        id: "eastern",
        name: "Eastern Region",
        nameAr: "المنطقة الشرقية",
        lat: 26.4207,
        lng: 50.0888,
        cities: [
            {
                id: "dammam",
                name: "Dammam",
                nameAr: "الدمام",
                lat: 26.4207,
                lng: 50.0888,
                districts: [
                    { id: "al_khobar", name: "Al Khobar", nameAr: "الخبر", lat: 26.3029, lng: 50.2195 },
                    { id: "al_dhahran", name: "Al Dhahran", nameAr: "الظهران", lat: 26.2886, lng: 50.1140 },
                    { id: "al_aziziyah_dammam", name: "Al Aziziyah", nameAr: "العزيزية", lat: 26.3667, lng: 50.1000 },
                    { id: "al_nakheel_dammam", name: "Al Nakheel", nameAr: "النخيل", lat: 26.3833, lng: 50.0833 },
                    { id: "al_hamra_dammam", name: "Al Hamra", nameAr: "الحمراء", lat: 26.4000, lng: 50.1000 }
                ]
            },
            {
                id: "al_ahsa",
                name: "Al Ahsa",
                nameAr: "الأحساء",
                lat: 25.3833,
                lng: 49.5833,
                districts: [
                    { id: "al_hofuf", name: "Al Hofuf", nameAr: "الهفوف", lat: 25.3833, lng: 49.5833 },
                    { id: "al_mubarraz", name: "Al Mubarraz", nameAr: "المبرز", lat: 25.4167, lng: 49.5833 },
                    { id: "al_omran", name: "Al Omran", nameAr: "العمران", lat: 25.4000, lng: 49.6000 },
                    { id: "al_jafr", name: "Al Jafr", nameAr: "الجفر", lat: 25.3667, lng: 49.5667 }
                ]
            },
            {
                id: "jubail",
                name: "Jubail",
                nameAr: "الجبيل",
                lat: 27.0112,
                lng: 49.6580,
                districts: [
                    { id: "jubail_industrial", name: "Jubail Industrial", nameAr: "الجبيل الصناعية", lat: 27.0112, lng: 49.6580 },
                    { id: "jubail_city", name: "Jubail City", nameAr: "مدينة الجبيل", lat: 27.0000, lng: 49.6667 },
                    { id: "al_fanateer", name: "Al Fanateer", nameAr: "الفناتير", lat: 27.0333, lng: 49.6333 }
                ]
            },
            {
                id: "qatif",
                name: "Qatif",
                nameAr: "القطيف",
                lat: 26.5667,
                lng: 50.0167,
                districts: [
                    { id: "qatif_center", name: "Qatif Center", nameAr: "وسط القطيف", lat: 26.5667, lng: 50.0167 },
                    { id: "safwa", name: "Safwa", nameAr: "صفوى", lat: 26.6500, lng: 49.9500 },
                    { id: "al_awamiyah", name: "Al Awamiyah", nameAr: "العوامية", lat: 26.5833, lng: 49.9833 }
                ]
            },
            {
                id: "hafr_al_batin",
                name: "Hafr Al Batin",
                nameAr: "حفر الباطن",
                lat: 28.4333,
                lng: 45.9667,
                districts: [
                    { id: "hafr_al_batin_center", name: "Hafr Al Batin Center", nameAr: "وسط حفر الباطن", lat: 28.4333, lng: 45.9667 },
                    { id: "al_nairiya_hafr", name: "Al Nairiya", nameAr: "النعيرية", lat: 28.4500, lng: 45.9500 }
                ]
            },
            {
                id: "al_khafji",
                name: "Al Khafji",
                nameAr: "الخفجي",
                lat: 28.4392,
                lng: 48.4914,
                districts: [
                    { id: "al_khafji_center", name: "Al Khafji Center", nameAr: "وسط الخفجي", lat: 28.4392, lng: 48.4914 }
                ]
            },
            {
                id: "al_nairyah",
                name: "Al Nairyah",
                nameAr: "النعيرية",
                lat: 27.4667,
                lng: 48.4167,
                districts: [
                    { id: "al_nairyah_center", name: "Al Nairyah Center", nameAr: "وسط النعيرية", lat: 27.4667, lng: 48.4167 }
                ]
            },
            {
                id: "al_udayriyah",
                name: "Al Udayriyah",
                nameAr: "العضيلية",
                lat: 26.5333,
                lng: 49.9833,
                districts: [
                    { id: "al_udayriyah_center", name: "Al Udayriyah Center", nameAr: "وسط العضيلية", lat: 26.5333, lng: 49.9833 }
                ]
            }
        ]
    },
    {
        id: "asir",
        name: "Asir Region",
        nameAr: "منطقة عسير",
        lat: 18.2500,
        lng: 42.5000,
        cities: [
            {
                id: "abha",
                name: "Abha",
                nameAr: "أبها",
                lat: 18.2167,
                lng: 42.5000,
                districts: [
                    { id: "abha_center", name: "Abha Center", nameAr: "وسط أبها", lat: 18.2167, lng: 42.5000 },
                    { id: "al_sahab", name: "Al Sahab", nameAr: "السحاب", lat: 18.2333, lng: 42.5167 },
                    { id: "al_andalus_abha", name: "Al Andalus", nameAr: "الأندلس", lat: 18.2000, lng: 42.4833 },
                    { id: "al_nuzha_abha", name: "Al Nuzha", nameAr: "النزهة", lat: 18.2167, lng: 42.4833 }
                ]
            },
            {
                id: "khamis_mushait",
                name: "Khamis Mushait",
                nameAr: "خميس مشيط",
                lat: 18.3000,
                lng: 42.7333,
                districts: [
                    { id: "khamis_center", name: "Khamis Center", nameAr: "وسط خميس مشيط", lat: 18.3000, lng: 42.7333 },
                    { id: "al_aziziyah_khamis", name: "Al Aziziyah", nameAr: "العزيزية", lat: 18.3167, lng: 42.7500 }
                ]
            },
            {
                id: "bisha",
                name: "Bisha",
                nameAr: "بيشة",
                lat: 20.0000,
                lng: 42.6167,
                districts: [
                    { id: "bisha_center", name: "Bisha Center", nameAr: "وسط بيشة", lat: 20.0000, lng: 42.6167 }
                ]
            },
            {
                id: "najran_city",
                name: "Najran",
                nameAr: "نجران",
                lat: 17.4917,
                lng: 44.1322,
                districts: [
                    { id: "najran_center", name: "Najran Center", nameAr: "وسط نجران", lat: 17.4917, lng: 44.1322 }
                ]
            },
            {
                id: "sarat_abidah",
                name: "Sarat Abidah",
                nameAr: "سراة عبيدة",
                lat: 19.7000,
                lng: 42.9500,
                districts: [
                    { id: "sarat_abidah_center", name: "Sarat Abidah Center", nameAr: "وسط سراة عبيدة", lat: 19.7000, lng: 42.9500 }
                ]
            },
            {
                id: "tathleeth",
                name: "Tathleeth",
                nameAr: "تثليث",
                lat: 19.5333,
                lng: 43.5000,
                districts: [
                    { id: "tathleeth_center", name: "Tathleeth Center", nameAr: "وسط تثليث", lat: 19.5333, lng: 43.5000 }
                ]
            },
            {
                id: "muhayil",
                name: "Muhayil",
                nameAr: "محايل",
                lat: 18.5167,
                lng: 42.0833,
                districts: [
                    { id: "muhayil_center", name: "Muhayil Center", nameAr: "وسط محايل", lat: 18.5167, lng: 42.0833 }
                ]
            }
        ]
    },
    {
        id: "tabuk",
        name: "Tabuk Region",
        nameAr: "منطقة تبوك",
        lat: 28.3833,
        lng: 36.5833,
        cities: [
            {
                id: "tabuk_city",
                name: "Tabuk",
                nameAr: "تبوك",
                lat: 28.3833,
                lng: 36.5833,
                districts: [
                    { id: "tabuk_center", name: "Tabuk Center", nameAr: "وسط تبوك", lat: 28.3833, lng: 36.5833 },
                    { id: "al_nakheel_tabuk", name: "Al Nakheel", nameAr: "النخيل", lat: 28.4000, lng: 36.6000 },
                    { id: "al_aziziyah_tabuk", name: "Al Aziziyah", nameAr: "العزيزية", lat: 28.3667, lng: 36.5667 }
                ]
            },
            {
                id: "duba",
                name: "Duba",
                nameAr: "ضباء",
                lat: 27.3500,
                lng: 35.7000,
                districts: [
                    { id: "duba_center", name: "Duba Center", nameAr: "وسط ضباء", lat: 27.3500, lng: 35.7000 }
                ]
            },
            {
                id: "umluj",
                name: "Umluj",
                nameAr: "أملج",
                lat: 25.0500,
                lng: 37.2667,
                districts: [
                    { id: "umluj_center", name: "Umluj Center", nameAr: "وسط أملج", lat: 25.0500, lng: 37.2667 }
                ]
            },
            {
                id: "al_wajh",
                name: "Al Wajh",
                nameAr: "الوجه",
                lat: 26.2333,
                lng: 36.4667,
                districts: [
                    { id: "al_wajh_center", name: "Al Wajh Center", nameAr: "وسط الوجه", lat: 26.2333, lng: 36.4667 }
                ]
            },
            {
                id: "haql",
                name: "Haql",
                nameAr: "حقل",
                lat: 29.2833,
                lng: 34.9333,
                districts: [
                    { id: "haql_center", name: "Haql Center", nameAr: "وسط حقل", lat: 29.2833, lng: 34.9333 }
                ]
            },
            {
                id: "tayma",
                name: "Tayma",
                nameAr: "تيماء",
                lat: 27.6333,
                lng: 38.5500,
                districts: [
                    { id: "tayma_center", name: "Tayma Center", nameAr: "وسط تيماء", lat: 27.6333, lng: 38.5500 }
                ]
            }
        ]
    },
    {
        id: "hail",
        name: "Hail Region",
        nameAr: "منطقة حائل",
        lat: 27.5167,
        lng: 41.6833,
        cities: [
            {
                id: "hail_city",
                name: "Hail",
                nameAr: "حائل",
                lat: 27.5167,
                lng: 41.6833,
                districts: [
                    { id: "hail_center", name: "Hail Center", nameAr: "وسط حائل", lat: 27.5167, lng: 41.6833 },
                    { id: "al_nakheel_hail", name: "Al Nakheel", nameAr: "النخيل", lat: 27.5333, lng: 41.7000 },
                    { id: "al_aziziyah_hail", name: "Al Aziziyah", nameAr: "العزيزية", lat: 27.5000, lng: 41.6667 }
                ]
            },
            {
                id: "baqaa",
                name: "Baqaa",
                nameAr: "بقعاء",
                lat: 28.0500,
                lng: 41.2500,
                districts: [
                    { id: "baqaa_center", name: "Baqaa Center", nameAr: "وسط بقعاء", lat: 28.0500, lng: 41.2500 }
                ]
            },
            {
                id: "al_gazalah",
                name: "Al Gazalah",
                nameAr: "الغزالة",
                lat: 27.6667,
                lng: 41.7500,
                districts: [
                    { id: "al_gazalah_center", name: "Al Gazalah Center", nameAr: "وسط الغزالة", lat: 27.6667, lng: 41.7500 }
                ]
            },
            {
                id: "al_shinan",
                name: "Al Shinan",
                nameAr: "الشنان",
                lat: 28.0833,
                lng: 41.1667,
                districts: [
                    { id: "al_shinan_center", name: "Al Shinan Center", nameAr: "وسط الشنان", lat: 28.0833, lng: 41.1667 }
                ]
            },
            {
                id: "al_sulaimi",
                name: "Al Sulaimi",
                nameAr: "السليمي",
                lat: 27.4500,
                lng: 41.6000,
                districts: [
                    { id: "al_sulaimi_center", name: "Al Sulaimi Center", nameAr: "وسط السليمي", lat: 27.4500, lng: 41.6000 }
                ]
            }
        ]
    },
    {
        id: "northern_borders",
        name: "Northern Borders Region",
        nameAr: "منطقة الحدود الشمالية",
        lat: 30.9756,
        lng: 41.0381,
        cities: [
            {
                id: "arar",
                name: "Arar",
                nameAr: "عرعر",
                lat: 30.9756,
                lng: 41.0381,
                districts: [
                    { id: "arar_center", name: "Arar Center", nameAr: "وسط عرعر", lat: 30.9756, lng: 41.0381 },
                    { id: "al_nakheel_arar", name: "Al Nakheel", nameAr: "النخيل", lat: 30.9833, lng: 41.0500 }
                ]
            },
            {
                id: "rafha",
                name: "Rafha",
                nameAr: "رفحاء",
                lat: 29.6333,
                lng: 43.5000,
                districts: [
                    { id: "rafha_center", name: "Rafha Center", nameAr: "وسط رفحاء", lat: 29.6333, lng: 43.5000 }
                ]
            },
            {
                id: "turaif",
                name: "Turaif",
                nameAr: "طريف",
                lat: 31.6833,
                lng: 38.6500,
                districts: [
                    { id: "turaif_center", name: "Turaif Center", nameAr: "وسط طريف", lat: 31.6833, lng: 38.6500 }
                ]
            },
            {
                id: "al_uwaiqilah",
                name: "Al Uwaiqilah",
                nameAr: "العويقيلة",
                lat: 30.5333,
                lng: 41.1333,
                districts: [
                    { id: "al_uwaiqilah_center", name: "Al Uwaiqilah Center", nameAr: "وسط العويقيلة", lat: 30.5333, lng: 41.1333 }
                ]
            }
        ]
    },
    {
        id: "jazan",
        name: "Jazan Region",
        nameAr: "منطقة جازان",
        lat: 16.8892,
        lng: 42.5611,
        cities: [
            {
                id: "jazan_city",
                name: "Jazan",
                nameAr: "جازان",
                lat: 16.8892,
                lng: 42.5611,
                districts: [
                    { id: "jazan_center", name: "Jazan Center", nameAr: "وسط جازان", lat: 16.8892, lng: 42.5611 },
                    { id: "al_rawdah_jazan", name: "Al Rawdah", nameAr: "الروضة", lat: 16.9000, lng: 42.5667 },
                    { id: "al_aziziyah_jazan", name: "Al Aziziyah", nameAr: "العزيزية", lat: 16.8833, lng: 42.5500 }
                ]
            },
            {
                id: "sabya",
                name: "Sabya",
                nameAr: "صبياء",
                lat: 17.1500,
                lng: 42.6167,
                districts: [
                    { id: "sabya_center", name: "Sabya Center", nameAr: "وسط صبياء", lat: 17.1500, lng: 42.6167 }
                ]
            },
            {
                id: "abuarish",
                name: "Abu Arish",
                nameAr: "أبو عريش",
                lat: 16.9667,
                lng: 42.8333,
                districts: [
                    { id: "abuarish_center", name: "Abu Arish Center", nameAr: "وسط أبو عريش", lat: 16.9667, lng: 42.8333 }
                ]
            },
            {
                id: "samtah",
                name: "Samtah",
                nameAr: "صامطة",
                lat: 16.6000,
                lng: 42.9333,
                districts: [
                    { id: "samtah_center", name: "Samtah Center", nameAr: "وسط صامطة", lat: 16.6000, lng: 42.9333 }
                ]
            },
            {
                id: "al_dayer",
                name: "Al Dayer",
                nameAr: "الداير",
                lat: 17.9167,
                lng: 41.9667,
                districts: [
                    { id: "al_dayer_center", name: "Al Dayer Center", nameAr: "وسط الداير", lat: 17.9167, lng: 41.9667 }
                ]
            },
            {
                id: "al_ardah",
                name: "Al Ardah",
                nameAr: "العارضة",
                lat: 16.9167,
                lng: 42.8333,
                districts: [
                    { id: "al_ardah_center", name: "Al Ardah Center", nameAr: "وسط العارضة", lat: 16.9167, lng: 42.8333 }
                ]
            },
            {
                id: "al_harth",
                name: "Al Harth",
                nameAr: "الحريث",
                lat: 17.5167,
                lng: 42.9667,
                districts: [
                    { id: "al_harth_center", name: "Al Harth Center", nameAr: "وسط الحريث", lat: 17.5167, lng: 42.9667 }
                ]
            }
        ]
    },
    {
        id: "najran",
        name: "Najran Region",
        nameAr: "منطقة نجران",
        lat: 17.4917,
        lng: 44.1322,
        cities: [
            {
                id: "najran_city",
                name: "Najran",
                nameAr: "نجران",
                lat: 17.4917,
                lng: 44.1322,
                districts: [
                    { id: "najran_center", name: "Najran Center", nameAr: "وسط نجران", lat: 17.4917, lng: 44.1322 },
                    { id: "al_akoud", name: "Al Akoud", nameAr: "العقود", lat: 17.5000, lng: 44.1333 },
                    { id: "al_mafraq", name: "Al Mafraq", nameAr: "المفرق", lat: 17.4833, lng: 44.1500 }
                ]
            },
            {
                id: "sharurah",
                name: "Sharurah",
                nameAr: "شرورة",
                lat: 17.4833,
                lng: 47.1167,
                districts: [
                    { id: "sharurah_center", name: "Sharurah Center", nameAr: "وسط شرورة", lat: 17.4833, lng: 47.1167 }
                ]
            },
            {
                id: "badr_al_junoob",
                name: "Badr Al Junoob",
                nameAr: "بدر الجنوب",
                lat: 17.3000,
                lng: 44.8000,
                districts: [
                    { id: "badr_al_junoob_center", name: "Badr Al Junoob Center", nameAr: "وسط بدر الجنوب", lat: 17.3000, lng: 44.8000 }
                ]
            },
            {
                id: "hubuna",
                name: "Hubuna",
                nameAr: "حبونا",
                lat: 17.3500,
                lng: 44.0833,
                districts: [
                    { id: "hubuna_center", name: "Hubuna Center", nameAr: "وسط حبونا", lat: 17.3500, lng: 44.0833 }
                ]
            },
            {
                id: "thar",
                name: "Thar",
                nameAr: "ثار",
                lat: 18.0500,
                lng: 44.2167,
                districts: [
                    { id: "thar_center", name: "Thar Center", nameAr: "وسط ثار", lat: 18.0500, lng: 44.2167 }
                ]
            },
            {
                id: "yadamah",
                name: "Yadamah",
                nameAr: "يدمة",
                lat: 17.4833,
                lng: 44.4000,
                districts: [
                    { id: "yadamah_center", name: "Yadamah Center", nameAr: "وسط يدمة", lat: 17.4833, lng: 44.4000 }
                ]
            }
        ]
    },
    {
        id: "al_baha",
        name: "Al Baha Region",
        nameAr: "منطقة الباحة",
        lat: 20.0000,
        lng: 41.4500,
        cities: [
            {
                id: "al_baha_city",
                name: "Al Baha",
                nameAr: "الباحة",
                lat: 20.0000,
                lng: 41.4500,
                districts: [
                    { id: "al_baha_center", name: "Al Baha Center", nameAr: "وسط الباحة", lat: 20.0000, lng: 41.4500 },
                    { id: "al_aziziyah_baha", name: "Al Aziziyah", nameAr: "العزيزية", lat: 20.0167, lng: 41.4667 },
                    { id: "al_nakheel_baha", name: "Al Nakheel", nameAr: "النخيل", lat: 19.9833, lng: 41.4333 }
                ]
            },
            {
                id: "baljurashi",
                name: "Balgurashi",
                nameAr: "بلجرشي",
                lat: 19.8500,
                lng: 41.5833,
                districts: [
                    { id: "baljurashi_center", name: "Balgurashi Center", nameAr: "وسط بلجرشي", lat: 19.8500, lng: 41.5833 }
                ]
            },
            {
                id: "al_mandaq",
                name: "Al Mandaq",
                nameAr: "المندق",
                lat: 19.8000,
                lng: 41.7500,
                districts: [
                    { id: "al_mandaq_center", name: "Al Mandaq Center", nameAr: "وسط المندق", lat: 19.8000, lng: 41.7500 }
                ]
            },
            {
                id: "al_makhwah",
                name: "Al Makhwah",
                nameAr: "المخواة",
                lat: 19.7833,
                lng: 41.4333,
                districts: [
                    { id: "al_makhwah_center", name: "Al Makhwah Center", nameAr: "وسط المخواة", lat: 19.7833, lng: 41.4333 }
                ]
            },
            {
                id: "qiwa",
                name: "Qiwa",
                nameAr: "قوا",
                lat: 19.9167,
                lng: 41.3000,
                districts: [
                    { id: "qiwa_center", name: "Qiwa Center", nameAr: "وسط قوا", lat: 19.9167, lng: 41.3000 }
                ]
            },
            {
                id: "al_aqiq",
                name: "Al Aqiq",
                nameAr: "العقيق",
                lat: 19.9167,
                lng: 41.6667,
                districts: [
                    { id: "al_aqiq_center", name: "Al Aqiq Center", nameAr: "وسط العقيق", lat: 19.9167, lng: 41.6667 }
                ]
            }
        ]
    },
    {
        id: "al_jouf",
        name: "Al Jouf Region",
        nameAr: "منطقة الجوف",
        lat: 29.7833,
        lng: 39.8667,
        cities: [
            {
                id: "sakaka",
                name: "Sakaka",
                nameAr: "سكاكا",
                lat: 29.9697,
                lng: 40.2064,
                districts: [
                    { id: "sakaka_center", name: "Sakaka Center", nameAr: "وسط سكاكا", lat: 29.9697, lng: 40.2064 },
                    { id: "al_nakheel_sakaka", name: "Al Nakheel", nameAr: "النخيل", lat: 29.9833, lng: 40.2167 },
                    { id: "al_aziziyah_sakaka", name: "Al Aziziyah", nameAr: "العزيزية", lat: 29.9667, lng: 40.2000 }
                ]
            },
            {
                id: "qurayyat",
                name: "Qurayyat",
                nameAr: "القريات",
                lat: 31.3167,
                lng: 37.3667,
                districts: [
                    { id: "qurayyat_center", name: "Qurayyat Center", nameAr: "وسط القريات", lat: 31.3167, lng: 37.3667 },
                    { id: "al_hamra_qurayyat", name: "Al Hamra", nameAr: "الحمراء", lat: 31.3333, lng: 37.3500 }
                ]
            },
            {
                id: "dumat_al_jandal",
                name: "Dumat Al Jandal",
                nameAr: "دومة الجندل",
                lat: 29.8167,
                lng: 39.8667,
                districts: [
                    { id: "dumat_al_jandal_center", name: "Dumat Al Jandal Center", nameAr: "وسط دومة الجندل", lat: 29.8167, lng: 39.8667 }
                ]
            },
            {
                id: "tabarjal",
                name: "Tabarjal",
                nameAr: "طبرجل",
                lat: 30.5000,
                lng: 38.2167,
                districts: [
                    { id: "tabarjal_center", name: "Tabarjal Center", nameAr: "وسط طبرجل", lat: 30.5000, lng: 38.2167 }
                ]
            },
            {
                id: "al_isawiyah",
                name: "Al Isawiyah",
                nameAr: "الإساوية",
                lat: 30.0000,
                lng: 40.1333,
                districts: [
                    { id: "al_isawiyah_center", name: "Al Isawiyah Center", nameAr: "وسط الإساوية", lat: 30.0000, lng: 40.1333 }
                ]
            },
            {
                id: "al_kaf",
                name: "Al Kaf",
                nameAr: "الكاف",
                lat: 29.9167,
                lng: 40.2000,
                districts: [
                    { id: "al_kaf_center", name: "Al Kaf Center", nameAr: "وسط الكاف", lat: 29.9167, lng: 40.2000 }
                ]
            }
        ]
    }
];