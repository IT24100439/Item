import { useEffect, useState } from "react";
import API from "./api";

function App() {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    price: "",
    serialNumber: ""
  });

  const fetchItems = async () => {
    try {
      const response = await API.get("/items");
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      quantity: "",
      price: "",
      serialNumber: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
        serialNumber: formData.serialNumber
      };

      if (editingId) {
        await API.put(`/items/${editingId}`, payload);
      } else {
        await API.post("/items", payload);
      }

      resetForm();
      fetchItems();
    } catch (error) {
      console.error("Error saving item:", error);
      alert(error?.response?.data?.message || "Failed to save item");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      serialNumber: item.serialNumber
    });
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/items/${id}`);
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
      alert(error?.response?.data?.message || "Failed to delete item");
    }
  };

  return (
    <div className="container">
      <h1>Item Manager</h1>

      <form className="item-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          min="0"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
        />

        <input
          type= "text"
          name= "serialNumber"
          placeholder= "Serial Number"
          value = {formData.serialNumber}
          onChange = {handleChange}
          required
        />

        <button type="submit">
          {editingId ? "Update Item" : "Add Item"}
        </button>

        {editingId && (
          <button type="button" className="cancel-btn" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <div className="item-list">
        {items.length === 0 ? (
          <p>No item records found.</p>
        ) : (
          items.map((item) => (
            <div className="item-card" key={item._id}>
              <h3>{item.name}</h3>
              <p><strong>Quantity:</strong> {item.quantity}</p>
              <p><strong>Price:</strong> {item.price}</p>
              <p><strong>Serial Number:</strong> {item.serialNumber}</p>

              <div className="card-actions">
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(item._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;