type ChangeMapItem = {
  hasChanged: boolean;
  previousValue: any;
};

export type ChangeMap = {
  [item: string]: ChangeMapItem;
};

export class Module<MappedStateAndDispatches> {
  protected props: MappedStateAndDispatches;

  constructor(Props: MappedStateAndDispatches);
  private setProps(newProps: any): void;
  unsubscribe(): void;
  onChange(changeMap: ChangeMap): void;
}

export class Connect {
  constructor(store: any);
}

export function connect<State, MappedState, MappedDispatches, Dispatch>(
  mapStateToProps: (state: State) => MappedState,
  mapDispatchToProps?: (dispatch: Dispatch) => MappedDispatches
): (Module) => typeof Connect;
