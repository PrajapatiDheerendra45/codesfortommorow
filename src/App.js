import React from "react";
import FileExplorer from "./components/FileExplorer";
import "tailwindcss/tailwind.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const App = () => {
  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <div className="p-10">
          <h1 className="text-2xl font-bold mb-4">React File Explorer</h1>
          <FileExplorer />
        </div>
      </DndProvider>{" "}.0
      
    </div>
  );
};

export default App;