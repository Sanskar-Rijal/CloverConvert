import { BrowserRouter, Route, Routes } from "react-router";
import AppLayout from "./pages/AppLayout";
import Home from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="pdf-to-jpg" element={<div>PDF to JPG</div>} />
          <Route path="jpg-to-pdf" element={<div>JPG to PDF</div>} />
          <Route path="pdf-to-word" element={<div>PDF to Word</div>} />
          <Route path="word-to-pdf" element={<div>Word to PDF</div>} />
          <Route path="compress-pdf" element={<div>Compress PDF</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
