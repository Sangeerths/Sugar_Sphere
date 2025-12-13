import React from 'react';

const SweetCard = ({ sweet, onPurchase, isAdmin, onEdit, onDelete }) => {
  const isOutOfStock = sweet.quantity === 0;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
      <div className="h-48 bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
        {sweet.imageUrl ? (
          <img src={sweet.imageUrl} alt={sweet.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-6xl">🍬</span>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{sweet.name || 'Sweet'}</h3>
        {sweet.category && (
          <p className="text-sm text-gray-600 mb-2">{sweet.category}</p>
        )}
        <p className="text-gray-700 mb-4">{sweet.description || 'Delicious sweet treat'}</p>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-pink-600">₹{sweet.price || 0}</span>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            isOutOfStock ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
          }`}>
            {isOutOfStock ? 'Out of Stock' : `${sweet.quantity || 0} in stock`}
          </span>
        </div>

        <div className="flex gap-2">
          {!isAdmin && (
            <button
              onClick={() => onPurchase(sweet.id)}
              disabled={isOutOfStock}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                isOutOfStock
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700'
              }`}
            >
              Purchase
            </button>
          )}
          
          {isAdmin && (
            <>
              <button
                onClick={() => onEdit(sweet)}
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(sweet.id)}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SweetCard;