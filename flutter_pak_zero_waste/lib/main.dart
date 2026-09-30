import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'services/storage_service.dart';
import 'data/recipes_data.dart';
import 'screens/pantry_screen.dart';
import 'screens/can_i_make_this_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final storageService = await StorageService.init();

  runApp(
    MultiProvider(
      providers: [
        Provider<StorageService>.value(value: storageService),
        ChangeNotifierProvider(create: (_) => AppState(storageService)),
      ],
      child: const PakZeroWasteApp(),
    ),
  );
}

class AppState extends ChangeNotifier {
  final StorageService _storage;

  Set<String> _selectedPantryIds = {};
  Set<String> _favoriteIds = {};
  bool _assumeStaples = true;

  AppState(this._storage) {
    _selectedPantryIds = _storage.loadSelectedPantryIds();
    _favoriteIds = _storage.loadFavoriteIds();
    _assumeStaples = _storage.loadAssumeStaples();
  }

  Set<String> get selectedPantryIds => _selectedPantryIds;
  Set<String> get favoriteIds => _favoriteIds;
  bool get assumeStaples => _assumeStaples;

  void togglePantryItem(String id) {
    if (_selectedPantryIds.contains(id)) {
      _selectedPantryIds.remove(id);
    } else {
      _selectedPantryIds.add(id);
    }
    _storage.saveSelectedPantryIds(_selectedPantryIds);
    notifyListeners();
  }

  void toggleFavorite(String recipeId) {
    if (_favoriteIds.contains(recipeId)) {
      _favoriteIds.remove(recipeId);
    } else {
      _favoriteIds.add(recipeId);
    }
    _storage.saveFavoriteIds(_favoriteIds);
    notifyListeners();
  }

  void toggleAssumeStaples() {
    _assumeStaples = !_assumeStaples;
    _storage.saveAssumeStaples(_assumeStaples);
    notifyListeners();
  }

  int get cookableCount {
    return pakistaniRecipesDatabase.where((r) {
      return r.ingredients.every((ing) {
        return _selectedPantryIds.contains(ing.id) || (_assumeStaples && ing.isStaple);
      });
    }).length;
  }
}

class PakZeroWasteApp extends StatelessWidget {
  const PakZeroWasteApp({super.key});

  @override
  Widget build(BuildContext context) {
    const primaryGreen = Color(0xFF064E3B);
    const accentAmber = Color(0xFFF59E0B);

    return MaterialApp(
      title: 'PakZeroWaste Kitchen',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: primaryGreen,
          primary: primaryGreen,
          secondary: accentAmber,
          surface: const Color(0xFFFAF9F6),
        ),
        textTheme: GoogleFonts.plusJakartaSansTextTheme(
          Theme.of(context).textTheme,
        ),
        appBarTheme: AppBarTheme(
          backgroundColor: primaryGreen,
          foregroundColor: Colors.white,
          elevation: 0,
          titleTextStyle: GoogleFonts.playfairDisplayTextTheme().titleLarge?.copyWith(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      home: const MainNavigationScreen(),
    );
  }
}

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    PantryScreen(),
    CanIMakeThisScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (i) => setState(() => _currentIndex = i),
        backgroundColor: Colors.white,
        destinations: [
          NavigationDestination(
            icon: const Icon(Icons.kitchen_outlined),
            selectedIcon: const Icon(Icons.kitchen, color: Color(0xFF064E3B)),
            label: 'Pantry (\${state.selectedPantryIds.length})',
          ),
          NavigationDestination(
            icon: Badge(
              label: Text('\${state.cookableCount}'),
              child: const Icon(Icons.auto_awesome_outlined),
            ),
            selectedIcon: const Icon(Icons.auto_awesome, color: Color(0xFF064E3B)),
            label: 'Can I Make?',
          ),
        ],
      ),
    );
  }
}
