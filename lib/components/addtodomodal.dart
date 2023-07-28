import 'package:flutter/material.dart';

class AddTodoModal extends StatefulWidget {
  const AddTodoModal({Key? key}) : super(key: key);

  @override
  State<AddTodoModal> createState() => _AddTodoModalState();
}

class _AddTodoModalState extends State<AddTodoModal> {
  late TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
        padding: EdgeInsets.only(
            top: 20,
            right: 20,
            left: 20,
            bottom: MediaQuery.of(context).viewInsets.bottom + 20),
        child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Flexible(
                  child: TextField(
                controller: _controller,
                autocorrect: true,
                decoration: const InputDecoration(
                  border: UnderlineInputBorder(),
                  labelText: 'Add Todo',
                ),
              )),
              const SizedBox(height: 20),
              SizedBox(
                  width: double.infinity,
                  child: OutlinedButton(
                    onPressed: () {
                      Navigator.pop(context, _controller.text);
                    },
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(
                          color: Theme.of(context).colorScheme.inversePrimary),
                    ),
                    child: const Text('Add'),
                  )),
            ]));
  }
}
