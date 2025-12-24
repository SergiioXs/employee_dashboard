const SESSION_KEY = "user_session";

/**
 * Guardar sesión completa
 * @param {Object} userData
 */
export const saveSession = (userData) => {
    if (!userData) return;
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
};

/**
 * Obtener sesión
 * @returns {Object|null}
 */
export const getSession = () => {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
};

/**
 * Actualizar datos de la sesión
 * @param {Object} newData
 */
export const updateSession = (newData) => {
    const current = getSession();
    if (!current) return;
    const updated = { ...current, ...newData };
    saveSession(updated);
};

/**
 * Verificar si existe sesión
 * @returns {boolean}
 */
export const hasSession = () => {
    return !!getSession();
};

/**
 * Cerrar sesión (limpiar)
 */
export const clearSession = () => {
    localStorage.removeItem(SESSION_KEY);
};
