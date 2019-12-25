<hr>
<div align="center">
  <h1 align="center">
    &lt;Collapse&gt;
  </h1>
</div>

<p align="center">
  <a href="https://bundlephobia.com/result?p=@accessible/collapse">
    <img alt="Bundlephobia" src="https://img.shields.io/bundlephobia/minzip/@accessible/collapse?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="Types" href="https://www.npmjs.com/package/@accessible/collapse">
    <img alt="Types" src="https://img.shields.io/npm/types/@accessible/collapse?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="Code coverage report" href="https://codecov.io/gh/accessible-ui/collapse">
    <img alt="Code coverage" src="https://img.shields.io/codecov/c/gh/accessible-ui/collapse?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="Build status" href="https://travis-ci.org/accessible-ui/collapse">
    <img alt="Build status" src="https://img.shields.io/travis/accessible-ui/collapse?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/@accessible/collapse">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/@accessible/collapse?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="License" href="https://jaredlunde.mit-license.org/">
    <img alt="MIT License" src="https://img.shields.io/npm/l/@accessible/collapse?style=for-the-badge&labelColor=24292e">
  </a>
</p>

<pre align="center">npm i @accessible/collapse</pre>
<hr>

An accessible and versatile collapsible component for React

## Features

- **Style-agnostic** You can use this component with the styling library of your choice. It
  works with CSS-in-JS, SASS, plain CSS, plain `style` objects, anything!
- **Portal-friendly** The collapse target will render into React portals of your choice when configured
  to do so.
- **a11y/aria-compliant** This component works with screen readers out of the target and manages
  focus for you.

## Quick Start

[Check out the example on CodeSandbox](https://codesandbox.io/s/accessiblecollapse-example-8pkd2)

```jsx harmony
import {Collapse, Target, Trigger, Close} from '@accessible/collapse'

const Component = () => (
  <Collapse>
    <Target>
      <div className="my-collapse">
        <Close>
          <button>Close me</button>
        </Close>
      </div>
    </Target>

    <Trigger>
      <button>Open me</button>
    </Trigger>
  </Collapse>
)
```

## API

### Components

| Component                 | Description                                                                                                      |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| [`<Collapse>`](#collapse) | This component creates the context for your collapse target and trigger and contains some configuration options. |
| [`<Target>`](#target)     | This component wraps any React element and turns it into a collapse target.                                      |
| [`<Trigger>`](#trigger)   | This component wraps any React element and turns it into a collapse trigger.                                     |
| [`<Close>`](#close)       | This is a convenience component that wraps any React element and adds an onClick handler to close the collapse.  |  |

### Hooks

| Hook                            | Description                                                                                          |
| ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [`useCollapse()`](#usecollapse) | This hook provides the value of the collapse's [CollapseContextValue object](#collapsecontextvalue). |
| [`useControls()`](#usecontrols) | This hook provides access to the collapse's `open`, `close`, and `toggle` functions.                 |
| [`useIsOpen()`](#useisopen)     | This hook provides access to the collapse's `isOpen` value.                                          |

### `<Collapse>`

This component creates the context for your collapse target and trigger and contains some
configuration options.

#### Props

| Prop        | Type                                                                                                                                 | Default     | Required? | Description                                                                                                                                                                          |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| defaultOpen | `boolean`                                                                                                                            | `false`     | No        | This sets the default open state of the collapse. By default the collapse is closed.                                                                                                 |
| open        | `boolean`                                                                                                                            | `undefined` | No        | You can control the open/closed state of the collapse with this prop. When it isn't undefined, this value will take precedence over any calls to `open()`, `close()`, or `toggle()`. |
| id          | `string`                                                                                                                             | `undefined` | No        | By default this component creates a unique id for you, as it is required for certain aria attributes. Supplying an id here overrides the auto id feature.                            |
| children    | <code>React.ReactNode &#124; React.ReactNode[] &#124; JSX.Element &#124; ((context: CollapseContextValue) => React.ReactNode)</code> | `undefined` | No        | Your collapse contents and any other children.                                                                                                                                       |

### `<Target>`

This component wraps any React element and turns it into a collapse target.

#### Props

| Prop          | Type                                | Default            | Required? | Description                                                                                                                                                                                                       |
| ------------- | ----------------------------------- | ------------------ | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| portal        | <code>boolean &#124; string </code> | `false`            | No        | When `true` this will render the collapse into a React portal with the id `#portals`. You can render it into any portal by providing its query selector here, e.g. `#foobar`, `[data-portal=true]`, or `.foobar`. |
| closeOnEscape | `boolean`                           | `true`             | No        | By default the collapse will close when the `Escape` key is pressed. You can turn this off by providing `false` here.                                                                                             |
| closedClass   | `string`                            | `undefined`        | No        | This class name will be applied to the child element when the collapse is `closed`.                                                                                                                               |
| openClass     | `string`                            | `"collapse--open"` | No        | This class name will be applied to the child element when the collapse is `open`.                                                                                                                                 |
| closedStyle   | `React.CSSProperties`               | `undefined`        | No        | These styles will be applied to the child element when the collapse is `closed` in addition to the default styles that set the target's visibility.                                                               |
| openStyle     | `React.CSSProperties`               | `undefined`        | No        | These styles name will be applied to the child element when the collapse is `open` in addition to the default styles that set the target's visibility.                                                            |
| children      | `React.ReactElement`                | `undefined`        | Yes       | The child is cloned by this component and has aria attributes injected into its props as well as the events defined above.                                                                                        |

#### Example

```jsx harmony
<Target>
  <div className="alert">Alert</div>
</Target>

// <div
//   class="alert"
//   hidden
//   aria-collapse="false"
//   id="collapse--12"
//   style="visibility: hidden; position: fixed; margin: auto; left: 0px; right: 0px; top: 50%; transform: translateY(-50%); z-index: 1;"
// >
//   Alert
// </div>
```

### `<Trigger>`

This component wraps any React element and adds an `onClick` handler which toggles the open state
of the collapse target.

#### Props

| Prop        | Type                  | Default     | Required? | Description                                                                                                                |
| ----------- | --------------------- | ----------- | --------- | -------------------------------------------------------------------------------------------------------------------------- |
| closedClass | `string`              | `undefined` | No        | This class name will be applied to the child element when the collapse is `closed`.                                        |
| openClass   | `string`              | `undefined` | No        | This class name will be applied to the child element when the collapse is `open`.                                          |
| closedStyle | `React.CSSProperties` | `undefined` | No        | These styles will be applied to the child element when the collapse is `closed`.                                           |
| openStyle   | `React.CSSProperties` | `undefined` | No        | These styles name will be applied to the child element when the collapse is `open`.                                        |
| children    | `React.ReactElement`  | `undefined` | Yes       | The child is cloned by this component and has aria attributes injected into its props as well as the events defined above. |

```jsx harmony
<Trigger on="click">
  <button className="my-button">Open me!</button>
</Trigger>

// <button
//   class="my-button"
//   aria-controls="collapse--12"
//   aria-expanded="false"
// >
//   Open me!
// </button>
```

### `<Close>`

This is a convenience component that wraps any React element and adds an onClick handler which closes the collapse.

#### Props

| Prop     | Type                 | Default     | Required? | Description                                                                                                                |
| -------- | -------------------- | ----------- | --------- | -------------------------------------------------------------------------------------------------------------------------- |
| children | `React.ReactElement` | `undefined` | Yes       | The child is cloned by this component and has aria attributes injected into its props as well as the events defined above. |

```jsx harmony
<Close>
  <button className="my-button">Close me</button>
</Close>

// <button
//   class="my-button"
//   aria-controls="collapse--12"
//   aria-expanded="false"
// >
//   Close me
// </button>
```

### `useCollapse()`

This hook provides the value of the collapse's [CollapseContextValue object](#collapsecontextvalue)

#### Example

```jsx harmony
const Component = () => {
  const {open, close, toggle, isOpen} = useCollapse()
  return <button onClick={toggle}>Toggle the collapse</button>
}
```

### `CollapseContextValue`

```typescript
interface CollapseContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  id: string
}
```

### `useControls()`

This hook provides access to the collapse's `open`, `close`, and `toggle` functions

#### Example

```jsx harmony
const Component = () => {
  const {open, close, toggle} = useControls()
  return (
    <Target>
      <div className="my-collapse">
        <button onClick={close}>Close me</button>
      </div>
    </Target>
  )
}
```

### `useIsOpen()`

This hook provides access to the collapse's `isOpen` value

#### Example

```jsx harmony
const Component = () => {
  const isOpen = useIsOpen()
  return (
    <Target>
      <div className="my-collapse">Am I open? {isOpen ? 'Yes' : 'No'}</div>
    </Target>
  )
}
```

## LICENSE

MIT
