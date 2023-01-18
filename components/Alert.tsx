import { ReactNode } from "react";

const colors = {
  error: "bg-red-500 border-red-600 text-white",
  "error-darker": "bg-red-600 border-red-800 text-white",
  success: "bg-green-300 border-green-400 text-black",
  warning: "bg-yellow-200 border-yellow-300 text-black",
  info: "bg-blue-200 border-blue-400 text-black",
};

export default function Alert({
  children,
  type = "error",
}: {
  children: ReactNode;
  type?: keyof typeof colors;
}) {
  return (
    <span className={`rounded-sm ${colors[type]} border px-4 py-2`}>
      {children}
    </span>
  );
}
