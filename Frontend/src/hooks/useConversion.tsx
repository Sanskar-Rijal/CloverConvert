import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { makeApiRequest } from "../services/ConvertTo";

interface ConversionPayload {
  formData: FormData;
  route: string;
}

interface ConversionResponse {
  blob: Blob;
  filename: string;
}

export default function useConversion() {
  const {
    isSuccess,
    isPending,
    mutate: convert,
  } = useMutation<ConversionResponse, Error, ConversionPayload>({
    mutationFn: ({ formData, route }) => makeApiRequest({ formData, route }),
    onSuccess: ({ blob, filename }) => {
      toast.success("Conversion successful! Your download will start shortly.");
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      toast.error(
        error.message ||
          "An error occurred during conversion. Please try again.",
      );
    },
  });

  return { isSuccess, isPending, convert };
}
