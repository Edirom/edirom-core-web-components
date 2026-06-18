<div align="left">
 
[![DOI](https://zenodo.org/badge/1090859160.svg)](https://doi.org/10.5281/zenodo.17813169)
[![GitHub release](https://img.shields.io/github/v/release/Edirom/edirom-core-web-components.svg)](https://github.com/Edirom/edirom-core-web-components/releases) 
![NPM Version](https://img.shields.io/npm/v/edirom-core-web-components.svg)

</div>



# Core web components for Edirom Online

This repository contains core web components for the Edirom Online. In general these are smaller components for parts of the Edirom like icons, lists, menus etc.
More complex web components are organized in individual repositories. You can get an overview of other web components in the [edirom-web-components](https://github.com/Edirom/edirom-web-components) repository which integrates other components as submodules and provides basic demonstrators for them.


## `<edirom-icon>`

Web Component wrapper for **Google Material Symbols (Material Design icons)**.

It provides:

- Declarative icon rendering
- Built-in size and color control
- Optional spinning and rotation
- Button behavior support
- ARIA support
- Custom SVG/HTML override via slot
- Automatic font loading (once per document)


## Features

- Uses **Material Symbols Outlined**
- Loads icon font automatically
- Supports ligature-based icon names
- Built-in name mapping system
- Supports custom slotted SVG content
- Keyboard-accessible button behavior
- Reactive to attribute changes
- Zero dependencies


## Usage

### Basic Icon

```html
<edirom-icon name="home"></edirom-icon>
```


### Size and Color

```html
<edirom-icon name="home" size="36" color="#f33"></edirom-icon>
```


### Fill Mode

Set `size="fill"` to make the icon expand to fill its container:

```html
<div style="width: 64px; height: 64px;">
    <edirom-icon name="home" size="fill"></edirom-icon>
</div>
```

In fill mode:
- The host switches to `display: block` with `width: 100%; height: 100%`
- The icon is centered (flexbox) and scaled to fit via `min(100cqi, 100cqb)` using CSS container queries
- Useful for icon buttons or containers where the icon should occupy the full available space


### Spin and Rotate

```html
<edirom-icon name="sync" spin></edirom-icon>

<edirom-icon name="arrow_right" rotate="45"></edirom-icon>
```


### Button Behavior

```html
<edirom-icon
    name="menu"
    role="button"
    aria-label="Open menu">
</edirom-icon>
```

Or:

```html
<edirom-icon name="menu" button></edirom-icon>
```

Features:

- Adds pointer cursor
- Adds keyboard support (`Enter` / `Space`)
- Automatically sets `tabindex="0"` if missing


### Custom SVG Override

You can provide your own content instead of using the font icon:

```html
<edirom-icon size="32" color="blue">
    <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"></circle>
    </svg>
</edirom-icon>
```

If the element contains children, the component renders a `<slot>` instead of a font ligature.


## Attributes

| Attribute     | Type                                      | Description |
|---------------|------------------------------------------|-------------|
| `name`        | string                                    | Icon name (ligature text) |
| `size`        | number \| CSS size \| `12px` \| `"fill"` | Icon size; use `"fill"` to expand to fit container |
| `color`       | CSS color                                 | Icon color |
| `spin`        | boolean                                   | Enables infinite rotation |
| `rotate`      | number \| `45deg`                         | Rotates icon |
| `aria-label`  | string                                    | Accessibility label |
| `role`        | string                                    | ARIA role |
| `button`      | boolean                                   | Enables button styling + keyboard |
| `pressed`     | boolean                                   | Applies pressed styling |


## Size Attribute Formats

The `size` attribute supports:

| Value    | Result |
|----------|--------|
| `"24"`   | `24px` |
| `"32px"` | `32px` |
| `"2em"`  | `2em`  |
| `"150%"` | `150%` |
| `"2x"`   | `2em`  |
| `"fill"` | Fills the parent container (sets `display: block`, `width/height: 100%`, uses CSS container queries to scale) |


## Styling

The component uses CSS variables internally:

```css
--edirom-icon-size
--edirom-icon-color
```

You can override them externally:

```css
edirom-icon {
    --edirom-icon-size: 40px;
    --edirom-icon-color: red;
}
```


## Icon Name Mapping

The component includes a built-in mapping layer:

```js
_mapIconName(name)
```

Example:

```js
'eo_help' → 'help'
'eo_search' → 'search'
```

If no mapping exists, the provided name is used directly.

You can extend the mapping inside `_mapIconName()`.


---


## `<edirom-dom>`

A lightweight Web Component that wraps its light DOM content inside a Shadow DOM using a `<slot>`.

It allows configuring Shadow DOM options declaratively via HTML attributes.

### Features

Uses Shadow DOM with `<slot>` (does not move children)
Configurable Shadow DOM options via attributes
Reacts to attribute changes
Zero dependencies
Native Web Component (no framework)

###  Usage

```
<edirom-dom>
    <p>Hello Shadow DOM</p>
</edirom-dom>
```

The content remains in the light DOM but is rendered inside the component's Shadow DOM via a default `<slot>`.

### Attributes

| Attribute | Type | Default | Description | 
| -- | -- | -- | -- |
| mode | "open", "closed" | "open" | Defines the Shadow DOM mode |
| delegates-focus | boolean | false | Enables focus delegation |
| slot-assignment | "named", "manual" | browser default | Controls slot assignment behavior |

### Examples

Default (open mode)
```
<edirom-dom>
    <p>Content inside shadow</p>
</edirom-dom>
```

Closed Shadow DOM
```
<edirom-dom mode="closed">
    <p>This shadow root is not accessible via JS</p>
</edirom-dom>
```

Focus Delegation
```
<edirom-dom delegates-focus>
    <input placeholder="Focus is delegated">
</edirom-dom>
```

Named Slot Assignment
```
<edirom-dom slot-assignment="named">
    <span slot="header">Header</span>
</edirom-dom>
```

### Limitations

1. Shadow mode cannot be changed after creation

Once attached, the Shadow DOM mode (open or closed) cannot be modified.

2. Closed mode prevents rebuild

If mode="closed" is used:

element.shadowRoot // → null


---


## `<edirom-windows>`

A Web Component that manages a set of draggable, resizable floating windows inside an isolated Shadow DOM, built on top of [WinBox.js](https://github.com/nextapps-de/winbox).

It provides a declarative, attribute-driven API for adding, removing, updating and arranging windows, making it suitable for multi-document and multi-view interfaces in Edirom Online.

### Features

- Manages multiple floating windows via [WinBox.js](https://github.com/nextapps-de/winbox)
- Fully isolated in an open Shadow DOM (`<host>` is a fixed, full-viewport layer)
- Declarative control through HTML attributes (`set`, `add`, `remove`, `update`, `arrange`)
- Automatic, asynchronous loading of the WinBox script and CSS from CDN
- Queues windows requested before WinBox finishes loading and creates them once ready
- Mirrors the document's stylesheets into the Shadow DOM so Edirom content styles (e.g. `.textViewContent`) apply inside windows
- Built-in Edirom-matching appearance overrides for WinBox
- Dispatches `communicate-windows-*` custom events on every attribute change
- Vertical and horizontal tiling via the `arrange` attribute
- Zero npm dependencies (WinBox is loaded at runtime)

### Usage

Place the element anywhere in the document; it renders as a fixed overlay covering the viewport. Windows are controlled by setting attributes (typically as JSON strings).

```html
<edirom-windows></edirom-windows>
```

Add a window programmatically:

```js
const windows = document.querySelector('edirom-windows');
windows.setAttribute('add', JSON.stringify([
    { id: 'win1', title: 'Source A', html: '<p>Hello</p>' }
]));
```

### Attributes

All attributes accept a JSON string (except `remove` and `arrange`). Changing an attribute triggers the corresponding action and fires a `communicate-windows-<attribute>` event.

| Attribute | Type | Description |
| -- | -- | -- |
| `set` | JSON array | Removes all currently managed windows and replaces them with the provided windows. An empty value clears all windows. |
| `add` | JSON array | Adds one or more new windows without removing existing ones. |
| `remove` | string (id) | Removes the window with the given `id`. |
| `update` | JSON array | Updates properties of existing windows, matched by `id`. Each entry must include an `id`. |
| `arrange` | `"vertical"` \| `"horizontal"` | Tiles all managed windows in the given orientation. |

### Window Configuration

Each window object is passed through to WinBox. Commonly used properties:

| Property | Type | Description |
| -- | -- | -- |
| `id` | string | Unique identifier used to reference the window in `remove`/`update`. |
| `title` | string | Window title shown in the header. |
| `html` / `url` | string | Window content (inline HTML or an embedded URL). |
| `x`, `y` | number \| string | Initial position. |
| `width`, `height` | number \| string | Initial size (e.g. `"95%"`). |
| `border` | CSS size | Window border width (default `0.3em`). |
| `background` | CSS color | Header background color (default `#ccc`). |
| `index` | number | Stacking order / z-index (default `100000`). |

If `border`, `background` or `index` are omitted, the component's defaults are applied automatically.

### Examples

Set (replace all windows):

```js
windows.setAttribute('set', JSON.stringify([
    { id: 'a', title: 'Window A', html: '<p>First</p>' },
    { id: 'b', title: 'Window B', html: '<p>Second</p>' }
]));
```

Add a window:

```js
windows.setAttribute('add', JSON.stringify([
    { id: 'c', title: 'Window C', html: '<p>Third</p>' }
]));
```

Remove a window:

```js
windows.setAttribute('remove', 'c');
```

Update a window:

```js
windows.setAttribute('update', JSON.stringify([
    { id: 'a', height: '95%' }
]));
```

Arrange windows:

```js
windows.setAttribute('arrange', 'vertical');
windows.setAttribute('arrange', 'horizontal');
```

### Events

On every observed attribute change, the component dispatches a bubbling `CustomEvent`:

```js
windows.addEventListener('communicate-windows-add', (e) => {
    console.log(e.detail.add); // the new attribute value
});
```

Event names follow the pattern `communicate-windows-<attribute>`, where `<attribute>` is one of `set`, `add`, `remove`, `update`, `arrange`.

### Asset Loading

WinBox's script and CSS are loaded automatically at runtime from a CDN:

- The WinBox script is appended to `document.head` (loaded once per document).
- The WinBox CSS is injected into the Shadow DOM so it can style shadow nodes.
- Edirom-matching style overrides are injected into the Shadow DOM.
- All document `<link rel="stylesheet">` stylesheets are mirrored into the Shadow DOM so Edirom content styles apply inside windows.

Windows requested before WinBox has finished loading are queued and created automatically once the script is ready.

### Limitations

1. `update` does not yet re-render windows

The `update` action stores new values in the internal window state, but visually re-applying them to an existing WinBox window is not yet implemented.

2. Requires network access

WinBox assets are loaded from a CDN; without network access, windows cannot be created.

