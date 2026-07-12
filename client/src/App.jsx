import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Vehicles from './pages/Vehicles';
import Drivers from './pages/Drivers';
<<<<<<< HEAD
import ProtectedRoute from './components/ProtectedRoute';
=======
import Trips from './pages/Trips';
>>>>>>> bb29c9ac95232bb33178158897c349599768cf45

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
<<<<<<< HEAD
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/vehicles"
          element={
            <ProtectedRoute>
              <Vehicles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drivers"
          element={
            <ProtectedRoute>
              <Drivers />
            </ProtectedRoute>
          }
        />
=======
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/trips" element={<Trips />} />
>>>>>>> bb29c9ac95232bb33178158897c349599768cf45
      </Routes>
    </BrowserRouter>
  );
}

export default App;