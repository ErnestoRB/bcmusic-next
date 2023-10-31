import {
  Dialog,
  OverlayArrow,
  Popover as AriaPopover,
  type PopoverProps,
} from "react-aria-components";

interface MyPopoverProps extends Omit<PopoverProps, "children"> {
  children: React.ReactNode;
}

export function Popover({ children, ...props }: MyPopoverProps) {
  return (
    <AriaPopover {...props}>
      <OverlayArrow>
        <svg width={12} height={12} viewBox="0 0 12 12">
          <path d="M0 0 L6 6 L12 0" />
        </svg>
      </OverlayArrow>
      <Dialog>{children}</Dialog>
    </AriaPopover>
  );
}
