import { BannerRecordWithAuthors } from "../types/definitions";
import Alert from "./Alert";

export default function BannerPreview({
  bannerData,
}: {
  bannerData: BannerRecordWithAuthors;
}) {
  return (
    <div className="border border-stone-400 w-64  bg-white rounded shadow-lg">
      <div className="flex flex-col gap-y-4 items-center justify-center w-full h-64 bg-black">
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
        <h3 className="text-xl font-bold decoration-red-600 decoration-4 underline">
          {bannerData.name}
        </h3>
        {bannerData.authors && bannerData.authors.length >= 1 && (
          <p>
            Autores:
            <ul className="list-disc list-inside">
              {bannerData.authors?.map((author) => (
                <li key={author}>{`${author}`}</li>
              ))}
            </ul>
          </p>
        )}

        {bannerData.description && (
          <p>{`Descripción: ${bannerData.description}`}</p>
        )}
      </div>
    </div>
  );
}
