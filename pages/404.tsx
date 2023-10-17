import Image from "next/image";
import notFound from "../images/not-found.gif";

export default function NotFound() {
  return (
    <div className="grid place-items-center w-full">
      <div className="w-max flex flex-col items-center gap-2">
        <h1>Página no implementada!</h1>
        <Image
          src={notFound}
          alt="Page wasn't found!"
          className="w-32 md:w-64 lg:w-72"
        ></Image>
      </div>
    </div>
  );
}
