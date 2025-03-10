
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  Filter, 
  BoxesIcon,
  Edit,
  Trash,
  ArrowUpDown
} from "lucide-react";
import { toast } from "sonner";

// Mock data for demonstration
const MOCK_INVENTORY = [
  {
    id: "i1",
    name: "Stéthoscope",
    quantity: 5,
    unit: "unité",
    minQuantity: 2,
    category: "Matériel médical",
    price: 80,
  },
  {
    id: "i2",
    name: "Gants médicaux (L)",
    quantity: 150,
    unit: "paire",
    minQuantity: 50,
    category: "Consommables",
    price: 0.2,
  },
  {
    id: "i3",
    name: "Masques chirurgicaux",
    quantity: 200,
    unit: "unité",
    minQuantity: 100,
    category: "Consommables",
    price: 0.15,
  },
  {
    id: "i4",
    name: "Compresses stériles",
    quantity: 300,
    unit: "boîte",
    minQuantity: 30,
    category: "Consommables",
    price: 3.5,
  },
  {
    id: "i5",
    name: "Thermomètre électronique",
    quantity: 8,
    unit: "unité",
    minQuantity: 3,
    category: "Matériel médical",
    price: 25,
  },
];

const Inventory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [inventory, setInventory] = useState(MOCK_INVENTORY);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 0,
    unit: "",
    minQuantity: 0,
    category: "",
    price: 0,
  });

  // Filter inventory based on search query
  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle adding a new inventory item
  const handleAddItem = () => {
    if (showAddForm) {
      if (newItem.name && newItem.quantity > 0) {
        setInventory([
          ...inventory,
          {
            id: `i${inventory.length + 1}`,
            ...newItem,
          },
        ]);
        setNewItem({
          name: "",
          quantity: 0,
          unit: "",
          minQuantity: 0,
          category: "",
          price: 0,
        });
        setShowAddForm(false);
        toast.success("Article ajouté avec succès");
      } else {
        toast.error("Veuillez remplir tous les champs obligatoires");
      }
    } else {
      setShowAddForm(true);
    }
  };

  // Handle editing an inventory item
  const handleEditItem = (itemId: string) => {
    toast.info(`Modification de l'article: ${itemId}`);
  };

  // Handle deleting an inventory item
  const handleDeleteItem = (itemId: string) => {
    toast.info(`Suppression de l'article: ${itemId}`);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">Inventaire</h1>
        <p className="text-muted-foreground">
          Gérez le stock de matériel et de consommables du cabinet
        </p>
      </div>

      <div className="glass-card mb-8 animate-in">
        <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un article..."
              className="pl-9 w-full sm:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-4 w-4" />
              Filtrer
            </Button>
            <Button size="sm" className="gap-1" onClick={handleAddItem}>
              <Plus className="h-4 w-4" />
              Nouvel article
            </Button>
          </div>
        </div>

        {showAddForm && (
          <div className="p-4 bg-secondary/30 border-b border-border">
            <h3 className="font-medium mb-4">Ajouter un nouvel article</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Nom</label>
                <Input
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Catégorie</label>
                <Input
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Unité</label>
                <Input
                  value={newItem.unit}
                  onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Quantité</label>
                <Input
                  type="number"
                  value={newItem.quantity.toString()}
                  onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Quantité minimum</label>
                <Input
                  type="number"
                  value={newItem.minQuantity.toString()}
                  onChange={(e) => setNewItem({ ...newItem, minQuantity: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Prix unitaire (€)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={newItem.price.toString()}
                  onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddItem}>
                Ajouter
              </Button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  <div className="flex items-center gap-1">
                    Article
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  <div className="flex items-center gap-1">
                    Catégorie
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                  <div className="flex items-center justify-end gap-1">
                    Quantité
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                  Prix unitaire
                </th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                  Valeur totale
                </th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-secondary/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                          <BoxesIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.quantity <= item.minQuantity && (
                            <p className="text-xs text-status-pending">
                              Stock faible
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{item.category}</td>
                    <td className="py-3 px-4 text-right">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {item.price.toFixed(2)} €
                    </td>
                    <td className="py-3 px-4 text-right">
                      {(item.quantity * item.price).toFixed(2)} €
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditItem(item.id)}
                      >
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    Aucun article trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border text-sm text-muted-foreground">
          Affichage de {filteredInventory.length} sur {inventory.length} articles
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
