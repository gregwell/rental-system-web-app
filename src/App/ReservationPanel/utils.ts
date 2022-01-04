import {
  Reservation,
  Price,
  ItemPrice,
  ItemType,
  Item,
  Status,
  GroupedItems,
} from "../constants/types";

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
        reservation.status === Status.cancelled
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

export const groupItems = ({
  items,
  bysize,
}: {
  items: Item[] | null;
  bysize?: boolean;
}): GroupedItems => {
  if (!items) {
    return {} as GroupedItems;
  }

  return items.reduce((acc: GroupedItems, curr: Item) => {
    const basic = `${curr.type} ${curr.producer} ${curr.model}`;
    const fullName = bysize ? `${basic} ${curr.size}` : basic;

    if (acc[fullName]) {
      acc[fullName].push(curr);
      return acc;
    }

    acc[fullName] = [curr];
    return acc;
  }, {});
};

export const removeBackupItems = (
  groupedItems: GroupedItems,
  percentage: string
): GroupedItems => {
  const grouped = JSON.parse(JSON.stringify(groupedItems));

  for (const prop in grouped) {
    const length = grouped[prop].length;
    const spliceCount = Math.ceil((length * parseInt(percentage)) / 100);

    if (length === spliceCount) {
      delete grouped[prop];
    }

    if (length !== spliceCount) {
      grouped[prop] = grouped[prop].splice(0, length - spliceCount);
    }
  }

  return grouped;
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
