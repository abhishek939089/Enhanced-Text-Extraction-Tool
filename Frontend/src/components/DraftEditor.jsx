
import 'draft-js/dist/Draft.css';
import './DraftEditor.css';

import React, { useState } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw } from 'draft-js';
import axios from 'axios'; // Import axios

function DraftEditor() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const toggleInlineStyle = (inlineStyle) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  
  const handleSaveClick = () => {
    const content = JSON.stringify(convertToRaw(editorState.getCurrentContent())); // Convert editor content to JSON string
    const username = localStorage.getItem("username"); // Retrieve the logged-in user's username from localStorage
  
    axios.post('http://localhost:3001/saveContent', { content, username })
      .then(response => {
        console.log('Content saved successfully:', response.data);
      })
      .catch(error => {
        console.error('Error saving content:', error);
      });
  };
  

  const getUserId = () => {
    // Implement logic to retrieve the logged-in user's ID
    // Example: return currentUser.id;
    return 'user123'; // Placeholder
  };

  return (
    <div className="editor-container">
      <div className="editor-toolbar">
        <button onClick={() => toggleInlineStyle('BOLD')}>Bold</button>
        <button onClick={() => toggleInlineStyle('UNDERLINE')}>Underline</button>
        <button onClick={() => toggleInlineStyle('ITALIC')}>Italic</button>
        <button onClick={() => toggleInlineStyle('HIGHLIGHT')}>Highlight</button>
        <button onClick={handleSaveClick}>Save</button>
      </div>
      <div className="editor-content">
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={handleKeyCommand}
          placeholder="Write your views here..."
        />
      </div>
    </div>
  );
}

export default DraftEditor;
