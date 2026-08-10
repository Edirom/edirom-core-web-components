/**
 *  Edirom Online Core Web Components
 *  Copyright (C) 2026 The Edirom Project
 *  http://www.edirom.de
 *
 *  Edirom Online is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  Edirom Online is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with Edirom Online. If not, see <http://www.gnu.org/licenses/>.
 * 
 * -----------------------------------------------------------------------
 * 
 *  About
 *  edirom-dom.js
 *
 *  Web Component: <edirom-dom>
 * 
 *  - A simple wrapper for a shadow DOM, allowing to set the shadow root mode and delegatesFocus option via attributes.
 *  - Usage:
 *     <edirom-dom mode="open" delegates-focus>
 *         <p>Content inside the shadow DOM</p>
 *     </edirom-dom>
 *   - Attributes:
 *    - mode: "open" (default) or "closed"
 *    - delegates-focus: boolean attribute, if present, enables delegatesFocus
 *    - slot-assignment: "named" or "manual" (optional), sets the slot assignment mode
 */

class EdiromDom extends HTMLElement {

    static get observedAttributes() {
        return ['mode', 'delegates-focus', 'slot-assignment'];
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.#initializeShadow();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.#rebuildShadow();
        }
    }

    #getShadowOptions() {
        const mode = this.getAttribute('mode') === 'closed' ? 'closed' : 'open';
        const delegatesFocus = this.hasAttribute('delegates-focus');
        const slotAssignment = this.getAttribute('slot-assignment');

        const options = { mode };

        if (delegatesFocus) {
            options.delegatesFocus = true;
        }

        if (slotAssignment === 'named' || slotAssignment === 'manual') {
            options.slotAssignment = slotAssignment;
        }

        return options;
    }

    #initializeShadow() {
        if (this.shadowRoot) return;

        const options = this.#getShadowOptions();
        const shadow = this.attachShadow(options);

        this.#render(shadow);
    }

    #rebuildShadow() {
        // If mode is closed we can't access shadowRoot,
        // so we only rebuild when shadowRoot is available.
        if (!this.shadowRoot) return;

        const options = this.#getShadowOptions();

        // Remove old shadow content
        this.shadowRoot.innerHTML = '';

        // Note: mode cannot be changed after creation.
        // We only re-render content here.
        this.#render(this.shadowRoot);
    }

    #render(shadow) {
        const slot = document.createElement('slot');
        shadow.appendChild(slot);
    }
}

customElements.define('edirom-dom', EdiromDom);
