import 'package:flutter_test/flutter_test.dart';

import 'package:afrishield_mobile/app.dart';

void main() {
  testWidgets('App launches to the splash screen', (WidgetTester tester) async {
    await tester.pumpWidget(const AfriShieldApp());
    await tester.pump();

    expect(find.text('AfriShield'), findsOneWidget);
    expect(find.text('Know the Risk. Act Early. Stay Safe.'), findsOneWidget);

    // Flush the splash screen's delayed navigation timer so the test
    // doesn't end with a pending Timer still outstanding.
    await tester.pump(const Duration(seconds: 2));
  });
}
