import { formatDate, formatCode, removeDashes, decrypt, encrypt, encryptLong, decryptLong } from "./utils";

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

  it("should return empty string when trying to decrypt empty string or undefined", () => {
    expect(decrypt("")).toStrictEqual("");
    expect(decrypt(undefined)).toStrictEqual("");
  });

  it("should return empty string when trying to encrypt empty string or undefined", () => {
    expect(encrypt("")).toStrictEqual("");
    expect(encrypt(undefined)).toStrictEqual("");
  });

  it("should return emptddddddy string when trying to encrypt empty string or undefined", () => {
    const hello = encryptLong("hello");
    expect(decryptLong(hello)).toStrictEqual("hello");
  });

  /*
  it("should decrypt sample string", () => {
    const decrypted = decrypt("506c709e6c2ee32b02b56f6419bb505aaf9wDia9UySw/UFcpl7zRg028a5ac04a25e77e766b52095b56e700");
    expect(decrypted).toStrictEqual("admin");
  });
  
  it("should encrypt and decrypt provided long string", () => {
    const str: string = "hello";
    const encrypted = encryptLong(str);
    const decrypted = decryptLong(encrypted);
    expect(1).toStrictEqual(1);
  });
  */
});
