import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./Routes";
import Navbar from "./components/Navbar";
import { HelmetProvider } from "react-helmet-async";

const App = () => {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Navbar />
            <AppRoutes />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
