class PantryItem {
  final String id;
  final String name;
  final String urduName;
  final String category; // 'vegetables', 'meats', 'dairy', 'staples'
  final bool isDefaultStaple;
  final int shelfLifeDays;
  final bool isCustom;

  const PantryItem({
    required this.id,
    required this.name,
    required this.urduName,
    required this.category,
    this.isDefaultStaple = false,
    this.shelfLifeDays = 7,
    this.isCustom = false,
  });

  Map<String, dynamic> toMap() => {
    'id': id,
    'name': name,
    'urduName': urduName,
    'category': category,
    'isDefaultStaple': isDefaultStaple,
    'shelfLifeDays': shelfLifeDays,
    'isCustom': isCustom,
  };

  factory PantryItem.fromMap(Map<String, dynamic> map) => PantryItem(
    id: map['id'] as String,
    name: map['name'] as String,
    urduName: map['urduName'] as String? ?? '',
    category: map['category'] as String,
    isDefaultStaple: map['isDefaultStaple'] as bool? ?? false,
    shelfLifeDays: map['shelfLifeDays'] as int? ?? 7,
    isCustom: map['isCustom'] as bool? ?? false,
  );
}
