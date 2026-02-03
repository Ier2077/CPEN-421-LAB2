import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiPackage, FiDollarSign, FiHash, FiTag } from 'react-icons/fi';

const InventoryItem = ({ item, onDelete }) => {
    const getStockStatus = (quantity) => {
        if (quantity === 0) return { class: 'out-of-stock', text: 'Out of Stock' };
        if (quantity <= 10) return { class: 'low-stock', text: 'Low Stock' };
        return { class: 'in-stock', text: 'In Stock' };
    };

    const stockStatus = getStockStatus(item.quantity);

    return (
        <div className="inventory-card">
            <div className="card-header">
                <div className="card-icon">
                    <FiPackage />
                </div>
                <div className="card-title">
                    <h3>{item.name}</h3>
                    <span className="sku">
                        <FiHash /> {item.sku}
                    </span>
                </div>
                <span className={`stock-badge ${stockStatus.class}`}>
                    {stockStatus.text}
                </span>
            </div>

            <p className="card-description">{item.description || 'No description'}</p>

            <div className="card-details">
                <div className="detail">
                    <FiTag />
                    <span>{item.category}</span>
                </div>
                <div className="detail">
                    <FiPackage />
                    <span>{item.quantity} units</span>
                </div>
                <div className="detail price">
                    <FiDollarSign />
                    <span>${item.price.toFixed(2)}</span>
                </div>
            </div>

            <div className="card-actions">
                <Link to={`/edit/${item._id}`} className="btn btn-edit">
                    <FiEdit2 />
                    Edit
                </Link>
                <button
                    onClick={() => onDelete(item._id)}
                    className="btn btn-delete"
                >
                    <FiTrash2 />
                    Delete
                </button>
            </div>
        </div>
    );
};

export default InventoryItem;
