import { ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function Eyebrow({ children }) {
  return (
    <span className="eyebrow">
      <ChevronsLeft size={14} aria-hidden="true" />
      {children}
      <ChevronsRight size={14} aria-hidden="true" />
    </span>
  );
}
