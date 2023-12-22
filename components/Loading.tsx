interface LoadingProps {
  color?: string;
  backgroundColor?: string;
  size?: keyof typeof SIZES;
}

const SIZES = {
  sm: {
    dim: "w-8 h-8",
    border: "border-4",
    borderInner: "border-t-4",
  },
  md: {
    dim: "w-16 h-16",
    border: "border-8",
    borderInner: "border-t-8",
  },
  lg: {
    dim: "w-24 h-24",
    border: "border-12",
    borderInner: "border-t-12",
  },
};

export function Loading({
  color = "border-red-600 ",
  backgroundColor = "border-black",
  size = "md",
}: LoadingProps) {
  return (
    <div className={`relative ${SIZES[size].dim}`}>
      <div
        className={`absolute w-full h-full ${backgroundColor} ${SIZES[size].border} bg-none rounded-full`}
      ></div>
      <div
        className={`animate-spin absolute top-0 left-0 w-full h-full ${color} ${SIZES[size].borderInner} bg-none rounded-full`}
      ></div>
    </div>
  );
}
