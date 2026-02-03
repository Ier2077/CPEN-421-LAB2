import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { inventoryAPI } from '../services/api';
import InventoryForm from '../components/InventoryForm';
import { toast } from 'react-toastify';
import { FiEdit2 } from 'react-icons/fi';

const EditItem = () => {
    const [item, setItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchItem();
    }, [id]);

    const fetchItem = async () => {
        try {
            const response = await inventoryAPI.getOne(id);
            setItem(response.data);
        } catch (error) {
            toast.error('Failed to fetch item');
            navigate('/');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        setIsSaving(true);
        try {
            await inventoryAPI.update(id, formData);
            toast.success('Item updated successfully!');
            navigate('/');
        } catch (error) {
            const message = error.response?.data?.message ||
                error.response?.data?.errors?.[0]?.msg ||
                'Failed to update item';
            toast.error(message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading item...</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>
                    <FiEdit2 />
                    Edit Item
                </h1>
                <p>Update product details for {item?.name}</p>
            </div>

            <div className="form-container">
                <InventoryForm
                    initialData={item}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/')}
                    isLoading={isSaving}
                />
            </div>
        </div>
    );
};

export default EditItem;
