import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

// Import pages
import ScanPage from "./pages/ScanPage";
import Dashboard from "./pages/Dashboard";
import KanbanCards from "./pages/KanbanCards";

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
    },
  },
});

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster position="top-right" />
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/scan" />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/kanban" element={<KanbanCards />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;