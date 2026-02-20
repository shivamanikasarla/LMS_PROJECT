import "./App.css"
import AppRoutes from "./routes/AppRoutes"
import useAffiliateTracker from "./hooks/useAffiliateTracker"
import { AuthProvider } from "./pages/Library/context/AuthContext"

function App() {
  useAffiliateTracker();
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
