import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import '../src/styles/App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path='/signup' element={<Register />}/>
        <Route path='/home' element={<Home />}/>
      </Routes>
    </Router>
  );
}
export default App;
