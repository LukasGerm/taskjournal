import 'package:flutter/material.dart';
import 'package:taskjournal/pages/todo.dart';

void main() {
  runApp(const Taskjournal());
}

class Taskjournal extends StatelessWidget {
  const Taskjournal({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Taskjournal',
      themeMode: ThemeMode.dark,
      darkTheme: ThemeData(
        // This is the theme of your application.
        //
        // TRY THIS: Try running your application with "flutter run". You'll see
        // the application has a blue toolbar. Then, without quitting the app,
        // try changing the seedColor in the colorScheme below to Colors.green
        // and then invoke "hot reload" (save your changes or press the "hot
        // reload" button in a Flutter-supported IDE, or press "r" if you used
        // the command line to start the app).
        //
        // Notice that the counter didn't reset back to zero; the application
        // state is not lost during the reload. To reset the state, use hot
        // restart instead.
        //
        // This works for code too, not just values: Most code changes can be
        // tested with just a hot reload.
        colorScheme: ColorScheme.fromSeed(
            seedColor: const Color(0xff8d00b0), brightness: Brightness.dark),
        useMaterial3: true,
      ),
      home: const TodoPage(),
    );
  }
}
