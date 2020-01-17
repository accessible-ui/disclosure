/* jest */
import * as React from 'react'
import {renderHook} from '@testing-library/react-hooks'
import {render, fireEvent} from '@testing-library/react'
import {
  Disclosure,
  Trigger,
  Target,
  Close,
  useControls,
  useIsOpen,
  useDisclosure,
} from './index'

describe('<Disclosure>', () => {
  it('should have a custom id', () => {
    const result = render(
      <Disclosure id="foobar">
        <Target>
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    expect(result.asFragment()).toMatchSnapshot()
  })

  it('should provide context to function child', () => {
    let cxt

    render(
      <Disclosure>
        {context => {
          cxt = context
          return <div />
        }}
      </Disclosure>
    )

    expect(cxt).toMatchSnapshot()
  })

  it('should invoke onChange callback when open state changes', () => {
    const handleChange = jest.fn()

    const {getByTestId} = render(
      <Disclosure onChange={handleChange}>
        <Trigger>
          <button data-testid="btn">open me</button>
        </Trigger>
      </Disclosure>
    )

    expect(handleChange).not.toBeCalled()
    fireEvent.mouseDown(getByTestId('btn'))
    fireEvent.click(getByTestId('btn'))
    expect(handleChange).toBeCalledWith(true)
    fireEvent.mouseDown(getByTestId('btn'))
    fireEvent.click(getByTestId('btn'))
    expect(handleChange).toBeCalledWith(false)
  })
})

describe('<Target>', () => {
  it('should open and close on Trigger click', () => {
    const result = render(
      <Disclosure>
        <Target>
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    expect(result.asFragment()).toMatchSnapshot('closed initially')
    fireEvent.mouseDown(result.getByText('open me'))
    fireEvent.click(result.getByText('open me'))
    expect(result.asFragment()).toMatchSnapshot('open')
    fireEvent.mouseDown(result.getByText('open me'))
    fireEvent.click(result.getByText('open me'))
    expect(result.asFragment()).toMatchSnapshot('closed')
  })

  it('should close on escape key', () => {
    const result = render(
      <Disclosure>
        <Target>
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    expect(result.asFragment()).toMatchSnapshot('closed initially')
    fireEvent.mouseDown(result.getByText('open me'))
    fireEvent.click(result.getByText('open me'))
    expect(result.asFragment()).toMatchSnapshot('open')
    fireEvent.keyDown(result.getByText('Hello world'), {
      key: 'Escape',
      which: 27,
    })
    expect(result.asFragment()).toMatchSnapshot('closed')
  })

  it(`shouldn't close on escape key if prop is false`, () => {
    const result = render(
      <Disclosure>
        <Target closeOnEscape={false}>
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    expect(result.asFragment()).toMatchSnapshot('closed initially')
    fireEvent.mouseDown(result.getByText('open me'))
    fireEvent.click(result.getByText('open me'))
    expect(result.asFragment()).toMatchSnapshot('open')
    fireEvent.keyDown(result.getByText('Hello world'), {
      key: 'Escape',
      code: 27,
    })
    expect(result.asFragment()).toMatchSnapshot('still open')
  })

  it(`should assign to custom styles when opened or closed`, () => {
    const result = render(
      <Disclosure>
        <Target>
          <div style={{fontSize: '2rem'}}>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    expect(result.asFragment()).toMatchSnapshot()
    fireEvent.mouseDown(result.getByText('open me'))
    fireEvent.click(result.getByText('open me'))
    expect(result.asFragment()).toMatchSnapshot('open')
  })

  it(`should apply custom classname when opened or closed`, () => {
    const result = render(
      <Disclosure>
        <Target>
          <div className="custom">Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    expect(result.asFragment()).toMatchSnapshot()
    fireEvent.mouseDown(result.getByText('open me'))
    fireEvent.click(result.getByText('open me'))
    expect(result.asFragment()).toMatchSnapshot('open')
  })

  it(`should apply user defined openClass and closedClass`, () => {
    const result = render(
      <Disclosure>
        <Target closedClass="closed" openClass="open">
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    expect(result.asFragment()).toMatchSnapshot()
    fireEvent.mouseDown(result.getByText('open me'))
    fireEvent.click(result.getByText('open me'))
    expect(result.asFragment()).toMatchSnapshot('open')
  })

  it(`should apply user defined openStyle and closedStyle`, () => {
    const result = render(
      <Disclosure>
        <Target closedStyle={{display: 'none'}} openStyle={{display: 'block'}}>
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    expect(result.asFragment()).toMatchSnapshot()
    fireEvent.mouseDown(result.getByText('open me'))
    fireEvent.click(result.getByText('open me'))
    expect(result.asFragment()).toMatchSnapshot('open')
  })

  it(`should be initially open when defined as such`, () => {
    const result = render(
      <Disclosure defaultOpen>
        <Target>
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    expect(result.asFragment()).toMatchSnapshot('initially open')
    fireEvent.mouseDown(result.getByText('open me'))
    fireEvent.click(result.getByText('open me'))
    expect(result.asFragment()).toMatchSnapshot('closed')
  })

  it(`should act like a controlled component when 'open' prop is specified`, () => {
    const result = render(
      <Disclosure open>
        <Target>
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    expect(result.asFragment()).toMatchSnapshot('initially open')
    fireEvent.mouseDown(result.getByText('open me'))
    fireEvent.click(result.getByText('open me'))
    expect(result.asFragment()).toMatchSnapshot('still open')

    result.rerender(
      <Disclosure open={false}>
        <Target>
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    expect(result.asFragment()).toMatchSnapshot('closed')
    fireEvent.mouseDown(result.getByText('open me'))
    fireEvent.click(result.getByText('open me'))
    expect(result.asFragment()).toMatchSnapshot('still closed')
  })

  it('should render into a portal by default ID', () => {
    const portalRoot = document.createElement('div')
    portalRoot.setAttribute('id', 'portals')
    document.body.appendChild(portalRoot)

    const result = render(
      <Disclosure open>
        <Target portal>
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    fireEvent.mouseDown(result.getByText('open me'))
    fireEvent.click(result.getByText('open me'))
    expect(result.baseElement).toMatchSnapshot()
    document.body.removeChild(portalRoot)
  })

  it('should render into a portal by custom selector object', () => {
    const portalRoot = document.createElement('div')
    portalRoot.setAttribute('class', 'portals')
    document.body.appendChild(portalRoot)

    const result = render(
      <Disclosure open>
        <Target portal={{container: '.portals'}}>
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    fireEvent.mouseDown(result.getByText('open me'))
    fireEvent.click(result.getByText('open me'))
    expect(result.baseElement).toMatchSnapshot()
    document.body.removeChild(portalRoot)
  })

  it('should render into a portal by custom selector', () => {
    const portalRoot = document.createElement('div')
    portalRoot.setAttribute('class', 'portals')
    document.body.appendChild(portalRoot)

    const result = render(
      <Disclosure open>
        <Target portal=".portals">
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    fireEvent.mouseDown(result.getByText('open me'))
    fireEvent.click(result.getByText('open me'))
    expect(result.baseElement).toMatchSnapshot()
    document.body.removeChild(portalRoot)
  })
})

describe('<Trigger>', () => {
  it('should have openClass and closedClass', () => {
    const result = render(
      <Disclosure>
        <Target>
          <div>Hello world</div>
        </Target>

        <Trigger closedClass="closed" openClass="open">
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    expect(result.asFragment()).toMatchSnapshot()
    fireEvent.mouseDown(result.getByText('open me'))
    fireEvent.click(result.getByText('open me'))
    expect(result.asFragment()).toMatchSnapshot('open')
  })

  it('should have openStyle and closedStyle', () => {
    const result = render(
      <Disclosure>
        <Target>
          <div>Hello world</div>
        </Target>

        <Trigger closedStyle={{display: 'none'}} openStyle={{display: 'block'}}>
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    expect(result.asFragment()).toMatchSnapshot()
    fireEvent.mouseDown(result.getByText('open me'))
    fireEvent.click(result.getByText('open me'))
    expect(result.asFragment()).toMatchSnapshot('open')
  })

  it('should fire user-defined onClick handler', () => {
    const cb = jest.fn()
    const result = render(
      <Disclosure>
        <Target>
          <div>Hello world</div>
        </Target>

        <Trigger closedStyle={{display: 'none'}} openStyle={{display: 'block'}}>
          <button onClick={cb}>open me</button>
        </Trigger>
      </Disclosure>
    )

    fireEvent.click(result.getByText('open me'))
    expect(cb).toBeCalledTimes(0)
    fireEvent.mouseDown(result.getByText('open me'))
    fireEvent.click(result.getByText('open me'))
    expect(cb).toBeCalledTimes(1)
  })
})

describe('<Close>', () => {
  it('should close the modal', () => {
    const result = render(
      <Disclosure defaultOpen={true}>
        <Target>
          <div>
            <Close>
              <button data-testid="close">Close me</button>
            </Close>
            Hello world
          </div>
        </Target>

        <Trigger closedClass="closed" openClass="open">
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    expect(result.asFragment()).toMatchSnapshot()
    fireEvent.mouseDown(result.getByTestId('close'))
    fireEvent.click(result.getByTestId('close'))
    expect(result.asFragment()).toMatchSnapshot('closed')
  })

  it('should fire user-defined onClick handler', () => {
    const cb = jest.fn()
    const result = render(
      <Disclosure defaultOpen={true}>
        <Target>
          <div>
            <Close>
              <button onClick={cb} data-testid="close">
                Close me
              </button>
            </Close>
            Hello world
          </div>
        </Target>

        <Trigger closedClass="closed" openClass="open">
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    fireEvent.click(result.getByTestId('close'))
    expect(cb).toBeCalledTimes(0)
    fireEvent.mouseDown(result.getByTestId('close'))
    fireEvent.click(result.getByTestId('close'))
    expect(cb).toBeCalledTimes(1)
  })
})

describe('useControls()', () => {
  it('should have toggle, open, close keys', () => {
    const {result} = renderHook(() => useControls(), {wrapper: Disclosure})
    expect(Object.keys(result.current)).toStrictEqual([
      'open',
      'close',
      'toggle',
    ])
  })
})

describe('useIsOpen()', () => {
  it('should return boolean', () => {
    const {result} = renderHook(() => useIsOpen(), {wrapper: Disclosure})
    expect(typeof result.current).toBe('boolean')
  })
})

describe('useDisclosure()', () => {
  it('should return context', () => {
    const {result} = renderHook(() => useDisclosure(), {wrapper: Disclosure})
    expect(result.current).toMatchSnapshot()
  })
})
