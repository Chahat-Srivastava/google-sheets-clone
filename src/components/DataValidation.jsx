/*import React, { useState } from "react";

const DataValidation = ({ onDataTypeChange }) => {
  const [selectedType, setSelectedType] = useState("text");

  const handleTypeChange = (event) => {
    const newType = event.target.value;
    setSelectedType(newType);
    onDataTypeChange(newType);
  };

  return (
    <div className="box">
      <label className="label">Data Type:</label>
      <div className="select">
        <select value={selectedType} onChange={handleTypeChange}>
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="date">Date</option>
        </select>
      </div>
    </div>
  );
};

export default DataValidation;*/
import React, { useState } from "react";

const DataValidation = ({ onDataTypeChange, cells = [] }) => {
  const [selectedType, setSelectedType] = useState("text");

  const handleTypeChange = (event) => {
    const newType = event.target.value;
    setSelectedType(newType);
    onDataTypeChange(newType);
  };

  return (
    <div className="box">
      <label className="label">Data Type:</label>
      <div className="select">
        <select value={selectedType} onChange={handleTypeChange}>
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="date">Date</option>
        </select>
      </div>
    </div>
  );
};

export default DataValidation;
