import Link from 'next/link';
const Header = () => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login'; // Redirigir al login
    };
    return (
        <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
            <h1 className="text-lg font-bold">FootBook</h1>
            <Link href="/search">
                <p>Ir al buscador</p>
            </Link>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 p-2 rounded">
                Cerrar Sesión
            </button>
        </header>
    );
};

export default Header;
