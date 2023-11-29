//All imports for the APP.JS file
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TextEditor from './TextEditor';
import DocumentList from './DocumentList';
import './App.css';


//Content of APP.JS
const App = () => {
  const [content, setContent] = useState('');
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [isNew, setIsNew] = useState(false);


  //for side effects used useeffect hook
  useEffect(() => {
    // Fetch documents when the component mounts
    axios.get('http://localhost:5000/api/documents')
      .then(response => setDocuments(response.data))
      .catch(error => console.error('Error fetching documents:', error));
  }, []);

  useEffect(() => {
    // Load document content when selectedDocument changes
    handleLoad();
  }, [selectedDocument]);

  useEffect(() => {
    window.addEventListener('unload', handleUnload);
    window.addEventListener('beforeunload', handleBeforeUnload);
   

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, [documentName, content]);

  const debouncedSave = useDebounce(() => {
    handleSave();
  }, 1000);
  useEffect(() => {
    // Use the debouncedSave function as an effect whenever the content or documentName changes
    const intervalId = setInterval(debouncedSave, 1000);
    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [content, documentName, debouncedSave]);


  //Handling main events for the editor
  const handleSave = () => {
    if (!isNew) {
      axios.put(`http://localhost:5000/api/documents/${selectedDocument}`, { name: documentName, content })
        .then(response => {
          // alert('Content and name updated successfully!');
          console.log("Content is updated successfully.");
        })
        .catch(error => console.error('Error updating document:', error));
    } else {
      setIsNew(false);
    }
  };

  const handleNew = async () => {
    handleSave();
    handleClear();
    const name = prompt('Enter document name:');
    if (name) {
      try {
        await createNewDocument(name);
      } catch (error) {
        // Handle errors or cancellation
      }
    }
  };

  const createNewDocument = async (name) => {
    try {
      const response = await axios.post('http://localhost:5000/api/documents', { name, content: "" });
      setDocuments([...documents, response.data]);
      setDocumentName(name);
      setSelectedDocument(response.data._id);
      setIsNew(true);
      console.log('New document created!');
    } catch (error) {
      console.error('Error creating new document:', error);
    }
  };

  const handleLoad = async () => {
    try {
      if (selectedDocument) {
        const response = await axios.get(`http://localhost:5000/api/documents/${selectedDocument}`);
        setDocumentName(response.data.name);
        setContent(response.data.content);
      }
    } catch (error) {
      console.error('Error loading document:', error);
    }
  };

  const handleClear = () => {
    setDocumentName('');
    setContent(() => '');
    setSelectedDocument('');
    setIsNew(false);
  };

  const handleDocumentSelect = (docId) => {
    setSelectedDocument(docId);
    setIsNew(false);
  };

  

  const handleBeforeUnload = (event) => {
    // Your logic for beforeunload event
    const message = 'You have unsaved changes. Are you sure you want to leave?';
    event.returnValue = message; // Standard for most browsers
    return message; // For some older browsers
  };

  const handleUnload = async () => {
    try {
      // Make synchronous API call just before unloading
      axios.put(`http://localhost:5000/api/documents/${selectedDocument}`, { name: documentName, content })
        .then(response => {
          // alert('Content and name updated successfully!');
          console.log("Content is updated successfully.");
        })
        .catch(error => console.error('Error updating document:', error));
    } catch (error) {
      console.error('Error making API call before unload:', error);
    }
  };

  

  return (
    <div className="app">
      <h1>SJ Text Editor</h1>
      <label>
        Document Name:
        <input type="text" value={documentName} onChange={(e) => setDocumentName(e.target.value)} />
      </label>
      <TextEditor
        content={content}
        setContent={setContent}
        onSave={handleSave}
        onLoad={handleLoad}
        onNew={handleNew}
        onClear={handleClear}
      />
      {documents.length > 0 && (
        <DocumentList documents={documents} onSelect={handleDocumentSelect} />
      )}
    </div>
  );
};

//function for debouncing 
function useDebounce(callback, delay) {
  let timeoutId;

  const debouncedFunction = (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  return debouncedFunction;
}

export default App;

