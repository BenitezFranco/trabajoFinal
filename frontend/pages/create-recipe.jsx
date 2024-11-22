import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import PasoInstruccion from "@/components/receta/pasoInstruccion/PasoInstruccion";
import { uploadImage } from "@/utils/funcion";
import Select from "react-select";

const CreateRecipe = () => {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    ingredientes: "",
    dificultad: "Fácil",
    tiempo_preparacion: "",
    categorias: [],
  });
  const router = useRouter();
  const [id_usuario, setIdUsuario] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // Estado para el mensaje de éxito
  const [pasos, setPasos] = useState([{ paso: "", imagen: null }]); // Estado para los pasos
  const [ingredientes, setIngredientes] = useState([
    { id_ingrediente: null, nombre: "", cantidad: "" },
  ]);

  const [imagenReceta, setImagenReceta] = useState(null); // Estado para la imagen

  const [ingredientesOptions, setIngredientesOptions] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwt.decode(token);
        setIdUsuario(decodedToken.id_usuario);
      }
      if (!token) {
        console.log("No token, redirecting to /login");
        router.push("/login");
        return;
      }
    }
  }, []);

  useEffect(() => {
    // Llamada a la API para obtener ingredientes
    const fetchIngredientes = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/ingredientes");
        if (response.status === 200) {
          const ingredientes = await response.json();
          // Formatear los ingredientes para el Select
          const options = ingredientes.map((ingrediente) => ({
            value: ingrediente.id_ingrediente,
            label: ingrediente.nombre,
          }));
          setIngredientesOptions(options);
        } else if (response.status === 401 || response.status === 403) {
          alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
          localStorage.removeItem("token");
          router.push("/login");
        }
      } catch (error) {
        console.error("Error al obtener ingredientes:", error);
      }
    };

    fetchIngredientes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasoChange = (index, value) => {
    const newPasos = [...pasos];
    newPasos[index].paso = value;
    setPasos(newPasos);
  };

  const handleImagenChange = (index, file) => {
    const newPasos = [...pasos];
    newPasos[index].imagen = file;
    setPasos(newPasos);
  };

  const handleAddPaso = () => {
    setPasos([...pasos, { paso: "", imagen: null }]);
  };
  const handleRemovePaso = () => {
    if (pasos.length > 1) {
      setPasos(pasos.slice(0, -1));
    }
  };
  const handleAgregarIngrediente = () => {
    setIngredientes([
      ...ingredientes,
      { id_ingrediente: null, nombre: "", cantidad: "" },
    ]);
  };

  const handleQuitarIngrediente = (index) => {
    if (ingredientes.length > 1) {
      const nuevosIngredientes = ingredientes.filter((_, i) => i !== index);
      setIngredientes(nuevosIngredientes);
    }
  };

  const handleSelectIngredienteChange = (selectedOption, index) => {
    const newIngredientes = [...ingredientes];
    newIngredientes[index] = {
      ...newIngredientes[index],
      id_ingrediente: selectedOption ? selectedOption.value : null,
      nombre: selectedOption ? selectedOption.label : "",
    };
    setIngredientes(newIngredientes);
  };

  const handleCantidadChange = (index, value) => {
    const newIngredientes = [...ingredientes];
    newIngredientes[index].cantidad = value;
    setIngredientes(newIngredientes);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagenReceta(file);
  };

  const handleSelectChange = (selectedOptions) => {
    const selectedCategories = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setFormData({ ...formData, categorias: selectedCategories });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let fotoRecetaUrl = "";
    if (imagenReceta) {
      fotoRecetaUrl = await uploadImage(imagenReceta);
      if (!fotoRecetaUrl) {
        alert("Error al subir la imagen. Inténtalo de nuevo.");
        return;
      }
      console.log("imagen: ", fotoRecetaUrl);
    }

    const instrucciones = await Promise.all(
      pasos.map(async (paso) => {
        let imageUrl = null;

        if (paso.imagen) {
          // Lógica para subir la imagen y obtener la URL.
          // Ejemplo:
          imageUrl = await uploadImage(paso.imagen);
          console.log("url:", imageUrl);
        }

        return {
          paso: paso.paso,
          imagen: imageUrl,
        };
      })
    );

    const recetaData = {
      ...formData,
      foto_receta: fotoRecetaUrl,
      instrucciones,
      ingredientes,
      fecha_publicacion: new Date().toISOString().split("T")[0],
      id_usuario: id_usuario,
    };

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:3000/create-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recetaData),
      });

      if (response.status === 200) {
        setSuccessMessage("Receta creada con éxito"); // Mensaje de éxito
        setTimeout(() => {
          router.push("/HomeLog");
        }, 2000);
      } else if (response.status === 401 || response.status === 403) {
        alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
        localStorage.removeItem("token");
        router.push("/login");
      }
      console.log("response:", response);
      if (response.ok) {
      } else {
        console.error("Error al crear la receta");
      }
    } catch (error) {
      console.error("Error al crear la receta", error);
    }
  };

  const categoriasOptions = [
    { value: 1, label: "Vegetariano" },
    { value: 2, label: "Vegano" },
    { value: 3, label: "Desayuno" },
    { value: 4, label: "Sin TACC" },
    { value: 5, label: "Sin gluten" },
    { value: 6, label: "Postres" },
    { value: 7, label: "Saludables" },
    { value: 8, label: "Cenas" },
    { value: 9, label: "Almuerzos" },
    { value: 10, label: "Platos principales" },
    { value: 11, label: "Aperitivos" },
    { value: 12, label: "Bebidas" },
    { value: 13, label: "Dulces" },
    { value: 14, label: "Ensaladas" },
    { value: 15, label: "Sopas y cremas" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-00">
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex-grow flex flex-col items-center p-6">
        <h1 className="text-4xl font-bold mb-8">Crear Receta</h1>
        {successMessage && (
          <div className="mb-4 text-green-600">{successMessage}</div> // Mensaje de éxito
        )}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          {/* Resto del formulario... */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Título:
            </label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="foto_receta">Foto de la Receta:</label>
            <input
              type="file"
              name="foto_receta"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Descripción:
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Ingredientes:
            </label>
            {ingredientes.map((ingrediente, index) => (
              <div key={index} className="flex items-center mb-2">
                <Select
                  required
                  options={ingredientesOptions}
                  className="basic-single"
                  classNamePrefix="select"
                  placeholder="Selecciona un ingrediente"
                  onChange={(selectedOption) =>
                    handleSelectIngredienteChange(selectedOption, index)
                  }
                  value={
                    ingrediente.id_ingrediente
                      ? {
                          value: ingrediente.id_ingrediente,
                          label: ingrediente.nombre,
                        }
                      : null
                  }
                />
                <input
                  required
                  type="text"
                  placeholder="Cantidad"
                  value={ingrediente.cantidad}
                  onChange={(e) => handleCantidadChange(index, e.target.value)}
                  className="ml-2 shadow appearance-none border rounded w-20 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <button
                  type="button"
                  onClick={() => handleQuitarIngrediente(index)}
                  className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                >
                  Quitar
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAgregarIngrediente}
              className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Agregar Ingrediente
            </button>
          </div>

          <div className="mb-4">
            <h2 className="block text-gray-700 text-sm font-bold mb-2">
              Instrucciones:
            </h2>
            {pasos.map((paso, index) => (
              <PasoInstruccion
                key={index}
                index={index}
                paso={paso}
                handlePasoChange={handlePasoChange}
                handleImagenChange={handleImagenChange}
              />
            ))}
            <button
              type="button"
              onClick={handleAddPaso}
              className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Agregar Paso
            </button>
            <button
              type="button"
              onClick={handleRemovePaso}
              className="mt-2 ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              disabled={pasos.length <= 1} // Deshabilitado si solo hay un paso
            >
              Borrar Último Paso
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tiempo de Preparación (minutos):
            </label>
            <input
              type="text"
              name="tiempo_preparacion"
              value={formData.tiempo_preparacion}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Dificultad:
            </label>
            <div className="flex items-center">
              <label className="mr-4">
                <input
                  type="radio"
                  name="dificultad"
                  value="Fácil"
                  checked={formData.dificultad === "Fácil"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Fácil
              </label>
              <label className="mr-4">
                <input
                  type="radio"
                  name="dificultad"
                  value="Media"
                  checked={formData.dificultad === "Media"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Media
              </label>
              <label className="mr-4">
                <input
                  type="radio"
                  name="dificultad"
                  value="Difícil"
                  checked={formData.dificultad === "Difícil"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Difícil
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Categorías:
            </label>
            <Select
              required
              isMulti
              options={categoriasOptions}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Selecciona una o más categorías"
              onChange={handleSelectChange}
              value={categoriasOptions.filter((option) =>
                formData.categorias.includes(option.value)
              )}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Crear Receta
          </button>
        </form>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CreateRecipe;
