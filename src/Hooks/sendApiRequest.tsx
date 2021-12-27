import axios from "axios";

import {
  Item,
  User,
  Price,
  Reservation,
  ReservationPostBody,
  UserPostBody,
  CrudOperation,
  RequestData,
} from "../General/types";

interface SendApiRequestProps {
  collection: string;
  operation: CrudOperation;
  body?: ReservationPostBody | UserPostBody;
}

const crudActionName = (crud: CrudOperation): string => {
  switch (crud) {
    case CrudOperation.CREATE:
      return "insertOne";
    case CrudOperation.READ:
      return "find";
    case CrudOperation.UPDATE:
      return "updateOne";
  }
};

export async function sendApiRequest({
  collection,
  operation,
  body,
}: SendApiRequestProps): Promise<Item[] | Reservation[] | User[] | Price[]> {
  const apiKey = process.env.REACT_APP_MONGO_API_KEY;
  if (!apiKey) {
    return [];
  }

  const requestData: RequestData = {
    collection: `${collection}`,
    database: "rental-data",
    dataSource: "rental-system",
  };

  if (operation === CrudOperation.CREATE) {
    requestData.document = body;
  }

  try {
    const response = await axios({
      method: "POST",
      url: `https://data.mongodb-api.com/app/data-lasjp/endpoint/data/beta/action/${crudActionName(
        operation
      )}`,
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      data: JSON.stringify(requestData),
    });
    return response.data.documents;
  } catch (error) {
    console.log(error);
  }
  return [];
}
