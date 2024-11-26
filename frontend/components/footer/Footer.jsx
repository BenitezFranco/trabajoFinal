import { FaGithub, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-blue-900 text-white p-8" role='contentinfo'>
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                {/* Información del grupo y enlaces de navegación */}
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
                    <div className="flex space-x-8">
                        <p className="text-lg font-semibold">Grupo 27</p>
                        <a href="#contact" className="hover:text-gray-400">Contacto</a>
                        <a href="#terms" className="hover:text-gray-400">Términos</a>
                        <a href="#privacy" className="hover:text-gray-400">Privacidad</a>
                    </div>
                </div>

                {/* Redes sociales */}
                <div className="flex space-x-6 mt-4 md:mt-0">
                    <a
                        href="https://github.com/BenitezFranco/trabajoFinal"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-400 transition duration-200"
                        aria-label='Link de github'
                    >
                        <FaGithub size={24} />
                    </a>
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-400 transition duration-200"
                        aria-label='Link de instagram'

                    >
                        <FaInstagram size={24} />
                    </a>
                    <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-400 transition duration-200"
                        aria-label='Link de twitter'

                    >
                        <FaTwitter size={24} />
                    </a>
                    <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-400 transition duration-200"
                        aria-label='Link de linkedin'

                    >
                        <FaLinkedin size={24} />
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
