import Head from "next/head";
import { backgroundGradient } from "../../utils/styles";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Alert from "../../components/Alert";
import { useSession } from "next-auth/react";
import { perserveStatus } from "../../utils";

export default function CreateBannerCode() {
  const { push } = useRouter();
  const session = useSession({
    required: true,
    onUnauthenticated: () => {
      push("/");
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div
      className={`flex flex-col items-center justify-center w-full ${backgroundGradient}`}
    >
      <Head>
        <title>Escribir banner</title>
      </Head>
      <div className="bg-white p-2 md:p-4 shadow-lg rounded max-w-7xl w-full">
        <>
          <h1 className="text-3xl font-semibold mb-4">
            Programando nuevo banner
          </h1>

          <form
            className="flex flex-col gap-y-4"
            onSubmit={handleSubmit((values) => {
              fetch("/api/banner", {
                method: "POST",
                body: JSON.stringify(values),
                headers: {
                  "Content-Type": "application/json",
                },
              })
                .then(perserveStatus)
                .then((response) => {
                  console.log(response);
                  toast(response.json.message, {
                    type: response.ok ? "success" : "error",
                  });
                  if (response.ok) {
                    push("/code/" + response.json.id);
                  }
                });
            })}
          >
            <input
              type="text"
              placeholder="Nombre del banner"
              {...register("name", { required: true })}
            />
            {errors.name && <Alert>El nombre es obligatorio</Alert>}
            <input
              type="text"
              placeholder="Descripción del banner"
              {...register("description", {})}
            />
            <input
              type="number"
              placeholder="Ancho del banner"
              {...register("width", {
                max: 3000,
                min: 1000,
                required: true,
              })}
            />
            {errors.width?.type === "required" && (
              <Alert>El ancho es obligatorio</Alert>
            )}
            {errors.width?.type === "min" && (
              <Alert>El ancho mínimo es de 1000px </Alert>
            )}
            {errors.width?.type === "max" && (
              <Alert>El ancho máximo es de 3000px</Alert>
            )}

            <input
              type="number"
              placeholder="Alto del banner"
              {...register("height", {
                max: 3000,
                min: 1000,
                required: true,
              })}
            />
            {errors.height?.type === "required" && (
              <Alert>El alto es obligatorio</Alert>
            )}
            {errors.height?.type === "min" && (
              <Alert>El alto mínimo es de 1000px </Alert>
            )}
            {errors.height?.type === "max" && (
              <Alert>El alto máximo es de 3000px</Alert>
            )}
            <input
              type="number"
              placeholder="Minimo de registros"
              {...register("minItems", {
                max: 10,
                min: 1,
                required: true,
              })}
            />
            {errors.minItems?.type === "required" && (
              <Alert>El número de registros es obligatorio</Alert>
            )}
            {errors.minItems?.type === "min" && (
              <Alert>El número de registros mínimo es de una entrada </Alert>
            )}
            {errors.minItems?.type === "max" && (
              <Alert>El número de registros máximo es de 10 entradas</Alert>
            )}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Crear
            </button>
          </form>
        </>
      </div>
    </div>
  );
}
