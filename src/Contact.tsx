import { Typography } from "@mui/material";
import CustomContainer from "./general/CustomContainer";
import { CompanyInfo } from "./general/types";

interface ContactProps {
  companyInfo?: CompanyInfo;
}

const Contact = ({ companyInfo }: ContactProps) => {
  if (!companyInfo) {
    return null;
  }

  return (
    <CustomContainer>
      <Typography variant="h6">{companyInfo.title}</Typography>
      <Typography variant="h6">{companyInfo.address}</Typography>
      <Typography variant="h6">{`tel:  ${companyInfo.phone}`}</Typography>
      <Typography variant="h6">
        <a href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a>
      </Typography>
    </CustomContainer>
  );
};

export default Contact;
