import { NextPageContext } from "next";
import { getCsrfToken, getProviders, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Alert from "../../components/Alert";

const callbackUrl = "/";
export default function AuthError({
  providers,
  csrfToken,
}: {
  providers: Awaited<ReturnType<typeof getProviders>>;
  csrfToken: string;
}) {
  const { query } = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [loginMethod, setLoginMethod] = useState("");

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-black">
      <div className="max-w-md md:p-4 rounded-sm bg-white flex flex-col">
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
          className="bg-spotify-green text-white"
          onClick={() => signIn("spotify", { callbackUrl })}
        >
          Iniciar sesión con Spotify
        </button>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const csrfToken = await getCsrfToken(context);
  const providers = await getProviders();
  return {
    props: {
      csrfToken,
      providers,
    },
  };
}
