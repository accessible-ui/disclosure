import * as React from 'react'
import useKey from '@accessible/use-key'
import useConditionalFocus from '@accessible/use-conditional-focus'
import useSwitch from '@react-hook/switch'
import useMergedRef from '@react-hook/merged-ref'
import usePrevious from '@react-hook/previous'
import useId from '@accessible/use-id'
import {useA11yButton} from '@accessible/button'
import Portalize from 'react-portalize'
import type {PortalizeProps} from 'react-portalize'
import clsx from 'clsx'

const DisclosureContext = React.createContext<DisclosureContextValue>({
  isOpen: false,
  open: noop,
  close: noop,
  toggle: noop,
})

/**
 * This hook provides the current value of the disclosure's context object
 */
export function useDisclosure() {
  return React.useContext(DisclosureContext)
}

/**
 * This component creates the context for your disclosure target and trigger
 * and contains some configuration options.
 */
export function Disclosure({
  id,
  open,
  defaultOpen,
  onChange = noop,
  children,
}: DisclosureProps) {
  id = useId(id)
  const [isOpen, toggle] = useSwitch(defaultOpen, open, onChange)

  const context = React.useMemo(
    () => ({
      id,
      open: toggle.on,
      close: toggle.off,
      toggle,
      isOpen,
    }),
    [id, isOpen, toggle]
  )

  return (
    <DisclosureContext.Provider value={context}>
      {children}
    </DisclosureContext.Provider>
  )
}

function portalize(
  Component: React.ReactElement,
  portal: boolean | undefined | null | string | Omit<PortalizeProps, 'children'>
) {
  if (!portal) return Component
  const props: PortalizeProps = {children: Component}
  if (typeof portal === 'string') props.container = portal
  else Object.assign(props, portal)
  return React.createElement(Portalize, props)
}

/**
 * A React hook for creating a headless disclosure target to [WAI-ARIA authoring practices](https://www.w3.org/TR/wai-aria-practices-1.1/examples/disclosure/disclosure-faq.html).
 *
 * @param target A React ref or HTML element
 * @param options Configuration options
 */
export function useA11yTarget<T extends HTMLElement>(
  target: React.RefObject<T> | T | null,
  options: UseA11yTargetOptions = {}
) {
  const {
    preventScroll,
    closeOnEscape = true,
    openClass,
    closedClass,
    openStyle,
    closedStyle,
  } = options
  const {id, isOpen, close} = useDisclosure()
  const prevOpen = usePrevious(isOpen)
  // Provides the target focus when it is in a new open state
  useConditionalFocus(target, !prevOpen && isOpen, {
    includeRoot: true,
    preventScroll,
  })
  // Handles closing the modal when the ESC key is pressed
  useKey(target, {Escape: () => closeOnEscape && close()})

  return {
    'aria-hidden': !isOpen,
    id,
    className: isOpen ? openClass : closedClass,
    style: Object.assign(
      {visibility: isOpen ? 'visible' : 'hidden'} as const,
      isOpen ? openStyle : closedStyle
    ),
  } as const
}

/**
 * This component wraps any React element and turns it into a
 * disclosure target.
 */
export function Target({
  closeOnEscape = true,
  portal,
  openClass,
  closedClass,
  openStyle,
  closedStyle,
  preventScroll,
  children,
}: TargetProps) {
  const ref = React.useRef<HTMLElement>(null)
  const childProps = children.props
  const a11yProps = useA11yTarget(ref, {
    openClass: clsx(childProps.className, openClass) || void 0,
    closedClass: clsx(childProps.className, closedClass) || void 0,
    openStyle: childProps.style
      ? Object.assign({}, childProps.style, openStyle)
      : openStyle,
    closedStyle: childProps.style
      ? Object.assign({}, childProps.style, closedStyle)
      : closedStyle,
    closeOnEscape,
    preventScroll,
  })

  return portalize(
    React.cloneElement(
      children,
      Object.assign(a11yProps, {
        ref: useMergedRef(
          ref,
          // @ts-expect-error
          children.ref
        ),
      })
    ),
    portal
  )
}

/**
 * A React hook for creating a headless close button to [WAI-ARIA authoring practices](https://www.w3.org/TR/wai-aria-practices-1.1/examples/disclosure/disclosure-faq.html).
 * In addition to providing accessibility props to your component, this
 * hook will add events for interoperability between actual <button> elements
 * and fake ones e.g. <a> and <div> to the target element.
 *
 * @param target A React ref or HTML element
 * @param options Configuration options
 */
export function useA11yCloseButton<T extends HTMLElement>(
  target: React.RefObject<T> | T | null,
  {onClick}: UseA11yCloseButtonOptions = {}
) {
  const {close, isOpen, id} = useDisclosure()
  return Object.assign(
    {
      'aria-controls': id,
      'aria-expanded': isOpen,
      'aria-label': 'Close',
    } as const,
    useA11yButton<T>(target, (e) => {
      close()
      onClick?.(e)
    })
  )
}

/**
 * This is a convenience component that wraps any React element and adds
 * an onClick handler which closes the disclosure.
 */
export function CloseButton({children}: CloseButtonProps) {
  const ref = React.useRef<HTMLElement>(null)
  const childProps = children.props
  const a11yProps = useA11yCloseButton(ref, {
    onClick: childProps.onClick,
  })

  return React.cloneElement(
    children,
    Object.assign(a11yProps, {
      onClick: undefined,
      'aria-label': childProps.hasOwnProperty('aria-label')
        ? childProps['aria-label']
        : a11yProps['aria-label'],
      ref: useMergedRef(
        ref,
        // @ts-expect-error
        children.ref
      ),
    })
  )
}

/**
 * A React hook for creating a headless disclosure trigger to [WAI-ARIA authoring practices](https://www.w3.org/TR/wai-aria-practices-1.1/examples/disclosure/disclosure-faq.html).
 * In addition to providing accessibility props to your component, this
 * hook will add events for interoperability between actual <button> elements
 * and fake ones e.g. <a> and <div> to the target element
 *
 * @param target A React ref or HTML element
 * @param options Configuration options
 */
export function useA11yTrigger<T extends HTMLElement>(
  target: React.RefObject<T> | T | null,
  options: UseA11yTriggerOptions = {}
) {
  const {openClass, closedClass, openStyle, closedStyle, onClick} = options
  const {isOpen, id, toggle} = useDisclosure()
  const prevOpen = usePrevious(isOpen)
  useConditionalFocus(target, prevOpen && !isOpen, {includeRoot: true})

  return Object.assign(
    {
      'aria-controls': id,
      'aria-expanded': isOpen,
      className: isOpen ? openClass : closedClass,
      style: isOpen ? openStyle : closedStyle,
    } as const,
    useA11yButton<T>(target, (e) => {
      toggle()
      onClick?.(e)
    })
  )
}

/**
 * This component wraps any React element and adds an `onClick` handler
 * which toggles the open state of the disclosure target.
 */
export function Trigger({
  openClass,
  closedClass,
  openStyle,
  closedStyle,
  children,
}: TriggerProps) {
  const ref = React.useRef<HTMLElement>(null)
  const childProps = children.props
  const a11yProps = useA11yTrigger(ref, {
    openClass: clsx(childProps.className, openClass) || void 0,
    closedClass: clsx(childProps.className, closedClass) || void 0,
    openStyle: childProps.style
      ? Object.assign({}, childProps.style, openStyle)
      : openStyle,
    closedStyle: childProps.style
      ? Object.assign({}, childProps.style, closedStyle)
      : closedStyle,
    onClick: childProps.onClick,
  })

  return React.cloneElement(
    children,
    Object.assign(a11yProps, {
      onClick: undefined,
      ref: useMergedRef(
        ref,
        // @ts-expect-error
        children.ref
      ),
    })
  )
}

function noop() {}

export interface DisclosureContextValue {
  /**
   * The open state of the disclosure
   */
  isOpen: boolean
  /**
   * Opens the disclosure
   */
  open: () => void
  /**
   * Closes the disclosure
   */
  close: () => void
  /**
   * Toggles the open state of the disclosure
   */
  toggle: () => void
  /**
   * A unique ID for the disclosure target
   */
  id?: string
}

export interface DisclosureProps {
  /**
   * This creates a controlled disclosure component where the open state of the
   * disclosure is controlled by this property.
   */
  open?: boolean
  /**
   * This sets the default open state of the disclosure. By default the disclosure
   * is closed.
   * @default false
   */
  defaultOpen?: boolean
  /**
   * By default this component creates a unique id for you, as it is required
   * for certain aria attributes. Supplying an id here overrides the auto id feature.
   */
  id?: string
  /**
   * This callback is invoked any time the `open` state of the disclosure changes.
   */
  onChange?: (open: boolean) => void
  /**
   * By default this component creates a unique id for you, as it is required for
   * certain aria attributes. Supplying an id here overrides the auto id feature.
   */
  children: React.ReactNode
}

export interface UseA11yTriggerOptions {
  /**
   * Adds this class name to props when the disclosure is open
   */
  openClass?: string
  /**
   * Adds this class name to props when the disclosure is closed
   */
  closedClass?: string
  /**
   * Adds this style to props when the disclosure is open
   */
  openStyle?: React.CSSProperties
  /**
   * Adds this style to props when the disclosure is closed
   */
  closedStyle?: React.CSSProperties
  /**
   * Adds an onClick handler in addition to the default one that
   * toggles the disclosure's open state.
   */
  onClick?: (e: MouseEvent) => any
}

export interface TriggerProps extends Omit<UseA11yTriggerOptions, 'onClick'> {
  /**
   * The child is cloned by this component and has aria attributes injected
   * into its props as well as the events defined above.
   */
  children: JSX.Element | React.ReactElement
}

export interface UseA11yTargetOptions {
  /**
   * Adds this class name to props when the disclosure is open
   */
  openClass?: string
  /**
   * Adds this class name to props when the disclosure is closed
   */
  closedClass?: string
  /**
   * Adds this style to props when the disclosure is open
   */
  openStyle?: React.CSSProperties
  /**
   * Adds this style to props when the disclosure is closed
   */
  closedStyle?: React.CSSProperties
  /**
   * Prevents the `window` from scrolling when the target is
   * focused after opening.
   */
  preventScroll?: boolean
  /**
   * When `true`, this closes the target element when the `Escape`
   * key is pressed.
   * @default true
   */
  closeOnEscape?: boolean
}

export interface TargetProps extends UseA11yTargetOptions {
  /**
   * When `true` this will render the disclosure into a React portal with the
   * id `#portals`. You can render it into any portal by providing its query
   * selector here, e.g. `#foobar`, `[data-portal=true]`, or `.foobar`.
   * @default false
   */
  portal?:
    | boolean
    | undefined
    | null
    | string
    | Omit<PortalizeProps, 'children'>
  /**
   * The child is cloned by this component and has aria attributes injected into its
   * props as well events.
   */
  children: JSX.Element | React.ReactElement
}

export interface UseA11yCloseButtonOptions {
  /**
   * Adds an onClick handler in addition to the default one that
   * closes the disclosure.
   */
  onClick?: (e: MouseEvent) => any
}

export interface CloseButtonProps {
  /**
   * The child is cloned by this component and has aria attributes injected into its
   * props as well events.
   */
  children: JSX.Element | React.ReactElement
}

/* istanbul ignore next */
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
  Disclosure.displayName = 'Disclosure'
  Target.displayName = 'Target'
  Trigger.displayName = 'Trigger'
  CloseButton.displayName = 'CloseButton'
}
