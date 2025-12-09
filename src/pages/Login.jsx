// Login.jsx
// Página de login com autenticação Google

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
    const { loginWithGoogle, user } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirecionamento automático quando o usuário já estiver logado
    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleGoogleLogin = async () => {
        try {
            setError('');
            setLoading(true);
            await loginWithGoogle();
            // O redirecionamento será feito pelo useEffect acima
        } catch (error) {
            console.error('Erro no login:', error);
            setError('Erro ao fazer login. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo e Título */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <div className="bg-gradient-to-br from-amber-600 to-orange-700 p-5 rounded-full shadow-lg">
                            <BookOpen className="w-14 h-14 text-white" />
                        </div>
                    </div>
                    <h1 className="text-5xl font-serif font-bold text-gray-900 dark:text-white mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                        Clube do Livro
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Sua biblioteca pessoal
                    </p>
                </div>

                {/* Card de Login */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
                        Bem-vindo de volta! 📚
                    </h2>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center gap-3 justify-center bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        <span>{loading ? 'Entrando...' : 'Entrar com Google'}</span>
                    </button>

                    <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
                        Ao continuar, você concorda com nossos termos de uso
                    </p>
                </div>
            </div>
        </div>
    );
}
