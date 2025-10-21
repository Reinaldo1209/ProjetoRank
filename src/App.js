// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Ranking from './pages/Ranking';
import Formulario from './pages/Formulario';
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import Concursos from './pages/Concursos';
import GabaritoDetalhe from './pages/GabaritoDetalhe';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import MeusConcursos from './pages/MeusConcursos';
import NovoConcurso from './pages/NovoConcurso';
import Checkout from './pages/Checkout';
import SolicitarRanking from './pages/SolicitarRanking';
// globalStyles removed: using CSS variables/classes in src/pages/global.css
import Header from './components/Header';
import { ConcursosProvider } from './context/ConcursosContext';
import { AuthProvider } from './context/AuthContext';
import { PaymentProvider } from './context/PaymentContext';

function App() {

  const Footer = () => (
    <footer className="global-footer">
      <p>© {new Date().getFullYear()} RankSim. Todos os direitos reservados.</p>
      <p>Simule seu sucesso.</p>
    </footer>
  );

  return (
    <ConcursosProvider>
      <AuthProvider>
        <PaymentProvider>
          <Router>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/ranking" element={<Ranking />} />
              <Route path="/ranking/:id" element={<Ranking />} />
              <Route path="/formulario" element={<Formulario />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/login" element={<Login />} />
              <Route path="/concursos" element={<Concursos />} />
              <Route path="/gabarito/:id" element={<GabaritoDetalhe />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/meus-concursos" element={<MeusConcursos />} />
              <Route path="/novo-concurso" element={<NovoConcurso />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/solicitar-ranking" element={<SolicitarRanking />} />
            </Routes>
            <Footer />
          </Router>
        </PaymentProvider>
      </AuthProvider>
    </ConcursosProvider>
  );
}

export default App;