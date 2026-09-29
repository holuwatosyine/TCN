import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type LiquidButtonProps = {
  children: ReactNode;
  to: string;
  className?: string;
  ariaLabel?: string;
  reveal?: boolean;
};

export const LiquidButton = ({ children, to, className = "", ariaLabel, reveal = false }: LiquidButtonProps) => (
  <Link
    to={to}
    aria-label={ariaLabel}
    className={`kh-liquid-button ${className}`}
    data-cursor="lantern"
    data-home-reveal={reveal ? "" : undefined}
  >
    <span className="kh-liquid-button__label">{children}</span>
  </Link>
);

export default LiquidButton;
