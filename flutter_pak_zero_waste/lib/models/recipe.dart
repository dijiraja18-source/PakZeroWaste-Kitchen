import 'package:flutter/foundation.dart';

enum Difficulty { easy, medium, hard }
enum SpiceLevel { mild, medium, spicy }

class RecipeIngredient {
  final String id;
  final String name;
  final String amount;
  final String category;
  final bool isStaple;

  const RecipeIngredient({
    required this.id,
    required this.name,
    required this.amount,
    required this.category,
    this.isStaple = false,
  });

  Map<String, dynamic> toMap() => {
    'id': id,
    'name': name,
    'amount': amount,
    'category': category,
    'isStaple': isStaple,
  };

  factory RecipeIngredient.fromMap(Map<String, dynamic> map) => RecipeIngredient(
    id: map['id'] as String,
    name: map['name'] as String,
    amount: map['amount'] as String,
    category: map['category'] as String,
    isStaple: map['isStaple'] as bool? ?? false,
  );
}

class Recipe {
  final String id;
  final String title;
  final String urduTitle;
  final String category;
  final int prepTime; // in minutes
  final int cookTime; // in minutes
  final Difficulty difficulty;
  final int servings;
  final SpiceLevel spiceLevel;
  final String description;
  final List<RecipeIngredient> ingredients;
  final List<String> instructions;
  final String zeroWasteTip;
  final bool isVegetarian;

  const Recipe({
    required this.id,
    required this.title,
    required this.urduTitle,
    required this.category,
    required this.prepTime,
    required this.cookTime,
    required this.difficulty,
    required this.servings,
    required this.spiceLevel,
    required this.description,
    required this.ingredients,
    required this.instructions,
    required this.zeroWasteTip,
    this.isVegetarian = false,
  });

  int get totalTime => prepTime + cookTime;
}
