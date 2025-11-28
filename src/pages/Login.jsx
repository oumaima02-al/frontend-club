import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Rediriger si déjà authentifié
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('🔄 Redirection automatique vers dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('📝 Soumission formulaire login');

    try {
      const result = await login(email, password);

      if (result.success) {
        console.log('🎉 Login réussi dans le composant');
        // La redirection se fera automatiquement via le useEffect
      } else {
        console.log('❌ Échec login:', result.message);
        setError(result.message);
      }
    } catch (err) {
      console.error('💥 Erreur inattendue:', err);
      setError('Une erreur inattendue est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Afficher le loading si déjà authentifié (en attente de redirection)
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-green mx-auto mb-4"></div>
          <p className="text-white">Redirection vers le dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-neon-green rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-2xl">V</span>
            </div>
            <span className="text-2xl font-bold text-white">VolleyClub</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Connexion</h1>
          <p className="text-gray-400">Accédez à votre espace membre</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg flex items-center space-x-2">
            <AlertCircle size={20} className="text-red-500" />
            <span className="text-red-500 text-sm">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="card space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <div className="relative">
              <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
                placeholder="admin@club.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Mot de passe</label>
            <div className="relative">
              <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 px-4 bg-neon-green text-black font-semibold rounded-lg hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-neon-green focus:ring-offset-2 focus:ring-offset-dark-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></div>
                Connexion...
              </div>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-400 mt-6">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-neon-green hover:underline">
            S'inscrire
          </Link>
        </p>

        <Link to="/" className="block text-center text-gray-500 mt-4 hover:text-neon-green transition">
          ← Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default Login;