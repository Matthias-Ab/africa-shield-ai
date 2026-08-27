/// A citizen-submitted "what are you seeing" report — matches the Figma
/// "Report a Hazard" screen. **There is no backend endpoint for this yet**
/// (community reporting is still on `todo.md`'s post-hackathon roadmap).
/// This model exists so the screen has something real to build against
/// once that endpoint exists; today, submitting just confirms locally.
class HazardReport {
  final String category;
  final String? description;
  final String locationName;
  final DateTime submittedAt;

  const HazardReport({
    required this.category,
    this.description,
    required this.locationName,
    required this.submittedAt,
  });
}

const List<String> hazardCategories = [
  'Water Rising',
  'Heavy Rainfall',
  'Flooded Road',
  'Flooded Home',
  'Other',
];
