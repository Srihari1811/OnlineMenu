import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HomePage.css'; // Custom CSS for Zomato-like styling
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome

function HomePage() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://online-menu-api.vercel.app/addcategories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleAdminLogin = async () => {
    try {
      const response = await axios.post('https://online-menu-api.vercel.app/validate-admin', {
        adminId,
        password,
      });

      if (response.data.isValid) {
        setIsLoggedIn(true);
        setShowModal(false);
        navigate('/admin');
      } else {
        alert('Incorrect Admin ID or Password!');
      }
    } catch (error) {
      console.error('Error validating admin credentials:', error);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="homepage-container">
      <div className="container-fluid">
        <div className="d-flex justify-content-between w-100">
          <button
            type="button"
            className="btn mt-2 admin-btn"
            onClick={() => {
              if (isLoggedIn) {
                alert('You are already logged in.');
              } else {
                setShowModal(true);
              }
            }}
          >
            <i className="fas fa-user-shield admin-icon"></i>
          </button>
          <Link className="navbar-brand mx-auto brand-text" to="/">
            Pizza House
          </Link>
          <Link to="/cart">
            <button type="button" className="btn mt-2 cart-btn">
              <i className="fas fa-shopping-cart cart-icon"></i>
            </button>
          </Link>
        </div>
      </div>
      
      <div className="container" id="container">
        <h2 className="menu-title">Menus</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control search-input"
          />
        </div>
        <div className="row mt-3">
          {filteredCategories.length > 0 ? (
            filteredCategories.map(category => (
              <div key={category._id} className="col-12 col-sm-6 col-md-4 col-lg-3 mt-4">
                <Link to={`/category/${category._id}`} className="text-decoration-none">
                  <img src={category.imageUrl} className="custom-card-img" alt={category.name} />
                  <h5 className="custom-card-body">{category.name}</h5>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-12">
              <p className="no-results">No categories found.</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" style={{color:"black"}}>Admin Login</h5>
                <button type="button" className="close" onClick={() => setShowModal(false)} aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="adminId"style={{color:"black"}}>Admin ID</label>
                  <input
                    type="text"
                    className="form-control"
                    id="adminId"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password"style={{color:"black"}}>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={handleAdminLogin}>
                  Login
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
