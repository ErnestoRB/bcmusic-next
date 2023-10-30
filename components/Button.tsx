import { ButtonProps, Button as Btn } from "react-aria-components";

export function Button({ className = "", ...props }: ButtonProps) {
  return <Btn {...props} className={`p-2 ${className}`}></Btn>;
}
