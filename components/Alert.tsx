import { ReactNode } from "react";
import { Card } from "./Card";

const colors = {
  error: "bg-red-500 border-red-600 text-white",
  "error-darker": "bg-red-600 border-red-800 text-white",
  success: "bg-green-300 border-green-400 text-black",
  warning: "bg-yellow-200 border-yellow-300 text-black",
  info: "bg-blue-200 border-blue-400 text-black",
};

export default function Alert({
  children,
  inline = true,
  type = "error",
}: {
  children: ReactNode;
  type?: keyof typeof colors;
  inline?: boolean;
}) {
  return (
    <Card
      className={`rounded-sm bg-blue-200 ${colors[type]} ${
        inline ? "inline-block" : "block"
      } border px-4 py-2`}
    >
      <p>{children}</p>
    </Card>
  );
}
