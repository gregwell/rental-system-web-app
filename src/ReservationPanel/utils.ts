import { TypePolishNames, Reservation } from "./types";

export const getPolishName = (itemType: string) => {
    let name: string;

    switch (itemType) {
      case "ski": {
        name = TypePolishNames.ski;
        break;
      }
      case "snowboard": {
        name = TypePolishNames.snowboard;
        break;
      }
      default: {
        name = "inne";
        break;
      }
    }
    return name;
  };

  export const canWeRentThisProduct = (
    productId: string,
    startDate: Date,
    finishDate: Date,
    reservations: Reservation[]
  ): boolean => {
    let result: boolean = false;

    reservations.forEach((reservation) => {
      if (
        (reservation.productId === productId &&
          startDate.getTime() < Date.parse(reservation.startDate)) ||
        finishDate.getTime() < Date.parse(reservation.finishDate)
      ) {
        result = true;
      }
    });

    return result;
  };