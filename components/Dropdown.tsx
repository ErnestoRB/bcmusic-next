import { usePosition } from "@ernestorb/useposition";
import { ReactNode, useRef, useState } from "react";

type Position = { key: "top" | "bottom" | "left" | "right"; value: number };
type MaxSize = { key: "maxWidth" | "maxHeight"; value: number };

export function Dropdown({
  children,
  classNameButton = "",
  classNameDropdown = "",
}: {
  classNameButton?: string;
  children: ReactNode;
  classNameDropdown?: string;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState({});
  const [open, setOpen] = useState(false);

  usePosition(
    divRef,
    (
      { top, left, bottom, right, width },
      { screenHeight, screenWidth, visible }
    ) => {
      const positionFromBottom = screenHeight - bottom;
      const positionFromRight = screenWidth - right;

      const moreSpaceVertically = Math.max(top, positionFromBottom);

      const moreSpaceHorizontally = Math.max(positionFromRight, left);

      let position: [Position, Position, MaxSize, MaxSize] = [
        { key: "top", value: 0 },
        { key: "right", value: 0 },
        { key: "maxWidth", value: 0 },
        { key: "maxHeight", value: 0 },
      ];
      switch (moreSpaceHorizontally) {
        case left:
          position[0] = { key: "right", value: positionFromRight };
          position[2] = { key: "maxWidth", value: left + width };

          break;
        case positionFromRight:
          position[0] = { key: "left", value: left };
          position[2] = { key: "maxWidth", value: screenWidth - left };
          break;
      }
      switch (moreSpaceVertically) {
        case top:
          position[1] = { key: "bottom", value: positionFromBottom };
          position[3] = {
            key: "maxHeight",
            value: screenHeight - positionFromBottom,
          };
          break;
        case positionFromBottom:
          position[1] = { key: "top", value: bottom };
          position[3] = { key: "maxHeight", value: screenHeight - top };
          break;
      }

      const obj: { [key: string]: string | number } = {};

      position.forEach((item) => {
        obj[item.key] = item.value;
      });
      setMenuPos(obj);
    },
    { callOnResize: true } // pretty expensive
  );

  return (
    <div
      ref={divRef}
      className={`bg-white hover:bg-stone-200 text-black ${classNameButton}`}
      onClick={() => setOpen((opened) => !opened)}
    >
      Menú
      <div
        ref={dropdownRef}
        data-testid="menu-wrapper"
        className={`flex flex-col fixed right-0 z-10 bg-white ${classNameDropdown}`}
        style={{ display: open ? "flex" : "none", ...menuPos }}
      >
        {children}
      </div>
    </div>
  );
}
