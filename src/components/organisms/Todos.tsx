import { Component, Match, Switch } from "solid-js";
import { useTodosByListName } from "../hooks/todos/useTodosByListName";
import { Todo } from "../../adapters/todos/types/Todo";
interface TodoListProps {
  listName: string;
  todos: Todo[];
}

const TodoList: Component<TodoListProps> = (props) => {
  return (
    <div>
      <div>
        <h1>{props.listName}</h1>
      </div>
      <Switch>
        <Match when={props.todos.length === 0}>
          <p class="text-gray-400">No todos</p>
        </Match>
        <Match when={props.todos.length > 0}>
          <ul>
            {props.todos.map((todo) => (
              <li>{todo.name}</li>
            ))}
          </ul>
        </Match>
      </Switch>
    </div>
  );
};

export const Todos = () => {
  const todoData = useTodosByListName({
    todoListName: "Inbox",
  });
  return (
    <Switch>
      <Match when={todoData.isPending}>
        <p>Loading...</p>
      </Match>

      <Match when={todoData.isSuccess && todoData.data}>
        <TodoList listName={todoData.data!.name} todos={todoData.data!.todos} />
      </Match>
    </Switch>
  );
};
