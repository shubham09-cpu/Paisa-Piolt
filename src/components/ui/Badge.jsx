import PropTypes from 'prop-types';
import { toneType } from '../../types.js';

/** Small pill label. */
export default function Badge({ tone = 'neutral', children }) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

Badge.propTypes = { tone: toneType, children: PropTypes.node.isRequired };
