import React, { useState } from "react";
import { FaFolder, FaFile, FaPlus, FaTrash, FaEdit, FaFolderOpen, FaSearch } from "react-icons/fa";
import "tailwindcss/tailwind.css";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { AiTwotoneFileAdd } from "react-icons/ai";
const initialData = {
  name: "root",
  isFolder: true,
  children: [
    { name: "Documents", isFolder: true, children: [{ name: "resume.pdf", isFolder: false }] },
    { name: "Images", isFolder: true, children: [{ name: "photo.jpg", isFolder: false }] },
  ],
};

const FileExplorer = () => {
  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleFolder = (node) => {
    node.isOpen = !node.isOpen;
    setData({ ...data });
  };

  const addItem = (node, isFolder) => {
    const name = prompt(`Enter ${isFolder ? "folder" : "file"} name:`);
    if (!name) return;
    if (!node.children) node.children = [];
    node.children.push({ name, isFolder, children: isFolder ? [] : null });
    setData({ ...data });
  };

  const renameItem = (node) => {
    const name = prompt("Enter new name:", node.name);
    if (!name) return;
    node.name = name;
    setData({ ...data });
  };

  const deleteItem = (parent, index) => {
    parent.children.splice(index, 1);
    setData({ ...data });
  };

  const moveItem = (sourceNode, targetNode) => {
    if (!targetNode.isFolder) return;

    const removeNode = (parent, node) => {
      parent.children = parent.children.filter((child) => child !== node);
    };

    const findParent = (parent, node) => {
      if (!parent.children) return null;

      if (parent.children.includes(node)) return parent;

      for (let child of parent.children || []) {
        const found = findParent(child, node);
        if (found) return found;
      }

      return null;
    };

    const parent = findParent(data, sourceNode);
    if (parent) {
      removeNode(parent, sourceNode);
      if (!targetNode.children) targetNode.children = [];
      targetNode.children.push(sourceNode);
      setData({ ...data });
    }
  };


  const searchItems = (node) => {
   
    if (node.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return true;
    }

    if (node.children) {
    
      for (let child of node.children) {
        if (searchItems(child)) {
          return true;
        }
      }
    }

    return false; 
  };

  const FileItem = ({ node, parent, index }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: "ITEM",
      item: { node },
      collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
    }));

    const [, drop] = useDrop(() => ({
      accept: "ITEM",
      drop: ({ node: draggedNode }) => moveItem(draggedNode, node),
    }));

   
    if (searchTerm && !searchItems(node)) {
      return null; 
    }

    return (
      <div ref={drop} className="pl-4">
        <div
          ref={drag}
          className={`flex items-center space-x-2 p-2 rounded-lg shadow-md transition-all ${
            isDragging ? "opacity-50" : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {node.isFolder && (
            node.isOpen ? (
              <FaFolderOpen className="cursor-pointer text-yellow-500" onClick={() => toggleFolder(node)} />
            ) : (
              <FaFolder className="cursor-pointer text-yellow-500" onClick={() => toggleFolder(node)} />
            )
          
          )}
          <span className="font-medium text-gray-700">{node.name}</span>
          {node.isFolder && (
            <>
              <button className="text-green-500" onClick={() => addItem(node, true)}><MdOutlineCreateNewFolder /></button>
              <button className="text-blue-500" onClick={() => addItem(node, false)}><AiTwotoneFileAdd /></button>
            </>
          )}
          
          <button className="text-yellow-500" onClick={() => renameItem(node)}><FaEdit /></button>
          {parent && <button className="text-red-500" onClick={() => deleteItem(parent, index)}><FaTrash /></button>}
        </div>
        {node.isFolder && node.isOpen && (
          <div className="ml-6 border-l-4 border-yellow-400 pl-2 mt-2">
            {node.children && node.children.map((child, idx) => (
              <FileItem key={idx} node={child} parent={node} index={idx} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-5 border rounded-lg w-96 bg-white shadow-lg">
        <h2 className="text-lg font-bold mb-4 text-gray-800">File Explorer</h2>
        <div className="mb-4 flex items-center space-x-2">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search files or folder..."
            className="border p-2 rounded w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <FileItem node={data} />
      </div>
    </DndProvider>
  );
};

export default FileExplorer;
