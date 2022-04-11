import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { sendApiRequest } from "./async/sendApiRequest";
import AccessGuard from "./general/AccessGuard";
import CustomContainer from "./general/CustomContainer";
import { Collection, CrudOperation, State, StateProps } from "./constants/types";
import { decrypt, decryptObject, decryptLong } from "./utils";
import { Alert, AlertTitle } from "@mui/material";

interface ConfirmEmailProps extends StateProps {
  apiDataInitialized: boolean;
}

const ConfirmEmail = ({
  state,
  dispatch,
  apiDataInitialized,
}: ConfirmEmailProps) => {
  const { token } = useParams();

  const [success, setSuccess] = useState<boolean | null>(null);
  const [doneOnce, setDoneOnce] = useState<boolean>(false);

  useEffect(() => {
    if (!token || !apiDataInitialized) {
      return;
    }

    const createUser = async () => {
      const changedChars = token?.replace(/temporarySolution/g, "/");
      const decryptedToken = decryptLong(changedChars);
      const parsedObj = JSON.parse(decryptedToken);

      if (
        state.users?.find((user) => {
          return decrypt(user.email) === decrypt(parsedObj.email);
        })
      ) {
        console.log("false");
        setSuccess(false);
        return;
      }

      const insertedId: string = (await sendApiRequest({
        collection: Collection.users,
        operation: CrudOperation.CREATE,
        body: parsedObj,
      })) as string;

      setSuccess(true);

      parsedObj._id = insertedId;
      state.users?.push(parsedObj);

      const decryptedObj = decryptObject(parsedObj);
      decryptedObj._id = insertedId;

      dispatch((prev: State) => ({ ...prev, loggedUser: decryptedObj }));
    };

    if (!doneOnce) {
      setDoneOnce(true);
      createUser();
    }
  }, [apiDataInitialized, dispatch, doneOnce, state.users, token]);

  return (
    <AccessGuard wait={success === null || !apiDataInitialized}>
      <CustomContainer textAlign="left">
        <Alert severity={success ? "success" : "error"}>
          <AlertTitle>
            {success ? "Adres email został zweryfikowany." : "Niepowodzenie"}
          </AlertTitle>
          {success
            ? "Możesz już korzsytać ze swojego konta."
            : "Sprobuj ponownie pozniej"}
        </Alert>
      </CustomContainer>
    </AccessGuard>
  );
};

export default ConfirmEmail;
