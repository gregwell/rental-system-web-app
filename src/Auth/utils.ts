import { AuthFormFields } from "../general/types";

export const getFormFieldName = (field: keyof AuthFormFields): string => {
  switch (field) {
    case "name":
      return "Imię";
    case "surname":
      return "Nazwisko";
    case "phone":
      return "Telefon";
    case "email":
    case "loginEmail":
      return "E-mail";
    case "password":
    case "loginPassword":
      return "Hasło";
    case "passwordSecond":
      return "Powtórz hasło";
    default:
      return field;
  }
};
