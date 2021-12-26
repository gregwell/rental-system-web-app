import crypto from "crypto-js";

export const encrypt = (str: string): string => {
    const encrypted = crypto.AES.encrypt(
      JSON.stringify({ str }),
      process.env.REACT_APP_HASH_KEY as string
    ).toString();
    console.log(encrypted);

    return encrypted;
  };

  export const decrypt = (encryptedText: string | undefined): string => {

    if(encryptedText === undefined) {
        return '';
    }

    const decrypted = crypto.AES.decrypt(
      encryptedText,
      process.env.REACT_APP_HASH_KEY as string
    ).toString(crypto.enc.Utf8);

    const decryptedParsed = JSON.parse(decrypted);

    return { str: decryptedParsed.str }.str;
  };