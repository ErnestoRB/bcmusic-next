import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { Spinner } from "../../components/Spinner";
import { NextPageContext } from "next";
import Cookies from "cookies";

export default function NativeLogin() {
  const login = () =>
    signIn("spotify", { callbackUrl: "/api/native/callback" });

  useEffect(() => {
    login();
  }, []);

  return (
    <div className="bg-white grid place-items-center w-full">
      <div className="flex flex-col items-center text-center">
        <Spinner></Spinner>
        Iniciando sesión desde plataforma nativa...
        <br />
        Si no has sido redireccionado, por favor, da click{" "}
        <a
          role="button"
          onClick={login}
          className="text-blue-600 hover:text-blue-800"
        >
          aquí
        </a>
      </div>
    </div>
  );
}

export const NATIVE_URL_COOKIE = "bcmusic-native-url";

export async function getServerSideProps(context: NextPageContext) {
  const redirectUrl = context.query["redirect_url"];

  if (!redirectUrl) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const cookies = new Cookies(context.req!, context.res!);
  cookies.set(
    NATIVE_URL_COOKIE,
    Array.isArray(redirectUrl) ? redirectUrl[0] : redirectUrl,
    {
      expires: new Date(Date.now() + 60 * 1000 * 5),
      sameSite: true,
    }
  );

  return {
    props: {},
  };
}
