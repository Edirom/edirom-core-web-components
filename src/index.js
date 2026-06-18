// Import web component(s)
import EdiromDom from './edirom-dom.js';
import EdiromIcon from './edirom-icon.js';
import EdiromWindows from './edirom-windows.js';

// Export them so they can be used
export { EdiromDom, EdiromIcon, EdiromWindows };

// Register custom elements globally
customElements.define('edirom-dom', EdiromDom);
customElements.define('edirom-icon', EdiromIcon);
customElements.define('edirom-windows', EdiromWindows);
