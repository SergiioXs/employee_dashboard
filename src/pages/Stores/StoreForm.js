import { useState, useEffect } from "react";
import { Form, FormGroup, FormField, FormInput, Grid, GridColumn, FormSelect, FormButton, Button, Input, Dropdown, Icon } from 'semantic-ui-react'
import GeoMapPicker from "../../components/GeoMapPicker";
import useNotification from "../../components/notifications/useNotification";
import { httpPost } from '../../services/http';

import "./Stores.css";

const ENSENADA_CENTER = [31.8667, -116.6000];

const StoreForm = ({ initialData, onSubmit, onCancel }) => {
    const [form, setForm] = useState({
        id: initialData?.id || 0,
        nombre: initialData?.nombre || "",
        telefono: initialData?.telefono || "",
        direccion: initialData?.direccion || "",
        encargado: initialData?.encargado || "",
        lat: initialData?.lat || 0,
        lng: initialData?.lng || 0,
        radio: initialData?.radio || 20,
    });
    const [loading, setLoading] = useState(false);
    const { notify } = useNotification();
    console.log(form);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);


        if (!form.nombre || !form.telefono || !form.direccion || !form.encargado || !form.lat || !form.lng || !form.radio) {
            notify({
                title: "Error",
                message: "Todos los campos son obligatorios",
                type: "error",
            });
            setLoading(false);
            return;
        }

        if (form.radio < 10) {
            notify({
                title: "Error",
                message: "El radio debe ser mayor a 10",
                type: "error",
            });
            setLoading(false);
            return;
        }

        const response = await httpPost('registroSucursal.php', form);
        console.log(response);

        if (response.id) {
            notify({
                title: "Exito",
                message: "Se ha creado la sucursal correctamente",
                type: "success",
            });
            setLoading(false);
            onSubmit({
                ...form,
                id: response.id,
            });
            setLoading(false);
        } else {
            notify({
                title: "Error",
                message: "No se pudo crear la sucursal",
                type: "error",
            });
            setLoading(false);
        }
    };

    const handleMapChange = (coords) => {
        console.log(coords);
        setForm({ ...form, lat: coords.lat, lng: coords.lng, radio: coords.radius, direccion: coords.address });
    };



    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Grid stackable columns={2}>
                    <GridColumn width={7}>
                        <GeoMapPicker
                            value={{ lat: form.lat, lng: form.lng, radius: form.radio }}
                            radius={form.radio}
                            onChange={(coords) => handleMapChange(coords)}
                        />
                    </GridColumn>
                    <GridColumn width={9}>
                        <FormGroup widths='equal'>
                            <FormField>
                                <FormInput
                                    label="Nombre"
                                    name="nombre"
                                    placeholder="Nombre de la sucursal"
                                    defaultValue={form.nombre}
                                    onChange={handleChange}
                                    required
                                />
                            </FormField>

                            <FormField>
                                <FormInput
                                    label="Teléfono"
                                    name="telefono"
                                    placeholder="Teléfono"
                                    defaultValue={form.telefono}
                                    onChange={handleChange}
                                />
                            </FormField>

                            <FormField>
                                <FormInput
                                    label="Encargado"
                                    placeholder="Encargado"
                                    name="encargado"
                                    defaultValue={form.encargado}
                                    onChange={handleChange}
                                />
                            </FormField>


                        </FormGroup>
                        <FormField>
                            <FormInput
                                label="Dirección"
                                name="direccion"
                                defaultValue={form.direccion}
                                placeholder="Dirección"
                                fluid
                                onChange={handleChange}
                            />
                        </FormField>
                        <FormGroup widths='equal'>
                            <FormField>
                                <FormInput
                                    label="latitude"
                                    placeholder="latitude"
                                    value={form.lat}
                                    onChange={handleChange}
                                />
                            </FormField>

                            <FormField>
                                <FormInput
                                    label="longitude"
                                    placeholder="longitude"
                                    value={form.lng}
                                    onChange={handleChange}
                                />
                            </FormField>

                            <FormField>
                                <FormInput
                                    label="radio"
                                    placeholder="radio"
                                    type="number"
                                    min="10"
                                    value={form.radio}
                                    onChange={(e) =>
                                        setForm({ ...form, radio: Number(e.target.value) })
                                    }
                                />
                            </FormField>


                        </FormGroup>
                    </GridColumn>

                </Grid>

                <Button onClick={handleSubmit} loading={loading} floated="right" color="positive" type="submit">Guardar</Button>
                <Button onClick={onCancel} floated="right">Cancelar</Button>
            </Form>
        </>
    );
};

export default StoreForm;
