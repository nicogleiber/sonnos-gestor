import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { TarifasProvider } from './context/TarifasContext'
import { PersonalProvider } from './context/PersonalContext'
import { CalendarioProvider } from './context/CalendarioContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Socios from './pages/Socios'
import Tarifas from './pages/Tarifas'
import Clases from './pages/Clases'
import Calendario from './pages/Calendario'
import Personal from './pages/Personal'

export default function App() {
  return (
    <AuthProvider>
      <TarifasProvider>
        <PersonalProvider>
          <CalendarioProvider>
            <BrowserRouter>
              <Routes>
                {/* Ruta Pública de Autenticación */}
                <Route path="/login" element={<Login />} />

                {/* Rutas Privadas / Protegidas */}
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/socios" element={<Socios />} />
                          <Route path="/tarifas" element={<Tarifas />} />
                          <Route path="/clases" element={<Clases />} />
                          <Route path="/calendario" element={<Calendario />} />
                          <Route path="/personal" element={<Personal />} />
                          <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                      </Layout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </BrowserRouter>
          </CalendarioProvider>
        </PersonalProvider>
      </TarifasProvider>
    </AuthProvider>
  )
}
