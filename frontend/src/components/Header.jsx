import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiPackage, FiLogOut, FiUser, FiPlus } from 'react-icons/fi';

const Header = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="header-content">
                <Link to="/" className="logo">
                    <FiPackage className="logo-icon" />
                    <span>InventoryPro</span>
                </Link>

                {isAuthenticated && (
                    <nav className="nav">
                        <Link to="/" className="nav-link">
                            <FiPackage />
                            Dashboard
                        </Link>
                        <Link to="/add" className="nav-link">
                            <FiPlus />
                            Add Item
                        </Link>
                    </nav>
                )}

                <div className="header-actions">
                    {isAuthenticated ? (
                        <>
                            <div className="user-info">
                                <FiUser />
                                <span>{user?.name}</span>
                            </div>
                            <button onClick={handleLogout} className="btn btn-logout">
                                <FiLogOut />
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-primary">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
