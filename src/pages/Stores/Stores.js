
import { useHeader } from '../../context/HeaderContext';
import { useEffect, useState } from 'react';

import StoreTable from "./StoreTable";
import StoreForm from "./StoreForm";
import FiltersBar from '../../components/FiltersBar';
import { Form, FormGroup, FormField, FormInput, FormSelect, FormButton, Button, Input, Dropdown, Icon } from 'semantic-ui-react'
import useNotification from "../../components/notifications/useNotification";


const Stores = () => {
    const { setTitle, setDescription } = useHeader();
    const { notify } = useNotification();
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const statusOptions = [
        { key: 'activo', text: 'Activo', value: 'activo' },
        { key: 'inactivo', text: 'Inactivo', value: 'inactivo' },
    ];

    const loadStores = async () => {
        //const res = await getStores({ search, status });
        setStores([{
            id: 1,
            nombre: "Sucursal 1",
            telefono: "1234567890",
            direccion: "123 Main St",
            encargado: "John Doe",
            lat: 12.3456,
            lng: 78.9012,
            radio: 100
        }]);
    };

    const handleCreate = () => {
        setEditing(null);
        setShowForm(true);
    };

    const handleEdit = (store) => {
        setEditing(store);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        const updatedStores = stores.filter((store) => store.id !== id);
        setStores(updatedStores);
    };

    const handleNewStore = (store) => {
        notify({
            title: "Exito",
            message: "Se ha creado la sucursal correctamente",
            type: "success",
        });
        setStores([...stores, store]);
        setShowForm(false);
    };

    const handleSave = (store) => {
        if (editing) {
            const updatedStores = stores.map((s) =>
                s.id === editing.id ? store : s
            );
            setStores(updatedStores);
        } else {
            setStores([...stores, store]);
        }
        setShowForm(false);
    };

    const handleSearch = () => {
        loadStores();
    };

    useEffect(() => {
        setTitle("Sucursales");
        setDescription("Administra y configura tus sucursales");

        loadStores();
    }, []);


    return (
        <>


            {showForm ? (
                <>
                    <StoreForm
                        initialData={editing}
                        onSubmit={handleNewStore}
                        onCancel={() => setShowForm(false)}
                    />


                </>
            ) : (
                <div>
                    <div className="filters">
                        <Form>
                            <FormGroup widths={"equal"}>
                                <FormField>
                                    <FormInput
                                        label="Nombre"
                                        placeholder="Buscar por nombre..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </FormField>

                                <FormField>
                                    <FormSelect
                                        label="Estatus"
                                        placeholder='Select Status'
                                        selection
                                        options={statusOptions}
                                        value={status} onChange={(e) => setStatus(e.target.value)}
                                    />
                                </FormField>

                                <FormButton fluid label="." icon floated='right' labelPosition='left' onClick={() => handleSearch()}>
                                    <Icon name='search' />
                                    Buscar
                                </FormButton>
                            </FormGroup>
                        </Form>
                    </div>
                    <StoreTable
                        data={stores}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                    <Button primary floated='right' labelPosition='left' icon onClick={() => { setEditing(null); setShowForm(true); }}>
                        <Icon name='add' />
                        Agregar
                    </Button>
                </div>
            )}
        </>
    );
};

export default Stores;