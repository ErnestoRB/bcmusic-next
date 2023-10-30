import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MenuButton } from "./Menu/MenuButton";
import MenuItem from "./Menu/MenuItem";

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
      <MenuButton label="Acciones" buttonClass="bg-red-500 p-2 text-white">
        <MenuItem href="/new">Crear nuevo banner</MenuItem>
        <MenuItem href="/font">Subir nueva fuente</MenuItem>
        <MenuItem href="/fonts">Ver fuentes </MenuItem>
      </MenuButton>
    </div>
  );
}
