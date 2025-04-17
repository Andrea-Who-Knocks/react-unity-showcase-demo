import React from "react";
import UnityPlayer from "./components/UnityPlayer";
import "./App.css"; // Keep or modify default App styles

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Metarise's Assets</h1>
      </header>
      <main>
        <UnityPlayer />
      </main>
    </div>
  );
}

export default App;
