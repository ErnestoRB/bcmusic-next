import { useEffect, useRef, useState } from "react";
import Alert from "../../../components/Alert";
import Head from "next/head";
import bannerImage from "../images/banner.png";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  BannerRecord,
  BannerRecordType,
  Fonts,
} from "../../../utils/database/models";
import { GetServerSideProps } from "next";
import BannerForm from "../../../components/BannerForm";

export default function BannerPage({
  banner,
}: {
  banner: BannerRecordType["dataValues"];
}) {
  const session = useSession({ required: true });

  return (
    <div className="w-full bg-gradient-to-tr from-bc-purple-1 via-blue-300 to-stone-100 flex flex-col md:flex-row justify-center gap-8 items-center">
      <Head>
        <title>Administrar banner</title>
      </Head>

      <div className="max-w-md p-2 md:p-4 rounded-sm bg-white flex flex-col gap-y-2 shadow-lg">
        <h1 className="text-3xl font-semibold">Editar banner</h1>
        <hr />
        <Link
          href={`/code/${banner.id}`}
          className="bg-bc-purple-2 hover:bg-bc-purple-3 text-white p-2 inline-block"
        >
          Ver código
        </Link>
        {banner && (
          <>
            <BannerForm banner={banner}></BannerForm>
          </>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (!query.id) {
    return { props: { banner: null } };
  }
  let id: string | null = null;
  if (Array.isArray(query.id)) {
    id = query.id[0];
  } else {
    id = query.id;
  }

  const banner: BannerRecordType | null = await BannerRecord.findByPk(id, {
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
