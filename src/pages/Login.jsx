import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
	const [userid, setUserid] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	
  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    setError(''); // Reset error message

    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', {
        userid,
        password,
      });
      const token = res.data.access_token;
      localStorage.setItem('token', token); // atau simpan di cookie
      setLoading(false);
      console.log('Login berhasil:', res.data);
      navigate('/dashboard'); // Redirect ke halaman dashboard setelah login sukses
    } catch (err) {
      console.error('Login gagal:', err);
      setError(err.response?.data?.message || 'Login gagal, silakan coba lagi.');
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigate('/register');
  }

  return (
    <div className='grid grid-cols-2'>
      <div style={{ backgroundImage: "url('/img/login-background-small.png')" }} className='hidden md:block h-screen bg-cover bg-center'>
      </div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-12">
            <h3 className='text-xl font-bold text-neutral-600'>Login</h3>
          </div>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <div className='mb-8'>
            <form onSubmit={handleLogin}>
              <input 
                type="text"
                placeholder="NIS / NIK"
                className="w-full mb-3 py-2 px-5 bg-white rounded-full mb-5"
                value={userid}
                onChange={(e) => setUserid(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full mb-3 py-2 px-5 bg-white rounded-full mb-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className='mb-8'>
                <span className="ps-2 text-gray-500 font-medium whitespace-nowrap">Belum punya akun? <span className='text-blue-500 cursor-pointer' onClick={handleRegister}>Register</span></span>
              </div>
              <div className='flex justify-center'>
                <button 
                  className={`bg-green-500 w-[150px] text-white py-2 px-4 rounded-full hover:bg-emerald-300 transition-colors duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  type="submit"
                >
                  {loading ? 'Loading...' : 'Login'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;