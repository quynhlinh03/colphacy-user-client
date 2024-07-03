import React, { ReactNode } from "react";

interface WrapperProps {
  children: ReactNode;
  className?: string;
}

function Wrapper({ children, className }: WrapperProps) {
  return <div className={`popper ${className}`}>{children}</div>;
}

export default Wrapper;
