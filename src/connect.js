// @author Chris Lee

import isEqual from 'lodash/isEqual';

// The wrapped component is able to:
// 1) React to state changes that it cares about
// 2) Dispatch actions to update the redux state of the app
// NOTE: Similar to React, it is important to not dispatch actions
// from the constructor of the component despite having access to the props
// in the constructor.
export default function connect (
  mapStateToProps = state => ({ state }),
  mapDispatchToProps = dispatch => ({ dispatch })
) {
  // This function when called will return a connected Module class.
  // The Connect class wraps the Module and allows it to subscribe to updates
  // from the store and listen to changes on pieces of state that it cares
  // about.
  return (Module) => {
    return class Connect {

      constructor (store) {
        this.store = store;
        this.currentState = mapStateToProps(this.store.getState());
        this.actionDispatchers = mapDispatchToProps(this.store.dispatch);
        this.instance = new Module(this.getProps());

        // Now subscribe this instance to the store
        this.subscribe();
      }

      subscribe () {
        this._unsubscribe = this.store.subscribe(this.handleChange.bind(this));

        this.instance.unsubscribe = this.unsubscribe.bind(this);
      }

      unsubscribe () {
        if (this._unsubscribe) {
          this._unsubscribe();
          this._unsubscribe = null;
        }
      }

      // Loop through each key in newState and compare its value to the
      // corresponding value in this.currentState. Build the changeMap object
      // with a hasChanged key and previousValue key and call
      // setModuleProps if any piece of the state has changed.
      handleChange () {
        const newState = mapStateToProps(this.store.getState());
        const changeMap = {};
        let stateChangeOccurred = false;

        Object.keys(newState).forEach(key => {
          if (!isEqual(this.currentState[key], newState[key])) {
            stateChangeOccurred = true;
            changeMap[key] = {
              hasChanged: true,
              previousValue: this.currentState[key]
            };
          } else {
            changeMap[key] = {
              hasChanged: false,
              previousValue: this.currentState[key]
            };
          }
        });

        // If a state change has occurred we need to update the currentState
        // and the changeMap before calling setModuleProps
        if (stateChangeOccurred) {
          this.currentState = newState;
          this.changeMap = changeMap;
          this.setModuleProps();
        }
      }

      // Sets the props on the instance and passes in the changeMap
      // to the call to onChange
      setModuleProps () {
        this.instance.setProps(this.getProps());
        if(this.instance.onChange) {
          if(typeof this.instance.onChange === "function") {
            this.instance.onChange(this.changeMap);
          } else {
            throw new Error(`newton-redux-reborn: If you have an onChange property on your class, it must be a function.
            Your onChange property is of type ${typeof this.instance.onChange}.`)
          }
        }
      }

      getProps () {
        return {
          ...this.currentState,
          ...this.actionDispatchers
        };
      }
    };
  };
}
