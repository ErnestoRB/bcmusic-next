import { NextPageContext } from "next";
import { getCsrfToken, getProviders, signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import spotifyLogo from "../../images/spotify-white.png";
import Alert from "../../components/Alert";
import Script from "next/script";
import Head from "next/head";
import { Button } from "../../components/Button";

const LoginButton = function ({
  children,
  className,
  onPressEnd,
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      id="email-login"
      className={`h-12 ${className}`}
      onPressEnd={onPressEnd}
    >
      {children}
    </Button>
  );
};

export const callbackUrl = "/";
export default function AuthError({
  csrfToken,
  providers,
}: {
  providers: Awaited<ReturnType<typeof getProviders>>;
  csrfToken: string;
}) {
  const { query } = useRouter();
  const { register, handleSubmit } = useForm();

  const [loginMethod, setLoginMethod] = useState("");

  return (
    <div className={`w-full flex justify-center items-center `}>
      <Head>
        <title>Iniciar sesión</title>
      </Head>
      <Script
        async
        src={
          "https://www.google.com/recaptcha/api.js?render=" +
          process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT
        }
      ></Script>
      <div className="max-w-md p-2 md:p-4 rounded-sm bg-white flex flex-col gap-y-2">
        {query.error && (
          <>
            {(query.error == "OAuthCallback" && (
              <Alert>No fue posible este metodo de autentificación</Alert>
            )) ||
              (query.error == "SIGNIN_EMAIL_ERROR" && (
                <Alert>No se pudo iniciar sesión con email</Alert>
              )) || <Alert>{query.error}</Alert>}
          </>
        )}
        <h1 className="my-2">Iniciar sesión</h1>
        <div className="flex flex-col">
          <form
            className="flex flex-col gap-y-4"
            onSubmit={handleSubmit((values) => {
              const { contraseña, email } = values;

              if (loginMethod == "credentials") {
                window.grecaptcha.ready(function () {
                  window.grecaptcha
                    .execute(process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT, {
                      action: "submit",
                    })
                    .then(async function (token: string) {
                      signIn("credentials", {
                        email,
                        contraseña,
                        callbackUrl,
                        token,
                      });
                    });
                });
                return;
              }
              signIn("email", { email, callbackUrl });
            })}
          >
            {loginMethod && (
              <>
                <input
                  name="csrfToken"
                  type="hidden"
                  defaultValue={csrfToken}
                />
                <label htmlFor="email">Correo</label>
                <input
                  autoComplete="email"
                  id="input-email"
                  type="email"
                  {...register("email", { required: true })}
                  required
                />
              </>
            )}
            {loginMethod === "credentials" && (
              <>
                <label htmlFor="contraseña">Contraseña</label>
                <input
                  id="input-password"
                  type="password"
                  {...register("contraseña")}
                />
              </>
            )}
            {loginMethod && (
              <LoginButton
                id="login-button"
                className="bg-blue-600 text-white"
                type="submit"
              >
                Enviar
              </LoginButton>
            )}
          </form>
          {loginMethod && <hr className="my-4" />}
          {providers &&
            Object.values(providers).map((provider) => {
              switch (provider.id) {
                case "credentials":
                  return (
                    <LoginButton
                      key={provider.id}
                      id="password-login"
                      className="bg-stone-700 text-white"
                      onPressEnd={() => setLoginMethod("credentials")}
                    >
                      Iniciar sesión con contraseña
                    </LoginButton>
                  );
                case "email":
                  return (
                    <LoginButton
                      key={provider.id}
                      id="email-login"
                      className="bg-black text-white"
                      onPressEnd={() => setLoginMethod("email")}
                    >
                      Iniciar sesión con Email
                    </LoginButton>
                  );
                case "spotify":
                  return (
                    <LoginButton
                      key={provider.id}
                      id="spotify-login"
                      className="flex items-center gap-2 justify-center bg-spotify-green text-white"
                      onPressEnd={() => signIn("spotify", { callbackUrl })}
                    >
                      <Image
                        src={spotifyLogo}
                        width={32}
                        height={32}
                        alt={"spotify logo"}
                      ></Image>
                      Iniciar sesión con Spotify
                    </LoginButton>
                  );
              }
              return undefined;
            })}
        </div>
        <span>
          ¿Aún no tienes cuenta? ¡Puedes crear una{" "}
          <Link href="/auth/signup" className="text-blue-500">
            aquí
          </Link>
          !
        </span>
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
