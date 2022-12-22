import { NextPageContext } from "next";
import { getCsrfToken, getProviders, signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import spotifyLogo from "../../images/spotify-white.png";
import Alert from "../../components/Alert";
import { useSpring, animated } from "@react-spring/web";

export const callbackUrl = "/";
export default function AuthError({
  csrfToken,
}: {
  providers: Awaited<ReturnType<typeof getProviders>>;
  csrfToken: string;
}) {
  const { backgroundColor } = useSpring({
    from: {
      backgroundColor: "#a114e4",
    },
    to: { backgroundColor: "#31a7cb" },
    loop: {
      reverse: true,
    },
    config: {
      duration: 5000,
    },
  });
  const { query } = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [loginMethod, setLoginMethod] = useState("");

  return (
    <animated.div
      style={{ backgroundColor }}
      className="w-full flex justify-center items-center"
    >
      <div className="max-w-md p-2 md:p-4 rounded-sm bg-white flex flex-col">
        {query.error && <Alert>{query.error}</Alert>}
        <h1 className="text-2xl my-2">Iniciar sesión</h1>
        <form
          className="flex flex-col"
          onSubmit={handleSubmit((values) => {
            const { contraseña, email } = values;

            if (loginMethod == "credentials") {
              signIn("credentials", { email, contraseña, callbackUrl });
              return;
            }
            signIn("email", { email, callbackUrl });
          })}
        >
          {loginMethod && (
            <>
              <input
                autoComplete="email"
                name="csrfToken"
                type="hidden"
                defaultValue={csrfToken}
              />
              <label htmlFor="email">Correo</label>
              <input
                type="email"
                {...register("email", { required: true })}
                required
              />
            </>
          )}
          {loginMethod === "credentials" && (
            <>
              <label htmlFor="contraseña">Contraseña</label>
              <input type="password" {...register("contraseña")} />
            </>
          )}
          {loginMethod && (
            <button className="bg-blue-600 text-white" type="submit">
              Enviar
            </button>
          )}
        </form>
        {loginMethod && <hr className="my-4" />}
        <button
          className="bg-stone-700 text-white"
          onClick={() => setLoginMethod("credentials")}
        >
          Iniciar sesión con contraseña
        </button>

        <button
          className="bg-black text-white"
          onClick={() => setLoginMethod("email")}
        >
          Iniciar sesión con Email
        </button>

        <button
          className="flex items-center gap-2 justify-center bg-spotify-green text-white"
          onClick={() => signIn("spotify", { callbackUrl })}
        >
          <Image
            src={spotifyLogo}
            width={32}
            height={32}
            alt={"spotify logo"}
          ></Image>
          Iniciar sesión con Spotify
        </button>
        <span>
          ¿Aún no tienes cuenta? ¡Puedes crear una{" "}
          <Link href="/auth/signup" className="text-blue-500">
            aquí
          </Link>
          !
        </span>
      </div>
    </animated.div>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: {
      csrfToken,
    },
  };
}
