import 'package:flutter/material.dart';
import 'package:taskjournal/components/addtodomodal.dart';
import 'package:taskjournal/components/todolist.dart';

class TodoItem {
  String title;
  bool done;

  TodoItem(this.title, this.done);
}

class TodoPage extends StatefulWidget {
  const TodoPage({super.key});

  @override
  State<TodoPage> createState() => _TodoPageState();
}

class _TodoPageState extends State<TodoPage> {
  // those have to probably be initialized then with firebase
  final _todoListItems = <TodoItem>[];
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          scrolledUnderElevation: 0,
          title: const Text("Taskjournal"),
          backgroundColor: Theme.of(context).colorScheme.surfaceVariant,
        ),
        body: TodoList(
          todoListItems: _todoListItems,
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: () async {
            final result = await showModalBottomSheet(
                context: context,
                isScrollControlled: true,
                builder: (BuildContext builder) {
                  return const AddTodoModal();
                });

            if (result != null) {
              setState(() {
                _todoListItems.add(TodoItem(result, false));
              });
            }
          },
          backgroundColor: Theme.of(context).colorScheme.inversePrimary,
          child: const Icon(Icons.add),
        ));
  }
}
