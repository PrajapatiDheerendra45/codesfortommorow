import React from "react";
import FileExplorer from "./components/FileExplorer";
import "tailwindcss/tailwind.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const App = () => {
  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <div className="p-10 bg-pink-300 ">
          <h1 className="text-2xl font-bold mb-4 ml-10 text-green-800">React File Explorer Task </h1>
          <FileExplorer />
        </div>
      </DndProvider>{" "}

    </div>
  );
};

export default App;