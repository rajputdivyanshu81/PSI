import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './store/hooks';
import Login from './pages/Login';
import Register from './pages/Register';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useAppSelector((state) => state.auth);
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <div className="p-8">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p>Welcome to the Task Management System!</p>
              </div>
            </PrivateRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App;
