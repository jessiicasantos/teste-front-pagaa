import type { SVGProps } from 'react';

export function PixIcon({ strokeWidth = 1.5, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M9 1.5l6 6-6 6-6-6z" />
      <path d="M9 6l-2 2 2 2 2-2z" />
    </svg>
  );
}
