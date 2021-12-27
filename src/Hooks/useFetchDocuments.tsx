import axios from "axios";
import { useCallback } from "react";

import { Item, Reservation, User, Price } from "../General/types";

export const useFetchDocuments = () => {
  const fetchDocuments = useCallback((collection: string) => {
    try {
      return searchDocuments(collection);
    } catch (err) {
      return [];
    }
  }, []);

  return { fetchDocuments };
};

export async function searchDocuments(
  collection: string
): Promise<Item[] | Reservation[] | User[] | Price[]> {
  const apiKey = process.env.REACT_APP_MONGO_API_KEY;
  if (!apiKey) {
    return [];
  }

  try {
    const response = await axios({
      method: "POST",
      url: "https://data.mongodb-api.com/app/data-lasjp/endpoint/data/beta/action/find",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      data: JSON.stringify({
        collection: `${collection}`,
        database: "rental-data",
        dataSource: "rental-system",
      }),
    });
    return response.data.documents;
  } catch (error) {
    console.log(error);
  }
  return [];
}
