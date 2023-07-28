import 'package:flutter/material.dart';
import 'package:taskjournal/pages/todo.dart';

class TodoList extends StatefulWidget {
  const TodoList({super.key, required this.todoListItems});

  final List<TodoItem> todoListItems;

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  @override
  State<TodoList> createState() => _TodoListState();
}

class _TodoListState extends State<TodoList> {
  _checkItem(TodoItem item) {
    setState(() {
      item.done = !item.done;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: ListTile.divideTiles(context: context, tiles: [
          for (var item in widget.todoListItems)
            ListTile(
              title: Text(item.title,
                  style: TextStyle(
                      decoration: item.done
                          ? TextDecoration.lineThrough
                          : TextDecoration.none)),
              leading: Checkbox(
                value: item.done,
                onChanged: (value) {
                  _checkItem(item);
                },
              ),
            )
        ]).toList(),
      ),
    );
  }
}
