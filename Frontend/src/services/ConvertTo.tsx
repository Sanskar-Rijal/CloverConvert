import { BASE_URL } from "../utils/constants";

interface ApiRequestParams {
  formData: FormData;
  route: string;
}

// export default async function makeApiRequest({
//   formData,
//   route,
// }: ApiRequestParams) {
//   try {
//     console.log(`${BASE_URL}${route}`);
//     const response = await axios.post(`${BASE_URL}${route}`, formData, {
//       responseType: "blob", //important for downloading files, because backend uses res.download() which sends file as blob
//     });

//     const disposition = response.headers["content-disposition"];
//     console.log("Content-Disposition header:", disposition);
//     const filename =
//       disposition?.match(/filename="([^"]+)"/)?.[1]?.trim() ?? "converted-file";

//     return { blob: response.data, filename };
//   } catch (error: unknown) {
//     if (axios.isAxiosError(error)) {
//       throw new Error(
//         error.response?.data?.message ||
//           "Failed to convert file, Please try again later",
//       );
//     }
//     throw new Error("Failed to convert file, Please try again later");
//   }
// }

export async function makeApiRequest({ formData, route }: ApiRequestParams) {
  const response = await fetch(`${BASE_URL}${route}`, {
    method: "POST",
    body: formData,
  });

  // Handle backend errors
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Request failed");
  }

  // Success → download file
  const blob = await response.blob();

  const disposition = response.headers.get("content-disposition");
  const filename =
    disposition?.match(/filename="([^"]+)"/)?.[1] ?? "converted-file";

  return { blob, filename };
}
