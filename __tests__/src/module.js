import { Module } from '../../src';

describe('module', () => {
  it('should set props on the instance if passed into the constructor', () => {
    const initialProps = {
      womp: 'initial womp',
      diggity: 'initial diggity'
    };
    const module = new Module(initialProps);

    expect(module.props).toEqual(initialProps);
  });

  it('should set the new props when setProps is called', () => {
    const module = new Module();
    expect(module.props).toEqual({});
    module.setProps({ tests: 'are great!' });
    expect(module.props).toEqual({ tests: 'are great!'});
  });
});
