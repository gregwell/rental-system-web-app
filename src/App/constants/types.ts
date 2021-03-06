export enum Collection {
  users = "users",
  items = "items",
  reservations = "reservations",
  prices = "prices",
  company = "company",
  rentals = "rentals",
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

export interface Rental {
  _id: string;
  productId: string;
  userId: string;
  startDate: string;
  finishDate: string;
  status: string;
}

export interface AuthFormFields extends User {
  passwordSecond?: string;
  loginEmail?: string;
  loginPassword?: string;
  emailCode?: string;
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
  productId: string;
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
  confirmed = "confirmed",
  cancelled = "cancelled",
}

export interface Price {
  type: ItemType;
  hour: number;
  day: number;
  _id?: string;
}

export enum CrudOperation {
  CREATE = "insertOne",
  READ = "find",
  UPDATE = "updateOne",
  DELETE = "deleteOne",
  DELETE_MANY = "deleteMany",
}

export interface RequestData {
  collection: string;
  database: string;
  dataSource: string;
  document?: any;
  filter?: any;
  update?: any;
}

export interface CompanyInfo {
  phone?: string;
  email?: string;
  title?: string;
  open?: string;
  close?: string;
  address?: string;
  percentage?: string;
}

export interface GroupedItems {
  [key: string]: Item[];
}

export enum Path {
  home = "/",
  services = "/services",
  profile = "/profile",
  singleReservation = "/reservation",
  singleRental = "/rental",
  confirmEmail = "/confirmEmail",
  contact = "/contact",
  notFound = "*",
}

export interface State {
  users: User[] | null;
  prices: Price[];
  reservations: Reservation[];
  items: Item[];
  rentals: Rental[];
  companyInfo: CompanyInfo;
  loggedUser: User | null | undefined;
  newReservationSuccess: boolean | null;
}

export interface StateProps {
  state: State;
  dispatch: React.Dispatch<React.SetStateAction<State>>;
}
