import Search  from "../components/search/Search";

const SearchPage = () => {
    return (
        <div>
            <h1>Buscar Recetas o Usuarios</h1>
            <Search /> {/* Llama al componente de búsqueda */}
        </div>
    );
};

export default SearchPage;