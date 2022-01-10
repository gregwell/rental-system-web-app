import { getFormFieldName } from "./utils";

describe("Auth utils.ts", () => {
  it("should get proper form field name", () => {
    expect(getFormFieldName("name")).toStrictEqual("Imię");
  });
});
