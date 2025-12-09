import React from 'react';
import HomePage from './pages/Home';
import BottomNavbar from './components/BottomNavbar';
import LoginPage from './pages/Login'; // Para testar a página de login separadamente

function App() {
    const isLoggedIn = true; // Simule o estado de login

    return (
        <div className="relative">
            {isLoggedIn ? (
                <>
                    <HomePage />
                    <BottomNavbar />
                </>
            ) : (
                <LoginPage />
            )}
        </div>
    );
}

export default App;
