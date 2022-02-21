import CryptoJS from "crypto-js";
import crypto from "crypto-js";

export const encryptLong = (str: string | undefined): string => {
  if (str === "" || str === undefined) {
    return "";
  }

  const encrypted = crypto.AES.encrypt(
    str,
    "password"
  ).toString();

  return encrypted;
};

export const decryptLong = (encryptedText: string | undefined): string => {
  if (encryptedText === undefined || encryptedText === "") {
    return "";
  }

  const decrypted = crypto.AES.decrypt(
    encryptedText,
    "password"
  ).toString(crypto.enc.Utf8);

  return decrypted;
};

const generateKey = (salt: string) => {
  const passPhrase = process.env.REACT_APP_HASH_KEY as string;

  var key = CryptoJS.PBKDF2(passPhrase, CryptoJS.enc.Hex.parse(salt), {
    keySize: 4,
    iterations: 1000,
  });
  return key;
};

export const encrypt = (str: string | undefined): string => {
  if (str === "" || str === undefined) {
    return "";
  }

  const salt = process.env.REACT_APP_KRYPTOGRAPHIC_KEY as string;
  const iv = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);

  const encrypted = CryptoJS.AES.encrypt(str, generateKey(salt), {
    iv: CryptoJS.enc.Hex.parse(iv),
  });
  const base64 = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  const result = salt + base64.substring(0, base64.length - 2) + iv;

  return result;
};

export const decrypt = (encryptedText: string | undefined): string => {
  if (encryptedText === undefined || encryptedText === "") {
    return "";
  }

  const salt = process.env.REACT_APP_KRYPTOGRAPHIC_KEY as string;

  const iv = encryptedText.substring(
    encryptedText.length - 32,
    encryptedText.length
  );

  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Base64.parse(
      encryptedText.substring(32, encryptedText.length - 32) + "=="
    ),
  });

  const decrypted = CryptoJS.AES.decrypt(cipherParams, generateKey(salt), {
    iv: CryptoJS.enc.Hex.parse(iv),
  });

  const result = decrypted.toString(CryptoJS.enc.Utf8);

  return result;
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
