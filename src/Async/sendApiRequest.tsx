import axios from "axios";

import {
  Item,
  User,
  Price,
  Reservation,
  CrudOperation,
  RequestData,
} from "../general/types";

interface SendApiRequestProps {
  collection: string;
  operation: CrudOperation;
  body?: Reservation | User;
  filter?: any;
  update?: any;
  setState?: (newState: any) => void;
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
  filter,
  update,
  setState,
}: SendApiRequestProps): Promise<
  Item[] | Reservation[] | User[] | Price[] | string
> {
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

  if (operation === CrudOperation.UPDATE) {
    requestData.filter = filter;
    requestData.update = update;
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
    if (setState) {
      setState(true);
    }

    return operation === CrudOperation.CREATE
      ? response.data.insertedId
      : response.data.documents;
  } catch (error) {
    console.log(error);
    if (setState) {
      setState(false);
    }
  }
  return [];
}
