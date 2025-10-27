import type { companyData } from "../../../types/company/companyDataTypes";

const View = ({ name }: companyData) => {
  return <div>{name}</div>;
};

export default View;
