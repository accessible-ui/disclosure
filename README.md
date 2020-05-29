<hr>
<div align="center">
  <h1 align="center">
    &lt;Disclosure&gt;
  </h1>
</div>

<p align="center">
  <a href="https://bundlephobia.com/result?p=@accessible/disclosure">
    <img alt="Bundlephobia" src="https://img.shields.io/bundlephobia/minzip/@accessible/disclosure?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="Types" href="https://www.npmjs.com/package/@accessible/disclosure">
    <img alt="Types" src="https://img.shields.io/npm/types/@accessible/disclosure?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="Code coverage report" href="https://codecov.io/gh/accessible-ui/disclosure">
    <img alt="Code coverage" src="https://img.shields.io/codecov/c/gh/accessible-ui/disclosure?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="Build status" href="https://travis-ci.org/accessible-ui/disclosure">
    <img alt="Build status" src="https://img.shields.io/travis/accessible-ui/disclosure?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/@accessible/disclosure">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/@accessible/disclosure?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="License" href="https://jaredlunde.mit-license.org/">
    <img alt="MIT License" src="https://img.shields.io/npm/l/@accessible/disclosure?style=for-the-badge&labelColor=24292e">
  </a>
</p>

<pre align="center">npm i @accessible/disclosure</pre>
<hr>

An accessible and versatile disclosure component for React

## Features

- **Style-agnostic** You can use this component with the styling library of your choice. It
  works with CSS-in-JS, SASS, plain CSS, plain `style` objects, anything!
- **Portal-friendly** The disclosure target will render into React portals of your choice when configured
  to do so.
- **a11y/aria-compliant** This component works with screen readers out of the box and manages
  focus for you.

## Quick Start

[Check out the example on CodeSandbox](https://codesandbox.io/s/accessibledisclosure-example-8pkd2)

```jsx harmony
import {Disclosure, Target, Trigger, Close} from '@accessible/disclosure'

const Component = () => (
  <Disclosure>
    <Trigger>
      <button>Open me</button>
    </Trigger>

    <Target>
      <div className="my-disclosure">
        <Close>
          <button>Close me</button>
        </Close>
      </div>
    </Target>
  </Disclosure>
)
```

## API

### Components

| Component                     | Description                                                                                                        |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| [`<Disclosure>`](#disclosure) | This component creates the context for your disclosure target and trigger and contains some configuration options. |
| [`<Target>`](#target)         | This component wraps any React element and turns it into a disclosure target.                                      |
| [`<Trigger>`](#trigger)       | This component wraps any React element and turns it into a disclosure trigger.                                     |
| [`<Close>`](#close)           | This is a convenience component that wraps any React element and adds an onClick handler to close the disclosure.  |  |

### Hooks

| Hook                                | Description                                                                                                |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| [`useDisclosure()`](#usedisclosure) | This hook provides the value of the disclosure's [DisclosureContextValue object](#disclosurecontextvalue). |
| [`useControls()`](#usecontrols)     | This hook provides access to the disclosure's `open`, `close`, and `toggle` functions.                     |
| [`useIsOpen()`](#useisopen)         | This hook provides access to the disclosure's `isOpen` value.                                              |

### `<Disclosure>`

This component creates the context for your disclosure target and trigger and contains some
configuration options.

#### Props

| Prop        | Type                                                                                                                                   | Default     | Required? | Description                                                                                                                                                                            |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| defaultOpen | `boolean`                                                                                                                              | `false`     | No        | This sets the default open state of the disclosure. By default the disclosure is closed.                                                                                               |
| open        | `boolean`                                                                                                                              | `undefined` | No        | You can control the open/closed state of the disclosure with this prop. When it isn't undefined, this value will take precedence over any calls to `open()`, `close()`, or `toggle()`. |
| onChange    | `(open: boolean) => void`                                                                                                              | `undefined` | No        | This callback is invoked any time the `open` state of the disclosure changes.                                                                                                          |
| id          | `string`                                                                                                                               | `undefined` | No        | By default this component creates a unique id for you, as it is required for certain aria attributes. Supplying an id here overrides the auto id feature.                              |
| children    | <code>React.ReactNode &#124; React.ReactNode[] &#124; JSX.Element &#124; ((context: DisclosureContextValue) => React.ReactNode)</code> | `undefined` | No        | Your disclosure contents and any other children.                                                                                                                                       |

### `<Target>`

This component wraps any React element and turns it into a disclosure target.

#### Props

| Prop          | Type                                | Default              | Required? | Description                                                                                                                                                                                                         |
| ------------- | ----------------------------------- | -------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| portal        | <code>boolean &#124; string </code> | `false`              | No        | When `true` this will render the disclosure into a React portal with the id `#portals`. You can render it into any portal by providing its query selector here, e.g. `#foobar`, `[data-portal=true]`, or `.foobar`. |
| closeOnEscape | `boolean`                           | `true`               | No        | By default the disclosure will close when the `Escape` key is pressed. You can turn this off by providing `false` here.                                                                                             |
| closedClass   | `string`                            | `undefined`          | No        | This class name will be applied to the child element when the disclosure is `closed`.                                                                                                                               |
| openClass     | `string`                            | `"disclosure--open"` | No        | This class name will be applied to the child element when the disclosure is `open`.                                                                                                                                 |
| closedStyle   | `React.CSSProperties`               | `undefined`          | No        | These styles will be applied to the child element when the disclosure is `closed` in addition to the default styles that set the target's visibility.                                                               |
| openStyle     | `React.CSSProperties`               | `undefined`          | No        | These styles name will be applied to the child element when the disclosure is `open` in addition to the default styles that set the target's visibility.                                                            |
| preventScroll | `boolean`                           | `false`              | No        | When `true` this will prevent your browser from scrolling the document to bring the newly-focused tab into view.                                                                                                    |
| children      | `React.ReactElement`                | `undefined`          | Yes       | The child is cloned by this component and has aria attributes injected into its props as well as the events defined above.                                                                                          |

#### Example

```jsx harmony
<Target>
  <div className="alert">Alert</div>
</Target>

// <div
//   class="alert"
//   aria-hidden="true"
//   id="disclosure--12"
//   style="visibility: hidden;"
// >
//   Alert
// </div>
```

### `<Trigger>`

This component wraps any React element and adds an `onClick` handler which toggles the open state
of the disclosure target.

#### Props

| Prop        | Type                  | Default     | Required? | Description                                                                                                                |
| ----------- | --------------------- | ----------- | --------- | -------------------------------------------------------------------------------------------------------------------------- |
| closedClass | `string`              | `undefined` | No        | This class name will be applied to the child element when the disclosure is `closed`.                                      |
| openClass   | `string`              | `undefined` | No        | This class name will be applied to the child element when the disclosure is `open`.                                        |
| closedStyle | `React.CSSProperties` | `undefined` | No        | These styles will be applied to the child element when the disclosure is `closed`.                                         |
| openStyle   | `React.CSSProperties` | `undefined` | No        | These styles name will be applied to the child element when the disclosure is `open`.                                      |
| children    | `React.ReactElement`  | `undefined` | Yes       | The child is cloned by this component and has aria attributes injected into its props as well as the events defined above. |

```jsx harmony
<Trigger on="click">
  <button className="my-button">Open me!</button>
</Trigger>

// <button
//   class="my-button"
//   aria-controls="disclosure--12"
//   aria-expanded="false"
// >
//   Open me!
// </button>
```

### `<Close>`

This is a convenience component that wraps any React element and adds an onClick handler which closes the disclosure.

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
//   aria-controls="disclosure--12"
//   aria-expanded="false"
// >
//   Close me
// </button>
```

### `useDisclosure()`

This hook provides the value of the disclosure's [DisclosureContextValue object](#disclosurecontextvalue)

#### Example

```jsx harmony
const Component = () => {
  const {open, close, toggle, isOpen} = useDisclosure()
  return <button onClick={toggle}>Toggle the disclosure</button>
}
```

### `DisclosureContextValue`

```typescript
interface DisclosureContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  id: string
}
```

### `useControls()`

This hook provides access to the disclosure's `open`, `close`, and `toggle` functions

#### Example

```jsx harmony
const Component = () => {
  const {open, close, toggle} = useControls()
  return (
    <Target>
      <div className="my-disclosure">
        <button onClick={close}>Close me</button>
      </div>
    </Target>
  )
}
```

### `useIsOpen()`

This hook provides access to the disclosure's `isOpen` value

#### Example

```jsx harmony
const Component = () => {
  const isOpen = useIsOpen()
  return (
    <Target>
      <div className="my-disclosure">Am I open? {isOpen ? 'Yes' : 'No'}</div>
    </Target>
  )
}
```

## LICENSE

MIT
