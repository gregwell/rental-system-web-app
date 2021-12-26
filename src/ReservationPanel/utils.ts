import { Reservation, Price, ItemPrice , ItemType} from "../General/types";

export const getPolishName = (type: string):string => {
  switch(type) {
    case ItemType.ski:
      return "Narty";
    case ItemType.snowboard:
      return "Snowboard";
    case ItemType.car:
      return "Samochód";
    case ItemType.scooter:
      return "Hulajnoga elektryczna";
    case ItemType.bike:
      return "Rower";
    case ItemType.electricBike:
      return "Rower elektryczny";
    case ItemType.kayak:
      return "Kajak";
    default: 
      return type;
  }
}

export const canWeRentThisProduct = (
  productId: string,
  startDate: Date,
  finishDate: Date,
  reservations: Reservation[]
): boolean => {
  let result: boolean = true;

  const requestedStartTime = startDate.getTime();
  const requestedFinishTime = finishDate.getTime();

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

      if (variant2 || variant1) {
        result = false;
      }
    }
  });

  return result;
};

export const calculateReservationPriceForEachType = (
  prices: Price[] | null,
  startDate: Date | null,
  finishDate: Date | null
): ItemPrice[] | null => {
  if (!startDate || !finishDate || !prices) {
    return null;
  }
  const time = finishDate.getTime() - startDate.getTime();
  //1 hour = 3600000 ms
  const hourMs = 3600000;
  const hours = Math.ceil((time / hourMs));
  const days = Math.ceil(time / hourMs / 24);

  const pricesNew: ItemPrice[] = prices.map((price) => {
    const pricePerDay = price.day * days;
    const pricePerHour = price.hour * hours;

    const isPerDayBetter = pricePerDay < pricePerHour;
    const cheaperPrice = isPerDayBetter ? pricePerDay : pricePerHour;
    const howMuch = isPerDayBetter ? days : hours;

    return {
      type: price.type,
      price: cheaperPrice,
      isPerDay: isPerDayBetter,
      howMuch: howMuch,
    };
  });

  return pricesNew;
};
