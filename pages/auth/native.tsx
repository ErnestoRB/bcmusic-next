import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { Spinner } from "../../components/Spinner";

export default function NativeLogin() {
  useEffect(() => {
    signIn("spotify");
  }, []);

  return (
    <div className="bg-white grid place-items-center w-full">
      Iniciando sesión desde plataforma nativa
      <Spinner></Spinner>
    </div>
  );
}
