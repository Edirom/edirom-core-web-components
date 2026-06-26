// Import web component(s)
import EdiromDom from './edirom-dom.js';
import EdiromIcon from './edirom-icon.js';
import EdiromWindows from './edirom-window.js';

// Export them so they can be used.
// Each component module registers its own custom element on import,
// so no further customElements.define() calls are needed here.
export { EdiromDom, EdiromIcon, EdiromWindows };
