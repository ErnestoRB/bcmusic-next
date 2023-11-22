// ComboboxDemo.tsx
import { Check, ChevronsUpDown } from "lucide-react";
import React, { useRef, useState, MutableRefObject, ChangeEvent } from "react";

import { cn } from "../../utils/lib/utils";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface IComboBoxProps {
  items?: any[];
  value: string;
  onChange: (v: any) => any;
  onSelect: (item: any) => any;
  handleInputChange: (value: string) => any;
  ref?: MutableRefObject<any>;
}

export const ComboboxDemo = React.forwardRef((props: IComboBoxProps, ref) => {
  const [open, setOpen] = React.useState(false);
  const [selectedLocation, setSelectedLocation] = React.useState(""); // Estado para la ubicación seleccionada

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedLocation || "Select your Location"} {/* Mostrar la ubicación seleccionada o el texto predeterminado */}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search Location..."
            value={props.value}
            onChangeCapture={(e: ChangeEvent<HTMLInputElement>) => props.onChange(e.target.value)}
          />
          <CommandEmpty>No Location found.</CommandEmpty>
          <CommandGroup>
            {props.items?.map((item) => (
              <CommandItem
                key={item.properties?.name}
                value={item.properties?.name}
                onSelect={() => {
                  props.onSelect(item);
                  setSelectedLocation(item.properties?.name || ""); // Actualizar el estado con la ubicación seleccionada
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedLocation === item.properties?.name ? "opacity-100" : "opacity-0"
                  )}
                />
                {item.properties?.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
});
