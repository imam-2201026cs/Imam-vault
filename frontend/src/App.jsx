import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddProblem from './pages/AddProblem';
import ProblemDetail from './pages/ProblemDetail';
import TodayRevisions from './pages/TodayRevisions';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import GlobalAlarm from './components/GlobalAlarm';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <GlobalAlarm />
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/"         element={<PrivateRoute><Navbar /><Dashboard /></PrivateRoute>} />
        <Route path="/add"      element={<PrivateRoute><Navbar /><AddProblem /></PrivateRoute>} />
        <Route path="/problem/:id" element={<PrivateRoute><Navbar /><ProblemDetail /></PrivateRoute>} />
        <Route path="/today"    element={<PrivateRoute><Navbar /><TodayRevisions /></PrivateRoute>} />
        <Route path="/analytics" element={<PrivateRoute><Navbar /><Analytics /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
