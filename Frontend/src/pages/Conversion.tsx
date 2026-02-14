import { useState } from "react";
import { features, type ConversionFeature } from "../data/feature";
import useMoveBack from "../hooks/useMoveBack";
import { FaArrowLeft } from "react-icons/fa";
import Upload from "../features/Upload";
import { useParams } from "react-router";
import CompressionQuality from "../features/CompressionQuality";
import useConversion from "../hooks/useConversion";

export default function Conversion() {
  const moveBack = useMoveBack();
  const { id } = useParams();

  const data = features.find((feature: ConversionFeature) => feature.id === id);

  const [selectedFile, setSelectedFile] = useState<File | File[] | null>(null);

  const [compressionlevel, setCompressionlevel] = useState<
    `screen` | `ebook` | `printer`
  >("ebook");

  //from tanstack
  const { isSuccess, isPending, convert } = useConversion();
  console.log("isSuccess: ", isSuccess, "isPending: ", isPending);

  function handleFileSelect(file: File | File[] | null) {
    setSelectedFile(file);
  }

  //handle submit
  function handleSubmit() {
    if (!selectedFile) return;
    const formData = new FormData();
    if (Array.isArray(selectedFile)) {
      selectedFile.forEach((file) => formData.append("files", file));
    } else {
      formData.append("file", selectedFile);
    }
    if (compressionlevel) {
      formData.append("quality", compressionlevel);
    }
    if (data) {
      convert({ formData, route: data.route });
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* move back button  */}
      <button
        className="mb-8 flex cursor-pointer items-center text-gray-700 transition-colors duration-200 hover:text-emerald-600"
        onClick={moveBack}
      >
        <FaArrowLeft className="mr-2 h-5 w-5" />
        <span className="font-bold">Back to home</span>
      </button>

      {/* main card */}
      <div className="rounded-xl bg-white/80 p-8 shadow-lg">
        {/* header */}
        <div className="mb-4 text-center">
          <div className="mb-6 text-5xl">{data?.emoji}</div>
          <h2 className="mb-2 text-3xl font-bold text-gray-800">
            {data?.title}
          </h2>
          <p className="text-gray-600">{data?.description}</p>
        </div>
        {/* file upload drag and drop or choose from location  */}
        <Upload
          selectedFile={selectedFile}
          handleFileSelect={handleFileSelect}
          acceptedTypes={data?.acceptedTypes}
          multiple={data?.id === "jpg-to-pdf"}
        />
        {/* for compress pdf we select quality
         */}
        {data?.id === "compress-pdf" && (
          <CompressionQuality
            compressionlevel={compressionlevel}
            setCompressionlevel={setCompressionlevel}
          />
        )}

        {/* Submit button  */}
        <button
          onClick={handleSubmit}
          className={`flex w-full items-center justify-center rounded-lg px-4 py-3 font-semibold transition-all duration-300 ${
            selectedFile && !isPending
              ? `bg-emerald-600 text-white shadow-md hover:bg-emerald-700 hover:shadow-lg`
              : `cursor-not-allowed bg-gray-300 text-gray-500`
          }`}
        >
          {isPending ? "Converting Please Wait..." : "Convert File"}
        </button>
      </div>
      {/* additional information  */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>
          Your files are processed securely and automatically deleted after
          conversion
        </p>
      </div>
    </div>
  );
}
