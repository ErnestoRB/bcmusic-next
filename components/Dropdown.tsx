import { usePosition } from "@ernestorb/useposition";
import { ReactNode, useRef, useState } from "react";

type Position = { key: "top" | "bottom" | "left" | "right"; value: number };

export function Dropdown({
  children,
  className = "",
}: {
  className?: string;
  children: ReactNode;
}) {
  const divRef = useRef<HTMLDivElement>(null);

  const [menuPos, setMenuPos] = useState({});

  const [open, setOpen] = useState(false);

  usePosition(
    divRef,
    ({ top, left, bottom, right }, { screenHeight, screenWidth }) => {
      const positionFromBottom = screenHeight - bottom;
      const positionFromRight = screenWidth - right;

      const moreSpaceVertically = Math.max(top, positionFromBottom);

      const moreSpaceHorizontally = Math.max(positionFromRight, left);

      let position: [Position, Position] = [
        { key: "top", value: 0 },
        { key: "right", value: 0 },
      ];
      switch (moreSpaceHorizontally) {
        case left:
          position[0] = { key: "right", value: positionFromRight };
          break;
        case positionFromRight:
          position[0] = { key: "left", value: left };
          break;
      }
      switch (moreSpaceVertically) {
        case top:
          position[1] = { key: "bottom", value: positionFromBottom };
          break;
        case positionFromBottom:
          position[1] = { key: "top", value: bottom };
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
      className={`bg-white hover:bg-stone-200 text-black ${className}`}
      onClick={() => setOpen((opened) => !opened)}
    >
      Menú
      <div
        className="flex flex-col p-5 w-max fixed right-0 z-10 bg-white"
        style={{ display: open ? "" : "none", ...menuPos }}
      >
        {children}
      </div>
    </div>
  );
}
