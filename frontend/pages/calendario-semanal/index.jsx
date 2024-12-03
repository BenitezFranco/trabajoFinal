import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import CardRecetaC from "@/components/cards/receta/CardRecetaC";
import { TrashIcon } from "@heroicons/react/24/solid";
import { FaPlus } from 'react-icons/fa';
import CustomHead from "@/components/head/CustomHead";

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const CalendarioSemanal = () => {
    const router = useRouter();
    const [calendarios, setCalendarios] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCalendarios = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    alert("Debes iniciar sesión para ver esta receta");
                    router.push("/login");
                    return;
                }

                const res = await fetch("http://localhost:3000/obtenerCalendarios", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) throw new Error("Error al obtener los calendarios");
                const data = await res.json();
                setCalendarios(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchCalendarios();
    }, []);

    const handleDelete = async (id_calendario) => {
        const confirm = window.confirm(`¿Estás seguro de que deseas borrar el calendario?`);
        if (!confirm) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/borrarCalendario/${id_calendario}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Error al borrar el calendario");
            setCalendarios(calendarios.filter((cal) => cal.id_calendario !== id_calendario));
            alert("Calendario borrado con éxito");
        } catch (err) {
            alert("Hubo un error al borrar el calendario");
        }
    };

    const dividirRecetasEnDias = (recetas) => {
        const filas = [];
        for (let i = 0; i < recetas.length; i += 7) {
            filas.push(recetas.slice(i, i + 7));
        }
        return filas;
    };

    const getDiasReordenados = (fecha) => {
        const diaInicio = fecha;
        const indiceInicio = diaInicio === 0 ? 6 : diaInicio - 1; // Ajustar índice para que Lunes sea 0
        return [...diasSemana.slice(indiceInicio), ...diasSemana.slice(0, indiceInicio)];
    };

    if (error)
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-3xl text-red-600 font-bold">Error: {error}</h1>
            </div>
        );

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <CustomHead title={'Calendario Semanal'} description={'En esta página puedes ver tus calendarios semanales'} />
            <Header />
            <main className="flex-grow max-w-7xl mx-auto p-6">
                <h1 className="text-center text-4xl font-bold text-gray-800 mb-8">Calendario Semanal</h1>

                {calendarios.length === 0 ? (
                    <div className="text-center">
                        <p className="text-xl font-medium text-gray-700">No hay calendarios disponibles.</p>
                    </div>
                ) : (
                    calendarios.map((calendario) => {
                        const diasOrdenados = getDiasReordenados(calendario.fecha); // Ordena los días según la fecha del calendario
                        return (
                            <div key={calendario.id_calendario} className="mb-16 bg-white rounded-lg shadow p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {calendario.nombre ? calendario.nombre : `Calendario `} {/* Mostrar el nombre del calendario */}
                                    </h2>
                                    <button
                                        onClick={() => handleDelete(calendario.id_calendario)}
                                        className="flex items-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition">
                                        <TrashIcon className="h-5 w-5 mr-2" />
                                        Borrar
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                                    {dividirRecetasEnDias(calendario.recetas).map((fila, i) => (
                                        fila.map((receta, j) => (
                                            <div key={`${i}-${j}`} className="p-4 bg-gray-100 rounded shadow hover:shadow-lg transition duration-200">
                                                <h3 className="text-lg font-semibold text-center mb-4 text-blue-600">
                                                    {diasOrdenados[(i * 7 + j) % 7]}
                                                </h3>
                                                <CardRecetaC
                                                    key={receta.id_receta}
                                                    item={receta}
                                                    className="border-t pt-2"
                                                />
                                            </div>
                                        ))
                                    ))}
                                </div>
                            </div>
                        );
                    })
                )}

                <div className="text-center mt-6">
                    <Link
                        href="/calendario-semanal/generar"
                        className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-green-600 hover:text-white hover:border-green-600 transition duration-200"
                    >
                        <FaPlus className="mr-2" />
                        Generar Nuevo Calendario
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CalendarioSemanal;
