import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AksNavba from './components/Navbar';
import Home from './pages/Home';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AksNavba />
      <br />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
