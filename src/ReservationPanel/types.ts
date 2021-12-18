export interface Item {
  _id?: string;
  type: string;
  producer: string;
  model: string;
  photo: string;
  productId: string;
}

export interface Reservation {
  _id?: string;
  productId: string;
  userId: string;
  startDate: string;
  finishDate: string;
}

export enum TypePolishNames {
  "ski" = "Narty",
  "snowboard" = "Deski Snowboardowe",
}
