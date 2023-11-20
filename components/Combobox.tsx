import React, { useEffect, useRef, useState, MutableRefObject } from 'react';
import {
  Dialog,
  Input,
  Label,
  OverlayArrow,
  Popover,
  TextField,
} from 'react-aria-components';

interface IComboBoxProps {
  items?: any[];
  label: string;
  value: string;
  onChange: (v: any) => any;
  onSelect: (item: any) => any;
  ref?: MutableRefObject<any>;
}

export const MyComboBox = React.forwardRef((props: IComboBoxProps, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<any>(null);

  useEffect(() => {
    if (props.items && props.items.length > 0) {
      setIsOpen(true);
    }
  }, [props.items]);

  const handleOpenChange = (newIsOpen: boolean) => {
    setIsOpen(newIsOpen);
  };

  return (
    <div>
      <TextField ref={triggerRef}>
        <Label>{props.label}</Label>
        <Input defaultValue={props.value} onChange={props.onChange} />
      </TextField>
      <Popover
        className="bg-white flex flex-col"
        triggerRef={triggerRef}
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
      >
        <OverlayArrow>
          <svg width={12} height={12} viewBox="0 0 12 12">
            <path d="M0 0 L6 6 L12 0" />
          </svg>
        </OverlayArrow>
        <Dialog className="max-h-36 overflow-auto">
          {props.items?.map((i) => (
            <div
              key={i.properties?.name}
              onClick={() => {
                props.onSelect(i);
                setIsOpen(false);
              }}
              className="h-6"
            >
              {i.properties?.name}
            </div>
          ))}
        </Dialog>
      </Popover>
    </div>
  );
});
