import 'package:flutter/material.dart';
import 'package:taskjournal/components/loginform.dart';

class AuthPage extends StatefulWidget {
  const AuthPage({super.key});
  @override
  State<StatefulWidget> createState() {
    return _AuthPageState();
  }
}

class _AuthPageState extends State<AuthPage> {
  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
        length: 2,
        child: Scaffold(
          appBar: AppBar(
            scrolledUnderElevation: 0,
            title: const Text("Taskjournal"),
            backgroundColor: Theme.of(context).colorScheme.surfaceVariant,
            bottom: const TabBar(
              tabs: [
                Tab(text: "Login"),
                Tab(text: "Register"),
              ],
            ),
          ),
          body: const TabBarView(
            children: [
              Center(
                child: LoginForm(),
              ),
              Center(
                child: Text("Register"),
              ),
            ],
          ),
        ));
  }
}
