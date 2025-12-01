import React from "react";

// ProductRow component optimized with React.memo to prevent unnecessary re-renders.
// Only re-renders when props (product or onToggleFavorite) actually change.
// Combined with useCallback in parent, only the toggled row re-renders on favorite clicks.
function ProductRow({ product, onToggleFavorite }) {
  console.log("Row render:", product.name);

  return (
    <tr>
      <td>{product.name}</td>
      <td>{product.category}</td>
      <td>{product.price}</td>
      <td>
        <button onClick={() => onToggleFavorite(product.id)}>
          {product.favorite ? "★" : "☆"}
        </button>
      </td>
    </tr>
  );
}

export default React.memo(ProductRow);
  