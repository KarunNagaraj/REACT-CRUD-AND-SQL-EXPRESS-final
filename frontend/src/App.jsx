import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/items");
      setItems(response.data);
    } catch (error) {
      console.error("Failed to fetch items:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      if (editId !== null) {
        await axios.put(`http://localhost:8081/api/items/${editId}`, {
          text: text,
        });
        setEditId(null);
      } else {
        await axios.post("http://localhost:8081/api/items", {
          text: text,
        });
      }
      setText("");
      fetchItems();
    } catch (error) {
      console.error("Error saving item:", error);
    }
  }

  async function handleDelete(id) {
    try {
      await axios.delete(`http://localhost:8081/api/items/${id}`);
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }

  function handleEdit(item) {
    setText(item.text);
    setEditId(item.id);
  }

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">React CRUD with SQL (Axios)</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          className="border rounded p-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter item"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          {editId !== null ? "Update" : "Add"}
        </button>
      </form>

      <ul className="w-64 space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <span>{item.text}</span>
            <div className="space-x-2">
              <button
                className="bg-yellow-400 px-2 py-1 rounded"
                onClick={() => handleEdit(item)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
