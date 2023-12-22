import { useAutocomplete } from "@mui/base";
import { useState } from "react";
import { Spinner } from "./Spinner";

interface IAutocompleteOption {
  label: string;
  region: string;
  id: string;
  country_a: string;
}

interface IAutoCompleteProps<T extends IAutocompleteOption> {
  label: string;
  items: T[];
  id: string;
  loading?: boolean;
  disabled?: boolean;
  onChange: Parameters<typeof useAutocomplete<T>>[0]["onChange"];
  onInputChange: Parameters<typeof useAutocomplete<T>>[0]["onInputChange"];
}

export default function UseAutocomplete<T extends IAutocompleteOption>({
  items,
  label,
  id,
  loading,
  disabled = false,
  onChange,
  onInputChange,
}: IAutoCompleteProps<T>) {
  const [inputValue, setInputValue] = useState<string>("");

  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    focused,
  } = useAutocomplete({
    id,
    disabled,
    options: items,
    getOptionLabel: (option) => option.label,
    onChange,
    onInputChange: (event, newInputValue, reason) => {
      setInputValue(newInputValue);
      if (onInputChange) {
        onInputChange(event, newInputValue, reason);
      }
    },
  });

  return (
    <div className="mb-4 z-10">
      <label
        {...getInputLabelProps()}
        className="block mb-2 text-white font-bold"
      >
        {label}
      </label>
      <div
        {...getRootProps()}
        className={`border border-gray-100 rounded p-2 flex items-center relative ${
          focused ? "focused" : ""
        }`}
      >
        <div className="relative flex items-center just">
          <input
            {...getInputProps()}
            value={inputValue}
            className="relative w-full border-none outline-none text-black max-w-full p-1.5"
          />
          {loading && (
            <Spinner
              size="xs"
              className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-2"
            />
          )}
        </div>
      </div>
      {groupedOptions.length > 0 && (
        <ul
          className="absolute bg-white opacity-95 list-none m-0 max-h-48 text-sm overflow-y-auto w-80"
          {...getListboxProps()}
        >
          {groupedOptions.map((option, index) => {
            if (
              "label" in option &&
              "region" in option &&
              "country_a" in option
            ) {
              return (
                <li
                  className="hover:bg-gray-300 cursor-pointer"
                  key={index}
                  {...getOptionProps({
                    option,
                    index,
                  })}
                >
                  <span className="block p-2 truncate">{`${option.label}, ${option.region}, ${option.country_a}`}</span>
                </li>
              );
            }
          })}
          {groupedOptions.length == 0 && (
            <li className="text-black  cursor-pointer">No hay resultados</li>
          )}
        </ul>
      )}
    </div>
  );
}
