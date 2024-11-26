
import { useRouter } from "next/navigation";
import CustomHead from "@/components/head/CustomHead";

export default function Home() {
  const router = useRouter();

  const handleRegister = () => {
    router.push("/register");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8 bg-gray-100">
                              <CustomHead title={'Página de inicio'} description={'Desde esta página puedes crear un usuario o ingresar con tu cuenta'}></CustomHead>
      <h1 className="text-4xl font-bold text-gray-900">Bienvenido a Foodbook</h1>
      <p className="text-lg text-gray-700">Conéctate para explorar y compartir recetas</p>
      <div className="flex flex-col gap-4">
        <button
          onClick={handleRegister}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 transition duration-300"
        >
          Registrarse
        </button>
        <button
          onClick={handleLogin}
          className="px-6 py-3 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 transition duration-300"
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  );
}
