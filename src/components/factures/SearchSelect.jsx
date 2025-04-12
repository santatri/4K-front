import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchSelect = ({
  options,
  value,
  onChange,
  placeholder = "Rechercher...",
  disabled = false,
  className = "",
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Trouver l'option sélectionnée pour afficher son label
  const selectedOption = options.find(option => option.value === value);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (value) => {
    onChange(value);
    setIsOpen(false);
    setSearchTerm("");
  };

  const clearSelection = () => {
    onChange("");
    setSearchTerm("");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder={selectedOption ? selectedOption.label : placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className={`w-full pl-10 pr-8 py-2 border ${disabled ? 'bg-gray-100' : 'bg-white'} border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
          disabled={disabled}
        />
        {value && (
          <button
            onClick={clearSelection}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <FaTimes className="text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg py-1 max-h-60 overflow-auto border border-gray-200">
          {loading ? (
            <div className="px-4 py-2 text-gray-500">Chargement...</div>
          ) : filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                className={`px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center ${value === option.value ? 'bg-blue-100' : ''}`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">Aucun résultat trouvé</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchSelect;