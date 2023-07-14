import { Button } from "./Button";
import Link from "./Link";

export function AdminActions() {
  return (
    <div className="flex flex-col md:flex-row md:gap-x-2 flex-wrap">
      <Link href="/new" className="bg-blue-600 hover:bg-blue-700 text-white ">
        <Button>Crear nuevo banner</Button>
      </Link>
      <Link
        href="/uploadFont"
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Button> Subir nueva fuente</Button>
      </Link>
    </div>
  );
}
