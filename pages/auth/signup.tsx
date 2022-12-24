import { useCallback, useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { PaisFields } from "../../types/definitions";
import Alert from "../../components/Alert";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Pais } from "../../utils/database/models";
import { callbackUrl } from "./login";
import spotifyLogo from "../../images/spotify-white.png";
import Image from "next/image";
import { useSpring, animated } from "@react-spring/web";
import Script from "next/script";

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

  const { backgroundColor } = useSpring({
    from: {
      backgroundColor: "#bfdbfe",
    },
    to: { backgroundColor: "#3d92fe" },
    loop: {
      reverse: true,
    },
    config: {
      duration: 5000,
    },
  });

  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const onSubmit = useCallback(async (data: FieldValues) => {
    window.grecaptcha.ready(function () {
      window.grecaptcha
        .execute(process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT, {
          action: "submit",
        })
        .then(async function (token: string) {
          const dataWithToken = { ...data, token };
          const response = await fetch("/api/signup", {
            method: "POST",
            body: JSON.stringify(dataWithToken),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const { message } = await response.json();
          setResponse(message);
          setError(!response.ok);
        });
    });
  }, []);

  return (
    <animated.div
      style={{ backgroundColor }}
      className="w-full flex flex-col items-center justify-center bg-blue-200"
    >
      <Script
        async
        src={
          "https://www.google.com/recaptcha/api.js?render=" +
          process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT
        }
      ></Script>
      <form
        className="max-w-sm flex flex-col gap-y-2 p-2 md:p-4 rounded-sm bg-white"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-3xl">¡Regístrate!</h1>
        <button
          type="button"
          className="flex items-center gap-2 bg-spotify-green text-white"
          onClick={() => signIn("spotify", { callbackUrl })}
        >
          <Image
            src={spotifyLogo}
            width={32}
            height={32}
            alt={"spotify logo"}
          ></Image>
          Registrarse usando Spotify
        </button>
        <hr />
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
    </animated.div>
  );
}

export async function getServerSideProps() {
  const paises = await Pais.findAll();

  return {
    props: { paises: paises.map((pais) => pais.dataValues) },
  };
}
