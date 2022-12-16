import { ReactNode } from "react";

const colors = {
  error: "bg-red-600",
  success: "bg-green-300",
};

export default function Alert({
  children,
  type = "error",
}: {
  children: ReactNode;
  type?: "error" | "success";
}) {
  return (
    <span className={`rounded-sm ${colors[type]} text-white px-4 py-2`}>
      {children}
    </span>
  );
}
