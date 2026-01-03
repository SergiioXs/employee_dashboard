import { createContext, useContext, useState } from "react";

const HeaderContext = createContext();

export const HeaderProvider = ({ children }) => {
    const [title, setTitle] = useState("Dashboard");
    const [description, setDescription] = useState("Resumen general");

    return (
        <HeaderContext.Provider
            value={{ title, description, setTitle, setDescription }}
        >
            {children}
        </HeaderContext.Provider>
    );
};

export const useHeader = () => useContext(HeaderContext);
