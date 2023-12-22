import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]";
import { UserCard } from "../components/UserCard";
import { Tab, TabPanel, Tabs, TabsList } from "@mui/base";
import { useState } from "react";
import { PanelPlaylists } from "../components/panel/Playlists";
import { PanelInicio } from "../components/panel/Inicio";
import { BannerHistorial } from "../components/BannerHistorial";

interface ITab {
  display: React.ReactNode;
  title: React.ReactNode;
}

const tabs: ITab[] = [
  {
    display: <PanelInicio></PanelInicio>,
    title: "Inicio",
  },
  {
    display: <PanelPlaylists></PanelPlaylists>,
    title: "Playlists generadas",
  },
  {
    display: <BannerHistorial></BannerHistorial>,
    title: "Banners generados",
  },
];

export default function Panel() {
  const router = useRouter();
  const [selectedMenu, setSelectedMenu] = useState(0);
  const session = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push("/");
    },
  });

  return (
    <div className={`w-full flex-1`}>
      <Head>
        <title>Panel de usuario</title>
      </Head>
      <Tabs
        defaultValue={0}
        value={selectedMenu}
        className="flex md:flex-row flex-col h-full"
        onChange={(e, i) => setSelectedMenu(i as number)}
      >
        <TabsList className="flex flex-col md:flex-row bg-stone-100  md:w-40 w-full h-fit md:h-full">
          <div className="flex flex-row md:flex-col w-full bg-stone-100  overflow-auto items-stretch">
            <div className="grid place-items-center">
              <h3 className="text-center px-4 md:py-4 font-extrabold">Panel</h3>
            </div>
            {tabs.map((t, i) => {
              return (
                <Tab
                  key={i}
                  value={i}
                  className={`p-2 transition-all w-fit bg-stone-100 px-2 md:pt-2  border-black hover:bg-stone-50 md:w-full ${
                    selectedMenu == i
                      ? "md:border-l-8 border-t-8 md:border-t-0 bg-white"
                      : ""
                  }`}
                >
                  {t.title}
                </Tab>
              );
            })}
          </div>
        </TabsList>
        {tabs.map((t, i) => {
          return (
            <TabPanel
              className="bg-white py-2 px-4 flex-1 shadow-lg"
              key={i}
              value={i}
            >
              <h1 className="block py-4">{t.title}</h1>
              {t.display}
            </TabPanel>
          );
        })}
      </Tabs>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(
    req,
    res,
    authOptions(req, res)
  );

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
