import { useState, useEffect, useRef } from 'react';
import type { 
  Grain, 
  Protein, 
  GeneratedRecipe, 
  CalculationMode, 
  UnitDisplayMode, 
  SpiceStyle, 
  FavoriteRecipe 
} from './types';
import { 
  getStoredGrains, 
  saveStoredGrains, 
  getStoredProteins, 
  saveStoredProteins,
  getStoredFavorites,
  saveStoredFavorites,
  resetStorageToDefaults 
} from './utils/storage';
import { generateRecipe } from './utils/recipeGenerator';
import { Navbar } from './components/Navbar';
import { ProteinSelector } from './components/ProteinSelector';
import { GrainSelector } from './components/GrainSelector';
import { PortionControls } from './components/PortionControls';
import { RecipeView } from './components/RecipeView';
import { CookingAssistantModal } from './components/CookingAssistantModal';
import { FloatingKitchenTimer } from './components/FloatingKitchenTimer';
import { FavoritesModal } from './components/FavoritesModal';
import { GrainsCheatSheet } from './components/GrainsCheatSheet';
import { IngredientsManager } from './components/IngredientsManager';
import { AddCustomModal } from './components/AddCustomModal';
import confetti from 'canvas-confetti';

export function App() {
  const [activeTab, setActiveTab] = useState<'constructor' | 'cheatsheet' | 'manage'>('constructor');

  // Stored items
  const [grains, setGrains] = useState<Grain[]>(() => getStoredGrains());
  const [proteins, setProteins] = useState<Protein[]>(() => getStoredProteins());
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>(() => getStoredFavorites());

  // Form selections
  const [selectedProtein, setSelectedProtein] = useState<Protein>(() => proteins[0]);
  const [selectedGrains, setSelectedGrains] = useState<Grain[]>(() => {
    const buckwheat = grains.find((g) => g.id === 'buckwheat');
    const redLentils = grains.find((g) => g.id === 'red_lentils');
    return [buckwheat, redLentils].filter(Boolean) as Grain[];
  });

  // Calculation parameters
  const [calculationMode, setCalculationMode] = useState<CalculationMode>('servings');
  const [servings, setServings] = useState<number>(3);
  const [targetProteinGrams, setTargetProteinGrams] = useState<number>(400);
  const [targetGrainGrams, setTargetGrainGrams] = useState<number>(240);
  const [unitDisplayMode, setUnitDisplayMode] = useState<UnitDisplayMode>('both');
  const [spiceStyle, setSpiceStyle] = useState<SpiceStyle>('classic');
  const [cannedLegumes, setCannedLegumes] = useState<boolean>(false);

  // Recipe result
  const [recipe, setRecipe] = useState<GeneratedRecipe | null>(null);
  const [isCookingAssistantOpen, setIsCookingAssistantOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  // Quick Add Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalType, setAddModalType] = useState<'grain' | 'protein'>('grain');

  const recipeRef = useRef<HTMLDivElement | null>(null);

  // Storage sync
  useEffect(() => {
    saveStoredGrains(grains);
  }, [grains]);

  useEffect(() => {
    saveStoredProteins(proteins);
  }, [proteins]);

  useEffect(() => {
    saveStoredFavorites(favorites);
  }, [favorites]);

  // Toggle grain selection (max 4)
  const handleToggleGrain = (grain: Grain) => {
    setSelectedGrains((prev) => {
      const exists = prev.some((g) => g.id === grain.id);
      if (exists) {
        return prev.filter((g) => g.id !== grain.id);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, grain];
    });
  };

  // Random selection logic
  const handleSelectRandom = (mode: 'any' | 'fast' | 'dense') => {
    let pool: Grain[] = [];

    if (mode === 'fast') {
      pool = grains.filter((g) => g.cookTimeMin <= 20);
    } else if (mode === 'dense') {
      pool = grains.filter((g) => g.cookTimeMin >= 25 || g.category === 'legume');
    } else {
      pool = [...grains];
    }

    if (pool.length === 0) pool = [...grains];

    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const count = Math.min(pool.length, Math.floor(Math.random() * 3) + 2);
    const picked = shuffled.slice(0, count);

    setSelectedGrains(picked);

    confetti({
      particleCount: 25,
      spread: 40,
      origin: { y: 0.7 }
    });
  };

  // Generate Recipe
  const handleGenerateRecipe = () => {
    if (selectedGrains.length === 0) return;
    const generated = generateRecipe(selectedProtein, selectedGrains, {
      calculationMode,
      servings,
      targetProteinGrams,
      targetGrainGrams,
      spiceStyle,
      cannedLegumes
    });
    setRecipe(generated);

    setTimeout(() => {
      recipeRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Auto-update recipe if already visible and parameters change
  useEffect(() => {
    if (recipe && selectedGrains.length > 0) {
      const updated = generateRecipe(selectedProtein, selectedGrains, {
        calculationMode,
        servings,
        targetProteinGrams,
        targetGrainGrams,
        spiceStyle,
        cannedLegumes
      });
      setRecipe(updated);
    }
  }, [
    selectedProtein, 
    selectedGrains, 
    servings, 
    calculationMode, 
    targetProteinGrams, 
    targetGrainGrams, 
    spiceStyle, 
    cannedLegumes
  ]);

  // Save Favorite
  const handleSaveFavorite = (rec: GeneratedRecipe) => {
    const newFav: FavoriteRecipe = {
      id: `fav_${Date.now()}`,
      title: rec.title,
      createdAt: new Date().toLocaleDateString('ru-RU'),
      proteinId: selectedProtein.id,
      grainIds: selectedGrains.map((g) => g.id),
      servings: rec.servings,
      calculationMode,
      targetInputWeight: rec.targetInputWeight,
      spiceStyle
    };
    setFavorites((prev) => [newFav, ...prev.filter((f) => f.title !== rec.title)]);
  };

  // Load Favorite into Constructor
  const handleLoadFavorite = (fav: FavoriteRecipe) => {
    const foundProtein = proteins.find((p) => p.id === fav.proteinId);
    if (foundProtein) setSelectedProtein(foundProtein);

    const foundGrains = fav.grainIds
      .map((id) => grains.find((g) => g.id === id))
      .filter(Boolean) as Grain[];
    if (foundGrains.length > 0) setSelectedGrains(foundGrains);

    setServings(fav.servings);
    setCalculationMode(fav.calculationMode);
    if (fav.targetInputWeight) {
      if (fav.calculationMode === 'by_protein') setTargetProteinGrams(fav.targetInputWeight);
      if (fav.calculationMode === 'by_grain') setTargetGrainGrams(fav.targetInputWeight);
    }
    setSpiceStyle(fav.spiceStyle);
    setActiveTab('constructor');
  };

  const handleDeleteFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  // Add custom grain
  const handleAddGrain = (newGrainData: Omit<Grain, 'id'>) => {
    const newGrain: Grain = {
      ...newGrainData,
      id: `custom_${Date.now()}`
    };
    setGrains((prev) => [newGrain, ...prev]);
    if (selectedGrains.length < 4) {
      setSelectedGrains((prev) => [...prev, newGrain]);
    }
  };

  const handleDeleteGrain = (id: string) => {
    setGrains((prev) => prev.filter((g) => g.id !== id));
    setSelectedGrains((prev) => prev.filter((g) => g.id !== id));
  };

  const handleAddProtein = (newProteinData: Omit<Protein, 'id'>) => {
    const newProtein: Protein = {
      ...newProteinData,
      id: `custom_protein_${Date.now()}`
    };
    setProteins((prev) => [newProtein, ...prev]);
    setSelectedProtein(newProtein);
  };

  const handleDeleteProtein = (id: string) => {
    setProteins((prev) => prev.filter((p) => p.id !== id));
    if (selectedProtein.id === id) {
      setSelectedProtein(proteins[0]);
    }
  };

  const handleResetDefaults = () => {
    const { grains: defGrains, proteins: defProteins } = resetStorageToDefaults();
    setGrains(defGrains);
    setProteins(defProteins);
    setSelectedProtein(defProteins[0]);
    setSelectedGrains([defGrains[0], defGrains[4]]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-amber-500 selection:text-white pb-16">
      {/* Top Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        hasRecipe={!!recipe} 
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'constructor' && (
          <div className="space-y-6">
            {/* Step 1: Protein Selector */}
            <ProteinSelector
              proteins={proteins}
              selectedProtein={selectedProtein}
              onSelectProtein={setSelectedProtein}
              onOpenAddModal={() => {
                setAddModalType('protein');
                setIsAddModalOpen(true);
              }}
            />

            {/* Step 2: Grain Selector */}
            <GrainSelector
              grains={grains}
              selectedGrains={selectedGrains}
              onToggleGrain={handleToggleGrain}
              onSelectRandom={handleSelectRandom}
              onOpenAddModal={() => {
                setAddModalType('grain');
                setIsAddModalOpen(true);
              }}
            />

            {/* Step 3: Portion Controls & Kitchen Measure Settings */}
            <PortionControls
              calculationMode={calculationMode}
              setCalculationMode={setCalculationMode}
              servings={servings}
              setServings={setServings}
              targetProteinGrams={targetProteinGrams}
              setTargetProteinGrams={setTargetProteinGrams}
              targetGrainGrams={targetGrainGrams}
              setTargetGrainGrams={setTargetGrainGrams}
              unitDisplayMode={unitDisplayMode}
              setUnitDisplayMode={setUnitDisplayMode}
              spiceStyle={spiceStyle}
              setSpiceStyle={setSpiceStyle}
              cannedLegumes={cannedLegumes}
              setCannedLegumes={setCannedLegumes}
              selectedProtein={selectedProtein}
              selectedGrains={selectedGrains}
              onGenerate={handleGenerateRecipe}
            />

            {/* Result Recipe View */}
            {recipe && (
              <div ref={recipeRef} className="pt-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <RecipeView
                  recipe={recipe}
                  unitDisplayMode={unitDisplayMode}
                  setUnitDisplayMode={setUnitDisplayMode}
                  onStartCookingAssistant={() => setIsCookingAssistantOpen(true)}
                  onSaveFavorite={handleSaveFavorite}
                  isSaved={favorites.some((f) => f.title === recipe.title)}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'cheatsheet' && (
          <GrainsCheatSheet grains={grains} />
        )}

        {activeTab === 'manage' && (
          <IngredientsManager
            grains={grains}
            proteins={proteins}
            onAddGrain={handleAddGrain}
            onDeleteGrain={handleDeleteGrain}
            onAddProtein={handleAddProtein}
            onDeleteProtein={handleDeleteProtein}
            onResetDefaults={handleResetDefaults}
          />
        )}
      </main>

      {/* Floating Kitchen Timer (Always available anywhere in app) */}
      <FloatingKitchenTimer />

      {/* Interactive Cooking Assistant Modal */}
      {isCookingAssistantOpen && recipe && (
        <CookingAssistantModal
          recipe={recipe}
          onClose={() => setIsCookingAssistantOpen(false)}
        />
      )}

      {/* Favorites Modal */}
      {isFavoritesOpen && (
        <FavoritesModal
          favorites={favorites}
          grains={grains}
          proteins={proteins}
          onClose={() => setIsFavoritesOpen(false)}
          onLoadFavorite={handleLoadFavorite}
          onDeleteFavorite={handleDeleteFavorite}
        />
      )}

      {/* Quick Add Custom Modal */}
      {isAddModalOpen && (
        <AddCustomModal
          initialType={addModalType}
          onClose={() => setIsAddModalOpen(false)}
          onAddGrain={handleAddGrain}
          onAddProtein={handleAddProtein}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-slate-200/80 bg-white text-center text-xs text-slate-400">
        <p>Казан-Мастер &copy; Умный калькулятор каш для казана. Все расчеты сохраняются автоматически.</p>
      </footer>
    </div>
  );
}

export default App;
