import { useState } from 'react';
import { Link } from 'react-router';

export default function RequestForm() {
  const [goal, setGoal] = useState(
    'I want introductions to AI founders and operators building in Africa.'
  );

  return (
    <div className="stack">
      <label className="stack">
        <span>What kind of introduction do you need?</span>
        <textarea
          rows={5}
          value={goal}
          onChange={event => setGoal(event.target.value)}
        />
      </label>
      <div className="actions">
        <Link className="button primary" to="/requests/1/matches">
          Preview matches
        </Link>
        <span className="muted">This first scaffold uses mocked results.</span>
      </div>
    </div>
  );
}
