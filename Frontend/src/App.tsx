import { BrowserRouter, Route, Routes } from "react-router";
import AppLayout from "./pages/AppLayout";
import Home from "./pages/Home";

import Conversion from "./pages/Conversion";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="/convert/:id" element={<Conversion />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
