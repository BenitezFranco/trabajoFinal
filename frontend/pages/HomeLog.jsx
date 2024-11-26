import HomeLog from "@/components/homeLog/HomeLog";
import CustomHead from "@/components/head/CustomHead";

const SearchPage = () => {
    return (
        <div>
            <CustomHead title={'Página de inicio de usuario'} description={'Esta es la página de inicio para los usuarios que iniciaron sesión.'}/>
            <HomeLog /> 
        </div>
    );
};

export default SearchPage;