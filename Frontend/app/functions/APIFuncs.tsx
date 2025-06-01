import { Apartment, GlobalFees } from "~/types/ApartmentTypes";

import axios from "axios";

const API_URL = "http://127.0.0.1:3000";

function HandleError(error: any) {
  console.error(error);
}

export async function UpdateRentList(apartmentList: Apartment[], globalFees: any) {
  const response = await axios
    .post(`${API_URL}/api/update`, {
      apartmentList: apartmentList,
      globalFees: globalFees,
    })
    .catch(HandleError);

  return response;
}

export async function GetRentList(monthYear: string) {
  const response = await axios
    .get(`${API_URL}/api/get`, {
      params: {
        monthYear: monthYear,
      },
    })
    .catch(HandleError);

  if (response) return response.data;
}

export async function GetBillList(monthYear: string) {
  const response = await axios
    .get(`${API_URL}/api/bill`, {
      params: {
        monthYear: monthYear,
      },
    })
    .catch(HandleError);

  if (response) return response.data;
}
