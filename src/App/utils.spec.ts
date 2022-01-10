import { formatDate, formatCode, removeDashes } from "./utils";

describe("App utils.ts", () => {
  it("should format date", () => {
    expect(formatDate("1641748290000")).toStrictEqual("09.01.2022 (18:11)");
  });
  it("should format code", () => {
    expect(formatCode("61cc94e5639e7eb85e291c82")).toStrictEqual(
      "61cc94-e5639e-7eb85e-291c82"
    );
  });
  it("should remove dashes", () => {
    expect(removeDashes("61cc94-e5639e-7eb85e-291c82")).toStrictEqual(
      "61cc94e5639e7eb85e291c82"
    );
  });
  /*
  it("should encrypt and decrypt provided string", () => {
    const str: string = "hello";
    const encrypted = encrypt(str);
    const decrypted = decrypt(encrypted);
    expect(str).toStrictEqual(decrypted);
  });
  
  it("should encrypt and decrypt provided long string", () => {
    const str: string = "hello";
    const encrypted = encryptLong(str);
    const decrypted = decryptLong(encrypted);
    expect(1).toStrictEqual(1);
  });
  */
});
