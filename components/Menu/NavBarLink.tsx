import Link from "../Link";

export default function NavBarLink(
  props: React.ComponentProps<typeof Link> & { visible?: "true" | "false" }
) {
  return (
    <>
      {(props.visible === undefined || props.visible === "true") && (
        <Link
          {...props}
          className="grid h-full px-2 py-1 border-b-0 lg:border-b-2 border-stone-200 shadow-md bg-stone-800 hover:bg-stone-900 text-white place-items-center"
        ></Link>
      )}
    </>
  );
}
