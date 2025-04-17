import React from "react";
import UnityPlayer from "./components/UnityPlayer";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Metarise Assets</h1>
      </header>

      <main className="App-main">
        <UnityPlayer />
      </main>
    </div>
  );
}

export default App;
