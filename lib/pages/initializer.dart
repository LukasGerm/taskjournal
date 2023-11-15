import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:taskjournal/pages/auth.dart';
import 'package:taskjournal/pages/todo.dart';

class InitializerPage extends StatefulWidget {
  const InitializerPage({Key? key}) : super(key: key);

  @override
  State<InitializerPage> createState() => _InitializerPageState();
}

class _InitializerPageState extends State<InitializerPage> {
  bool authenticated = false;
  @override
  Widget build(BuildContext context) {
    FirebaseAuth.instance.authStateChanges().listen((User? user) {
      if (user == null && authenticated == true) {
        setState(() {
          authenticated = false;
        });
      } else if (user != null && authenticated == false) {
        setState(() {
          authenticated = true;
        });
      }
    });

    if (authenticated) {
      return const TodoPage();
    } else {
      return const AuthPage();
    }
  }
}
