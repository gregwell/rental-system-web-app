export enum Collection {
  users = "users",
  items = "items",
  reservations = "reservations",
  prices = "prices",
}

export interface User {
  name: string;
  surname: string;
  phone: string;
  googleId?: string;
  email: string;
  password?: string;
  _id?: string;
  idCard?: string;
}

export interface Reservation {
  productId: string;
  userId: string;
  startDate: string;
  finishDate: string;
  price: string;
  status: Status;
  _id?: string;
}

export interface Item {
  _id?: string;
  type: ItemType;
  producer: string;
  model: string;
  photo: string;
  productId: string;
  price?: ItemPrice;
  size?: string;
}

export interface ItemPrice {
  type: ItemType;
  price: number;
  isPerDay: boolean;
  howMuch: number;
}

export enum ItemType {
  ski = "ski",
  snowboard = "snowboard",
  car = "car",
  scooter = "scooter",
  bike = "bike",
  electricBike = "electricBike",
  kayak = "kayak",
  other = "other",
}

export enum Status {
  potwierdzona = "potwierdzona",
  anulowana = "cancelled",
}

export interface Price {
  type: ItemType;
  hour: number;
  day: number;
  _id?: string;
}

export enum CrudOperation {
  CREATE,
  READ,
  UPDATE,
  DELETE,
}

export interface RequestData {
  collection: string;
  database: string;
  dataSource: string;
  document?: any;
  filter?: any;
  update?: any;
}

export interface GoogleResponse {
  googleId: string;
  profileObj: {
    googleId: string;
    imageUrl: string;
    email: string;
    name: string;
    givenName: string;
    familyName: string;
  };
}
