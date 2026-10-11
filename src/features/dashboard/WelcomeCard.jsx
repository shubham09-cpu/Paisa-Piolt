import { memo, useState } from 'react';
import Card from '../../components/ui/Card.jsx';
import { STORAGE_KEYS } from '../../data/constants.js';
import { storage } from '../../services/storage.js';

/** One-time "how to play" card. Dismissal is remembered. */
function WelcomeCard() {
  const [open, setOpen] = useState(() => !storage.read(STORAGE_KEYS.welcome, false));
  if (!open) return null;

  const dismiss = () => {
    storage.write(STORAGE_KEYS.welcome, true);
    setOpen(false);
  };

  return (
    <Card tone="good" title="Welcome aboard ✈️" subtitle="You have ₹10,000 for 30 days. Here's how to play:">
      <ol className="steps">
        <li>
          <strong>Log</strong> what you spend and watch the forecast react.
        </li>
        <li>
          <strong>Simulate</strong> big decisions before you commit to them.
        </li>
        <li>
          <strong>Skip ahead</strong> to see bills land and surprises hit.
        </li>
      </ol>
      <button type="button" className="btn" onClick={dismiss}>
        Got it
      </button>
    </Card>
  );
}

export default memo(WelcomeCard);
