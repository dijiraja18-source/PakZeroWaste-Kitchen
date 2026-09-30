import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/pantry_item.dart';

class StorageService {
  static const String _keyPantryIds = 'pak_zerowaste_pantry_v1';
  static const String _keyFavorites = 'pak_zerowaste_favs_v1';
  static const String _keyCustomItems = 'pak_zerowaste_custom_items_v1';
  static const String _keyAssumeStaples = 'pak_zerowaste_assume_staples_v1';

  final SharedPreferences _prefs;

  StorageService(this._prefs);

  static Future<StorageService> init() async {
    final prefs = await SharedPreferences.getInstance();
    return StorageService(prefs);
  }

  // Selected pantry IDs
  Set<String> loadSelectedPantryIds() {
    final list = _prefs.getStringList(_keyPantryIds);
    if (list != null) {
      return list.toSet();
    }
    // Default starter kit for typical Pakistani kitchen
    return {
      'onion',
      'tomato',
      'garlic',
      'ginger',
      'green_chili',
      'fresh_coriander',
      'potatoes',
      'chicken',
      'eggs',
      'yogurt',
      'oil',
      'ghee',
      'basmati_rice',
      'wheat_flour',
      'salt',
      'red_chili_powder',
      'turmeric',
      'coriander_powder',
      'cumin_seeds'
    };
  }

  Future<void> saveSelectedPantryIds(Set<String> ids) async {
    await _prefs.setStringList(_keyPantryIds, ids.toList());
  }

  // Favorite recipe IDs
  Set<String> loadFavoriteIds() {
    final list = _prefs.getStringList(_keyFavorites);
    return list?.toSet() ?? {'chicken_biryani', 'mutton_karahi', 'daal_chawal'};
  }

  Future<void> saveFavoriteIds(Set<String> ids) async {
    await _prefs.setStringList(_keyFavorites, ids.toList());
  }

  // Custom added ingredients
  List<PantryItem> loadCustomItems() {
    final str = _prefs.getString(_keyCustomItems);
    if (str == null) return [];
    try {
      final List<dynamic> decoded = jsonDecode(str);
      return decoded.map((e) => PantryItem.fromMap(e as Map<String, dynamic>)).toList();
    } catch (_) {
      return [];
    }
  }

  Future<void> saveCustomItems(List<PantryItem> items) async {
    final encoded = jsonEncode(items.map((i) => i.toMap()).toList());
    await _prefs.setString(_keyCustomItems, encoded);
  }

  bool loadAssumeStaples() {
    return _prefs.getBool(_keyAssumeStaples) ?? true;
  }

  Future<void> saveAssumeStaples(bool val) async {
    await _prefs.setBool(_keyAssumeStaples, val);
  }
}
