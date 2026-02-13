import { compressionlevels } from "../data/feature";

interface CompressionQualityProps {
  compressionlevel: `screen` | `ebook` | `printer`;
  setCompressionlevel: React.Dispatch<
    React.SetStateAction<`screen` | `ebook` | `printer`>
  >;
}

export default function CompressionQuality({
  compressionlevel,
  setCompressionlevel,
}: CompressionQualityProps) {
  return (
    <div className="mb-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Choose Compression Level
      </h3>
      <div className="space-y-4">
        {compressionlevels.map((item) => (
          <label
            className={`flex cursor-pointer items-start rounded-lg border-2 p-4 transition-all duration-300 ${
              compressionlevel === item.value
                ? `border-emerald-600 bg-emerald-50`
                : `border-gray-200 bg-white hover:border-emerald-400`
            }`}
          >
            <input
              type="radio"
              name="compression"
              value={item.value}
              checked={compressionlevel === item.value}
              onChange={(event) =>
                setCompressionlevel(
                  event.target.value as "screen" | "ebook" | "printer",
                )
              }
              className="mt-1 h-4 w-4 border-none text-fuchsia-300"
            />
            <div className="ml-4 flex-1">
              <div className="font-semibold text-gray-800">
                {item.title}
                {item.recommended && (
                  <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                    Recommended
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600">{item.description}</div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
