import { Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import Calculator from "../pages/Calculator";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/calculator" element={<Calculator />} />
    </Routes>
  );
}
