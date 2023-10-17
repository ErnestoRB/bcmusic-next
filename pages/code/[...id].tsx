import Head from "next/head";
import Editor from "../../components/Editor";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { BannerRecord, Fonts } from "../../utils/database/models";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { BannerRecordWithFonts } from "../../types/definitions";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { userHavePermission } from "../../utils/authorization/validation/user/server";
import { VIEW_BANNER_CODE } from "../../utils/authorization/permissions";

export default function CodeEditor({
  banner = null,
}: {
  banner: BannerRecordWithFonts | null;
}) {
  const { query, push } = useRouter();
  const session = useSession({
    required: true,
    onUnauthenticated: () => {
      push("/");
    },
  });

  return (
    <div
      className={`flex flex-col items-center justify-center w-full  py-4 md:py-8`}
    >
      <Head>
        <title>Crear código de banner</title>
      </Head>
      <div className="bg-white p-2 md:p-4 shadow-lg rounded max-w-7xl w-full">
        {banner && (
          <div className="w-full flex flex-col gap-2">
            <div className="div flex  justify-end">
              <Link
                href={`/admin/banner/${banner.id}`}
                className="bg-purple-700 hover:bg-purple-800 text-white p-2 inline-block w-max"
              >
                Editar metadatos
              </Link>
            </div>
            <Editor id={banner.id}></Editor>
          </div>
        )}
        {!banner && (
          <h1 className="text-center">
            Banner {`"${query?.id?.[0]}"`} no encontrado!
          </h1>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
  res,
}) => {
  const session = await unstable_getServerSession(
    req,
    res,
    authOptions(req, res)
  );

  if (!userHavePermission(session, VIEW_BANNER_CODE)) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const idParam = params!.id;
  let id = "";
  if (Array.isArray(idParam)) {
    id = idParam[0];
  } else {
    id = idParam as string;
  }
  const bannerRecord = await BannerRecord.findByPk(id, {
    include: {
      model: Fonts,
      through: {
        attributes: [],
      },
    },
  });

  return {
    props: {
      banner: JSON.parse(JSON.stringify(bannerRecord || null)),
    },
  };
};
