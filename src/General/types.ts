export interface ItemPrice {
  type: ItemType;
  price: number;
  isPerDay: boolean;
  howMuch: number;
}

export interface Item {
  _id?: string;
  type: ItemType;
  producer: string;
  model: string;
  photo: string;
  productId: string;
  price?: ItemPrice;
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
  anulowana = "anulowana",
}

export interface ReservationPostBody {
  productId: string;
  userId: string;
  startDate: string;
  finishDate: string;
  price: string;
  status: Status;
}

export interface PricePostBody {
  type: ItemType;
  hour: number;
  day: number;
}

export enum CrudOperation {
  CREATE,
  READ,
  UPDATE,
}

export interface RequestData {
  collection: string;
  database: string;
  dataSource: string;
  document?: any;
  filter?: any;
  update?: any;
}

export interface UserPostBody {
  name: string;
  surname: string;
  phone: string;
  googleId?: string;
  email: string;
  password?: string;
}

export interface User extends UserPostBody {
  _id?: string;
}

export interface Reservation extends ReservationPostBody {
  _id?: string;
}

export interface Price extends PricePostBody {
  _id?: string;
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