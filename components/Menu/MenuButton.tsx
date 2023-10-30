import {
  MenuTrigger,
  type MenuProps,
  type MenuTriggerProps,
  Button,
  Popover,
  Menu,
} from "react-aria-components";

interface MyMenuButtonProps<T>
  extends MenuProps<T>,
    Omit<MenuTriggerProps, "children"> {
  buttonClass?: string;
  label?: string;
}

export function MenuButton<T extends object>({
  label,
  children,
  buttonClass = "",
  ...props
}: MyMenuButtonProps<T>) {
  return (
    <MenuTrigger {...props}>
      <Button className={buttonClass}>{label}</Button>
      <Popover>
        <Menu {...props}>{children}</Menu>
      </Popover>
    </MenuTrigger>
  );
}
