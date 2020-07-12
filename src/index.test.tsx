/* jest */
import * as React from 'react'
import {renderHook} from '@testing-library/react-hooks'
import {render, fireEvent, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Disclosure, Trigger, Target, CloseButton, useDisclosure} from './index'

describe('<Disclosure>', () => {
  it('should have a custom id', () => {
    render(
      <Disclosure id='foobar'>
        <Target>
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    expect(screen.getByText('Hello world')).toHaveAttribute('id', 'foobar')
  })

  it('should invoke onChange callback when open state changes', () => {
    const handleChange = jest.fn()

    render(
      <Disclosure onChange={handleChange}>
        <Trigger>
          <button data-testid='btn'>open me</button>
        </Trigger>
      </Disclosure>
    )

    expect(handleChange).not.toBeCalled()
    userEvent.click(screen.getByRole('button'))
    expect(handleChange).toBeCalledWith(true, false)
    userEvent.click(screen.getByRole('button'))
    expect(handleChange).toBeCalledWith(false, true)
  })
})

describe('<Target>', () => {
  it('should open and close on Trigger click', () => {
    render(
      <Disclosure>
        <Target>
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    expect(screen.getByText('Hello world')).toHaveAttribute(
      'aria-hidden',
      'true'
    )
    expect(screen.getByText('Hello world')).toHaveStyle({
      visibility: 'hidden',
    })

    userEvent.click(screen.getByRole('button'))
    expect(screen.getByText('Hello world')).toHaveAttribute(
      'aria-hidden',
      'false'
    )
    expect(screen.getByText('Hello world')).toHaveStyle({
      visibility: 'visible',
    })

    userEvent.click(screen.getByRole('button'))
    expect(screen.getByText('Hello world')).toHaveAttribute(
      'aria-hidden',
      'true'
    )
    expect(screen.getByText('Hello world')).toHaveStyle({
      visibility: 'hidden',
    })
  })

  it('should close on escape key', () => {
    render(
      <Disclosure defaultOpen>
        <Target>
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    expect(screen.getByText('Hello world')).toHaveAttribute(
      'aria-hidden',
      'false'
    )

    fireEvent.keyDown(screen.getByText('Hello world'), {
      key: 'Escape',
      which: 27,
    })
    expect(screen.getByText('Hello world')).toHaveAttribute(
      'aria-hidden',
      'true'
    )
  })

  it(`shouldn't close on escape key if prop is false`, () => {
    render(
      <Disclosure defaultOpen>
        <Target closeOnEscape={false}>
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    fireEvent.keyDown(screen.getByText('Hello world'), {
      key: 'Escape',
      code: 27,
    })
    expect(screen.getByText('Hello world')).toHaveAttribute(
      'aria-hidden',
      'false'
    )
  })

  it(`should assign to custom styles when opened or closed`, () => {
    render(
      <Disclosure>
        <Target>
          <div style={{fontSize: '2rem'}}>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    expect(screen.getByText('Hello world')).toHaveStyle({fontSize: '2rem'})
    userEvent.click(screen.getByRole('button'))
    expect(screen.getByText('Hello world')).toHaveStyle({fontSize: '2rem'})
  })

  it(`should apply custom classname when opened or closed`, () => {
    render(
      <Disclosure>
        <Target>
          <div className='custom'>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    expect(screen.getByText('Hello world')).toHaveClass('custom')
    userEvent.click(screen.getByRole('button'))
    expect(screen.getByText('Hello world')).toHaveClass('custom')
  })

  it(`should apply user defined openClass and closedClass`, () => {
    render(
      <Disclosure>
        <Target closedClass='closed' openClass='open'>
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    expect(screen.getByText('Hello world')).toHaveClass('closed')
    expect(screen.getByText('Hello world')).not.toHaveClass('open')
    userEvent.click(screen.getByRole('button'))
    expect(screen.getByText('Hello world')).not.toHaveClass('closed')
    expect(screen.getByText('Hello world')).toHaveClass('open')
  })

  it(`should apply user defined openStyle and closedStyle`, () => {
    render(
      <Disclosure>
        <Target closedStyle={{display: 'none'}} openStyle={{display: 'block'}}>
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    expect(screen.getByText('Hello world')).toHaveStyle({display: 'none'})
    expect(screen.getByText('Hello world')).not.toHaveStyle({display: 'block'})
    userEvent.click(screen.getByRole('button'))
    expect(screen.getByText('Hello world')).not.toHaveStyle({display: 'none'})
    expect(screen.getByText('Hello world')).toHaveStyle({display: 'block'})
  })

  it(`should be initially open when defined as such`, () => {
    render(
      <Disclosure defaultOpen>
        <Target>
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    expect(screen.getByText('Hello world')).toHaveAttribute(
      'aria-hidden',
      'false'
    )
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

    expect(screen.getByText('Hello world')).toHaveAttribute(
      'aria-hidden',
      'false'
    )

    userEvent.click(screen.getByRole('button'))
    expect(screen.getByText('Hello world')).toHaveAttribute(
      'aria-hidden',
      'false'
    )

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

    expect(screen.getByText('Hello world')).toHaveAttribute(
      'aria-hidden',
      'true'
    )
  })

  it('should render into a portal by default ID', () => {
    const portalRoot = document.createElement('div')
    portalRoot.setAttribute('id', 'portals')
    document.body.appendChild(portalRoot)

    render(
      <Disclosure open>
        <Target portal>
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    userEvent.click(screen.getByRole('button'))
    expect(screen.getByText('Hello world').parentNode).toHaveAttribute(
      'id',
      'portals'
    )
    document.body.removeChild(portalRoot)
  })

  it('should render into a portal by custom selector object', () => {
    const portalRoot = document.createElement('div')
    portalRoot.setAttribute('class', 'portals')
    document.body.appendChild(portalRoot)

    render(
      <Disclosure open>
        <Target portal={{container: '.portals'}}>
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    userEvent.click(screen.getByRole('button'))
    expect(screen.getByText('Hello world').parentNode).toHaveClass('portals')
    document.body.removeChild(portalRoot)
  })

  it('should render into a portal by custom selector', () => {
    const portalRoot = document.createElement('div')
    portalRoot.setAttribute('class', 'portals')
    document.body.appendChild(portalRoot)

    render(
      <Disclosure open>
        <Target portal='.portals'>
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    userEvent.click(screen.getByRole('button'))
    expect(screen.getByText('Hello world').parentNode).toHaveClass('portals')
    document.body.removeChild(portalRoot)
  })
})

describe('<Trigger>', () => {
  it('should have correct aria-controls prop', () => {
    render(
      <Disclosure id='test'>
        <Target>
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    expect(screen.getByRole('button')).toHaveAttribute('aria-controls', 'test')
  })

  it('should have correct aria-expanded prop', () => {
    render(
      <Disclosure>
        <Target>
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false')
    userEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true')
  })

  it('should have openClass and closedClass', () => {
    render(
      <Disclosure>
        <Target>
          <div>Hello world</div>
        </Target>

        <Trigger closedClass='closed' openClass='open'>
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    expect(screen.getByRole('button')).toHaveClass('closed')
    expect(screen.getByRole('button')).not.toHaveClass('open')
    userEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('button')).not.toHaveClass('closed')
    expect(screen.getByRole('button')).toHaveClass('open')
  })

  it('should have openStyle and closedStyle', () => {
    render(
      <Disclosure>
        <Target>
          <div>Hello world</div>
        </Target>

        <Trigger closedStyle={{display: 'flex'}} openStyle={{display: 'block'}}>
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    expect(screen.getByRole('button')).toHaveStyle({display: 'flex'})
    expect(screen.getByRole('button')).not.toHaveStyle({display: 'block'})
    userEvent.click(screen.getByText('open me'))
    expect(screen.getByRole('button')).not.toHaveStyle({display: 'flex'})
    expect(screen.getByRole('button')).toHaveStyle({display: 'block'})
  })

  it('should fire user-defined onClick handler', () => {
    const cb = jest.fn()
    render(
      <Disclosure>
        <Target>
          <div>Hello world</div>
        </Target>

        <Trigger>
          <button onClick={cb}>open me</button>
        </Trigger>
      </Disclosure>
    )

    userEvent.click(screen.getByRole('button'))
    expect(cb).toBeCalledTimes(1)
  })
})

describe('<CloseButton>', () => {
  it('should have correct aria-controls prop', () => {
    render(
      <Disclosure id='test'>
        <Target>
          <div>
            <CloseButton>
              <button data-testid='close' aria-label='close me'>
                Close me
              </button>
            </CloseButton>
            Hello world
          </div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    expect(screen.getByText('Close me')).toHaveAttribute(
      'aria-controls',
      'test'
    )
  })

  it('should have correct aria-expanded prop', () => {
    render(
      <Disclosure defaultOpen>
        <Target>
          <div>
            <CloseButton>
              <button data-testid='close' aria-label='close me'>
                Close me
              </button>
            </CloseButton>
            Hello world
          </div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    expect(screen.getByText('open me')).toHaveAttribute('aria-expanded', 'true')
    userEvent.click(screen.getByTestId('close'))
    expect(screen.getByText('open me')).toHaveAttribute(
      'aria-expanded',
      'false'
    )
  })

  it('should override the aria label', () => {
    render(
      <Disclosure defaultOpen={true}>
        <Target>
          <div>
            <CloseButton>
              <button data-testid='close' aria-label='close me'>
                Close me
              </button>
            </CloseButton>
            Hello world
          </div>
        </Target>
      </Disclosure>
    )

    expect(screen.getByText('Close me')).toHaveAttribute(
      'aria-label',
      'close me'
    )
  })

  it('should close the target', () => {
    render(
      <Disclosure defaultOpen>
        <Target>
          <div data-testid='target'>
            <CloseButton>
              <button data-testid='close'>Close me</button>
            </CloseButton>
            Hello world
          </div>
        </Target>

        <Trigger>
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    expect(screen.getByTestId('target')).toHaveAttribute('aria-hidden', 'false')
    userEvent.click(screen.getByTestId('close'))
    expect(screen.getByTestId('target')).toHaveAttribute('aria-hidden', 'true')
  })

  it('should fire user-defined onClick handler', () => {
    const cb = jest.fn()
    render(
      <Disclosure defaultOpen={true}>
        <Target>
          <div>
            <CloseButton>
              <button onClick={cb} data-testid='close'>
                Close me
              </button>
            </CloseButton>
            Hello world
          </div>
        </Target>

        <Trigger closedClass='closed' openClass='open'>
          <button>open me</button>
        </Trigger>
      </Disclosure>
    )

    userEvent.click(screen.getByTestId('close'))
    expect(cb).toBeCalledTimes(1)
  })
})

describe('useDisclosure()', () => {
  it('should return context', () => {
    const {result} = renderHook(() => useDisclosure(), {wrapper: Disclosure})
    expect(typeof result.current.close).toBe('function')
    expect(typeof result.current.open).toBe('function')
    expect(typeof result.current.toggle).toBe('function')
    expect(typeof result.current.isOpen).toBe('boolean')
    expect(typeof result.current.id).toBe('string')
    expect(Object.keys(result.current).sort()).toEqual(
      ['close', 'open', 'toggle', 'isOpen', 'id'].sort()
    )
  })
})
