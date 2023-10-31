import { Item, ItemProps } from "react-aria-components";

export default function MenuItem({ className, ...props }: ItemProps) {
  return (
    <Item
      {...props}
      className={
        className
          ? className
          : "grid h-full px-2 py-1 shadow-md bg-stone-800 hover:bg-stone-900 text-white place-items-center"
      }
    ></Item>
  );
}
