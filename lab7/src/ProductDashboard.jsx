import { useState, useMemo, useCallback } from "react";
import { products as initialProducts } from "./data";
import ProductTable from "./ProductTable";

function ProductDashboard() {
  const [filterText, setFilterText] = useState("");
  const [category, setCategory] = useState("all");
  const [items, setItems] = useState(initialProducts);
  const [showHelp, setShowHelp] = useState(false);

  console.log("Dashboard render");

  // TODO 1:
  // The filtering below runs **every time the component renders**.
  // This is an expensive computation when data grows larger.
  // Wrap this logic with `useMemo` so it only recomputes when:
  // - items
  // - filterText
  // - category
  // change.
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

  // TODO 2:
  // The total price calculation is also heavy and runs on **every render**.
  // Use `useMemo` so this expensive reduce operation only runs when
  // filteredProducts changes.

  const totalPrice = useMemo(() => {
    console.log("Computing total price...");
    return filteredProducts.reduce((sum, p) => {
      // Artificial heavy computation
      let fake = 0;
      for (let i = 0; i < 5000; i++) {
        fake += Math.sqrt(p.price) * Math.random();
      }
      return sum + p.price;
    }, 0);
  }, [filteredProducts]);

  // TODO 3:
  // Inline event handler creates a new function **every time the component renders**.
  // When we later wrap ProductRow in React.memo, this will cause
  // ALL rows to re-render because the onToggleFavorite prop is always a new function.
  //
  // Fix:
  // 1. Create a separate function above the return block.
  // 2. Wrap it in `useCallback` so the function reference stays stable.
  //
  // Example:
  // const handleToggleFavorite = useCallback((id) => { ... }, []);
  //
  // Then in JSX:
  // <ProductTable onToggleFavorite={handleToggleFavorite} />

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
          This is a help text.
          {/* After applying useMemo, toggling this SHOULD NOT trigger
              "Filtering products..." or "Computing total price..." logs. */}
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
        // TODO 3 (continued):
        // Replace this inline handler with the memoized one you create.
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
}

export default ProductDashboard;
