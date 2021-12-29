import { formatDate, encrypt, decrypt } from "./utils";

describe("src utils.ts", () => {
  it("should format date", () => {
    expect(formatDate("1641748290000")).toStrictEqual("09.01.2022 (18:11)");
  });

  /*
  it("should encrypt and decrypt data", () => {
    const encryptedString = encrypt("hello");
    const decrypted = decrypt(encryptedString);

    expect(decrypted.toEqual("hello"));
  });
  */
});
