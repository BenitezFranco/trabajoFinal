import Link from "next/link"; // Asegúrate de importar Link
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faSignOutAlt,
  faUser,
  faPlus,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons"; // Íconos importados

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para verificar autenticación
  const router = useRouter();
  const [userId, setUserId] = useState(null); // Estado para almacenar el userId

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false); // Actualiza el estado
    router.push("/login"); // Redirigir al login utilizando router.push
  };

  // Verifica si el usuario está autenticado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      setUserId(getUserIdFromToken(token)); // Establecer el userId solo si hay token
    } else {
      setIsAuthenticated(false);
      setUserId(null); // Si no hay token, asegurarse de limpiar el userId
    }
  }, []);

  const getUserIdFromToken = (token) => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Extraer el payload del JWT
        return payload.id_usuario; // Aquí asumo que el token tiene un campo 'id_usuario'
      } catch (error) {
        console.error("Error al extraer el ID del token:", error);
        return null;
      }
    }
    return null;
  };

  return (
    <header
      className="bg-blue-800 text-white p-4 flex justify-between items-center"
      role="navigation"
    >
      <Link href="/HomeLog" passHref>
        <h1 className="p-2 rounded-full flex items-center group text-lg font-bold cursor-pointer">
          FoodBook
        </h1>
      </Link>

      {/* Menú del Header */}
      <div className="flex items-center space-x-4">
        <Link href="/search" passHref>
          <div className="p-2 rounded-full flex items-center group flex items-center space-x-2 cursor-pointer group">
            {" "}
            {/* group para aplicar hover */}
            <FontAwesomeIcon
              icon={faSearch}
              className="text-white group-hover:text-blue-300"
            />
            <span className="text-white group-hover:text-blue-300">Buscar</span>{" "}
            {/* Cambia el color del texto e icono */}
          </div>
        </Link>

        {/* Otros botones, si el usuario está autenticado */}
        {isAuthenticated && (
          <>
            <Link href={`/perfil/${userId}`} passHref>
              <div className="p-2 rounded-full flex items-center group flex items-center space-x-2 cursor-pointer group">
                {" "}
                {/* group para aplicar hover */}
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-white group-hover:text-blue-300"
                />
                <span className="text-white ml-2 group-hover:text-blue-300">
                  Perfil
                </span>{" "}
                {/* Cambia el color del texto e icono */}
              </div>
            </Link>

            <Link href={`/create-recipe`} passHref>
              <div className=" flex items-center space-x-2 cursor-pointer group p-2 rounded-full flex items-center group">
                {" "}
                {/* group para aplicar hover */}
                <FontAwesomeIcon
                  icon={faPlus}
                  className="text-white group-hover:text-green-300"
                />
                <span className="text-white ml-2 group-hover:text-green-300">
                  Crear receta
                </span>{" "}
                {/* Cambia el color del texto e icono */}
              </div>
            </Link>
            <Link href="/plan-recetas" passHref>
              <div className="p-2 rounded-full flex items-center group flex items-center space-x-2 cursor-pointer group">
                {" "}
                {/* group para aplicar hover */}
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="text-white group-hover:text-blue-300"
                />
                <span className="text-white group-hover:text-blue-300">
                  Plan de Recetas
                </span>{" "}
                {/* Cambia el color del texto e icono */}
              </div>
            </Link>
          </>
        )}
        <Link
          href="#"
          passHref
          onClick={(e) => {
            e.preventDefault(); // Previene la acción predeterminada del enlace
            handleLogout(); // Llama a la función de cierre de sesión
          }}
        >
          <div className="p-2 rounded-full flex items-center group flex items-center space-x-2 cursor-pointer group">
            {" "}
            <FontAwesomeIcon
              icon={faSignOutAlt}
              className="text-white group-hover:text-red-300"
            />
            <span className="text-white ml-2 group-hover:text-red-300">
              Cerrar sesión
            </span>{" "}
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
