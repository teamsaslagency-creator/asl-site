/** Vector arrows stay monochrome on Safari instead of becoming emoji glyphs. */
export default function ArrowIcon({ down = false }: { down?: boolean }) {
  return <svg className="asl-arrow-icon" width="1em" height="1em" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <g transform={down ? 'rotate(90 12 12)' : undefined} stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 19 19 5M5 5h14v14" />
    </g>
  </svg>;
}
