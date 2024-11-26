import Generador from "@/components/semanal/Generador";
import CustomHead from "@/components/head/CustomHead";
//<CustomHead title={} description={}/>
const GenerarCalendario= () => {
    return (
        <div>
            <CustomHead title={'Generar Calendario Semanal'} description={'En esta página se genera un nuevo calendario semanal'}/>
            <Generador /> 
        </div>
    );
};

export default GenerarCalendario;