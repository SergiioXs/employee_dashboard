

import { Button, Icon, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from 'semantic-ui-react'

const StoreTable = ({ data, onEdit, onDelete }) => {
    return (
        <>
            <Table striped>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell>Nombre</TableHeaderCell>
                        <TableHeaderCell>Encargado</TableHeaderCell>
                        <TableHeaderCell>Telefono</TableHeaderCell>
                        <TableHeaderCell>Direccion</TableHeaderCell>
                        <TableHeaderCell>Coordenadas</TableHeaderCell>
                        <TableHeaderCell>Radio (m)</TableHeaderCell>
                        <TableHeaderCell>Acciones</TableHeaderCell>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((store) => (
                        <TableRow key={store.id}>
                            <TableCell>{store.nombre}</TableCell>
                            <TableCell>{store.encargado}</TableCell>
                            <TableCell>{store.telefono}</TableCell>
                            <TableCell>{store.direccion}</TableCell>
                            <TableCell>{store.lat}, {store.lng}</TableCell>
                            <TableCell>{store.radio}</TableCell>
                            <TableCell>
                                <Icon name='edit' color='blue' size='large' style={{ cursor: 'pointer', marginRight: '5px' }} onClick={() => onEdit(store)} />
                                <Icon name='trash' color='red' size='large' style={{ cursor: 'pointer', marginRight: '5px' }} onClick={() => onDelete(store.id)} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </>
    );
};

export default StoreTable;
