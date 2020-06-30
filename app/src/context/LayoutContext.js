/* eslint-disable react/no-unused-state */
import React, { useContext } from 'react'
import { node } from 'prop-types'

const LayoutContext = React.createContext()

class LayoutProvider extends React.PureComponent {
  static propTypes = {
    children: node.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      mobileDrawerOpen: false,
    }
  }

  setMobileDrawerOpen = (mobileDrawerOpen) => {
    this.setState({
      mobileDrawerOpen,
    })
  }

  toggleMobileDrawerOpen = () => {
    this.setState(({ mobileDrawerOpen }) => ({
      mobileDrawerOpen: !mobileDrawerOpen,
    }))
  }

  render() {
    const { children } = this.props

    return (
      <LayoutContext.Provider
        value={{
          ...this.state,
          setMobileDrawerOpen: this.setMobileDrawerOpen,
          toggleMobileDrawerOpen: this.toggleMobileDrawerOpen,
        }}
      >
        {children}
      </LayoutContext.Provider>
    )
  }
}

const withLayoutContext = (Comp) => (props) => (
  <LayoutContext.Consumer>
    {(newProps) => <Comp {...props} {...newProps} />}
  </LayoutContext.Consumer>
)

const { Consumer } = LayoutContext

const useLayoutContext = () => {
  const layoutContext = useContext(LayoutContext)
  return layoutContext
}

export {
  LayoutProvider,
  Consumer as LayoutConsumer,
  withLayoutContext,
  useLayoutContext,
}
