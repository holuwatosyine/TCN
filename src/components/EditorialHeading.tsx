import type { ElementType, HTMLAttributes, ReactNode } from "react";

type EditorialHeadingProps = Omit<HTMLAttributes<HTMLElement>, "className"> & {
  as?: ElementType;
  children: ReactNode;
  material?: "solid" | "outline" | "ghost" | "serif";
  className?: string;
};

const EditorialHeading = ({ as: Tag = "h2", children, material = "solid", className = "", ...rest }: EditorialHeadingProps) => (
  <Tag {...rest} className={"kh-editorial-heading kh-editorial-heading--" + material + " " + className}>{children}</Tag>
);

export default EditorialHeading;
