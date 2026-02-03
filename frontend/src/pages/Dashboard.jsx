import { useState, useEffect } from 'react';
import { inventoryAPI } from '../services/api';
import InventoryItem from '../components/InventoryItem';
import { toast } from 'react-toastify';
import { FiSearch, FiPackage, FiAlertCircle, FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    const categories = ['All', 'Electronics', 'Clothing', 'Food', 'Furniture', 'Tools', 'Other'];

    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        filterItems();
    }, [items, searchTerm, categoryFilter]);

    const fetchItems = async () => {
        try {
            const response = await inventoryAPI.getAll();
            setItems(response.data);
        } catch (error) {
            toast.error('Failed to fetch inventory items');
        } finally {
            setIsLoading(false);
        }
    };

    const filterItems = () => {
        let filtered = items;

        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (categoryFilter !== 'All') {
            filtered = filtered.filter(item => item.category === categoryFilter);
        }

        setFilteredItems(filtered);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await inventoryAPI.delete(id);
                setItems(items.filter(item => item._id !== id));
                toast.success('Item deleted successfully');
            } catch (error) {
                toast.error('Failed to delete item');
            }
        }
    };

    // Stats calculation
    const totalItems = items.length;
    const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const lowStockItems = items.filter(item => item.quantity <= 10 && item.quantity > 0).length;
    const outOfStockItems = items.filter(item => item.quantity === 0).length;

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading inventory...</p>
            </div>
        );
    }

    return (
        <div className="dashboard">
            {/* Stats Section */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon primary">
                        <FiPackage />
                    </div>
                    <div className="stat-content">
                        <h3>{totalItems}</h3>
                        <p>Total Items</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon success">
                        <span>$</span>
                    </div>
                    <div className="stat-content">
                        <h3>${totalValue.toFixed(2)}</h3>
                        <p>Total Value</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon warning">
                        <FiAlertCircle />
                    </div>
                    <div className="stat-content">
                        <h3>{lowStockItems}</h3>
                        <p>Low Stock</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon danger">
                        <FiAlertCircle />
                    </div>
                    <div className="stat-content">
                        <h3>{outOfStockItems}</h3>
                        <p>Out of Stock</p>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="filters-section">
                <div className="search-box">
                    <FiSearch />
                    <input
                        type="text"
                        placeholder="Search by name, SKU, or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="category-filter"
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <Link to="/add" className="btn btn-primary">
                    <FiPlus />
                    Add Item
                </Link>
            </div>

            {/* Inventory Grid */}
            {filteredItems.length === 0 ? (
                <div className="empty-state">
                    <FiPackage />
                    <h2>No items found</h2>
                    <p>
                        {items.length === 0
                            ? "Start by adding your first inventory item"
                            : "Try adjusting your search or filters"}
                    </p>
                    {items.length === 0 && (
                        <Link to="/add" className="btn btn-primary">
                            <FiPlus />
                            Add Your First Item
                        </Link>
                    )}
                </div>
            ) : (
                <div className="inventory-grid">
                    {filteredItems.map(item => (
                        <InventoryItem
                            key={item._id}
                            item={item}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
