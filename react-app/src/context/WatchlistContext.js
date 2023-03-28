import React, { createContext, useState, useContext } from "react";

// Create a new context
export const WatchlistFormContext = createContext(false);
export const useWatchlistFormContext = () => useContext(WatchlistFormContext)

// Define the default value for the context

// Create a provider component that provides the context value to child components
export default function WatchlistFormProvider (props) {
  const [watchlistFormState, setWatchlistFormState] = useState(false);
  return (
    <WatchlistFormContext.Provider
    value={{
        watchlistFormState,
        setWatchlistFormState
    }}>
        {props.children}
    </WatchlistFormContext.Provider>
  );
};
