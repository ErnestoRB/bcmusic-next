import { useSession } from "next-auth/react";
import { Button } from "./Button";
import Link from "./Link";
import { useRouter } from "next/navigation";

export function AdminActions() {
  const router = useRouter();
  const session = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push("/");
    },
  });

  return (
    <div className="flex flex-col md:flex-row md:gap-x-2 gap-y-1 flex-wrap">
      <Link href="/new" className="bg-blue-600 hover:bg-blue-700 text-white ">
        <Button>Crear nuevo banner</Button>
      </Link>
      <Link href="/font" className="bg-blue-600 hover:bg-blue-700 text-white">
        <Button>Subir nueva fuente</Button>
      </Link>
      <Link href="/fonts" className="bg-blue-600 hover:bg-blue-700 text-white">
        <Button>Ver fuentes existentes</Button>
      </Link>
    </div>
  );
}
