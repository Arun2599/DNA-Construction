import { Fragment, type ReactNode } from 'react'

/** Renders one line of admin text: *word* shows in the accent color. */
export function fmtAccent(line: string): ReactNode[] {
  return line
    .split(/\*([^*]*)\*/)
    .map((part, j) =>
      j % 2 === 1 ? (
        <span key={j} className="text-primary">
          {part}
        </span>
      ) : (
        <Fragment key={j}>{part}</Fragment>
      ),
    )
}

/** Renders admin text: *word* → accent color, new line → line break. */
export default function Fmt({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {fmtAccent(line)}
          {i < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </>
  )
}
