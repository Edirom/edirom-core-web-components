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

| Attribute     | Type                          | Description |
|---------------|------------------------------|-------------|
| `name`        | string                        | Icon name (ligature text) |
| `size`        | number \| CSS size \| `12px`    | Icon size |
| `color`       | CSS color                     | Icon color |
| `spin`        | boolean                       | Enables infinite rotation |
| `rotate`      | number \| `45deg`             | Rotates icon |
| `aria-label`  | string                        | Accessibility label |
| `role`        | string                        | ARIA role |
| `button`      | boolean                       | Enables button styling + keyboard |
| `pressed`     | boolean                       | Applies pressed styling |


## Size Attribute Formats

The `size` attribute supports:

| Value   | Result |
|---------|--------|
| `"24"`  | `24px` |
| `"32px"`| `32px` |
| `"2em"` | `2em`  |
| `"150%"`| `150%` |
| `"2x"`  | `2em`  |


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

