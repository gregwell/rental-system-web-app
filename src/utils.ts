import crypto from "crypto-js";

export const encrypt = (str: string | undefined): string => {
  if (str === "" || str === undefined) {
    return "";
  }

  const encrypted = crypto.AES.encrypt(
    str,
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

  return decrypted;
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

export const formatDate = (date: string | number | undefined): string => {
  if (date === undefined) {
    return "";
  }
  const d = new Date(parseInt(date as string));

  return (
    ("0" + d.getDate()).slice(-2) +
    "." +
    ("0" + (d.getMonth() + 1)).slice(-2) +
    "." +
    d.getFullYear() +
    " " +
    "(" +
    ("0" + d.getHours()).slice(-2) +
    ":" +
    ("0" + d.getMinutes()).slice(-2) +
    ")"
  );
};

export const formatCode = (code: string): string => {
  const newCode = code.replace(/-/g, "").slice(0, 24);
  const length = newCode.length;

  if (length > 6 && length <= 12)
    return newCode.replace(/^(.{6})(.{1,6})$/, "$1-$2");
  if (length > 12 && length <= 18)
    return newCode.replace(/^(.{6})(.{6})(.{1,6})$/, "$1-$2-$3");
  if (length > 18)
    return newCode.replace(/^(.{6})(.{6})(.{6})(.{1,6})$/, "$1-$2-$3-$4");

  return newCode;
};

export const removeDashes = (code: string): string => {
  return code.replace(/-/g, "");
};
