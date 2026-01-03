
import { useHeader } from '../../context/HeaderContext';
import { useEffect } from 'react';


const Attendance = () => {
    const { setTitle, setDescription } = useHeader();

    useEffect(() => {
        setTitle("Checadas");
        setDescription("Administra y configura tus checadas");
    }, []);


    return (
        <>
            <h1>-</h1>
        </>
    );
};

export default Attendance;