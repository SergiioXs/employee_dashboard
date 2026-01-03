import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useState } from "react";
import { HeaderProvider } from "../context/HeaderContext";

const MainLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <HeaderProvider>
            <div className="container">
                <Sidebar
                    isMobileOpen={isMobileMenuOpen}
                    onClose={() => setIsMobileMenuOpen(false)}
                />

                <main className="main-content">
                    <Header onMenuClick={handleMenuToggle} />

                    {/* 👇 AQUÍ CAMBIA EL CONTENIDO */}
                    <Outlet />
                </main>
            </div>
        </HeaderProvider>
    );
};

export default MainLayout;
