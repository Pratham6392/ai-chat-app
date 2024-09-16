import {Navigate, Route, Routes} from 'react-router-dom';
import './index.css';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SingUp';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthContext } from './services/AuthContext.jsx';

const App = () => {
  const { authUser } = useAuthContext();
  return (
    <div>
    <ToastContainer />
    <Routes>
				<Route path='/' element={authUser ? <Home /> : <Navigate to={"/login"} />} />
				<Route path='/login' element={authUser ? <Navigate to='/' /> : <Login />} />
				<Route path='/signup' element={authUser ? <Navigate to='/' /> : <SignUp />} />
			</Routes>
    </div>
  )
}

export default App