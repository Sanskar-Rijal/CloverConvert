import { BrowserRouter, Route } from "react-router";

export default function App() {
  return (
    <BrowserRouter>
      <Route path="home" element={<div>Home</div>} />
      <Route path="pdf-to-jpg" element={<div>PDF to JPG</div>} />
      <Route path="jpg-to-pdf" element={<div>JPG to PDF</div>} />
      <Route path="pdf-to-word" element={<div>PDF to Word</div>} />
      <Route path="word-to-pdf" element={<div>Word to PDF</div>} />
      <Route path="compress-pdf" element={<div>Compress PDF</div>} />
    </BrowserRouter>
  );
}
