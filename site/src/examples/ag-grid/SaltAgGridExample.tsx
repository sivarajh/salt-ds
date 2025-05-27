import React from 'react';
import { SaltAgGrid } from '@salt-ds/lab';

export const SaltAgGridExample = () => {
  return (
    <div style={{ 
      height: '700px', // Using 700px for a bit more space
      width: '100%', 
      padding: '20px', // Optional: adds some spacing around the grid container
      boxSizing: 'border-box' // Ensures padding doesn't add to total width/height
    }}>
      <SaltAgGrid />
    </div>
  );
};

export default SaltAgGridExample; // Also adding a default export for flexibility if needed by MDX/site tooling.
