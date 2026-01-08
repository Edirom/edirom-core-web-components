class EdiromImage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.scale = 1;
    this.minScale = 1;
    this.maxScale = 5;

    this.translateX = 0;
    this.translateY = 0;

    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;

    this.lastTouchDist = null;

    this.shadowShadowDOM();
  }

  shadowShadowDOM() {
    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: inline-block;
      }

      .viewport {
        overflow: hidden;
        position: relative;
        cursor: grab;
        user-select: none;
        background: #111;
        touch-action: none;
      }

      .viewport:active {
        cursor: grabbing;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        transform-origin: 0 0;
        will-change: transform;
        pointer-events: none;
      }
    `;

    this.viewport = document.createElement("div");
    this.viewport.className = "viewport";

    this.img = document.createElement("img");
    this.img.draggable = false;

    this.viewport.appendChild(this.img);
    this.shadowRoot.append(style, this.viewport);
  }

  connectedCallback() {
    this.img.src = this.getAttribute("src") || "";

    const w = this.getAttribute("width") || 400;
    const h = this.getAttribute("height") || 300;
    this.viewport.style.width = `${w}px`;
    this.viewport.style.height = `${h}px`;

    this.bindEvents();
    this.updateTransform();
  }

  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  updateTransform() {
    const vw = this.viewport.clientWidth;
    const vh = this.viewport.clientHeight;

    const iw = vw * this.scale;
    const ih = vh * this.scale;

    const minX = Math.min(0, vw - iw);
    const minY = Math.min(0, vh - ih);

    this.translateX = this.clamp(this.translateX, minX, 0);
    this.translateY = this.clamp(this.translateY, minY, 0);

    this.img.style.transform =
      `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
  }

  bindEvents() {
    /* Mouse wheel zoom */
    this.viewport.addEventListener("wheel", (e) => {
      e.preventDefault();

      const rect = this.viewport.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      const zoom = Math.exp((e.deltaY < 0 ? 1 : -1) * 0.1);
      const newScale = this.clamp(
        this.scale * zoom,
        this.minScale,
        this.maxScale
      );

      this.translateX -= (offsetX - this.translateX) * (newScale / this.scale - 1);
      this.translateY -= (offsetY - this.translateY) * (newScale / this.scale - 1);

      this.scale = newScale;
      this.updateTransform();
    }, { passive: false });

    /* Mouse drag */
    this.viewport.addEventListener("mousedown", (e) => {
      this.isDragging = true;
      this.startX = e.clientX - this.translateX;
      this.startY = e.clientY - this.translateY;
    });

    window.addEventListener("mousemove", (e) => {
      if (!this.isDragging) return;
      this.translateX = e.clientX - this.startX;
      this.translateY = e.clientY - this.startY;
      this.updateTransform();
    });

    window.addEventListener("mouseup", () => {
      this.isDragging = false;
    });

    /* Double click reset */
    this.viewport.addEventListener("dblclick", () => {
      this.scale = 1;
      this.translateX = 0;
      this.translateY = 0;
      this.updateTransform();
    });

    /* Touch */
    this.viewport.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.startX = e.touches[0].clientX - this.translateX;
        this.startY = e.touches[0].clientY - this.translateY;
      }

      if (e.touches.length === 2) {
        this.lastTouchDist = this.touchDistance(e.touches);
      }
    });

    this.viewport.addEventListener("touchmove", (e) => {
      e.preventDefault();

      if (e.touches.length === 1 && this.isDragging) {
        this.translateX = e.touches[0].clientX - this.startX;
        this.translateY = e.touches[0].clientY - this.startY;
        this.updateTransform();
      }

      if (e.touches.length === 2) {
        const dist = this.touchDistance(e.touches);
        const zoom = dist / this.lastTouchDist;
        this.scale = this.clamp(
          this.scale * zoom,
          this.minScale,
          this.maxScale
        );
        this.lastTouchDist = dist;
        this.updateTransform();
      }
    }, { passive: false });

    this.viewport.addEventListener("touchend", () => {
      this.isDragging = false;
      this.lastTouchDist = null;
    });
  }

  touchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  }
}

customElements.define("edirom-image", EdiromImage);