import { useState, useEffect, useRef } from 'react';
import type { Grain, Protein, GeneratedRecipe } from './types';
import { 
  getStoredGrains, 
  saveStoredGrains, 
  getStoredProteins, 
  saveStoredProteins,
  resetStorageToDefaults 
} from './utils/storage';
import { generateRecipe } from './utils/recipeGenerator';
import { Navbar } from './components/Navbar';
import { ProteinSelector } from './components/ProteinSelector';
import { GrainSelector } from './components/GrainSelector';
import { PortionControls } from './components/PortionControls';
import { RecipeView } from './components/RecipeView';
import { CookingAssistantModal } from './components/CookingAssistantModal';
import { GrainsCheatSheet } from './components/GrainsCheatSheet';
import { IngredientsManager } from './components/IngredientsManager';
import { AddCustomModal } from './components/AddCustomModal';
import confetti from 'canvas-confetti';

export function App() {
  const [activeTab, setActiveTab] = useState<'constructor' | 'cheatsheet' | 'manage'>('constructor');

  // Stored items
  const [grains, setGrains] = useState<Grain[]>(() => getStoredGrains());
  const [proteins, setProteins] = useState<Protein[]>(() => getStoredProteins());

  // Form selections
  const [selectedProtein, setSelectedProtein] = useState<Protein>(() => proteins[0]);
  const [selectedGrains, setSelectedGrains] = useState<Grain[]>(() => {
    // Default initial combo: Гречка + Красная чечевица
    const buckwheat = grains.find((g) => g.id === 'buckwheat');
    const redLentils = grains.find((g) => g.id === 'red_lentils');
    return [buckwheat, redLentils].filter(Boolean) as Grain[];
  });
  const [servings, setServings] = useState<number>(3);

  // Recipe result
  const [recipe, setRecipe] = useState<GeneratedRecipe | null>(null);
  const [isCookingAssistantOpen, setIsCookingAssistantOpen] = useState(false);

  // Quick Add Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalType, setAddModalType] = useState<'grain' | 'protein'>('grain');

  const recipeRef = useRef<HTMLDivElement | null>(null);

  // Save changes to storage
  useEffect(() => {
    saveStoredGrains(grains);
  }, [grains]);

  useEffect(() => {
    saveStoredProteins(proteins);
  }, [proteins]);

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

    // Shuffle
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    // Pick 2, 3 or 4 grains
    const count = Math.min(pool.length, Math.floor(Math.random() * 3) + 2); // 2 to 4
    const picked = shuffled.slice(0, count);

    setSelectedGrains(picked);

    // Minor celebration
    confetti({
      particleCount: 25,
      spread: 40,
      origin: { y: 0.7 }
    });
  };

  // Generate Recipe
  const handleGenerateRecipe = () => {
    if (selectedGrains.length === 0) return;
    const generated = generateRecipe(selectedProtein, selectedGrains, servings);
    setRecipe(generated);

    // Scroll to recipe
    setTimeout(() => {
      recipeRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Auto-update recipe if already visible and parameters change
  useEffect(() => {
    if (recipe && selectedGrains.length > 0) {
      const updated = generateRecipe(selectedProtein, selectedGrains, servings);
      setRecipe(updated);
    }
  }, [selectedProtein, selectedGrains, servings]);

  // Add custom grain
  const handleAddGrain = (newGrainData: Omit<Grain, 'id'>) => {
    const newGrain: Grain = {
      ...newGrainData,
      id: `custom_${Date.now()}`
    };
    setGrains((prev) => [newGrain, ...prev]);
    // Also select it if space allows
    if (selectedGrains.length < 4) {
      setSelectedGrains((prev) => [...prev, newGrain]);
    }
  };

  // Delete grain
  const handleDeleteGrain = (id: string) => {
    setGrains((prev) => prev.filter((g) => g.id !== id));
    setSelectedGrains((prev) => prev.filter((g) => g.id !== id));
  };

  // Add custom protein
  const handleAddProtein = (newProteinData: Omit<Protein, 'id'>) => {
    const newProtein: Protein = {
      ...newProteinData,
      id: `custom_protein_${Date.now()}`
    };
    setProteins((prev) => [newProtein, ...prev]);
    setSelectedProtein(newProtein);
  };

  // Delete protein
  const handleDeleteProtein = (id: string) => {
    setProteins((prev) => prev.filter((p) => p.id !== id));
    if (selectedProtein.id === id) {
      setSelectedProtein(proteins[0]);
    }
  };

  // Reset defaults
  const handleResetDefaults = () => {
    const { grains: defGrains, proteins: defProteins } = resetStorageToDefaults();
    setGrains(defGrains);
    setProteins(defProteins);
    setSelectedProtein(defProteins[0]);
    setSelectedGrains([defGrains[0], defGrains[4]]); // buckwheat + red lentils
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        hasRecipe={!!recipe} 
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

            {/* Step 3: Portion Controls & Quick Calculate */}
            <PortionControls
              servings={servings}
              setServings={setServings}
              selectedProtein={selectedProtein}
              selectedGrains={selectedGrains}
              onGenerate={handleGenerateRecipe}
            />

            {/* Result Recipe View */}
            {recipe && (
              <div ref={recipeRef} className="pt-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <RecipeView
                  recipe={recipe}
                  onStartCookingAssistant={() => setIsCookingAssistantOpen(true)}
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

      {/* Interactive Cooking Assistant Modal */}
      {isCookingAssistantOpen && recipe && (
        <CookingAssistantModal
          recipe={recipe}
          onClose={() => setIsCookingAssistantOpen(false)}
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
