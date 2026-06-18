/**
 * edirom-windows.js
 *
 * Web Component: <edirom-windows>
 * - Lightweight wrapper for managing multiple windows
 * - Usage:
 *     <edirom-windows></edirom-windows>
 */

// --- Path Resolution ---
// Resolve the directory where this JS file lives, relative to the module source
const winboxCssPath = new URL('../assets/css/winbox-0.2.82.min.css', import.meta.url).href;
const winboxJsPath = new URL('../assets/js/winbox-0.2.82.min.js', import.meta.url).href;


class EdiromWindows extends HTMLElement {
    constructor() {
        super();

        // Define the default properties
        this.windows = [];
        this.windowsDefaults = {
            border: "0.3em",
            background: "#ccc",
            index: 100000
        }
        this.winboxLoaded = false;
        this.pendingWindows = [];

        // Create shadow DOM
        this.attachShadow({ mode: 'open' });

        // :host must be a block-level fixed layer covering the viewport.
        // The inner _container div is the actual WinBox root; ShadowRoot itself
        // is not an HTMLElement and lacks offsetLeft/clientWidth that WinBox needs.
        const hostStyle = document.createElement('style');
        hostStyle.textContent = `:host {
            display: block;
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            pointer-events: none;
            z-index: 99999;
        }
        #winbox-container {
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            pointer-events: none;
        }
        .winbox {
            pointer-events: auto;
            /* Override WinBox's async-loaded CSS: position relative to
               #winbox-container (which covers the full viewport), so the
               window is visible immediately without waiting for the CDN link. */
            position: absolute !important;
        }`;
        this.shadowRoot.appendChild(hostStyle);

        // Real HTMLElement container — passed as WinBox `root` so dimension
        // queries (offsetLeft, clientWidth, etc.) resolve correctly.
        this._container = document.createElement('div');
        this._container.id = 'winbox-container';
        this.shadowRoot.appendChild(this._container);

        this._ensureWinboxAssets();
    }

    // Register the attributes to be observed
    static get observedAttributes() {
        return ['set', 'add', 'remove', 'update', 'arrange'];
    }

    // Attribute change
    attributeChangedCallback(property, oldValue, newValue) {
        // Custom event for the attribute change
        const event = new CustomEvent('communicate-windows-' + property, {
            detail: { [property]: newValue },
            bubbles: true
        });
        this.dispatchEvent(event);

        // Check the property
        switch (property) {
            case "set":
                // Remove all managed winbox windows from DOM
                this.windows.forEach((w) => {
                    var el = this.shadowRoot.getElementById(w.id);
                    if (el) el.remove();
                });
                this.windows = [];

                // Add the new windows
                if (newValue != "") {
                    this.add(JSON.parse(newValue));
                }
                break;
            case "add":
                if (newValue != "") {
                    this.add(JSON.parse(newValue));
                }
                break;
            case "remove":
                if (newValue != "") {
                    this.remove(newValue);
                }
                break;
            case "update":
                if (newValue != "") {
                    this.update(JSON.parse(newValue));
                }
                break;
            case "arrange":
                if (newValue != "") {
                    this.arrange(newValue);
                }
                break;
            default:
                break;
        }
    }

    // Add a window
    add(windows) {
        // Loop through the windows array
        for (var i = 0; i < windows.length; i++) {
            // Add the default properties
            for (var key in this.windowsDefaults) {
                if (!windows[i].hasOwnProperty(key)) {
                    windows[i][key] = this.windowsDefaults[key];
                }
            }

            // Add the window to the global windows property
            this.windows.push(windows[i]);

            // If WinBox isn't available yet, queue it for creation later
            if (!this.winboxLoaded || typeof WinBox === 'undefined') {
                this.pendingWindows.push(windows[i]);
                continue;
            }

            // Render window inside the shadow DOM container
            windows[i].root = this._container;
            new WinBox(windows[i]);
        }
    }

    _createPendingWindows() {
        if (!this.winboxLoaded || typeof WinBox === 'undefined') {
            return;
        }

        while (this.pendingWindows.length > 0) {
            const winConfig = this.pendingWindows.shift();
            winConfig.root = this._container;
            new WinBox(winConfig);
        }
    }

    _ensureWinboxAssets() {
        const ediromStyleId = "edirom-winbox-overrides";

        // Mirror all Edirom compiled stylesheets from the document into the shadow root
        // so that classes like .textViewContent are available inside the shadow DOM.
        document.querySelectorAll('link[rel="stylesheet"]').forEach((docLink) => {
            const href = docLink.getAttribute('href');
            if (href && !this.shadowRoot.querySelector(`link[href='${href}']`)) {
                const shadowLink = document.createElement('link');
                shadowLink.rel = 'stylesheet';
                shadowLink.href = href;
                this.shadowRoot.appendChild(shadowLink);
            }
        });

        // Load WinBox CSS from local source if not already present in the document
        if (document.querySelector('link[data-edirom-winbox-css]')) return;
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = winboxCssPath; 
        cssLink.setAttribute('data-edirom-winbox-css', '1');
        document.head.appendChild(cssLink);


        // Load WinBox JS from local source if not already present in the document
        if (!document.querySelector('script[data-edirom-winbox-js]')){
            
            const jsScript = document.createElement('script');
            jsScript.type = 'module';
            jsScript.src = winboxJsPath;
            jsScript.setAttribute('data-edirom-winbox-js', '1');
            jsScript.onload = () => {
                this.winboxLoaded = true;
                this._createPendingWindows();
            };
            jsScript.onerror = () => {
                console.error('Failed to load WinBox script:', winboxJsPath);
            };
            document.head.appendChild(jsScript);

        } else{

            const existingScript = document.querySelector(`script[data-edirom-winbox-js]`);
            if (typeof WinBox !== 'undefined') {
                this.winboxLoaded = true;
                this._createPendingWindows();
            } else if (existingScript) {
                existingScript.addEventListener('load', () => {
                    this.winboxLoaded = true;
                    this._createPendingWindows();
                });
            }

        }
        

        // WinBox CSS must live inside the shadow root so it can style shadow-DOM nodes
        if (!this.shadowRoot.querySelector(`link[data-edirom-winbox-css]`)) {
            const winboxCss = document.createElement('link');
            winboxCss.rel = 'stylesheet';
            winboxCss.href = winboxCssPath;
            winboxCss.setAttribute('data-edirom-winbox-css', '1');
            this.shadowRoot.appendChild(winboxCss);
        }

        // Inject Edirom-matching overrides for WinBox appearance into the shadow root
        if (!this.shadowRoot.getElementById(ediromStyleId)) {
            const style = document.createElement('style');
            style.id = ediromStyleId;
            style.textContent = `
                .winbox { box-shadow: 0 3px 10px #000; font-family: "PT Sans", Arial, sans-serif; }
                .winbox .wb-title { color: #333; font-size: 13px; font-weight: bold; text-shadow: none; }
                .winbox .wb-body { background: #fff; overflow: auto; }
                .winbox .textViewContent { color: #333; }
                .winbox .textViewContent h1 { font-weight: bold; font-size: 1.3em; }
                .winbox .textViewContent h2 { font-weight: bold; font-size: 1.1em; margin-top: 1em; }
                .winbox .textViewContent p { margin: 0.5em 0; line-height: 1.5; }
                .winbox .textViewContent a { color: #336699; }
            `;
            this.shadowRoot.appendChild(style);
        }
    }

    // Remove a window
    remove(id) {
        // Remove the window from the global windows property
        this.windows = this.windows.filter(function (obj) {
            return obj.id !== id;
        });

        // Remove the window from the shadow root
        const element = this.shadowRoot.getElementById(id);
        if (element) {
            element.remove();
        }
    }

    // Update windows
    update(windows) {

        // Case 1: update all the windows with the same values eg. arranging the windows,
        // windows =  [{"height": "95%"}]


        // Case 2: Update each window with different values

        // Loop through the json string sent to update function
        for (var i = 0; i < windows.length; i++) {
            // Check if there is an id
            if (!windows[i].hasOwnProperty("id")) {
                console.error("Property 'id' missing in update statement: "+JSON.stringify(windows[i]));
                return;
            }
            // Loop through all the existing edirom windows
            for (var j = 0; j < this.windows.length; j++) {
                
                // Check if the id of the input json string is the same as this.windows
                if (windows[i]["id"] == this.windows[j]["id"]) {
                    for (var key in windows[i]) {
                        this.windows[j][key] = windows[i][key];
                    }

                    // Apply the new values to the rendered WinBox window
                    this._applyWindowUpdate(windows[i]);
                }
            }
        }
            
    }

    // Apply updated properties to an existing WinBox window in the shadow DOM
    _applyWindowUpdate(changes) {
        const el = this.shadowRoot.getElementById(changes.id);
        if (!el) return;

        const toCss = (v) => (typeof v === 'number' ? v + 'px' : v);

        for (var key in changes) {
            switch (key) {
                case 'id':
                    break;
                case 'x':
                    el.style.left = toCss(changes.x);
                    break;
                case 'y':
                    el.style.top = toCss(changes.y);
                    break;
                case 'width':
                    el.style.width = toCss(changes.width);
                    break;
                case 'height':
                    el.style.height = toCss(changes.height);
                    break;
                case 'background':
                    el.style.backgroundColor = changes.background;
                    break;
                case 'title': {
                    const titleEl = el.querySelector('.wb-title');
                    if (titleEl) titleEl.textContent = changes.title;
                    break;
                }
                case 'html': {
                    const body = el.querySelector('.wb-body');
                    if (body) body.innerHTML = changes.html;
                    break;
                }
                case 'url': {
                    const iframe = el.querySelector('.wb-body iframe');
                    if (iframe) iframe.src = changes.url;
                    break;
                }
                default:
                    break;
            }
        }
    }

    arrange(type){
            // Get all managed winbox windows from the shadow root
            var topLevelDivs = this.windows.map((w) => { return this.shadowRoot.getElementById(w.id); }).filter(Boolean);
            if (topLevelDivs.length === 0) return;

            // Tile within the actual container, not the physical screen, and fill
            // the full available area so no empty space is left over.
            var contentWidth = this._container.clientWidth;
            var contentHeight = this._container.clientHeight;
            var gridWidth = contentWidth / topLevelDivs.length
            var gridHeight = contentHeight / topLevelDivs.length

            topLevelDivs.forEach((div, index) => {
                if(type == "vertical") {
                    div.style.width = gridWidth+"px" ;
                    div.style.left = index * gridWidth + "px"
                    div.style.top = 0
                    div.style.height = contentHeight + "px"
                } if(type == "horizontal") {
                    div.style.height = gridHeight+"px"
                    div.style.top = index * gridHeight + "px"
                    div.style.left = 0
                    div.style.width = contentWidth + "px" ;
                }

            });   
    }


    // Listen for communicate-update-update event and handle updates
    connectedCallback() {

    }
}

// Define the custom element if not already defined
if (!customElements.get('edirom-windows')) {
    customElements.define('edirom-windows', EdiromWindows);
}

export default EdiromWindows;
export { EdiromWindows };
