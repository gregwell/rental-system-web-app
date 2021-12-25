export interface Item {
  _id?: string;
  type: string;
  producer: string;
  model: string;
  photo: string;
  productId: string;
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

export interface UserPostBody {
  name: string;
  surname: string;
  phone: string;
  googleId: string;
  email: string;
  password: string;
}

export interface User extends UserPostBody {
  _id?: string;
}

export interface Reservation extends ReservationPostBody {
  _id?: string;
}

export enum TypePolishNames {
  "ski" = "Narty",
  "snowboard" = "Deski Snowboardowe",
}

// equipment types should be more like type low-end ski, medium-end ski, high-end ski with each other price
