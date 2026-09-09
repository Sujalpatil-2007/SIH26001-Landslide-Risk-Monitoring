import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage";
import DashboardPage from "../pages/DashboardPage";
import PredictionPage from "../pages/PredictionPage";
import RiskMapPage from "../pages/RiskMapPage";
import AlertsPage from "../pages/AlertsPage";
import AboutPage from "../pages/AboutPage";
import NotFoundPage from "../pages/NotFoundPage";

import MainLayout from "../layouts/MainLayout";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />

          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/prediction" element={<PredictionPage />} />

          <Route path="/risk-map" element={<RiskMapPage />} />

          <Route path="/alerts" element={<AlertsPage />} />

          <Route path="/about" element={<AboutPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
