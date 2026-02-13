# Core web components for Edirom Online

This repository contains core web components for the Edirom Online. In general these are smaller components for parts of the Edirom like icons, lists, menus etc.
More complex web components are organized in individual repositories. You can get an overview of other web components in the [edirom-web-components](https://github.com/Edirom/edirom-web-components) repository which integrates other components as submodules and provides basic demonstrators for them.

## `<edirom-dom>`

A lightweight Web Component that wraps its light DOM content inside a Shadow DOM using a <slot>.

It allows configuring Shadow DOM options declaratively via HTML attributes.

### Features

Uses Shadow DOM with <slot> (does not move children)
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

The content remains in the light DOM but is rendered inside the component's Shadow DOM via a default <slot>.

### Attributes

| Attribute | Type | Default | Description | 
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



