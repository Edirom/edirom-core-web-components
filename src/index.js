// Import web component(s)
import EdiromDom from './edirom-dom.js';
import EdiromIcon from './edirom-icon.js';
import EdiromNote from './edirom-note.js';

// Export them so they can be used
export { EdiromDom, EdiromIcon, EdiromNote };

// Register custom elements globally
customElements.define('edirom-dom', EdiromDom);
customElements.define('edirom-icon', EdiromIcon);
customElements.define('edirom-note', EdiromNote);
