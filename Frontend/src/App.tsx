import { BrowserRouter, Route, Routes } from "react-router";
import AppLayout from "./pages/AppLayout";
import Home from "./pages/Home";
import PdfToWord from "./pages/PdfToWord";
import PdftoJpg from "./pages/PdfToJpg";
import JpgToPdf from "./pages/JpgToPdf";
import WordToPdf from "./pages/WordToPdf";
import CompressPdf from "./pages/CompressPdf";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="pdf-to-jpg" element={<PdftoJpg />} />
          <Route path="jpg-to-pdf" element={<JpgToPdf />} />
          <Route path="pdf-to-word" element={<PdfToWord />} />
          <Route path="word-to-pdf" element={<WordToPdf />} />
          <Route path="compress-pdf" element={<CompressPdf />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
