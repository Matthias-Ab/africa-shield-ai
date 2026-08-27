import 'package:flutter/material.dart';

import '../theme/app_theme.dart';

/// The circular cyan-ringed Africa-silhouette mark used throughout the
/// Figma design (splash screen, top-left of Welcome/Home/Safety Guidance).
/// Drawn with CustomPainter rather than shipping an image asset, since no
/// logo file has been provided yet — swap this for the real asset once one
/// exists; the API (just a `size`) won't need to change.
class AfriShieldLogo extends StatelessWidget {
  final double size;

  const AfriShieldLogo({super.key, this.size = 40});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: Colors.white,
        border: Border.all(color: AppColors.cyan, width: size * 0.035),
      ),
      padding: EdgeInsets.all(size * 0.16),
      child: CustomPaint(painter: _AfricaSilhouettePainter()),
    );
  }
}

/// A deliberately simple two-tone continent silhouette — not geographically
/// precise, just enough to read as "Africa, split navy/grey" at small sizes,
/// matching the placeholder mark in the Figma file.
class _AfricaSilhouettePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;
    final path = Path()
      ..moveTo(w * 0.38, 0)
      ..lineTo(w * 0.62, 0)
      ..lineTo(w * 0.78, h * 0.22)
      ..lineTo(w * 0.68, h * 0.30)
      ..lineTo(w * 0.80, h * 0.48)
      ..lineTo(w * 0.66, h * 0.62)
      ..lineTo(w * 0.70, h * 0.80)
      ..lineTo(w * 0.56, h)
      ..lineTo(w * 0.44, h * 0.92)
      ..lineTo(w * 0.30, h * 0.70)
      ..lineTo(w * 0.10, h * 0.50)
      ..lineTo(w * 0.22, h * 0.30)
      ..lineTo(w * 0.14, h * 0.16)
      ..close();

    canvas.save();
    canvas.clipPath(path);
    canvas.drawRect(
      Rect.fromLTWH(0, 0, w / 2, h),
      Paint()..color = AppColors.navy,
    );
    canvas.drawRect(
      Rect.fromLTWH(w / 2, 0, w / 2, h),
      Paint()..color = const Color(0xFF7A7A7A),
    );
    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
