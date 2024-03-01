# Getting Started

## Installation

```bash
npm install @inula-ui/components @inula-ui/hooks @inula-ui/themes @inula-ui/utils
```

## Import style

For the sake of packing volume and importing on demand, we do not pack style files.

Global style:

```scss
@use '@inula-ui/themes/index';
```

Import on demand:

```scss
@use '@inula-ui/themes/root';

@use '@inula-ui/themes/reboot';
@use '@inula-ui/themes/animations';
@use '@inula-ui/themes/common';

@use '@inula-ui/themes/components/circular-progress';
@use '@inula-ui/themes/components/mask';
@use '@inula-ui/themes/components/wave';

@use '@inula-ui/themes/components/accordion';
```

## Demo

Here's a simple online codesandbox demo of the Inula UI component:

<iframe
  src="https://codesandbox.io/embed/getting-started-3vkd3t?fontsize=14&hidenavigation=1&theme=dark"
  style="width: 100%; height: 500px; overflow: hidden; border: 0; border-radius: 4px"
  title="getting-started"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>
