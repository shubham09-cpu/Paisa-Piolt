/** Basic surface. `tone` adds a coloured accent edge for alerts. */
export default function Card({ title, subtitle, tone, className = '', children, aside }) {
  return (
    <section className={`card ${tone ? `card--${tone}` : ''} ${className}`}>
      {(title || aside) && (
        <header className="card__head">
          <div>
            {title && <h2 className="card__title">{title}</h2>}
            {subtitle && <p className="muted">{subtitle}</p>}
          </div>
          {aside}
        </header>
      )}
      {children}
    </section>
  );
}
