import { useState, useMemo, useCallback } from "react";
import { products as initialProducts } from "./data";
import ProductTable from "./ProductTable";

function ProductDashboard() {
  const [filterText, setFilterText] = useState("");
  const [category, setCategory] = useState("all");
  const [items, setItems] = useState(initialProducts);
  const [showHelp, setShowHelp] = useState(false);

  console.log("Dashboard render");

  // Memoize filtered products to avoid re-filtering on every render.
  // Only recomputes when items, filterText, or category changes.
  const filteredProducts = useMemo(() => {
    console.log("Filtering products...");
    return items
      .filter((p) =>
        p.name.toLowerCase().includes(filterText.toLowerCase())
      )
      .filter((p) =>
        category === "all" ? true : p.category === category
      );
  }, [items, filterText, category]);

  // Memoize total price calculation to avoid expensive computation on every render.
  // Only recalculates when filteredProducts changes.
  const totalPrice = useMemo(() => {
    console.log("Computing total price...");
    return filteredProducts.reduce((sum, p) => {
      // Artificial heavy computation to demonstrate performance benefits
      let fake = 0;
      for (let i = 0; i < 5000; i++) {
        fake += Math.sqrt(p.price) * Math.random();
      }
      return sum + p.price;
    }, 0);
  }, [filteredProducts]);

  // Memoize the toggle handler to maintain stable function reference.
  // Prevents unnecessary re-renders of ProductRow components wrapped in React.memo.
  const handleToggleFavorite = useCallback((id) => {
    setItems((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, favorite: !p.favorite } : p
      )
    );
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Product Dashboard</h1>

      {/* State unrelated to filtering — useful for testing useMemo optimization */}
      <button
        onClick={() => setShowHelp((prev) => !prev)}
        style={{ marginBottom: "8px" }}
      >
        Toggle Help
      </button>
      {showHelp && (
        <p style={{ marginBottom: "16px" }}>
          This is a help text. Toggling this should not trigger filtering or price calculation logs.
        </p>
      )}

      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search…"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{ marginRight: "12px" }}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All</option>
          <option value="book">Book</option>
          <option value="device">Device</option>
          <option value="etc">Etc</option>
        </select>
      </div>

      <p>Showing {filteredProducts.length} items</p>
      <p>Total price: {totalPrice.toFixed(2)}</p>

      <ProductTable
        products={filteredProducts}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
}

export default ProductDashboard;
