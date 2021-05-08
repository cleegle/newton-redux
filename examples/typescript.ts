import { createStore } from "redux";
import { module, Connect, ChangeMap } from "newton-redux-reborn";

// Redux store setup
type Todo = string;

interface StoreState {
  todos: Todo[];
  done_todos: Todo[];
}

const AddTodoAction = "ADD_TODO";
const MarkTodoAsDoneAction = "MARK_TODO_AS_DONE";

type StoreActions = AddTodoAction | MarkTodoAsDoneAction;

interface AddTodoAction {
  type: typeof AddTodoAction;
  todo: Todo;
}

interface MarkTodoAsDoneAction {
  type: typeof MarkTodoAsDoneAction;
  todo: Todo;
}

function addTodoAction(todo: Todo): AddTodoAction {
  return {
    type: AddTodoAction,
    todo,
  };
}

function markTodoAsDoneAction(todo: Todo): MarkTodoAsDoneAction {
  return {
    type: MarkTodoAsDoneAction,
    todo,
  };
}

function reducer(state: StoreState = { todos: [], done_todos: [] }, action) {
  switch (action.type) {
    case AddTodoAction:
      return {
        ...state,
        todos: state.todos.concat([action.todo]),
      };
    case MarkTodoAsDoneAction:
      return {
        ...state,
        todos: state.todos.filter((t) => t !== action.todo),
        done_todos: state.todos.concat([action.todo]),
      };
    default:
      return state;
  }
}

const store = createStore(reducer);

// you MUST include the type annotation for this to work properly.
// learn more about the TodosManagerProps type below the class declaration.
class TodosManager extends Module<TodosManagerProps> {
  // will be run when the module connects to the store.
  constructor(props: TodosManagerProps) {
    super(props);

    // do something with initial props.
    if (!props.todos.length && !props.done_todos.length) {
      props.addDefaultTodo();
    }
  }

  // ChangeMap is a type from newton-redux-reborn we imported at the top.
  onChange(changeMap: ChangeMap) {
    // one small TypeScript caveat here: properties of the changeMap won't be checked.
    // be careful!

    if (changeMap.todos.hasChanged) {
      console.log("Todos have changed!");
    }

    // do stuff with changes!
  }

  // ... implement more class members and do more stuff here!
}

// all pieces of state that will be returned from your mapStateToProps function.
interface TodosManagerStateProps {
  // you can add more, customize names, etc.
  todos: StoreState["todos"];
  done_todos: StoreState["todos"];
}

// all dispatch functions returned from your mapDispatchToProps function.
interface TodosManagerDispatchProps {
  addDefaultTodo: () => AddTodoAction;
  addTodo: (todo: Todo) => AddTodoAction;
  markTodoAsDone: (todo: Todo) => MarkTodoAsDoneAction;
}

// a union of state and dispatch props: this will be the type of Module.props.
type TodosManagerProps = TodosManagerStateProps & TodosManagerDispatchProps;

// normal mapStateToProps function. Learn more here https://bit.ly/3hc1t5p.
function mapStateToProps(state: StoreState): TodosManagerStateProps {
  return {
    todos: state.todos,
    done_todos: state.done_todos,
  };
}

// function-type mapDispatchToProps: learn more here https://bit.ly/3etsZtx.
function mapDispatchToProps(dispatch): TodosManagerDispatchProps {
  return {
    addDefaultTodo: () => dispatch(addTodoAction("Do the dishes")),
    addTodo: (todo: Todo) => dispatch(addTodoAction(todo)),
    markTodoAsDone: (todo: Todo) => dispatch(markTodoAsDoneAction(todo)),
  };
}

// we'll now connect our module to the store.
const ConnectedTodosManager = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodosManager);

new ConnectedTodosManager(store);

// BAM! ConnectedTodosManager is now connected to our Redux store. Phew.
