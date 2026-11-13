/**
 * From `sm` up, the checkbox and the link button sit in the page gutters, so the text
 * columns line up with the `px-4 sm:px-8 lg:px-16` content of the other sections.
 */
export const leadGutterCell = 'pl-4 pr-2 sm:w-8 sm:min-w-8 sm:px-0 lg:w-16 lg:min-w-16'
/** Wraps the checkbox inside `leadGutterCell`. */
export const leadGutterInner = 'flex sm:justify-end sm:pr-2.5'
/** First text column: starts exactly at the gutter line. */
export const firstTextCell = 'sm:pl-0'
/** Last text column: ends exactly at the gutter line. */
export const lastTextCell = 'sm:pr-0'
export const trailGutterCell = 'pr-4 sm:w-8 sm:min-w-8 sm:px-0 lg:w-16 lg:min-w-16'
/** Wraps the button inside `trailGutterCell`. */
export const trailGutterInner = 'flex justify-end sm:justify-start sm:pl-1.5'
