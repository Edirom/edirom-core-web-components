// Import web component(s)
import EdiromDom from './edirom-dom.js';
import EdiromIcon from './edirom-icon.js';

// Export them so they can be used
export { EdiromDom, EdiromIcon };

// Register custom elements globally
customElements.define('edirom-dom', EdiromDom);
customElements.define('edirom-icon', EdiromIcon);
