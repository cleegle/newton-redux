# Newton Redux Reborn

A simple utility to connect plain JavaScript classes to redux.

A maintained fork of [cleegle/newton-redux](https://github.com/cleegle/newton-redux).

## Introduction

Inspired by [`react-redux`](https://github.com/reactjs/react-redux), Newton Redux allows you to connect plain JavaScript classes to a redux store. It will feel similar to writing a React component but without rendering a UI. This utility is essentially a wrapper around `store.subscribe()` method provided by [`redux`](https://github.com/reactjs/redux). `store.subscribe()` is very low level and will simply invoke a callback whenever the store changes forcing you to write your own state selection and comparison logic. Newton Redux does all this for you with a familiar `connect` function. Also provided is a very simple `Module` class that allows you to set `props` on your class similar to the `Component` class in React. This utility borrows the necessary parts of `react` and `react-redux` to create reactive modules connected to a redux store.

## Install

```
npm install --save newton-redux-reborn
```

or

```
yarn add newton-redux-reborn
```

## Usage

A Newton Redux module looks like the following.

```js
import { Module, connect } from 'newton-redux-reborn';
import { setWomp } from './actions/user';

class User extends Module {
  constructor (props) {
    // call super(props) to use this.props in constructor
    super(props);

    console.log(this.props.womp);
  }

  // onChange is called whenever a key in mapStateToProps changes in the redux store
  onChange () {
    this.test();
  }

  test () {
    // property of the redux store
    console.log(this.props.womp);

    // dispatch action
    this.props.setWomp('doo');
  }
}

function mapStateToProps (state) {
  return {
    womp: state.womp
  };
}

function mapDispatchToProps (dispatch) {
  return {
    setWomp: (womp) => {
      dispatch(setWomp(womp));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User);
```

And can be imported and used like this:

```js
import createStore from './store';
import User from './User';
import { setWomp } from './actions/user';

// Create the store
const store = createStore();

// Instantiate store connected modules
new User(store);

// Dispatch actions and watch your Newton Redux modules react!
store.dispatch(setWomp('diggity'));
```

The steps to creating a Newton Redux module are:
1. Import `connect` and `Module` from `newton-redux`
2. Create a JavaScript class that extends `Module`
3. Define a `mapStateToProps` function which will receive the redux `state` and return an object with the keys you would like to find on `props`. Optionally, you may also define a `mapDispatchToProps` function which will receive `dispatch` from redux. It should return an object with keys whose values are functions that dispatch actions. You may then dispatch actions from your modules by calling the functions put on props under those keys. If `mapDispatchToProps` is `undefined` then, `dispatch` will be put onto props and you may still import actions and dispatch them. However, `mapDispatchToProps` here is useful for explicitness.
4. Define an `onChange` method in your class. This method will be called whenever the state that you have specified in `mapStateToProps` changes.
5. Define any other methods that you class needs.
6. Export the result of calling `connect`, passing in first `mapStateToProps` and `mapDispatchToProps` and then the class which you have defined.

### Handling Changes with Multiple Pieces of State

If you are listening to multiple pieces of state but you only want action to be taken when a specific piece of state changes, you may access the `changeMap` which is passed in to `onChange` on every call. The `changeMap` consists of an object with the same keys that you defined in `mapStateToProps`. `hasChanged` is a boolean that lets you know if that particular key has changed. You may also access the `previousValue` of that piece of state. The `changeMap` and how you access it would look like this.

```js
// passed in to onChange handler on every call
const changeMap = {
  womp: {
    hasChanged: true,
    previousValue: 'diggity'
  },
  someOtherPieceOfState: {
    hasChanged: false,
    previousValue: 'something'
  }
};
```
```js
// onChange handler in User module
onChange (changeMap) {
  if (changeMap.womp.hasChanged) {
    // React ONLY if womp changes
  }

  if (changeMap.someOtherPieceOfState.hasChanged) {
    // React ONLY if someOtherPieceOfState changes
  }

  // React if EITHER womp or someOtherPieceOfState changes
}
```

As modules grow more complicated and begin listening to multiple pieces of state, the `changeMap` will be necessary to control the flow within modules.

### Unsubscribing

Sometimes, a class no longer needs to be connected to the store. In this case, you may call `this.unsubscribe()` to unsubscribe your class.

```js
class User extends Module {
  constructor(props) {
    super(props);

    // ...

    window.addEventListener("beforeunload", () => {
      this.unsubscribe();
    });
  }

  // ...
}
```
