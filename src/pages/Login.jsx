// Login.jsx
// Login NanoBanana aconchegante

import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Login = () => {
    const { loginWithGoogle, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-900 p-6 relative overflow-hidden">
            {/* Pattern de fundo */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            ></div>

            <div className="relative bg-stone-50 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-brand-500 to-brand-700"></div>
                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-700 rotate-3 shadow-inner">
                        <BookOpen size={32} strokeWidth={2.5} />
                    </div>

                    <h1 className="font-serif text-4xl font-bold text-stone-900 mb-2 tracking-tight">
                        Clube do Livro
                    </h1>
                    <p className="text-stone-500 text-sm mb-10 font-medium">
                        Sua comunidade literária privada
                    </p>

                    <button
                        onClick={loginWithGoogle}
                        className="w-full bg-white text-stone-700 font-sans font-bold py-4 px-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-stone-200 flex items-center justify-center group active:scale-95"
                    >
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="G"
                            className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform"
                        />
                        Continuar com Google
                    </button>

                    <p className="text-stone-400 text-xs mt-8">
                        Ao entrar, você concorda em trazer bons livros e boas histórias.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
