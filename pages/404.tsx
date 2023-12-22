import Image from "next/image";
import notFound from "../images/not-found.gif";

export default function NotFound() {
  return (
    <div className="grid place-items-center w-full">
      <div className="w-max flex flex-col items-center bg-white p-4 gap-2">
        <h1 className="font-bold">Ooops!</h1>
        <p>Página no encontrada, vuelve pronto!</p>
        <Image
          src={notFound}
          alt="Page wasn't found!"
          className="w-32 md:w-64 lg:w-72"
        ></Image>
      </div>
    </div>
  );
}
