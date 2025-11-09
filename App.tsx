import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CustomerForm } from './components/CustomerForm';
import { AdminPanel } from './components/AdminPanel';
import { Header } from './components/Header';
import { ChickenRun } from './components/ChickenRun';
import { Login } from './components/Login';
import { useLocalStorage } from './hooks/useLocalStorage';

const AppContent: React.FC = () => {
    const location = useLocation();
    const [isAdmin, setIsAdmin] = useLocalStorage('isAdmin', false);
    const isAdminPage = location.pathname.startsWith('/admin');

    const handleLogin = () => {
        setIsAdmin(true);
    };

    const handleLogout = () => {
        setIsAdmin(false);
    };

    return (
        <>
            <Header isAdmin={isAdminPage} />
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                <Routes>
                    <Route path="/" element={<CustomerForm />} />
                    <Route
                        path="/admin"
                        element={isAdmin ? <AdminPanel onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
                    />
                </Routes>
            </main>
            {!isAdminPage && <ChickenRun />}
        </>
    );
};


const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;
