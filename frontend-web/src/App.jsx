import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";

import Dashboard from "./pages/Dashboard";
import LiveFloodMap from "./pages/LiveFloodMap";
import Alerts from "./pages/Alerts";
import Regions from "./pages/Regions";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import HelpSupport from "./pages/HelpSupport";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Shared application layout */}
        <Route element={<AppLayout />}>

          <Route path="/" element={<Dashboard />} />
          <Route path="/map" element={<LiveFloodMap />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/regions" element={<Regions />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<HelpSupport />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;