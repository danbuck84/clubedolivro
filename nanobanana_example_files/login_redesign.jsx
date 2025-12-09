// src/pages/Login.jsx
import React from 'react';
import { Google } from 'lucide-react'; // Pode ser necessário um ícone personalizado para o Google

const LoginPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-900 p-4">
            {/* Você pode adicionar uma textura sutil ou padrão SVG aqui como fundo */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')]"></div>


            <div className="relative bg-stone-50 rounded-xl shadow-2xl border border-stone-100 p-8 w-full max-w-sm text-center">
                <h1 className="font-serif text-4xl italic font-bold text-stone-900 mb-8">Clube do Livro</h1>

                <button className="flex items-center justify-center w-full bg-white text-stone-700 font-sans font-medium py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-stone-200 active:scale-[0.98]">
                    {/* Ícone do Google. O Lucide não tem um ícone do Google colorido por padrão,
              você precisaria de um SVG ou outra biblioteca de ícones para ter as cores exatas.
              Aqui, usamos um ícone de "estrela" como placeholder ou similar, ou você pode importar um SVG do Google.
          */}
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png" alt="Google Logo" className="w-5 h-5 mr-3" />
                    Continuar com Google
                </button>

                <p className="text-stone-500 text-xs mt-6">Ao continuar, você concorda com nossos Termos e Condições.</p>
            </div>
        </div>
    );
};

export default LoginPage;
