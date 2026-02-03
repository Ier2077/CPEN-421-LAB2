import { useNavigate } from 'react-router-dom';
import { inventoryAPI } from '../services/api';
import InventoryForm from '../components/InventoryForm';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';

const AddItem = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (formData) => {
        setIsLoading(true);
        try {
            await inventoryAPI.create(formData);
            toast.success('Item created successfully!');
            navigate('/');
        } catch (error) {
            const message = error.response?.data?.message ||
                error.response?.data?.errors?.[0]?.msg ||
                'Failed to create item';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>
                    <FiPlus />
                    Add New Item
                </h1>
                <p>Add a new product to your inventory</p>
            </div>

            <div className="form-container">
                <InventoryForm
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/')}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

export default AddItem;
