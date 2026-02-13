import { features } from "../data/feature";
import FeatureCard from "../features/FeatureCard";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl">
      {/* Title  */}
      <div className="mb-12 text-center">
        <h1 className="mb-3 text-4xl font-bold text-gray-800 md:text-5xl">
          🍀CloverConvert🍀
        </h1>
        <p className="text-lg text-gray-600 md:text-xl">
          Convert your documents to the format you wish.
        </p>
      </div>

      {/* feature display four cards in a grid  */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard key={feature.id} feature={feature} />
        ))}
      </div>
      <div className="mt-12 text-center text-sm text-gray-500">
        <p>Upload your file and convert it instantly, created by Sanskar ✌️</p>
      </div>
    </div>
  );
}
