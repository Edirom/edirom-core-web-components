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
*/
class EdiromNote extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    shadow.innerHTML = `
      <style>
        :host {
          display: inline-block;
          position: relative;
        }

        .trigger {
          width: 1.5rem;
          height: 1.5rem;
          padding: 0;
          border: 1px solid #777;
          border-radius: 50%;
          background: white;
          color: #333;
          font: inherit;
          cursor: help;
        }

        .box {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          z-index: 1000;

          box-sizing: border-box;
          width: max-content;
          max-width: min(20rem, 85vw);
          padding: 0.75rem 1rem;

          border: 1px solid #ccc;
          border-radius: 0.4rem;
          background: white;
          color: #222;
          box-shadow: 0 4px 12px rgb(0 0 0 / 15%);

          font-size: 0.9rem;
          line-height: 1.5;
          text-align: left;
          white-space: normal;
          overflow-wrap: anywhere;
        }

        :host(:hover) .box,
        :host(:focus-within) .box {
          display: block;
        }
      </style>

      <button
        class="trigger"
        type="button"
        aria-label="Show editorial note"
        aria-describedby="note-content"
      >i</button>

      <div class="box" id="note-content" role="tooltip">
        <slot></slot>
      </div>
    `;
  }
}


// Define the custom element if not already defined
if (!customElements.get('edirom-note')) {
    customElements.define('edirom-note', EdiromNote);
}