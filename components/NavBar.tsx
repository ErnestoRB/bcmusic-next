import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";
import { useMediaQuery } from "../utils/hooks/useMediaQuery";
import { Dropdown } from "./Dropdown";

function NavBarLink(props: React.ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className="px-2 py-1 bg-white hover:bg-stone-200 text-black"
    ></Link>
  );
}

export default function NavBar() {
  const session = useSession();

  const desktopNavbar = useMediaQuery("(min-width:1000px)");

  const menuItems = useMemo<
    Array<{
      type?: "authenticated" | "unauthenticated";
      items: React.ReactNode[];
    }>
  >(
    () => [
      {
        items: [
          <NavBarLink key="crearBanner" href={"/banner"}>
            Crear banner
          </NavBarLink>,
          <NavBarLink key="acerca" href={"/about"}>
            Acerca
          </NavBarLink>,
        ],
      },
      {
        type: "unauthenticated",
        items: [
          <NavBarLink key="login" href="/auth/login">
            Iniciar sesión
          </NavBarLink>,
          <NavBarLink key="signup" href="/auth/signup">
            Registrarse
          </NavBarLink>,
          <NavBarLink key="privacidad" href={"/politicas"}>
            Política de privacidad
          </NavBarLink>,
        ],
      },
      {
        type: "authenticated",
        items: [
          <NavBarLink href="/panel" key="loggedInAs">
            <span>
              Sesión iniciada como:{" "}
              {session.data?.user?.email && !session.data?.user?.name && (
                <>{session.data.user.email}</>
              )}
              {session.data?.user?.name && <>{session.data.user.name}</>}
            </span>
            {session.data?.user?.image && (
              <Image
                className="max-w-[64px] inline mx-px"
                width={32}
                height={32}
                src={session.data.user.image}
                alt="user photo"
              ></Image>
            )}
          </NavBarLink>,
          <button
            key="logout"
            className="bg-red-600 text-white font-semibold"
            onClick={() => signOut()}
          >
            Cerrar sesión
          </button>,
        ],
      },
    ],
    [session]
  );

  return (
    <nav className=" bg-black flex flex-col sm:flex-row flex-wrap w-full h-[10vh] text-white gap-x-4 items-center sm:items-stretch place-items-center px-1 md:px-4">
      <Link
        className="justify-self-start flex-initial w-max text-lg font-bold"
        href={"/"}
      >
        BCMusic App
        <span className="bg-red-600 text-white rounded px-1 text-sm m-1">
          BETA
        </span>
      </Link>
      <div
        nav-options="true"
        className="flex flex-1 justify-end items-center gap-x-1 md:gap-x-2"
      >
        {desktopNavbar &&
          menuItems
            .filter((item) => !item.type || item.type === session.status)
            .flatMap((item) => item.items)
            .map((item, index) => item)}
        {!desktopNavbar && (
          <Dropdown
            classNameButton="p-2"
            classNameDropdown="w-min md:w-max p-2"
          >
            {menuItems
              .filter((item) => !item.type || item.type === session.status)
              .flatMap((item) => item.items)
              .map((item, index) => item)}
          </Dropdown>
        )}
      </div>
    </nav>
  );
}
