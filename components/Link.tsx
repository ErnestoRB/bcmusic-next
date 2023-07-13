import NextLink from "next/link";
import React from "react";

type LinkProps = React.ComponentProps<typeof NextLink>;
export default function Link(props: LinkProps) {
  return <NextLink className="text-blue-600 underline" {...props}></NextLink>;
}
