import React, { createContext, useState, useContext } from "react";

// Create a new context
export const StockContext = createContext('');
export const useStockContext = () => useContext(StockContext)

// Define the default value for the context

// Create a provider component that provides the context value to child components
export default function StockProvider (props) {
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  return (
    <StockContext.Provider
    value={{
        stockSearchQuery,
        setStockSearchQuery
    }}>
        {props.children}
    </StockContext.Provider>
  );
};
