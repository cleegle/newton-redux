// @author Chris Lee

// This class allows this.props to be accessed by classes that extend Module.
// It also will set the props passed into its constructor so that Modules may
// access this.props in their constructors.
export default class Module {
  constructor (props = {}) {
    this.props = props;
  }

  setProps (newProps) {
    this.props = newProps;
  }

  // This will be overriden by connect().
  unsubscribe () {
    console.error('newton-redux: You cannot unsubscribe from the store in your constructor.')
  }
}
