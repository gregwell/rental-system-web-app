import { formatDate, formatCode, encrypt, decrypt } from "./utils";

describe("src utils.ts", () => {
  it("should format date", () => {
    expect(formatDate("1641748290000")).toStrictEqual("09.01.2022 (18:11)");
  });
  it("should format code", () => {
    expect(formatCode("61cc94e5639e7eb85e291c82")).toStrictEqual(
      "61cc94-e5639e-7eb85e-291c82"
    );
  });

  /*
  it("should encrypt and decrypt data", () => {
    const encryptedString = encrypt("hello");
    const decrypted = decrypt(encryptedString);

    expect(decrypted.toEqual("hello"));
  });
  */
});
