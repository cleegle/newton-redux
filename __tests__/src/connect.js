import { Module, connect } from '../../src/index';

class Test extends Module {}
Test.prototype.onChange = jest.fn();

function mapStateToProps (state) {
  return {
    womp: state.womp,
    diggity: state.diggity
  };
}

function mapDispatchToProps (dispatch) {
  return {
    setWomp
  };
}

const ConnectedTest = connect(
  mapStateToProps,
  mapDispatchToProps
)(Test);

function unsubscribe () {}
function dispatch () {}
function setWomp () {}

const store = {
  getState: () => mapStateToProps(state),
  subscribe: () => unsubscribe,
  dispatch
};
let state = {};
let test;

describe('connect', () => {
  beforeEach(() => {
    state = {
      womp: 'initial womp',
      diggity: 'initial diggity'
    };

    test = new ConnectedTest(store);
    test.currentState = {...state};
  });

  it('should call the onChange Module method when the state changes', () => {
    state.womp = 'new womp';
    test.handleChange();

    expect(test.instance.onChange).toHaveBeenCalled();
  });

  it('should set the props on the Module when the state changes', () => {
    state.womp = 'new womp';
    test.handleChange();

    // Only care about the state subset so use toMatchObject
    expect(test.instance.props).toEqual({
      womp: 'new womp',
      diggity: 'initial diggity',
      setWomp
    });
  });

  it('should show which pieces of state changed in the changeMap', () => {
    state.womp = 'new womp';
    test.handleChange();

    expect(test.changeMap).toEqual({
      womp: {
        hasChanged: true,
        previousValue: 'initial womp'
      },
      diggity: {
        hasChanged: false,
        previousValue: 'initial diggity'
      }
    });
  });

  it('should set the currentState to the new state when the state changes', () => {
    state.womp = 'new womp';
    test.handleChange();

    expect(test.currentState).toEqual({
      womp: 'new womp',
      diggity: 'initial diggity'
    });
  });

  it('should return the props when getProps is called', () => {
    expect(test.getProps()).toEqual({
      womp: 'initial womp',
      diggity: 'initial diggity',
      setWomp
    });
  });

  it('should set this._unsubscribe when subscribe method is called', () => {
    test.subscribe();
    expect(test._unsubscribe).toBe(unsubscribe);
    expect(test._unsubscribe).not.toBeNull();
    expect(test._unsubscribe).not.toBeUndefined();
  });

  it('should unsubscribe when asked', () => {
    test.subscribe();
    expect(test._unsubscribe).toBe(unsubscribe);
    test.instance.unsubscribe();
    expect(test._unsubscribe).toBe(null);
  })
});
