

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white p-6">
            <div className="flex justify-between items-center">
                <p>FookBook</p>
                <div className="flex space-x-4">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
                        <i className="fab fa-github text-2xl"></i>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
                        <i className="fab fa-instagram text-2xl"></i>
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
                        <i className="fab fa-twitter text-2xl"></i>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
                        <i className="fab fa-linkedin text-2xl"></i>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
