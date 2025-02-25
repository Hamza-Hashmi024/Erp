import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';
import axiosInstance from '../AxiosInstance';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    if (!authContext) {
        console.error("AuthContext is undefined. Make sure AuthProvider wraps your component tree.");
        return <p>Something went wrong. Please refresh the page.</p>;
    }

    const { login } = authContext;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post(import.meta.env.VITE_API_URL_LOGIN, {
                email,
                password,
            });
    
            if (response.status === 200) {
                const data = response.data;
                
                // Store token in localStorage
                localStorage.setItem("token", data.token);
    
                // Save user data in AuthContext
                login(data.user);
    
                navigate('/');
            } else {
                alert('Login failed');
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert(error.response?.data?.message || 'Something went wrong during login');
        }
    };
    

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#47464C] p-5">
            <form 
                onSubmit={handleSubmit}
                className="bg-white p-10 rounded-lg shadow-lg w-full max-w-[400px]"
            >
                <h2 className="text-[#993F82] text-2xl font-semibold text-center mb-8">
                    ERP System Login
                </h2>
                
                <div className="mb-6">
                    <label className="block text-[#47464C] text-sm font-medium mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        className="w-full p-3 border border-[#47464C] rounded focus:outline-none focus:ring-1 focus:ring-[#993F82]"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-8">
                    <label className="block text-[#47464C] text-sm font-medium mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        className="w-full p-3 border border-[#47464C] rounded focus:outline-none focus:ring-1 focus:ring-[#993F82]"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-[#993F82] text-white py-3 px-4 rounded font-semibold hover:bg-[#883472] transition-colors"
                >
                    Sign In
                </button>
            </form>
        </div>
    );
};

export default Login;