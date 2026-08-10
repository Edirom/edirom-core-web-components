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
 *  edirom-note.js
 *
 *  Web Component: <edirom-note>
 * 
 *  - Adding a note in any HTML document, e.g. for annotations or comments.
 *  - Usage:
 *     Inline usage: <edirom-note><p>A comment</p></edirom-note>
 *     Inline usage (with icon): <edirom-note icon="URL"><p>A comment</p></edirom-note>
 *     Block usage (with note text): <edirom-note text="Comment" mode="block"><p>A comment</p></edirom-note>
 *   - Attributes:
 *    - mode: "tooltip" (default) or "block"
 *    - text: "note" (default) or any other text to be displayed as the note anchor - set to empty string if attribute icon is used and no text attribute is set
 *    - icon: URL or ref to an icon image (optional)
 *    - trigger: "hover" (default), "click" or "double-click" - determines how the note is triggered
 *    - width: width of the note (default for mode block is size of parent element, default for tooltip: 200px)
 *    - height: height of the note (default for mode block is size of parent element, default for tooltip: 150px)
 */

class EdiromNote extends HTMLElement {

    static get observedAttributes() {
        return ['mode', 'text', 'icon', 'trigger', 'width', 'height'];
    }

    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: 'open' });
        this._root = document.createElement('span');
        this._rootPart = null;
    }

    connectedCallback() {
        this._render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) this._render();
    }

    // property <-> attribute helpers
    get mode() { return this.getAttribute('mode') || 'tooltip'; }
    set mode(v) { this.setAttribute('mode', v); }

    get text() { return this.getAttribute('text') || 'note'; }
    set text(v) { this.setAttribute('text', v); }

    get icon() { return this.getAttribute('icon') || ''; }
    set icon(v) { this.setAttribute('icon', v); }

    get trigger() { return this.getAttribute('trigger') || 'hover'; }
    set trigger(v) { this.setAttribute('trigger', v); }

    get width() { return this.getAttribute('width') || (this.mode === 'block' ? this.parentElement.offsetWidth + 'px' : '200px'); }
    set width(v) { this.setAttribute('width', v); }

    get height() { return this.getAttribute('height') || (this.mode === 'block' ? this.parentElement.offsetHeight + 'px' : '150px'); }
    set height(v) { this.setAttribute('height', v); }


    _render() {

        const mode = this.mode;
        const text = this.text;
        const icon = this.icon;
        const trigger = this.trigger;
        const width = this.width;
        const height = this.height;

        // Clear shadow root
        while (this._shadow.firstChild) {
            this._shadow.removeChild(this._shadow.firstChild);
        }

        // Create the note anchor
        const noteAnchor = document.createElement('span');
        if (icon) {
            const img = document.createElement('img');
            img.src = icon;
            img.alt = text;
            noteAnchor.appendChild(img);
        } else {
            noteAnchor.textContent = text;
        }
        this._shadow.appendChild(noteAnchor);

        // Create the note content
        const noteContent = document.createElement('div');
        noteContent.style.display = 'none';
        noteContent.style.position = 'absolute';
        noteContent.style.width = width;
        noteContent.style.height = height;
        noteContent.style.border = '1px solid #ccc';
        noteContent.style.padding = '10px';
        noteContent.style.backgroundColor = '#fff';
        noteContent.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        noteContent.innerHTML = this.innerHTML;
        this._shadow.appendChild(noteContent);

        // Event listeners based on trigger
        if (trigger === 'hover') {
            noteAnchor.addEventListener('mouseenter', () => {
                noteContent.style.display = 'block';
            });
            noteAnchor.addEventListener('mouseleave', () => {
                noteContent.style.display = 'none';
            });
        } else if (trigger === 'click') {
            noteAnchor.addEventListener('click', () => {
                noteContent.style.display = noteContent.style.display === 'block' ? 'none' : 'block';
            });
        } else if (trigger === 'double-click') {
            noteAnchor.addEventListener('dblclick', () => {
                noteContent.style.display = noteContent.style.display === 'block' ? 'none' : 'block';
            });
        }

        // Append styles
        const style = document.createElement('style');
        style.textContent = `
            :host {
                position: relative;
                display: inline-block;
            }
            span {
                cursor: pointer;
            }
            div {
                z-index: 1000;
            }
        `;
        this._shadow.appendChild(style);
    }

}


// Define the custom element if not already defined
if (!customElements.get('edirom-note')) {
    customElements.define('edirom-note', EdiromNote);
}