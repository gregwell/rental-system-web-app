import {
  Reservation,
  Price,
  ItemPrice,
  ItemType,
  Item,
  Status,
  GroupedItems,
} from "../general/types";

export const getPolishName = (type: string): string => {
  switch (type) {
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
};

export const filterOutReservedItems = (
  startDate: Date | null,
  finishDate: Date | null,
  reservations: Reservation[] | null,
  items: Item[] | null
): Item[] => {
  if (startDate === null || finishDate === null || !items) {
    return [];
  }

  if (!reservations) {
    return items;
  }

  const reqStart = startDate.getTime();
  const reqFinish = finishDate.getTime();

  const filteredItems = items.filter((item) => {
    const reservation = reservations.find((reservation) => {
      if (
        reservation.productId !== item.productId ||
        reservation.status === Status.anulowana
      ) {
        return false;
      }

      const resStart = parseInt(reservation.startDate);
      const resFinish = parseInt(reservation.finishDate);

      if (
        (reqStart < resStart && reqFinish > resStart) ||
        (reqFinish > resFinish && reqStart < resFinish)
      ) {
        return true;
      }
      return false;
    });

    if (reservation) {
      return false;
    }
    return true;
  });

  return filteredItems;
};

export const groupItems = (items: Item[]): GroupedItems => {
  return items.reduce((acc: GroupedItems, curr: Item) => {
    const fullName = `${curr.type} ${curr.producer} ${curr.model}`;

    if (acc[fullName]) {
      acc[fullName].push(curr);
      return acc;
    }

    acc[fullName] = [curr];
    return acc;
  }, {});
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
  const hours = Math.ceil(time / hourMs);
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
