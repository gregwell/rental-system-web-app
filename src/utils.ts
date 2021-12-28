import crypto from "crypto-js";

export const encrypt = (str: string | undefined): string => {
  if (str === "" || str === undefined) {
    return "";
  }

  const encrypted = crypto.AES.encrypt(
    JSON.stringify({ str }),
    process.env.REACT_APP_HASH_KEY as string
  ).toString();

  return encrypted;
};

export const decrypt = (encryptedText: string | undefined): string => {
  if (encryptedText === undefined || encryptedText === "") {
    return "";
  }

  const decrypted = crypto.AES.decrypt(
    encryptedText,
    process.env.REACT_APP_HASH_KEY as string
  ).toString(crypto.enc.Utf8);

  const decryptedParsed = JSON.parse(decrypted);

  return { str: decryptedParsed.str }.str;
};

export const encryptObject = (object: any): any =>
  Object.fromEntries(
    Object.entries(object).map((obj) => {
      return [obj[0], obj[0] === "_id" ? obj[1] : encrypt(obj[1] as string)];
    })
  );

export const decryptObject = (object: any): any =>
  Object.fromEntries(
    Object.entries(object).map((obj) => {
      return [obj[0], obj[0] === "_id" ? obj[1] : decrypt(obj[1] as string)];
    })
  );
