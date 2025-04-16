import type { Apartment_t, PriceValues_t } from "~/types/ApartmentTypes";

function ParseLocalStorage(storageKeyName: string): any 
{
    return JSON.parse(localStorage.getItem(storageKeyName) as string); 
}

export function GetApartmentInfo(name: string): Apartment_t | null
{
    const rentList = ParseLocalStorage("rentList");
    if (rentList[name]) return rentList[name] as Apartment_t;
    else return null;
}

export function GetPriceValues(): PriceValues_t
{
    return ParseLocalStorage("priceValues");
}



