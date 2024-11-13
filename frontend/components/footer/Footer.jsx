const Footer = () => {
    return (
        <footer className="bg-blue-900 text-white p-8">

            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                {/* Información del grupo y enlaces de navegación */}
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
                    <p className="text-lg font-semibold">Grupo 27</p>
                    <div className="flex space-x-4">
                        <a href="#contact" className="hover:text-gray-400">Contacto</a>
                        <a href="#terms" className="hover:text-gray-400">Términos</a>
                        <a href="#privacy" className="hover:text-gray-400">Privacidad</a>
                    </div>
                </div>

                {/* Redes sociales */}
                <div className="flex space-x-6 mt-4 md:mt-0">
                    <a href="https://github.com/BenitezFranco/trabajoFinal" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition duration-200">
                        <i className="fab fa-github text-2xl"></i>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition duration-200">
                        <i className="fab fa-instagram text-2xl"></i>
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition duration-200">
                        <i className="fab fa-twitter text-2xl"></i>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition duration-200">
                        <i className="fab fa-linkedin text-2xl"></i>
                    </a>
                </div>
            </div>

            {/* Copyright */}
            <div className="mt-6 text-center text-sm text-gray-300">
                <p>&copy; {new Date().getFullYear()} Grupo 27. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;
