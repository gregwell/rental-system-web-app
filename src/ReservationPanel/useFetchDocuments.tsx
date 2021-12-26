import axios from "axios";
import { useCallback } from "react";

import { Item, Reservation } from "../General/types";

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

export async function searchDocuments(collection: string): Promise<
  Item[] | Reservation[]
> {
  try { 
    const response = await axios({
      method: "POST",
      url: "https://data.mongodb-api.com/app/data-lasjp/endpoint/data/beta/action/find",
      headers: {
        "Content-Type": "application/json",
        "api-key":
          "EPj8nhVP0kRnB3swQRfzvgNVMlQCFmcQ7lW2ZbyMfgE23zLZCGDDpp3o3n6X45o6",
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
