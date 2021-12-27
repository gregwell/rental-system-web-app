import axios from "axios";
import { useCallback } from "react";

import { Item, Reservation, ReservationPostBody, UserPostBody } from "../General/types";

export const usePostData = () => {
  const postData = useCallback(
    (collection: string, body: ReservationPostBody | UserPostBody) => {
      try {
        return sendPostRequest(collection, body);
      } catch (err) {
        return [];
      }
    },
    []
  );

  return { postData };
};

export async function sendPostRequest(
  collection: string,
  body: ReservationPostBody | UserPostBody
): Promise<Item[] | Reservation[]> {
  try {
    const response = await axios({
      method: "POST",
      url: "https://data.mongodb-api.com/app/data-lasjp/endpoint/data/beta/action/insertOne",
      headers: {
        "Content-Type": "application/json",
        "api-key":
          "EPj8nhVP0kRnB3swQRfzvgNVMlQCFmcQ7lW2ZbyMfgE23zLZCGDDpp3o3n6X45o6",
      },
      data: JSON.stringify({
        collection: collection,
        database: "rental-data",
        dataSource: "rental-system",
        document: body,
      }),
    });
    return response.data.documents;
  } catch (error) {
    console.log(error);
  }
  return [];
}
