import React from "react";
import { LinkProps, Link as L } from "react-aria-components";

export default function Link(props: LinkProps) {
  return <L className="text-blue-600 underline" {...props}></L>;
}
