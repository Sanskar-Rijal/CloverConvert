import axios from "axios";
import { BASE_URL } from "../utils/constants";

interface ApiRequestParams {
  formData: FormData;
  route: string;
}

export default async function makeApiRequest({
  formData,
  route,
}: ApiRequestParams) {
  console.log(`${BASE_URL}${route}`);
  const response = await axios.post(`${BASE_URL}${route}`, formData, {
    responseType: "blob", //important for downloading files, because backend uses res.download() which sends file as blob
  });

  const disposition = response.headers["content-disposition"];
  const filename =
    disposition?.match(/filename="?(.+)"?/)?.[1] ?? "converted-file";

  return { blob: response.data, filename };
}
