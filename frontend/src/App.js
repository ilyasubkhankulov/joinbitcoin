import {
  BrowserRouter,
  Route,
  Routes,
  // Link
} from "react-router-dom";

import Invest from './components/invest/Invest';
import LinkAccount from './components/linkAccount/LinkAccount';
import Dashboard from './components/dashboard/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/account" element={<LinkAccount />} />
        <Route path="/invest" element={<Invest />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
