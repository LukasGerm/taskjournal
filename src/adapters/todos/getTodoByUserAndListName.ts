import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
  addDoc,
  doc,
} from "firebase/firestore";
import { TodoList } from "./types/TodoList";

export const getTodoByUserAndListName = async (options: {
  userId: string;
  todoListName: string;
}) => {
  const db = getFirestore();
  try {
    const userRef = doc(db, "users", options.userId);
    const todosRef = collection(userRef, "todolists");

    const q = query(todosRef, where("name", "==", options.todoListName));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Return the first document if exists
      return querySnapshot.docs[0].data() as TodoList;
    } else {
      // create empty list
      const newTodoList: TodoList = {
        name: options.todoListName,
        todos: [],
      };
      // Add a new document in collection "todolists"
      await addDoc(todosRef, newTodoList);
      return newTodoList as TodoList;
    }
  } catch (error) {
    console.error("Error getting documents: ", error);
  }
};
