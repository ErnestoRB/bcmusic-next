import { Modal } from "@mui/base";
import { Card } from "./Card";
import { SetStateAction } from "react";
import { Button } from "./Button";
import Image from "next/image";
import closeIcon from "../images/close.svg";

interface IModalProps {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  persistent?: boolean;
}

export function AppModal({
  open,
  children,
  title,
  actions,
  setOpen,
  persistent = false,
}: IModalProps) {
  return (
    <Modal
      className="fixed z-100 inset-0 grid place-items-center bg-stone-600 bg-opacity-50"
      onClick={(e) => {
        if (e.target !== e.currentTarget) return;
        if (!persistent) {
          setOpen(false);
        }
      }}
      open={open}
    >
      <Card
        title={title}
        className="relative bg-white max-w-sm"
        actions={actions}
      >
        <Button
          className="right-2 top-2 absolute"
          onPress={() => setOpen(false)}
        >
          <Image
            alt="close this modal"
            src={closeIcon}
            width={24}
            height={24}
          ></Image>
        </Button>
        {children}
      </Card>
    </Modal>
  );
}
