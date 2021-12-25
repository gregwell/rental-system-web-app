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
  let result: boolean = true;

  const requestedStartTime = startDate.getTime();
  const requestedFinishTime = finishDate.getTime();

  console.log(reservations);
  console.log(productId);

  reservations.forEach((reservation) => {
    if (reservation.productId === productId) {
      const reservationStartTime = Date.parse(reservation.startDate);
      const reservationFinishTime = Date.parse(reservation.finishDate);

      const variant1 =
        requestedStartTime < reservationStartTime &&
        requestedFinishTime > reservationStartTime;
      const variant2 =
        requestedFinishTime > reservationFinishTime &&
        requestedStartTime < reservationFinishTime;

      console.log(variant1);
      console.log(variant2);

      if (variant2 || variant1) {
        result = false;
      }
    }
  });

  return result;
};
