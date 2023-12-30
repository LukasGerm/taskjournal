import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
  addDoc,
  doc,
  QueryDocumentSnapshot,
  FirestoreDataConverter,
} from "firebase/firestore";
import { TodoList } from "./types/TodoList";

const converter: FirestoreDataConverter<TodoList> = {
  toFirestore: (item) => item,
  fromFirestore: (snapshot: QueryDocumentSnapshot<TodoList>, options) => {
    const data = snapshot.data(options);
    return {
      ...data,
      id: snapshot.id,
    };
  },
};

export const getTodoByUserAndListName = async (options: {
  userId: string;
  todoListName: string;
}): Promise<TodoList> => {
  const db = getFirestore();
  const userRef = doc(db, "users", options.userId);
  const todosRef = collection(userRef, "todolists");

  const q = query(todosRef, where("name", "==", options.todoListName));

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const data = querySnapshot.docs[0].data() as TodoList;
    // Return the first document if exists
    return {
      ...data,
      ref: querySnapshot.docs[0].id,
    };
  } else {
    // create empty list
    const newTodoList = {
      name: options.todoListName,
      todos: [],
    };
    // Add a new document in collection "todolists"
    const ref = await addDoc(todosRef, newTodoList);

    return {
      ...newTodoList,
      ref: ref.id,
    };
  }
};
