/** Loading placeholder that reserves the same space as a screen, so lazy loading causes no layout shift. */
export default function Skeleton() {
  return (
    <div className="skeleton" role="status" aria-busy="true" aria-label="Loading screen">
      <span className="skeleton__line skeleton__line--title" />
      <span className="skeleton__block" />
      <span className="skeleton__block" />
    </div>
  );
}
