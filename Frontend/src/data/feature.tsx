export interface ConversionFeature {
  id: string;
  title: string;
  emoji: string;
  description: string;
  acceptedTypes: string;
}

export const features: ConversionFeature[] = [
  {
    id: "pdf-to-jpg",
    title: "PDF to JPG",
    emoji: "🖼️",
    description: "Convert PDF pages into JPG images",
    acceptedTypes: ".pdf",
  },
  {
    id: "jpg-to-pdf",
    title: "JPG to PDF",
    emoji: "📄",
    description: "Combine images into a single PDF",
    acceptedTypes: ".jpg,.jpeg,.png",
  },
  {
    id: "pdf-to-word",
    title: "PDF to Word",
    emoji: "📝",
    description: "Convert PDF files into editable Word documents",
    acceptedTypes: ".pdf",
  },
  {
    id: "word-to-pdf",
    title: "Word to PDF",
    emoji: "📘",
    description: "Convert Word documents into PDF format",
    acceptedTypes: ".doc,.docx",
  },
  {
    id: "compress-pdf",
    title: "Compress PDF",
    emoji: "📉",
    description: "Reduce PDF file size without losing quality",
    acceptedTypes: ".pdf",
  },
];
