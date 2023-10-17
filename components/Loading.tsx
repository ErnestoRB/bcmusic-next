interface LoadingProps {
  color?: string;
  backgroundColor?: string;
}

export function Loading({
  color = "border-red-600 ",
  backgroundColor = "border-stone-600",
}: LoadingProps) {
  return (
    <div className="relative w-16 h-16">
      <div
        className={`absolute w-full h-full ${backgroundColor}  border-4 bg-none rounded-full`}
      ></div>
      <div
        className={`animate-spin absolute top-0 left-0 w-full h-full ${color} border-t-4 bg-none rounded-full`}
      ></div>
    </div>
  );
}
