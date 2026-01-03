const FiltersBar = ({
    search,
    onSearchChange,
    status,
    onStatusChange,
    statusOptions = [],
    onCreate,
}) => {
    return (
        <div className="filters-bar">
            <input
                type="text"
                placeholder="Buscar por nombre..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
            />

            <select value={status} onChange={(e) => onStatusChange(e.target.value)}>
                <option value="">Todos</option>
                {statusOptions.map((s) => (
                    <option key={s.value} value={s.value}>
                        {s.label}
                    </option>
                ))}
            </select>

            <button onClick={onCreate}>+ Nueva sucursal</button>
        </div>
    );
};

export default FiltersBar;