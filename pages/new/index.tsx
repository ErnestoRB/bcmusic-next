import Head from "next/head";
import { backgroundGradient } from "../../utils/styles";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Alert from "../../components/Alert";
import { useSession } from "next-auth/react";
import BannerForm from "../../components/BannerForm";

export default function CreateBannerCode() {
  const { push } = useRouter();
  const session = useSession({
    required: true,
    onUnauthenticated: () => {
      push("/");
    },
  });

  return (
    <div
      className={`flex flex-col items-center justify-center w-full ${backgroundGradient}`}
    >
      <Head>
        <title>Programar nuevo banner</title>
      </Head>
      <div className="bg-white p-2 md:p-4 shadow-lg rounded max-w-7xl w-full">
        <>
          <h1 className="text-3xl font-semibold mb-4">
            Programar nuevo banner
          </h1>
          <hr />
          <BannerForm></BannerForm>
        </>
      </div>
    </div>
  );
}
