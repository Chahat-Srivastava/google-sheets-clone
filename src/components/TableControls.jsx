import React from "react";

const TableControls = ({ addRow, addColumn, deleteRow, deleteColumn }) => {
  return (
    <div className="buttons">
      <button className="button is-primary" onClick={addRow}>➕ Add Row</button>
      <button className="button is-primary" onClick={addColumn}>➕ Add Column</button>
      <button className="button is-danger" onClick={deleteRow}>🗑️ Delete Last Row</button>
      <button className="button is-danger" onClick={deleteColumn}>🗑️ Delete Last Column</button>
    </div>
  );
};

export default TableControls;
