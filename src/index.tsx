import React, {
  cloneElement,
  useRef,
  useMemo,
  useCallback,
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

export interface CollapseContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  id?: string
}

export interface CollapseControls {
  open: () => void
  close: () => void
  toggle: () => void
}

// @ts-ignore
export const CollapseContext: React.Context<CollapseContextValue> = React.createContext(
    {}
  ),
  {Consumer: CollapseConsumer} = CollapseContext,
  useCollapse = () => useContext<CollapseContextValue>(CollapseContext),
  useIsOpen = () => useCollapse().isOpen,
  useControls = (): CollapseControls => {
    const {open, close, toggle} = useCollapse()
    return {open, close, toggle}
  }

export interface CollapseProps {
  open?: boolean
  defaultOpen?: boolean
  id?: string
  children:
    | React.ReactNode
    | React.ReactNode[]
    | JSX.Element[]
    | JSX.Element
    | ((context: CollapseContextValue) => React.ReactNode)
}

export const Collapse: React.FC<CollapseProps> = ({
  id,
  open,
  defaultOpen,
  children,
}) => {
  // eslint-disable-next-line prefer-const
  let [isOpen, toggle] = useSwitch(defaultOpen)
  isOpen = open === void 0 || open === null ? isOpen : open
  id = useId(id)
  const context = useMemo(
    () => ({
      id,
      open: toggle.on,
      close: toggle.off,
      toggle,
      isOpen,
    }),
    [id, isOpen, toggle.on, toggle.off, toggle]
  )

  return (
    <CollapseContext.Provider
      value={context}
      // @ts-ignore
      children={typeof children === 'function' ? children(context) : children}
    />
  )
}

const portalize = (
  Component,
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
  children: React.ReactElement
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
  const {id, isOpen, close} = useCollapse()
  const prevOpen = useRef<boolean>(isOpen)
  const ref = useMergedRef(
    // @ts-ignore
    children.ref,
    // provides the target focus when it is in a new open state
    useConditionalFocus(!prevOpen.current && isOpen, true),
    // handles closing the modal when the ESC key is pressed
    useKeycodes({27: () => closeOnEscape && close()}, [closeOnEscape, close])
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
  const {close, isOpen, id} = useCollapse()
  return (
    <Button>
      {cloneElement(children, {
        'aria-controls': id,
        'aria-expanded': String(isOpen),
        'aria-label': children.props.hasOwnProperty('aria-label')
          ? children.props['aria-label']
          : 'Close',
        onClick:
          typeof children.props.onClick === 'function'
            ? useCallback(
                e => {
                  close()
                  children.props.onClick?.(e)
                },
                [children.props.onClick, close]
              )
            : close,
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
  const {isOpen, id, toggle} = useCollapse()
  const prevOpen = useRef<boolean>(isOpen)
  const ref = useMergedRef(
    // @ts-ignore
    children.ref,
    useConditionalFocus(prevOpen.current && !isOpen, true)
  )

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
        onClick:
          typeof children.props.onClick === 'function'
            ? e => {
                toggle()
                children.props.onClick(e)
              }
            : toggle,
        ref,
      })}
    </Button>
  )
}

/* istanbul ignore next */
if (__DEV__) {
  Collapse.displayName = 'Collapse'
  Target.displayName = 'Target'
  Trigger.displayName = 'Trigger'
  Close.displayName = 'Close'
}
