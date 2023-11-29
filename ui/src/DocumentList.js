// src/DocumentList.js
import React from 'react';

const DocumentList = ({ documents, onSelect }) => {
  return (
    <div>
      <label>Select Document: </label>
      <select
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">-- Select --</option>
        {documents.map(doc => (
          <option key={doc._id} value={doc._id}>{doc.name}</option>
        ))}
      </select>
    </div>
  );
};

export default DocumentList;
