import React from 'react'
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
export declare const DisclosureContext: React.Context<DisclosureContextValue>,
  DisclosureConsumer: React.Consumer<DisclosureContextValue>,
  useDisclosure: () => DisclosureContextValue,
  useIsOpen: () => boolean,
  useControls: () => DisclosureControls
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
export declare const Disclosure: React.FC<DisclosureProps>
export interface TargetProps {
  portal?: boolean | undefined | null | string | Record<any, any>
  closeOnEscape?: boolean
  openClass?: string
  closedClass?: string
  openStyle?: React.CSSProperties
  closedStyle?: React.CSSProperties
  preventScroll?: boolean
  children: JSX.Element | React.ReactElement
}
export declare const Target: React.FC<TargetProps>
export interface CloseProps {
  children: JSX.Element | React.ReactElement
}
export declare const Close: React.FC<CloseProps>
export interface TriggerProps {
  openClass?: string
  closedClass?: string
  openStyle?: React.CSSProperties
  closedStyle?: React.CSSProperties
  children: JSX.Element | React.ReactElement
}
export declare const Trigger: React.FC<TriggerProps>
