import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api.js';

export default function GoogleAuthButton({ onError }) {
  const { login: setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const { data } = await api.post('/auth/google', {
        credential: credentialResponse.credential,
      });
      localStorage.setItem('md_token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      const dest = data.user.role === 'admin' || data.user.role === 'superadmin' ? '/admin' : '/dashboard';
      window.location.href = dest;
    } catch (err) {
      onError?.(err.response?.data?.message || 'Errore accesso Google');
    }
  };

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => onError?.('Accesso Google annullato')}
        useOneTap={false}
        shape="rectangular"
        theme="outline"
        size="large"
        text="continue_with"
        locale="it"
      />
    </div>
  );
}
