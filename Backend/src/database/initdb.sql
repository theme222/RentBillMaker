CREATE TABLE IF NOT EXISTS GlobalFees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rent INTEGER DEFAULT 1200,
    serviceFee INTEGER DEFAULT 750,
    wasteFee INTEGER DEFAULT 40,
    safetyFee INTEGER DEFAULT 350,
    electricityPerUnit INTEGER DEFAULT 9,
    waterPerUnit INTEGER DEFAULT 35,
    currentMonth TEXT NOT NULL DEFAULT 'มกราคม',
    currentYear INTEGER NOT NULL DEFAULT 0
);

/*
CREATE TABLE IF NOT EXISTS "${sheetName}" (
    roomName TEXT DEFAULT "",
    await DB.close()
    name TEXT DEFAULT "",
    electricity INTEGER DEFAULT 0,
    water INTEGER DEFAULT 0,
    miscellaneous TEXT DEFAULT ""
  );
*/
