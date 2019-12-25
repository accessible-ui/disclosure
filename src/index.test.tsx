/* jest */
import * as React from 'react'
import {renderHook} from '@testing-library/react-hooks'
import {render, fireEvent} from '@testing-library/react'
import {
  Collapse,
  Trigger,
  Target,
  Close,
  useControls,
  useIsOpen,
  useCollapse,
} from './index'

describe('<Collapse>', () => {
  it('should have a custom id', () => {
    const result = render(
      <Collapse id="foobar">
        <Target>
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Collapse>
    )

    expect(result.asFragment()).toMatchSnapshot()
  })

  it('should provide context to function child', () => {
    let cxt

    render(
      <Collapse>
        {context => {
          cxt = context
          return <div />
        }}
      </Collapse>
    )

    expect(cxt).toMatchSnapshot()
  })
})

describe('<Target>', () => {
  it('should open and close on Trigger click', () => {
    const result = render(
      <Collapse>
        <Target>
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Collapse>
    )

    expect(result.asFragment()).toMatchSnapshot('closed initially')
    fireEvent.click(result.getByText('open me'))
    expect(result.asFragment()).toMatchSnapshot('open')
    fireEvent.click(result.getByText('open me'))
    expect(result.asFragment()).toMatchSnapshot('closed')
  })

  it('should close on escape key', () => {
    const result = render(
      <Collapse>
        <Target>
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Collapse>
    )

    expect(result.asFragment()).toMatchSnapshot('closed initially')
    fireEvent.click(result.getByText('open me'))
    expect(result.asFragment()).toMatchSnapshot('open')
    fireEvent.keyUp(result.getByText('Hello world'), {key: 'Escape', which: 27})
    expect(result.asFragment()).toMatchSnapshot('closed')
  })

  it(`shouldn't close on escape key if prop is false`, () => {
    const result = render(
      <Collapse>
        <Target closeOnEscape={false}>
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Collapse>
    )

    expect(result.asFragment()).toMatchSnapshot('closed initially')
    fireEvent.click(result.getByText('open me'))
    expect(result.asFragment()).toMatchSnapshot('open')
    fireEvent.keyUp(result.getByText('Hello world'), {key: 'Escape', code: 27})
    expect(result.asFragment()).toMatchSnapshot('still open')
  })

  it(`should assign to custom styles when opened or closed`, () => {
    const result = render(
      <Collapse>
        <Target>
          <div style={{fontSize: '2rem'}}>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Collapse>
    )

    expect(result.asFragment()).toMatchSnapshot()
    fireEvent.click(result.getByText('open me'))
    expect(result.asFragment()).toMatchSnapshot('open')
  })

  it(`should apply custom classname when opened or closed`, () => {
    const result = render(
      <Collapse>
        <Target>
          <div className="custom">Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Collapse>
    )

    expect(result.asFragment()).toMatchSnapshot()
    fireEvent.click(result.getByText('open me'))
    expect(result.asFragment()).toMatchSnapshot('open')
  })

  it(`should apply user defined openClass and closedClass`, () => {
    const result = render(
      <Collapse>
        <Target closedClass="closed" openClass="open">
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Collapse>
    )

    expect(result.asFragment()).toMatchSnapshot()
    fireEvent.click(result.getByText('open me'))
    expect(result.asFragment()).toMatchSnapshot('open')
  })

  it(`should apply user defined openStyle and closedStyle`, () => {
    const result = render(
      <Collapse>
        <Target closedStyle={{display: 'none'}} openStyle={{display: 'block'}}>
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Collapse>
    )

    expect(result.asFragment()).toMatchSnapshot()
    fireEvent.click(result.getByText('open me'))
    expect(result.asFragment()).toMatchSnapshot('open')
  })

  it(`should be initially open when defined as such`, () => {
    const result = render(
      <Collapse defaultOpen>
        <Target>
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Collapse>
    )

    expect(result.asFragment()).toMatchSnapshot('initially open')
    fireEvent.click(result.getByText('open me'))
    expect(result.asFragment()).toMatchSnapshot('closed')
  })

  it(`should act like a controlled component when 'open' prop is specified`, () => {
    const result = render(
      <Collapse open>
        <Target>
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Collapse>
    )

    expect(result.asFragment()).toMatchSnapshot('initially open')
    fireEvent.click(result.getByText('open me'))
    expect(result.asFragment()).toMatchSnapshot('still open')

    result.rerender(
      <Collapse open={false}>
        <Target>
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Collapse>
    )

    expect(result.asFragment()).toMatchSnapshot('closed')
    fireEvent.click(result.getByText('open me'))
    expect(result.asFragment()).toMatchSnapshot('still closed')
  })

  it('should render into a portal by default ID', () => {
    const portalRoot = document.createElement('div')
    portalRoot.setAttribute('id', 'portals')
    document.body.appendChild(portalRoot)

    const result = render(
      <Collapse open>
        <Target portal>
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Collapse>
    )

    fireEvent.click(result.getByText('open me'))
    expect(result.baseElement).toMatchSnapshot()
    document.body.removeChild(portalRoot)
  })

  it('should render into a portal by custom selector object', () => {
    const portalRoot = document.createElement('div')
    portalRoot.setAttribute('class', 'portals')
    document.body.appendChild(portalRoot)

    const result = render(
      <Collapse open>
        <Target portal={{container: '.portals'}}>
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Collapse>
    )

    fireEvent.click(result.getByText('open me'))
    expect(result.baseElement).toMatchSnapshot()
    document.body.removeChild(portalRoot)
  })

  it('should render into a portal by custom selector', () => {
    const portalRoot = document.createElement('div')
    portalRoot.setAttribute('class', 'portals')
    document.body.appendChild(portalRoot)

    const result = render(
      <Collapse open>
        <Target portal=".portals">
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Collapse>
    )

    fireEvent.click(result.getByText('open me'))
    expect(result.baseElement).toMatchSnapshot()
    document.body.removeChild(portalRoot)
  })
})

describe('<Trigger>', () => {
  it('should have openClass and closedClass', () => {
    const result = render(
      <Collapse>
        <Target>
          <div>Hello world</div>
        </Target>

        <Trigger closedClass="closed" openClass="open">
          <button>open me</button>
        </Trigger>
      </Collapse>
    )

    expect(result.asFragment()).toMatchSnapshot()
    fireEvent.click(result.getByText('open me'))
    expect(result.asFragment()).toMatchSnapshot('open')
  })

  it('should have openStyle and closedStyle', () => {
    const result = render(
      <Collapse>
        <Target>
          <div>Hello world</div>
        </Target>

        <Trigger closedStyle={{display: 'none'}} openStyle={{display: 'block'}}>
          <button>open me</button>
        </Trigger>
      </Collapse>
    )

    expect(result.asFragment()).toMatchSnapshot()
    fireEvent.click(result.getByText('open me'))
    expect(result.asFragment()).toMatchSnapshot('open')
  })
})

describe('<Close>', () => {
  it('should close the modal', () => {
    const result = render(
      <Collapse defaultOpen={true}>
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
      </Collapse>
    )

    expect(result.asFragment()).toMatchSnapshot()
    fireEvent.click(result.getByTestId('close'))
    expect(result.asFragment()).toMatchSnapshot('closed')
  })
})

describe('useControls()', () => {
  it('should have toggle, open, close keys', () => {
    const {result} = renderHook(() => useControls(), {wrapper: Collapse})
    expect(Object.keys(result.current)).toStrictEqual([
      'open',
      'close',
      'toggle',
    ])
  })
})

describe('useIsOpen()', () => {
  it('should return boolean', () => {
    const {result} = renderHook(() => useIsOpen(), {wrapper: Collapse})
    expect(typeof result.current).toBe('boolean')
  })
})

describe('useCollapse()', () => {
  it('should return context', () => {
    const {result} = renderHook(() => useCollapse(), {wrapper: Collapse})
    expect(result.current).toMatchSnapshot()
  })
})
