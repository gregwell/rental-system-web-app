import { ItemType } from "../constants/types";
import { filterOutReservedItems, getPolishName } from "./utils";
import {
  EXPECTED_FILTERED_ITEMS,
  FINISH_DATE,
  ITEMS,
  RESERVATIONS,
  START_DATE,
} from "./utils.mock";

describe("ReservationPanel utils.ts", () => {
  it("should filter out items that are reserved in provided dates", () => {
    expect(
      filterOutReservedItems(START_DATE, FINISH_DATE, RESERVATIONS, ITEMS)
    ).toStrictEqual(EXPECTED_FILTERED_ITEMS);
  });
  it("should get proper Polish name", () => {
    expect(getPolishName(ItemType.ski)).toStrictEqual("Narty");
  });
});
