// src/TextEditor.js
import React from 'react';

const TextEditor = ({ content, setContent, onSave, onLoad, onNew, onClear }) => {
  const handleChange = (e) => {
    setContent(e.target.value);
  };

  return (
    <div className="text-editor">
      <textarea value={content} onChange={handleChange} />
      <div className="editor-buttons">
        {/* <button onClick={onSave}>Save</button>
        <button onClick={onLoad}>Load</button> */}
        <button onClick={onNew}>New</button>
        <button onClick={onClear}>Clear</button>
      </div>
    </div>
  );
};

export default TextEditor;
