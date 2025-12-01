// TODO 4:
// This component re-renders for EVERY product whenever the parent renders.
// To optimize this, wrap ProductRow with `React.memo` so it only re-renders
// when its props actually change.
//
// After implementing memo + useCallback in the parent,
// clicking the favorite button should ONLY re-render the changed row,
// not all of them.

import React from "react";

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
  