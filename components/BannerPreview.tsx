import { BannerConfigAndFile } from "../utils/banners";
import Alert from "./Alert";

export default function BannerPreview({
  bannerConfig,
}: {
  bannerConfig: BannerConfigAndFile;
}) {
  return (
    <div className="border border-stone-400 w-64 bg-white rounded shadow-lg">
      <div className="flex flex-col gap-y-4 items-center justify-center w-full h-64 bg-black">
        {(bannerConfig.example && (
          <picture className="w-full h-full">
            <img
              src={bannerConfig.example}
              className="object-contain w-full h-full bg-black"
              alt={`Banner de ejemplo para: ${bannerConfig.name}`}
            />
          </picture>
        )) || <Alert>No hay vista previa</Alert>}
      </div>
      <div className="p-2">
        <h3 className="text-xl font-bold decoration-blue-600 decoration-4 underline">
          {bannerConfig.name}
        </h3>
        <p>{`Autor: ${bannerConfig.author}`}</p>
        {bannerConfig.description && (
          <p>{`Descripción: ${bannerConfig.description}`}</p>
        )}
      </div>
    </div>
  );
}
