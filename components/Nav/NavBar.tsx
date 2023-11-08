import { signOut, useSession } from "next-auth/react";
import React, { useMemo } from "react";
import { useMediaQuery } from "../../utils/hooks/useMediaQuery";
import { Button } from "../Button";
import NavItem from "../Menu/MenuItem";
import UserInfo from "./UserInfo";
import Link from "../Link";
import ButtonNav from "../Menu/ButtonNav";

interface NavItem {
  type?: "authenticated" | "unauthenticated";
  items: {
    route?: string;
    onClick?: () => any;
    node: React.ReactNode;
    className?: string;
  }[];
}

export default function NavBar() {
  const session = useSession();

  const desktopNavbar = useMediaQuery("(min-width:1000px)");

  const menuItems = useMemo<NavItem[]>(
    () => [
      {
        items: [
          {
            route: "/banner",
            node: "Generar banner",
          },
          {
            route: "/banners",
            node: "Ver banners",
          },
          {
            route: "/about",
            node: "Acerca",
          },
        ],
      },
      {
        type: "unauthenticated",
        items: [
          {
            route: "/auth/login",
            node: "Iniciar sesión",
          },
          {
            route: "/auth/signup",
            node: "Registrarse",
          },
          {
            route: "/politicas",
            node: "Políticas",
          },
          {
            route: "/generate-routes",
            node: "Generar rutas",
          },
        ],
      },
      {
        type: "authenticated",
        items: [
          {
            route: "/panel",
            node: <UserInfo></UserInfo>,
          },
          {
            route: "/new",
            node: "Crear banner",
          },
          {
            node: "Cerrar sesion",
            onClick: () => signOut(),
            className:
              "bg-red-600 text-white font-semibold grid place-items-center px-2 py-1",
          },
        ],
      },
    ],
    [session]
  );

  return (
    <nav
      className=" bg-gradient-to-br from-black/80 to-black/70 flex flex-col sm:flex-row flex-wrap w-full h-24 
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
            .map(({ route, node, onClick, className }, index) => {
              if (route) {
                return (
                  <Link
                    className="grid h-full px-2 py-1 border-b-0 lg:border-b-2 border-stone-200 shadow-md bg-stone-800 hover:bg-stone-900 text-white place-items-center"
                    key={index}
                    href={route}
                  >
                    {node}
                  </Link>
                );
              }
              return (
                <Button
                  onPress={onClick}
                  className={
                    className
                      ? className
                      : "grid h-full px-2 py-1 border-b-0 lg:border-b-2 border-stone-200 shadow-md bg-stone-800 hover:bg-stone-900 text-white place-items-center"
                  }
                  key={index}
                >
                  {node}
                </Button>
              );
            })}
        {!desktopNavbar && (
          <ButtonNav
            buttonContent="Menu"
            popoverClass="flex flex-col"
            buttonClass="p-2 bg-stone-900 hover:bg-stone-900 text-white border-white border"
          >
            {menuItems
              .filter((item) => !item.type || item.type === session.status)
              .flatMap((item) => item.items)
              .map(({ route, node, onClick, className }, index) => {
                if (route) {
                  return (
                    <Link
                      className="grid h-full px-2 py-1 border-l-4 border-stone-200 shadow-md bg-stone-800 hover:bg-stone-900 text-white place-items-center"
                      key={index}
                      href={route}
                    >
                      {node}
                    </Link>
                  );
                }
                return (
                  <Button
                    onPress={onClick}
                    className={`w-full ${className ?? ""}`}
                    key={index}
                  >
                    {node}
                  </Button>
                );
              })}
          </ButtonNav>
        )}
      </div>
    </nav>
  );
}
