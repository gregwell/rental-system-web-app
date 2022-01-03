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

  const things = [
    companyInfo.title,
    companyInfo.address,
    `tel:  ${companyInfo.phone}`,
    `godz. otwarcia: ${companyInfo.open} - ${companyInfo.close}`,
    <a href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a>,
  ];

  return (
    <CustomContainer>
      {things.map((thing) => (
        <Typography variant="h6">{thing}</Typography>
      ))}
    </CustomContainer>
  );
};

export default Contact;
