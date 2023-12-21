import { Show } from "solid-js";
import { useTodosByListName } from "../components/hooks/todos/useTodosByListName";

export const Todos = () => {
  const todoData = useTodosByListName({
    todoListName: "inbox",
  });
  return <Show when={todoData.isError}>{todoData.error?.message}</Show>;
};
