import axios from "axios";

import {
  Item,
  Reservation,
  ReservationPostBody,
  UserPostBody,
} from "../General/types";

export async function sendPostRequest(
  collection: string,
  body: ReservationPostBody | UserPostBody
): Promise<Item[] | Reservation[]> {
  const apiKey = process.env.REACT_APP_MONGO_API_KEY;
  if (!apiKey) {
    return [];
  }
  try {
    const response = await axios({
      method: "POST",
      url: "https://data.mongodb-api.com/app/data-lasjp/endpoint/data/beta/action/insertOne",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
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
