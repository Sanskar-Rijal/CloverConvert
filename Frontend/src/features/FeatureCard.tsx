import type { ConversionFeature } from "../data/feature";

interface FeatureCardProps {
  feature: ConversionFeature;
}

export default function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <div className="cursor-pointer rounded-lg border-2 border-transparent bg-white/80 p-6 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-emerald-500">
      <div className="mb-4 text-4xl">{feature.emoji}</div>
      <h3 className="mb-2 text-xl font-semibold text-gray-800 sm:text-2xl">
        {feature.title}
      </h3>
      <p className="text-sm text-gray-600">{feature.description}</p>
    </div>
  );
}
