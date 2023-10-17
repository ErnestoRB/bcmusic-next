import Head from "next/head";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  BannerRecord,
  BannerRecordModel,
  Fonts,
} from "../../../utils/database/models";
import { GetServerSideProps } from "next";
import BannerForm from "../../../components/BannerForm";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import Alert from "../../../components/Alert";
import { userHavePermission } from "../../../utils/authorization/validation/user/server";
import { VIEW_BANNER_EDIT } from "../../../utils/authorization/permissions";

export default function BannerPage({
  banner,
}: {
  banner?: BannerRecordModel["dataValues"];
}) {
  useSession({ required: true });

  return (
    <div className="w-full flex flex-col md:flex-row justify-center gap-8 items-center">
      <Head>
        <title>{banner ? "Administrar banner" : "Banner no encontrado"}</title>
      </Head>

      <div className="max-w-md p-2 md:p-4 rounded-sm bg-white flex flex-col gap-y-2 shadow-lg">
        {banner && (
          <>
            <h1>Editar banner</h1>
            <hr />
            <Link
              href={`/code/${banner.id}`}
              className="bg-bc-purple-2 hover:bg-bc-purple-3 text-white p-2 inline-block"
            >
              Ver código
            </Link>
            <BannerForm banner={banner}></BannerForm>
          </>
        )}
        {!banner && <Alert>Banner no encontrado</Alert>}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
  res,
}) => {
  if (!query.id) {
    return { props: { banner: null } };
  }

  const session = await unstable_getServerSession(
    req,
    res,
    authOptions(req, res)
  );

  if (!userHavePermission(session, VIEW_BANNER_EDIT)) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  let id: string | null = null;
  if (Array.isArray(query.id)) {
    id = query.id[0];
  } else {
    id = query.id;
  }

  const banner: BannerRecordModel | null = await BannerRecord.findByPk(id, {
    include: {
      model: Fonts,
      through: {
        attributes: [],
      },
    },
  });

  return {
    props: { banner: banner ? JSON.parse(JSON.stringify(banner)) : null },
  };
};
