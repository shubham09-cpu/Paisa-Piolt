/** Circular 0-100 score with the number in the middle. */
export default function HealthRing({ score, tone }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  return (
    <svg width="92" height="92" viewBox="0 0 92 92" role="img" aria-label={`Health score ${score} out of 100`}>
      <circle cx="46" cy="46" r={radius} className="ring__track" />
      <circle
        cx="46"
        cy="46"
        r={radius}
        className={`ring__value ring__value--${tone}`}
        strokeDasharray={`${(circumference * score) / 100} ${circumference}`}
        transform="rotate(-90 46 46)"
      />
      <text x="46" y="53" textAnchor="middle" className="ring__text">{score}</text>
    </svg>
  );
}
