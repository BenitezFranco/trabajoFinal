import Generador from "@/components/semanal/Generador";
import Link from "next/link";

const CalendarioSemanal= () => {
    return (
        <Link href={'/calendario-semanal/generar'}>Generar</Link>
    );
};

export default CalendarioSemanal;