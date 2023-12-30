import { Todo } from "./Todo";

export interface TodoList {
  ref: string;
  name: string;
  todos: Todo[];
}
