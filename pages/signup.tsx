import { useCallback, useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { PaisFields } from "../utils/definitions";
import Alert from "../components/Alert";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Pais } from "../utils/database/models";

export default function SignUp({ paises = [] }: { paises: PaisFields[] }) {
  const router = useRouter();
  const [response, setResponse] = useState("");
  const [isError, setError] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const onSubmit = useCallback(async (data: FieldValues) => {
    const response = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { msg } = await response.json();
    setResponse(msg);
    setError(!response.ok);
  }, []);

  return (
    <div className="container max-w-3xl">
      <form className="flex flex-col gap-y-2" onSubmit={handleSubmit(onSubmit)}>
        {response && isError && <Alert>{response}</Alert>}
        {response && !isError && <Alert type="success">{response}</Alert>}
        <label htmlFor="Email">Email</label>
        <input
          type="email"
          {...register("Email", {
            required: true,
          })}
        />
        {errors.Usuario?.type === "required" && (
          <Alert>Campo usuario requerido</Alert>
        )}
        <label htmlFor="Contraseña">Contraseña</label>
        <input
          type="password"
          {...register("Contraseña", {
            required: true,
            minLength: 8,
            maxLength: 24,
          })}
        />
        {errors.Contraseña?.type === "required" && (
          <Alert>Campo Contraseña requerido</Alert>
        )}
        {errors.Contraseña?.type === "minLength" && (
          <Alert>Campo Contraseña debe ser de al menos 8 caracteres</Alert>
        )}
        {errors.Contraseña?.type === "maxLength" && (
          <Alert>Campo Contraseña debe ser de a lo mucho 24 caracteres</Alert>
        )}
        <label htmlFor="Nombre">Nombre</label>
        <input type="text" {...register("Nombre", { required: true })} />
        {errors.Nombre?.type === "required" && (
          <Alert>Campo Nombre requerido</Alert>
        )}
        <label htmlFor="Apellido">Apellido</label>
        <input type="text" {...register("Apellido", { required: true })} />
        {errors.Apellido?.type === "required" && (
          <Alert>Campo Apellido requerido</Alert>
        )}
        <label htmlFor="Pais">Pais</label>
        <select {...register("Pais", { required: true })}>
          {paises.map((pais) => (
            <option value={pais.ID} key={pais.ID}>
              {pais.Nombre}
            </option>
          ))}
        </select>
        {errors.Pais?.type === "required" && (
          <Alert>Campo Pais requerido</Alert>
        )}
        <label htmlFor="Nacimiento">Fecha de Nacimiento</label>
        <input type="date" {...register("Nacimiento", { required: true })} />
        {errors.Nacimiento?.type === "required" && (
          <Alert>Campo Nacimiento requerido</Alert>
        )}
        <button type="submit" className="bg-blue-700 text-white">
          Registrarse
        </button>
      </form>
    </div>
  );
}

export async function getServerSideProps() {
  const paises = await Pais.findAll();

  return {
    props: { paises: paises.map((pais) => pais.dataValues) },
  };
}
