import { signOut, useSession } from "next-auth/react";
import React, { useMemo } from "react";
import { useMediaQuery } from "../../utils/hooks/useMediaQuery";
import { Button } from "../Button";
import NavItem from "../Menu/MenuItem";
import UserInfo from "./UserInfo";
import Link from "../Link";
import ButtonNav from "../Menu/ButtonNav";
import Image from "next/image";
import logoutIcon from "../../images/logout.svg";
import barsIcon from "../../images/bars.svg";

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
        ],
      },
      {
        type: "authenticated",
        items: [
          {
            route: "/maps/route",
            node: "Crear playlist",
          },
          {
            route: "/new",
            node: "Crear banner",
          },
          {
            route: "/panel",
            node: <UserInfo></UserInfo>,
          },
          {
            node: (
              <Image
                src={logoutIcon}
                width={24}
                height={24}
                alt="logout from account"
              ></Image>
            ),
            onClick: () => signOut(),
            className: "bg-red-600 hover:bg-red-700 grid place-items-center",
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
            buttonContent={
              <Image
                src={barsIcon}
                alt="app navbar"
                width={12}
                height={12}
              ></Image>
            }
            popoverClass="flex flex-col"
            buttonClass="p-2 bg-stone-900 hover:bg-stone-900 text-white border-white border-b"
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
