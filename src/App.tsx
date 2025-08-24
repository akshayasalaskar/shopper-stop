import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ToastProvider } from './contexts/ToastContext';
import { Header } from './components/Header';
import { ProductPage } from './pages/ProductPage';

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen bg-gray-50">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<ProductPage />} />
                </Routes>
              </main>
            </div>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
