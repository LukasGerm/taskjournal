import { createQuery } from "@tanstack/solid-query";
import { getTodoByUserAndListName } from "../../../adapters/todos/getTodoByUserAndListName";
import { useSession } from "../user.selectors";

export const useTodosByListName = (options: { todoListName: string }) => {
  const user = useSession();
  const query = createQuery(() => ({
    queryKey: ["todolist", options.todoListName],
    queryFn: async () => {
      const result = await getTodoByUserAndListName({
        userId: user!.uid,
        ...options,
      });
      return result;
    },
    refetchOnWindowFocus: false,
  }));

  return query;
};
