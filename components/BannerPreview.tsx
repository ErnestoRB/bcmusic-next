import { useSession } from "next-auth/react";
import { BannerRecordWithAuthors } from "../types/definitions";
import Alert from "./Alert";
import Link from "./Link";
import { Button } from "./Button";
import { toast } from "react-toastify";
import {
  isAdminSession,
  isCollaboratorSession,
} from "../utils/authorization/validation/permissions/browser";

export default function BannerPreview({
  bannerData,
}: {
  bannerData: BannerRecordWithAuthors;
}) {
  const session = useSession();

  return (
    <div className="border border-stone-400 dark:border-gray-600 w-64  bg-white dark:bg-gray-950 rounded shadow-lg">
      {session.data &&
        (isCollaboratorSession(session.data) ||
          isAdminSession(session.data)) && (
          <div className="flex gap-y-1 flex-wrap  p-2">
            <h4 className="w-full">Acciones</h4>
            <Link
              href={`/code/${bannerData.id}`}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Button>Ver</Button>
            </Link>
            <Link
              href={`/admin/banner/${bannerData.id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Button>Editar</Button>
            </Link>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onPressEnd={() => {
                fetch(`/api/banner/${bannerData.id}`, { method: "DELETE" })
                  .then(() => toast("Banner eliminado", { type: "success" }))
                  .catch(() =>
                    toast("Banner no pudo ser eliminado", { type: "error" })
                  );
              }}
            >
              Borrar
            </Button>
          </div>
        )}
      <div className="flex flex-col gap-y-4 items-center justify-center w-full h-64 bg-black dark:bg-black dark:border-y dark:border-gray-600">
        {(bannerData.exampleUrl && (
          <picture className="w-full h-full">
            <img
              src={bannerData.exampleUrl}
              className="object-contain w-full h-full bg-black"
              alt={`Banner de ejemplo para: ${bannerData.name}`}
            />
          </picture>
        )) || <Alert type="error-darker">No hay vista previa</Alert>}
      </div>
      <div className="p-2">
        <h3 className="text-xl font-extrabold decoration-red-600">
          {bannerData.name}
        </h3>
        {bannerData.authors && bannerData.authors.length >= 1 && (
          <>
            <p>Autores:</p>
            <ul className="list-disc list-inside">
              {bannerData.authors?.map((author) => (
                <li key={author}>{`${author}`}</li>
              ))}
            </ul>
          </>
        )}

        {bannerData.description && (
          <p>{`Descripción: ${bannerData.description}`}</p>
        )}
      </div>
    </div>
  );
}
