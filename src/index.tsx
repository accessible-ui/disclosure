import React, {
  cloneElement,
  useRef,
  useMemo,
  useCallback,
  useEffect,
  useContext,
} from 'react'
import {useKeycodes} from '@accessible/use-keycode'
import useConditionalFocus from '@accessible/use-conditional-focus'
import useSwitch from '@react-hook/switch'
import useMergedRef from '@react-hook/merged-ref'
import useLayoutEffect from '@react-hook/passive-layout-effect'
import useId from '@accessible/use-id'
import Button from '@accessible/button'
import Portalize from 'react-portalize'
import clsx from 'clsx'

const __DEV__ =
  typeof process !== 'undefined' && process.env.NODE_ENV !== 'production'

export interface DisclosureContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  id?: string
}

export interface DisclosureControls {
  open: () => void
  close: () => void
  toggle: () => void
}

const noop = () => {}
export const DisclosureContext = React.createContext<DisclosureContextValue>({
    isOpen: false,
    open: noop,
    close: noop,
    toggle: noop,
  }),
  {Consumer: DisclosureConsumer} = DisclosureContext,
  useDisclosure = () => useContext<DisclosureContextValue>(DisclosureContext),
  useIsOpen = () => useDisclosure().isOpen,
  useControls = (): DisclosureControls => {
    const {open, close, toggle} = useDisclosure()
    return {open, close, toggle}
  }

export interface DisclosureProps {
  open?: boolean
  defaultOpen?: boolean
  id?: string
  onChange?: (open: boolean) => void
  children:
    | React.ReactNode
    | React.ReactNode[]
    | JSX.Element[]
    | JSX.Element
    | ((context: DisclosureContextValue) => React.ReactNode)
}

export const Disclosure: React.FC<DisclosureProps> = ({
  id,
  open,
  defaultOpen,
  onChange,
  children,
}) => {
  // eslint-disable-next-line prefer-const
  let [isOpen, toggle] = useSwitch(defaultOpen)
  const prevOpen = useRef(isOpen)
  const storedOnChange = useRef(onChange)
  id = useId(id)

  useEffect(() => {
    if (isOpen !== prevOpen.current) storedOnChange.current?.(isOpen)
    prevOpen.current = isOpen
  }, [isOpen])

  const context = useMemo(
    () => ({
      id,
      open: toggle.on,
      close: toggle.off,
      toggle,
      isOpen: open === void 0 || open === null ? isOpen : open,
    }),
    [id, open, isOpen, toggle]
  )

  return (
    <DisclosureContext.Provider
      value={context}
      // @ts-ignore
      children={typeof children === 'function' ? children(context) : children}
    />
  )
}

const portalize = (
  Component: React.ReactElement,
  portal: boolean | undefined | null | string | Record<any, any>
) => {
  if (portal === false || portal === void 0 || portal === null) return Component
  const props: Record<string, any> = {children: Component}
  if (typeof portal === 'string') props.container = portal
  else Object.assign(props, portal)
  return React.createElement(Portalize, props)
}

export interface TargetProps {
  portal?: boolean | undefined | null | string | Record<any, any>
  closeOnEscape?: boolean
  openClass?: string
  closedClass?: string
  openStyle?: React.CSSProperties
  closedStyle?: React.CSSProperties
  children: JSX.Element | React.ReactElement
}

export const Target: React.FC<TargetProps> = ({
  closeOnEscape = true,
  portal,
  openClass,
  closedClass,
  openStyle,
  closedStyle,
  children,
}) => {
  const {id, isOpen, close} = useDisclosure()
  const prevOpen = useRef<boolean>(isOpen)
  const ref = useMergedRef(
    // @ts-ignore
    children.ref,
    // provides the target focus when it is in a new open state
    useConditionalFocus(!prevOpen.current && isOpen, {includeRoot: true}),
    // handles closing the modal when the ESC key is pressed
    useKeycodes({27: () => closeOnEscape && close()})
  )

  useLayoutEffect(() => {
    prevOpen.current = isOpen
  }, [isOpen])

  return portalize(
    cloneElement(children, {
      'aria-hidden': `${!isOpen}`,
      id,
      className:
        clsx(children.props.className, isOpen ? openClass : closedClass) ||
        void 0,
      style: Object.assign(
        {visibility: isOpen ? 'visible' : 'hidden'},
        children.props.style,
        isOpen ? openStyle : closedStyle
      ),
      ref,
    }),
    portal
  )
}

export interface CloseProps {
  children: JSX.Element | React.ReactElement
}

export const Close: React.FC<CloseProps> = ({children}) => {
  const {close, isOpen, id} = useDisclosure()
  const storedOnClick = useRef(children.props.onClick)
  storedOnClick.current = children.props.onClick

  return (
    <Button>
      {cloneElement(children, {
        'aria-controls': id,
        'aria-expanded': String(isOpen),
        'aria-label': children.props.hasOwnProperty('aria-label')
          ? children.props['aria-label']
          : 'Close',
        onClick: useCallback(
          (e: MouseEvent) => {
            close()
            storedOnClick.current?.(e)
          },
          [close]
        ),
      })}
    </Button>
  )
}

export interface TriggerProps {
  openClass?: string
  closedClass?: string
  openStyle?: React.CSSProperties
  closedStyle?: React.CSSProperties
  children: JSX.Element | React.ReactElement
}

export const Trigger: React.FC<TriggerProps> = ({
  openClass,
  closedClass,
  openStyle,
  closedStyle,
  children,
}) => {
  const {isOpen, id, toggle} = useDisclosure()
  const prevOpen = useRef<boolean>(isOpen)
  const ref = useMergedRef(
    // @ts-ignore
    children.ref,
    useConditionalFocus(prevOpen.current && !isOpen, true)
  )
  const storedOnClick = useRef(children.props.onClick)
  storedOnClick.current = children.props.onClick

  useLayoutEffect(() => {
    prevOpen.current = isOpen
  }, [isOpen])

  return (
    <Button>
      {cloneElement(children, {
        'aria-controls': id,
        'aria-expanded': String(isOpen),
        className:
          clsx(children.props.className, isOpen ? openClass : closedClass) ||
          void 0,
        style: Object.assign(
          {},
          children.props.style,
          isOpen ? openStyle : closedStyle
        ),
        onClick: useCallback(
          (e: MouseEvent) => {
            toggle()
            storedOnClick.current?.(e)
          },
          [toggle]
        ),
        ref,
      })}
    </Button>
  )
}

/* istanbul ignore next */
if (__DEV__) {
  Disclosure.displayName = 'Disclosure'
  Target.displayName = 'Target'
  Trigger.displayName = 'Trigger'
  Close.displayName = 'Close'
}
