import React from 'react';
import './SearchInput.css';
import searchIcon from "../../icons/search.svg"

export const SearchInput = ({ placeholder }) => {
  return (
    <div className="search-input-wrap">
      <img src={searchIcon} className="search-icon" alt="search-icon" />
      <input
        type="search"
        className="search-input"
        placeholder={placeholder || 'Search...'}
      />
    </div>
  );
};
