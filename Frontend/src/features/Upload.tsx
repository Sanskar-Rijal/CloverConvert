import { useRef, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { CiFileOn } from "react-icons/ci";

interface UploadProps {
  acceptedTypes?: string;
  handleFileSelect: (file: File) => void;
  selectedFile: File | null;
}

export default function Upload({
  acceptedTypes,
  handleFileSelect,
  selectedFile,
}: UploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  function handleButtonClick() {
    inputRef.current?.click();
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    if (event.target.files && event.target.files[0]) {
      handleFileSelect(event.target.files[0]);
    }
  }

  function handleDrag(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter" || event.type === "dragover") {
      setDragActive(true);
    } else if (event.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      handleFileSelect(event.dataTransfer.files[0]);
    }
  }

  return (
    <div className="mb-8 w-full">
      <div
        className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-all duration-300 ${dragActive ? "border-emerald-500 bg-emerald-50" : "border-gray-300"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptedTypes}
          className="hidden"
          onChange={handleInputChange}
        />
        {selectedFile ? (
          <div className="flex flex-col items-center">
            <CiFileOn className="mb-3 h-12 w-12 text-emerald-600" />
            {/* filename  */}
            <p className="mb-2 line-clamp-1 font-semibold text-gray-800">
              {selectedFile.name}
            </p>
            {/* filesize */}
            <p>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            {/* button to change file  */}
            <button
              onClick={handleButtonClick}
              className="mt-4 cursor-pointer text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              Change file
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <IoCloudUploadOutline className="mb-3 h-12 w-12 text-gray-400" />
            <p className="mb-2 text-lg font-semibold text-gray-700">
              Drag and Drop you File here
            </p>
            <p className="mb-3 text-sm text-gray-400">or</p>
            <button
              onClick={handleButtonClick}
              className="rounded-lg bg-emerald-600 px-6 py-2 font-semibold text-white transition-colors duration-300 hover:bg-emerald-700"
            >
              Browse Files
            </button>
            <p className="mt-4 text-xs text-gray-400">
              Accepted Formats: {acceptedTypes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
