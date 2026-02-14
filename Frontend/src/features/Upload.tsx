import { useRef, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { CiFileOn, CiImageOn } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";

interface UploadProps {
  acceptedTypes?: string;
  handleFileSelect: (file: File | File[] | null) => void;
  selectedFile: File | File[] | null;
  multiple?: boolean;
}

export default function Upload({
  acceptedTypes,
  handleFileSelect,
  selectedFile,
  multiple = false,
}: UploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const files = Array.isArray(selectedFile)
    ? selectedFile
    : selectedFile
      ? [selectedFile]
      : [];

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  function handleButtonClick() {
    inputRef.current?.click();
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();

    if (!event.target.files) {
      return;
    }

    //if user adds more files, we must add into existing files
    const newFiles = Array.from(event.target.files);

    if (event.target.files && event.target.files[0]) {
      if (multiple) {
        handleFileSelect([...files, ...newFiles]); //converting into array
      } else {
        handleFileSelect(event.target.files[0]);
      }
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
      if (multiple) {
        handleFileSelect(Array.from(event.dataTransfer.files)); //converting into array
      } else {
        handleFileSelect(event.dataTransfer.files[0]);
      }
    }
  }

  //function to remove file from the list i.e images
  function removeFile(index: number) {
    console.log("removing file at index: ", index);
    if (Array.isArray(selectedFile)) {
      const newFiles = selectedFile.filter((_, i) => i !== index);
      handleFileSelect(newFiles.length > 0 ? newFiles : null);
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
          multiple={multiple}
        />
        {files.length > 0 ? (
          <div className="flex flex-col items-center">
            {/* if its multiple then it must be image  */}
            {multiple ? (
              <>
                <CiImageOn className="mb-3 h-12 w-12 text-emerald-600" />
                <p className="mb-1 font-medium text-gray-800">
                  {files.length} {files.length === 1 ? "file" : "files"}{" "}
                  selected
                </p>

                <p className="mb-4 text-sm text-gray-500">
                  Total size: {(totalSize / 1024 / 1024).toFixed(2)} MB
                </p>

                {/* display list of files with name and size  */}
                <div className="mb-4 max-h-48 w-full space-y-3 overflow-y-auto">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg bg-gray-50 p-4 text-left"
                    >
                      <div className="flex min-w-0 flex-1 items-center">
                        <CiFileOn className="mr-2 h-4 w-4 shrink-0 text-gray-600" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-shadow-gray-800">
                            {file.name}
                          </p>
                          {/* display file size below the name  */}
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      {/* button to remove images  */}
                      <button onClick={() => removeFile(index)}>
                        <IoMdClose className="ml-2 shrink-0 rounded transition-colors hover:bg-gray-200" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleButtonClick}
                  className="cursor-pointer text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                  Add more images
                </button>
              </>
            ) : (
              <>
                <CiFileOn className="mb-3 h-12 w-12 text-emerald-600" />
                {/* filename  */}
                <p className="mb-2 max-w-full truncate font-semibold text-gray-800">
                  {files[0].name}
                </p>
                {/* filesize */}
                <p>{(files[0].size / 1024 / 1024).toFixed(2)} MB</p>
                {/* button to change file  */}
                <button
                  onClick={handleButtonClick}
                  className="mt-4 cursor-pointer text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                  Change file
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <IoCloudUploadOutline className="mb-3 h-12 w-12 text-gray-400" />
            <p className="mb-2 text-lg font-semibold text-gray-700">
              {multiple
                ? "Drag and Drop your Files here"
                : "Drag and Drop your File here"}
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
