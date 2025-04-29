// Use this file to translate internal property names to output thai versions
export const ThaiToEnglish: { [key: string]: string } = {  
    "ค่าเช่า": "rent",
    "ค่าไฟฟ้า": "electricity",
    "ค่าน้ำประปา": "water",
    "นาม": "name",
    "ห้อง": "roomName",
    "ค่าใช้จ่ายอื่นๆ": "miscellaneous",
    "รวม": "total",
    "ปี": "year",
    "เดือน": "month",
}

export const EnlgishToThai: { [key: string]: string } = {};
// Invert ThaiToEnglish
for (const key in ThaiToEnglish) {
    if (ThaiToEnglish.hasOwnProperty(key)) EnlgishToThai[ThaiToEnglish[key]] = key;
} 
