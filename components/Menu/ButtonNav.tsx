import { useRef, useState } from "react";
import { Button } from "../Button";
import { Popover } from "./Popover";
import { DialogTrigger } from "react-aria-components";

interface ButtonNavProps {
  popoverClass?: string;
  buttonClass?: string;
  buttonContent: React.ReactNode;
  children: React.ReactNode;
}

export default function ButtonNav({
  popoverClass = "",
  buttonClass = "",
  buttonContent,
  children,
}: ButtonNavProps) {
  return (
    <DialogTrigger>
      <Button className={buttonClass}>{buttonContent}</Button>
      <Popover className={popoverClass}>{children}</Popover>
    </DialogTrigger>
  );
}
