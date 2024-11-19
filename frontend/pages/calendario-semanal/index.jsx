import Link from "next/link";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import CardReceta from "@/components/cards/receta/CardReceta";

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const CalendarioSemanal = () => {
    const router = useRouter();
    const [calendarios, setCalendarios] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCalendarios = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('Debes iniciar sesión para ver esta receta');
                    router.push('/login');
                    return;
                }

                const res = await fetch('http://localhost:3000/obtenerCalendarios', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!res.ok) throw new Error('Error al obtener los calendarios');
                const data = await res.json();
                setCalendarios(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchCalendarios();
    }, []);

    const handleDelete = async (id_calendario) => {
        const confirm = window.confirm(`¿Estás seguro de que deseas borrar el calendario con ID ${id_calendario}?`);
        if (!confirm) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3000/borrarCalendario/${id_calendario}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error('Error al borrar el calendario');
            setCalendarios(calendarios.filter(cal => cal.id_calendario !== id_calendario));
            alert('Calendario borrado con éxito');
        } catch (err) {
            alert('Hubo un error al borrar el calendario');
        }
    };

    if (error) return <div>Error: {error}</div>;

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                <h1 className="text-center text-3xl font-bold my-8">Calendario Semanal</h1>

                {calendarios.length === 0 ? (
                    <div className="text-center">
                        <p className="text-xl font-medium text-gray-700">No hay calendarios disponibles.</p>
                    </div>
                ) : (
                    calendarios.map((calendario, index) => (
                        <div key={calendario.id_calendario} className="mb-12">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold">Calendario {index + 1}</h2>
                                <button 
                                    onClick={() => handleDelete(calendario.id_calendario)} 
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
                                    Borrar
                                </button>
                            </div>

                            <div className="grid grid-cols-7 gap-4">
                                {diasSemana.map((dia, i) => (
                                    <div key={i} className="bg-gray-100 p-4 rounded shadow-md">
                                        <h3 className="text-xl font-semibold text-center mb-2">{dia}</h3>

                                        {calendario.recetas
                                            .filter((_, j) => j % 7 === i)
                                            .map(receta => (
                                                <CardReceta key={receta.id_receta} item={receta}></CardReceta>
                                            ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
                <div className="text-center">
                    <Link href={'/calendario-semanal/generar'} className="text-blue-500 underline mt-4 inline-block">
                        Generar Nuevo Calendario
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CalendarioSemanal;
