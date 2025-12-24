import React, { useEffect, useState } from "react";
import "../styles/login.css";
import { httpPost } from "../services/http";
import logo from "../assets/logo_blanco.png";
import { saveSession, hasSession } from "../services/session";
import { useNavigate } from "react-router-dom";


const Login = () => {
    const navigate = useNavigate();
    const [employeeNumber, setEmployeeNumber] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (hasSession()) {
            navigate("/", { replace: true });
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {

            console.log(employeeNumber, password);
            saveSession({ id: 11, employee_number: employeeNumber, name: "John Doe" });
            navigate("/", { replace: true });
            /*          
                       const response = await httpPost("/login.php", {
                           employee_number: employeeNumber,
                           password: password,
                       });
           */

            /*
                        // 🔧 Ajusta según la respuesta real del backend
                        if (response.data?.success) {
                            saveSession(response.data.user);
                            navigate("/dashboard", { replace: true });
                        } else {
                            setError("Credenciales incorrectas");
                        }
                        */
        } catch (err) {
            setError("Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            {/* IZQUIERDA */}
            <div className="login-form-section">
                <img src={logo} alt="Logo" className="logo" />
                <div className="login-form">
                    <h1>Iniciar sesión</h1>
                    <p className="subtitle">
                        Ingresa tu número de empleado y contraseña para iniciar sesión
                    </p>

                    <form onSubmit={handleSubmit}>
                        <label>Número de empleado *</label>
                        <input
                            type="text"
                            placeholder="Número de empleado"
                            value={employeeNumber}
                            onChange={(e) => setEmployeeNumber(e.target.value)}
                            required
                        />

                        <label>Contraseña *</label>
                        <input
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {/*
                        <div className="options">
                            <label className="remember">
                                <input type="checkbox" />
                                Mantener sesión activa
                            </label>
                            <span className="forgot">¿Olvidaste tu contraseña?</span>
                        </div>
                        */}

                        {error && <div className="error">{error}</div>}

                        <button type="submit" disabled={loading} >
                            {loading ? "Ingresando..." : "Iniciar sesión"}
                        </button>
                        <div className="forgot-option">
                            <span className="forgot">¿Olvidaste tu contraseña?</span>
                        </div>
                    </form>
                </div>
            </div>

            {/* DERECHA */}
            <div className="login-brand-section">
                <img src={logo} alt="Logo Integranet" style={{ width: "50%" }} />
            </div>
        </div>
    );
};

export default Login;
