import React, { useState, useEffect } from 'react';
import { PlusCircle, Lock, Unlock, Database, Loader2, Search, Filter } from 'lucide-react';
import { useIORStore } from './store/iorStore';
import { MaterialCard } from './components/MaterialCard';
import { MaterialForm } from './components/MaterialForm';
import { AdminLogin } from './components/AdminLogin';
import { IORMaterial } from './types/ior';

function App() {
  const { 
    materials, 
    isAdmin, 
    setAdmin, 
    addMaterial, 
    updateMaterial, 
    validatePassword,
    fetchMaterials,
    isLoading,
    error 
  } = useIORStore();
  
  const [showForm, setShowForm] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<IORMaterial | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const categories = Array.from(new Set(materials.map(m => m.category))).sort();
  
  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || material.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (material: IORMaterial) => {
    setEditingMaterial(material);
    setShowForm(true);
  };

  const handleSubmit = async (material: IORMaterial) => {
    if (editingMaterial) {
      await updateMaterial(editingMaterial.id, material);
    } else {
      await addMaterial(material);
    }
    setShowForm(false);
    setEditingMaterial(undefined);
  };

  const handleAdminLogin = (password: string) => {
    if (validatePassword(password)) {
      setAdmin(true);
      setShowAdminLogin(false);
    }
  };

  const toggleAdmin = () => {
    if (isAdmin) {
      setAdmin(false);
    } else {
      setShowAdminLogin(true);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 flex items-center space-x-2">
          <span className="font-medium">Error:</span>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Database className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">IOR Database</h1>
                <p className="text-sm text-gray-500">Index of Refraction Materials Catalog</p>
              </div>
            </div>
            <button
              onClick={toggleAdmin}
              className="btn-secondary flex items-center space-x-2"
            >
              {isAdmin ? (
                <>
                  <Unlock className="h-5 w-5" />
                  <span>Admin Mode</span>
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5" />
                  <span>View Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
          <div className="flex-1 max-w-2xl space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full input-base"
                aria-label="Search materials"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 input-base"
                aria-label="Filter by category"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center space-x-2 w-full sm:w-auto"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Add Material</span>
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-500">
              Showing {filteredMaterials.length} of {materials.length} materials
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials.map((material) => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          </>
        )}

        {showForm && (
          <MaterialForm
            material={editingMaterial}
            onSubmit={handleSubmit}
            onClose={() => {
              setShowForm(false);
              setEditingMaterial(undefined);
            }}
          />
        )}
        {showAdminLogin && (
          <AdminLogin
            onLogin={handleAdminLogin}
            onClose={() => setShowAdminLogin(false)}
          />
        )}
      </main>
    </div>
  );
}

export default App;