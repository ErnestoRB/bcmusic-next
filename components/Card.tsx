import React from "react";

interface ICardProps {
  title?: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const Card = React.forwardRef<HTMLDivElement, ICardProps>(function Card(
  { title, children, className = "", actions },
  ref
) {
  return (
    <div
      ref={ref}
      className={`block p-6 border border-gray-200 rounded-lg shadow  ${className}`}
    >
      {title && typeof title === "string" && (
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
          {title}
        </h5>
      )}
      {title && typeof title !== "string" && title}
      {children && typeof children !== "string" && children}
      {children && typeof children === "string" && (
        <p className="font-normal text-gray-700 dark:text-gray-400">
          {children}
        </p>
      )}
      {actions && <div className="pt-4 flex justify-end">{actions}</div>}
    </div>
  );
});
