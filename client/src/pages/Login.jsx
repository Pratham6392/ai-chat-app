import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthContext } from "../services/AuthContext";
import { HandleLogin } from "../services/Api";

const Login = () => {
  const [userDetails, setUserDetails] = useState({
    email:"",
    password:"",
  });

  const { setAuthUser } = useAuthContext();

  const validate = (userDetails) => {
    if (!userDetails.email || !userDetails.password) {
      toast.error("Please fill all the details!", {
        autoClose: 2000,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!validate(userDetails)) {
      return;
    }
    await HandleLogin(userDetails, setAuthUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Login</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="mt-1">
              <input
                type="text"
                value={userDetails.email}
                onChange={(e) => setUserDetails({...userDetails, email:e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1">
              <input
                type="password"
                value={userDetails.password}
                onChange={(e) => setUserDetails({...userDetails, password:e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                Create an account?
              </Link>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
