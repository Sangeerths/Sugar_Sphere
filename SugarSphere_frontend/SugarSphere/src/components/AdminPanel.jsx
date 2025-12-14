import React, { useState, useEffect } from 'react';
import { sweetService } from '../services/sweetService';
import { orderService } from '../services/orderService';
import SweetCard from './SweetCard';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('sweets'); // 'sweets', 'orders', 'revenue'
  const [sweets, setSweets] = useState([]);
  const [orders, setOrders] = useState([]);
  const [revenueStats, setRevenueStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    quantity: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (activeTab === 'sweets') {
      loadSweets();
    } else if (activeTab === 'orders') {
      loadOrders();
    } else if (activeTab === 'revenue') {
      loadRevenueStats();
    }
  }, [activeTab]);

  const loadSweets = async () => {
    try {
      setLoading(true);
      const data = await sweetService.getAllSweets();
      setSweets(data);
    } catch (err) {
      alert('Failed to load sweets');
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await orderService.getAllOrders();
      if (response && response.success) {
        setOrders(response.data || []);
      } else {
        alert('Failed to load orders');
      }
    } catch (err) {
      console.error('Error loading orders:', err);
      alert('Failed to load orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  const loadRevenueStats = async () => {
    try {
      setLoading(true);
      const response = await orderService.getRevenueStats();
      if (response && response.success) {
        setRevenueStats(response.data);
      } else {
        alert('Failed to load revenue stats');
      }
    } catch (err) {
      console.error('Error loading revenue:', err);
      alert('Failed to load revenue stats');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSweet) {
        // Use MongoDB _id for updates, fallback to numeric id if _id doesn't exist
        const sweetId = editingSweet._id || editingSweet.id;
        if (!sweetId) {
          alert('Error: Sweet ID not found');
          return;
        }
        // Ensure category is included from the original sweet when editing
        const updateData = {
          ...formData,
          category: formData.category || editingSweet.category || null
        };
        await sweetService.updateSweet(sweetId, updateData);
        alert('Sweet updated successfully!');
      } else {
        await sweetService.createSweet(formData);
        alert('Sweet created successfully!');
      }
      resetForm();
      loadSweets();
    } catch (err) {
      console.error('Update error:', err);
      alert(err.response?.data?.message || err.message || 'Operation failed');
    }
  };

  const handleEdit = (sweet) => {
    setEditingSweet(sweet);
    setFormData({
      name: sweet.name,
      category: sweet.category || '',
      description: sweet.description || '',
      price: sweet.price,
      quantity: sweet.quantity,
      imageUrl: sweet.imageUrl || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (sweet) => {
    if (window.confirm('Are you sure you want to delete this sweet?')) {
      try {
        // Use MongoDB _id for delete, fallback to numeric id
        const sweetId = sweet._id || sweet.id;
        await sweetService.deleteSweet(sweetId);
        alert('Sweet deleted successfully!');
        loadSweets();
      } catch (err) {
        console.error('Delete error:', err);
        alert(err.response?.data?.message || 'Failed to delete sweet');
      }
    }
  };

  const handleRestock = async (sweet) => {
    const quantity = prompt('Enter quantity to add:');
    if (quantity && !isNaN(quantity)) {
      try {
        // Use MongoDB _id for restock, fallback to numeric id
        const sweetId = sweet._id || sweet.id;
        await sweetService.restockSweet(sweetId, parseInt(quantity));
        alert('Restocked successfully!');
        loadSweets();
      } catch (err) {
        console.error('Restock error:', err);
        alert(err.response?.data?.message || 'Restock failed');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    const note = prompt('Enter status update note (optional):');
    try {
      const response = await orderService.updateOrderStatus(orderId, status, note || '');
      if (response && response.success) {
        alert('Order status updated successfully!');
        loadOrders();
      } else {
        alert('Failed to update order status');
      }
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      price: '',
      quantity: '',
      imageUrl: '',
    });
    setEditingSweet(null);
    setShowForm(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-8">
          Admin Panel
        </h1>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('sweets')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'sweets'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🍬 Manage Sweets
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📦 View Orders
          </button>
          <button
            onClick={() => setActiveTab('revenue')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'revenue'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            💰 Revenue Dashboard
          </button>
        </div>

        {/* Sweets Tab */}
        {activeTab === 'sweets' && (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition"
              >
                {showForm ? 'Cancel' : 'Add New Sweet'}
              </button>
            </div>

            {/* Form */}
            {showForm && (
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>

                  {!editingSweet && (
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Chocolate">Chocolate</option>
                        <option value="Candy">Candy</option>
                        <option value="Gummy">Gummy</option>
                        <option value="Lollipop">Lollipop</option>
                        <option value="Hard Candy">Hard Candy</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      rows="3"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Price (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Quantity</label>
                      <input
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Image URL</label>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition"
                    >
                      {editingSweet ? 'Update' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Sweets Grid */}
            {loading ? (
              <div className="text-center text-2xl font-semibold text-gray-600">Loading...</div>
            ) : sweets.length === 0 ? (
              <div className="text-center text-gray-600 text-xl mt-12">
                No sweets available. Add some to get started!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sweets.map((sweet) => (
                  <div key={sweet.id || sweet._id} className="relative">
                    <SweetCard
                      sweet={sweet}
                      isAdmin={true}
                      onEdit={handleEdit}
                      onDelete={() => handleDelete(sweet)}
                    />
                    <button
                      onClick={() => handleRestock(sweet)}
                      className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-green-600 transition"
                    >
                      Restock
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">All Orders</h2>
            {ordersLoading ? (
              <div className="text-center text-xl font-semibold text-gray-600">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="text-center text-gray-600 text-xl py-12">
                No orders found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Order #</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Items</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">{order.orderNumber || order.id}</td>
                        <td className="py-3 px-4">
                          {order.user?.username || 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          {order.items?.length || 0} item(s)
                        </td>
                        <td className="py-3 px-4 font-semibold">₹{order.totalAmount?.toFixed(2) || '0.00'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            order.orderStatus === 'confirmed' ? 'bg-green-100 text-green-600' :
                            order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                            order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {order.orderStatus || 'pending'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={order.orderStatus || 'pending'}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === 'revenue' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-gray-600 text-sm font-semibold mb-2">Total Revenue</div>
              <div className="text-3xl font-bold text-pink-600">
                ₹{revenueStats?.totalRevenue?.toFixed(2) || '0.00'}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-gray-600 text-sm font-semibold mb-2">Today's Revenue</div>
              <div className="text-3xl font-bold text-purple-600">
                ₹{revenueStats?.todayRevenue?.toFixed(2) || '0.00'}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-gray-600 text-sm font-semibold mb-2">Total Orders</div>
              <div className="text-3xl font-bold text-blue-600">
                {revenueStats?.totalOrders || 0}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-gray-600 text-sm font-semibold mb-2">Completed Orders</div>
              <div className="text-3xl font-bold text-green-600">
                {revenueStats?.completedOrders || 0}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;