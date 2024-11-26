import Search  from "../components/search/Search";
import CustomHead from "@/components/head/CustomHead";
const SearchPage = () => {
    return (
        <div>
            <CustomHead title={'Buscador'} 
            description={'Encuentra usuarios y recetas usando el buscador'}></CustomHead>
            <Search /> 
        </div>
    );
};

export default SearchPage;