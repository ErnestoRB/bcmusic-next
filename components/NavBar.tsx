import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
export default function NavBar() {
  const session = useSession();
  return (
    <nav className=" bg-black flex flex-wrap w-full h-[10vh] text-white gap-x-4 items-stretch place-items-center px-1 md:px-4">
      <Link
        className="justify-self-start flex-initial w-max text-lg"
        href={"/"}
      >
        BCMusic App
      </Link>
      <div nav-options="true" className="flex flex-1 justify-end items-center">
        {session.status == "unauthenticated" && (
          <>
            <Link className="bg-blue-600 text-white" href="/auth/login">
              Iniciar sesión
            </Link>
          </>
        )}
        {session.status == "authenticated" && (
          <>
            <span>
              Sesión iniciada como:{" "}
              {session.data?.user?.email && !session.data?.user?.name && (
                <>{session.data.user.email}</>
              )}
              {session.data?.user?.name && <>{session.data.user.name}</>}
            </span>
            {session.data?.user?.image && (
              <Image
                className="h-full w-auto"
                width={32}
                height={32}
                src={session.data.user.image}
                alt="user photo"
              ></Image>
            )}
            <button
              className="bg-red-600 h-full text-white"
              onClick={() => signOut()}
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
