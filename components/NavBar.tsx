import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";
import { useMediaQuery } from "../utils/hooks/useMediaQuery";
import { Dropdown } from "./Dropdown";
import { Button } from "./Button";

function NavBarLink(
  props: React.ComponentProps<typeof Link> & { visible?: "true" | "false" }
) {
  return (
    <>
      {(props.visible === undefined || props.visible === "true") && (
        <Link
          {...props}
          className="grid h-full px-2 py-1 border-b-0 lg:border-b-2 border-stone-200 shadow-md bg-stone-800 hover:bg-stone-900 text-white place-items-center"
        ></Link>
      )}
    </>
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
            Generar banner
          </NavBarLink>,
          <NavBarLink key="verBanners" href={"/banners"}>
            Ver banners
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
            <div className="flex items-center gap-x-1">
              {session.data?.user?.image && (
                <Image
                  className="box-content max-w-[64px] inline mx-px border-2 border-white"
                  width={32}
                  height={32}
                  src={session.data.user.image}
                  alt="user photo"
                ></Image>
              )}
              <span>
                Sesión iniciada como:{" "}
                <b>
                  {session.data?.user?.email && !session.data?.user?.name && (
                    <>{session.data.user.email}</>
                  )}
                  {session.data?.user?.name && <>{session.data.user.name}</>}
                </b>
              </span>
            </div>
          </NavBarLink>,
          <NavBarLink
            href="/new"
            key="crear"
            visible={
              /* For DOM purposes */
              session.data?.user?.tipo_usuario?.nombre === "admin"
                ? "true"
                : "false"
            }
          >
            <span>Crear banner</span>
          </NavBarLink>,
          <Button
            key="logout"
            className="bg-red-600 text-white font-semibold grid place-items-center px-2 py-1"
            onClick={() => signOut()}
          >
            Cerrar sesión
          </Button>,
        ],
      },
    ],
    [session]
  );

  return (
    <nav
      className=" bg-gradient-to-br from-black/80 to-black/70 flex flex-col sm:flex-row flex-wrap w-full h-[10vh] 
    text-white gap-x-4 items-center sm:items-center place-items-center px-1 md:px-4"
    >
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
        className="flex flex-1 p-0 max-h-12 justify-end items-stretch gap-x-1 md:gap-x-2"
      >
        {desktopNavbar &&
          menuItems
            .filter((item) => !item.type || item.type === session.status)
            .flatMap((item) => item.items)
            .map((item, index) => item)}
        {!desktopNavbar && (
          <Dropdown
            classNameButton="p-2 bg-stone-900 hover:bg-stone-900 text-white"
            classNameDropdown="w-min md:w-max p-2 bg-black/40 backdrop-blur-md shadow-md text-white"
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
