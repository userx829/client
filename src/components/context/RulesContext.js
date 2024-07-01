// RulesContext.js
import React, { createContext, useState } from 'react';

export const RulesContext = createContext();

export const RulesProvider = ({ children }) => {
  const [rulesContent, setRulesContent] = useState('');

  return (
    <RulesContext.Provider value={{ rulesContent, setRulesContent }}>
      {children}
    </RulesContext.Provider>
  );
};
