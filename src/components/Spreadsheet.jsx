/*import React, { useState } from "react";
import * as XLSX from 'xlsx';
import '../styles/Spreadsheet.css'
import DataValidation from "./DataValidation";
import "bulma/css/bulma.min.css";

const Spreadsheet = () => {
  const rows = 15;
  const cols = 26;
  const [cells, setCells] = useState(
    Array(rows).fill(null).map(() => Array(cols).fill({ value: "", formula: "", styles: {} }))
  );
  const [cellDataTypes, setCellDataTypes] = useState(
    Array(rows).fill(null).map(() => Array(cols).fill("text"))
  );
  
  const [selectedCell, setSelectedCell] = useState(null);
  const [boldActive, setBoldActive] = useState(false);
  const [italicActive, setItalicActive] = useState(false);
  const [underlineActive, setUnderlineActive] = useState(false);
  const [fontSize, setFontSize] = useState("14px");
  const [fontColor, setFontColor] = useState("#000000");

  const getCellValue = (ref) => {
    const match = ref.match(/^([A-Z]+)(\d+)$/);
    if (!match) return "";
    const col = match[1].charCodeAt(0) - 65;
    const row = parseInt(match[2], 10) - 1;
    return cells[row] && cells[row][col] ? cells[row][col].value : "";
  };

const exportToCSV = () => {
  let csvContent = "data:text/csv;charset=utf-8,";

  // Add headers (Column Letters)
  csvContent += "," + Array.from({ length: cols }, (_, i) => String.fromCharCode(65 + i)).join(",") + "\n";

  // Add row data
  cells.forEach((row, rowIndex) => {
    let rowData = [rowIndex + 1]; // Row number
    row.forEach((cell) => {
      rowData.push(cell.value ? `"${cell.value}"` : "");
    });
    csvContent += rowData.join(",") + "\n";
  });

  // Create a download link
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "spreadsheet_data.csv");
  document.body.appendChild(link);
  link.click();
};

const exportToExcel = () => {
  const ws = XLSX.utils.aoa_to_sheet([
    ["", ...Array.from({ length: cols }, (_, i) => String.fromCharCode(65 + i))], // Header Row
    ...cells.map((row, rowIndex) => [rowIndex + 1, ...row.map((cell) => cell.value || "")]),
  ]);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, "spreadsheet_data.xlsx");
};


  const evaluateFormula = (formula) => {
    try {
      if (formula.startsWith("=SUM(")) {
        const refs = formula.slice(5, -1).split(":");
        const values = refs.map(getCellValue).map(Number);
        return values.reduce((sum, val) => sum + val, 0);
      }
      if (formula.startsWith("=AVERAGE(")) {
        const refs = formula.slice(9, -1).split(":");
        const values = refs.map(getCellValue).map(Number);
        return values.reduce((sum, val) => sum + val, 0) / values.length;
      }
      if (formula.startsWith("=MAX(")) {
        const refs = formula.slice(5, -1).split(":");
        const values = refs.map(getCellValue).map(Number);
        return Math.max(...values);
      }
      if (formula.startsWith("=MIN(")) {
        const refs = formula.slice(5, -1).split(":");
        const values = refs.map(getCellValue).map(Number);
        return Math.min(...values);
      }
      if (formula.startsWith("=COUNT(")) {
        const refs = formula.slice(7, -1).split(":");
        const values = refs.map(getCellValue).map(Number);
        return values.filter(v => !isNaN(v)).length;
      }
      if (formula.startsWith("=UPPER(")) {
        const content = formula.slice(7, -1);
        const value = content.startsWith("\"") && content.endsWith("\"") 
          ? content.slice(1, -1) 
          : getCellValue(content);
        return value ? value.toString().toUpperCase() : "";
      }
      if (formula.startsWith("=LOWER(")) {
        const content = formula.slice(7, -1);
        const value = content.startsWith("\"") && content.endsWith("\"") 
          ? content.slice(1, -1) 
          : getCellValue(content);
        return value ? value.toString().toLowerCase() : "";
      }
      if (formula.startsWith("=TRIM(")) {
        const content = formula.slice(6, -1);
        const value = content.startsWith("\"") && content.endsWith("\"") 
          ? content.slice(1, -1) 
          : getCellValue(content);
        return value ? value.toString().trim() : "";
      }
    } catch (error) {
      return "ERROR";
    }
    return formula;
  };
  const handleDataTypeChange = (newType) => {
    if (selectedCell) {
      setCellDataTypes((prev) => ({
        ...prev,
        [`${selectedCell.row}-${selectedCell.col}`]: newType,
      }));
    }
  };
  
  
  const toggleBold = () => setBoldActive(!boldActive);
  const toggleItalic = () => setItalicActive(!italicActive);
  const toggleUnderline = () => setUnderlineActive(!underlineActive);
  
  const handleCellClick = (row, col) => {
    setSelectedCell({ row, col });
    setTimeout(() => document.getElementById(`cell-${row}-${col}`)?.focus(), 0);
  };
  

  const handleChange = (e, row, col) => {
    const newCells = [...cells];
    let value = e.target.value;
    let formula = "";

    if (value.startsWith("=")) {
      formula = value;
      value = evaluateFormula(value);
    }

    const dataType = cellDataTypes[`${row}-${col}`];

    // Enforce Data Type Validation
    if (dataType === "number" && isNaN(value)) return;
    if (dataType === "date" && isNaN(Date.parse(value))) return;

    newCells[row][col] = {
      ...newCells[row][col],
      value,
      formula,
      styles: { 
        ...newCells[row][col].styles,
        fontWeight: boldActive ? "bold" : "normal",
        fontStyle: italicActive ? "italic" : "normal",
        textDecoration: underlineActive ? "underline" : "none",
        fontSize: fontSize,
        color: fontColor
      },
    };

    setCells(newCells);
  };


  return (
    <div className="container">
      <h1 className="title has-text-centered">Google Sheets Clone</h1>
      
      <div className="box">
        <button className={`button is-small ${boldActive ? "is-primary" : ""}`} onClick={toggleBold}>Bold</button>
        <button className={`button is-small ${italicActive ? "is-primary" : ""}`} onClick={toggleItalic}>Italic</button>
        <button className={`button is-small ${underlineActive ? "is-primary" : ""}`} onClick={toggleUnderline}>Underline</button>
        <button className="button is-small is-info" onClick={exportToCSV}>Export as CSV</button>
<button className="button is-small is-success" onClick={exportToExcel}>Export as Excel</button>

        <input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} />
        <select value={fontSize} onChange={(e) => setFontSize(e.target.value)}>
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
        </select>
      </div>
      <DataValidation onDataTypeChange={handleDataTypeChange} />
      <div className="table-container" style={{ overflow: "auto", maxHeight: "500px" }}>
        <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th></th>
              {Array.from({ length: cols }, (_, i) => (
                <th key={i}>{String.fromCharCode(65 + i)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cells.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <th style={{ minWidth: "80px", textAlign: "center" }}>{rowIndex + 1}</th>
                {row.map((cell, colIndex) => (
                  
                  <td key={colIndex} className="custom-table-cell" style={cell.styles}  onClick={() => handleCellClick(rowIndex, colIndex)}>
                    <input className="input is-small" type="text" value={selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? cell.formula || cell.value : cell.value} onChange={(e) => handleChange(e, rowIndex, colIndex)} style={cell.styles} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Spreadsheet;*/
import React, { useState } from "react";
import * as XLSX from 'xlsx';
import TableControls from "./TableControls";
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css'; // Import styles
import '../styles/Spreadsheet.css'
import DataValidation from "./DataValidation";
import "bulma/css/bulma.min.css";

const Spreadsheet = () => {
  const rows = 15;
  const cols = 26;
  const [cells, setCells] = useState(
    Array(rows).fill(null).map(() => Array(cols).fill({ value: "", formula: "", styles: {} }))
  );
  const [cellDataTypes, setCellDataTypes] = useState(
    Array(rows).fill(null).map(() => Array(cols).fill("text"))
  );
  const [c,setCols] = useState(26);
  const [rowHeights, setRowHeights] = useState(Array(rows).fill(30));
  const [selectedCell, setSelectedCell] = useState(null);
  const [boldActive, setBoldActive] = useState(false);
  const [italicActive, setItalicActive] = useState(false);
  const [underlineActive, setUnderlineActive] = useState(false);
  const [fontSize, setFontSize] = useState("14px");
  const [fontColor, setFontColor] = useState("#000000");

  const getCellValue = (ref) => {
    const match = ref.match(/^([A-Z]+)(\d+)$/);
    if (!match) return "";
    const col = match[1].charCodeAt(0) - 65;
    const row = parseInt(match[2], 10) - 1;
    return cells[row] && cells[row][col] ? cells[row][col].value : "";
  };
  const getValuesFromRange = (range) => {
    const match = range.match(/^([A-Z]+)(\d+):([A-Z]+)(\d+)$/);
    if (!match) return [];
  
    let [_, startCol, startRow, endCol, endRow] = match;
    startCol = startCol.charCodeAt(0) - 65;
    endCol = endCol.charCodeAt(0) - 65;
    startRow = parseInt(startRow, 10) - 1;
    endRow = parseInt(endRow, 10) - 1;
  
    let values = [];
  
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        let value = getCellValue(String.fromCharCode(65 + col) + (row + 1));
        
        // Convert to number if possible, else ignore
        let numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          values.push(numValue);
        }
      }
    }
  
    return values;
  };
  

const exportToCSV = () => {
  let csvContent = "data:text/csv;charset=utf-8,";

  // Add headers (Column Letters)
  csvContent += "," + Array.from({ length: cols }, (_, i) => String.fromCharCode(65 + i)).join(",") + "\n";

  // Add row data
  cells.forEach((row, rowIndex) => {
    let rowData = [rowIndex + 1]; // Row number
    row.forEach((cell) => {
      rowData.push(cell.value ? `"${cell.value}"` : "");
    });
    csvContent += rowData.join(",") + "\n";
  });

  // Create a download link
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "spreadsheet_data.csv");
  document.body.appendChild(link);
  link.click();
};

const exportToExcel = () => {
  const ws = XLSX.utils.aoa_to_sheet([
    ["", ...Array.from({ length: cols }, (_, i) => String.fromCharCode(65 + i))], // Header Row
    ...cells.map((row, rowIndex) => [rowIndex + 1, ...row.map((cell) => cell.value || "")]),
  ]);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, "spreadsheet_data.xlsx");
};

const addRow = () => {
  setCells([...cells, Array(cols).fill({ value: "", formula: "", styles: {} })]);
  setRowHeights([...rowHeights, 30]);
};

const addColumn = () => {
  setCols(cols + 1);
  setCells(cells.map(row => [...row, { value: "", formula: "", styles: {} }]));
};

const deleteRow = () => {
  if (cells.length > 1) {
    setCells(cells.slice(0, -1));
    setRowHeights(rowHeights.slice(0, -1));
  }
};

const deleteColumn = () => {
  if (cols > 1) {
    setCols(cols - 1);
    setCells(cells.map(row => row.slice(0, -1)));
  }
};
  const evaluateFormula = (formula) => {
    try {

      if (formula.startsWith("=SUM(")) {
        const values = getValuesFromRange(formula.slice(5, -1));
        return values.reduce((sum, val) => sum + val, 0);
      }
      if (formula.startsWith("=AVERAGE(")) {
        const values = getValuesFromRange(formula.slice(9, -1));
        return values.length ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
      }
      if (formula.startsWith("=MAX(")) {
        const values = getValuesFromRange(formula.slice(5, -1));
        return values.length ? Math.max(...values) : "N/A";
      }
      if (formula.startsWith("=MIN(")) {
        const values = getValuesFromRange(formula.slice(5, -1));
        return values.length ? Math.min(...values) : "N/A";
      }
      if (formula.startsWith("=COUNT(")) {
        const values = getValuesFromRange(formula.slice(7, -1));
        return values.length;
      }
      
      if (formula.startsWith("=UPPER(")) {
        const content = formula.slice(7, -1);
        const value = content.startsWith("\"") && content.endsWith("\"") 
          ? content.slice(1, -1) 
          : getCellValue(content);
        return value ? value.toString().toUpperCase() : "";
      }
      if (formula.startsWith("=LOWER(")) {
        const content = formula.slice(7, -1);
        const value = content.startsWith("\"") && content.endsWith("\"") 
          ? content.slice(1, -1) 
          : getCellValue(content);
        return value ? value.toString().toLowerCase() : "";
      }
      if (formula.startsWith("=TRIM(")) {
        const content = formula.slice(6, -1);
        const value = content.startsWith("\"") && content.endsWith("\"") 
          ? content.slice(1, -1) 
          : getCellValue(content);
        return value ? value.toString().trim() : "";
      }
    } catch (error) {
      return "ERROR";
    }
    return formula;
  };
  const handleDataTypeChange = (newType) => {
    if (selectedCell) {
      setCellDataTypes((prev) => ({
        ...prev,
        [`${selectedCell.row}-${selectedCell.col}`]: newType,
      }));
    }
  };
  
  
  const toggleBold = () => setBoldActive(!boldActive);
  const toggleItalic = () => setItalicActive(!italicActive);
  const toggleUnderline = () => setUnderlineActive(!underlineActive);
  
  const handleCellClick = (row, col) => {
    setSelectedCell({ row, col });
    setTimeout(() => document.getElementById(`cell-${row}-${col}`)?.focus(), 0);
  };
  

  const handleChange = (e, row, col) => {
    const newCells = [...cells];
    let value = e.target.value;
    let formula = "";

    if (value.startsWith("=")) {
      formula = value;
      value = evaluateFormula(value);
    }

    const dataType = cellDataTypes[`${row}-${col}`];

    // Enforce Data Type Validation
    if (dataType === "number" && isNaN(value)) return;
    if (dataType === "date" && isNaN(Date.parse(value))) return;

    newCells[row][col] = {
      ...newCells[row][col],
      value,
      formula,
      styles: { 
        ...newCells[row][col].styles,
        fontWeight: boldActive ? "bold" : "normal",
        fontStyle: italicActive ? "italic" : "normal",
        textDecoration: underlineActive ? "underline" : "none",
        fontSize: fontSize,
        color: fontColor
      },
    };

    setCells(newCells);
  };


  return (
    <div className="container">
      <h1 className="title has-text-centered">Google Sheets Clone</h1>
      
      <div className="box">
        <button className={`button is-small ${boldActive ? "is-primary" : ""}`} onClick={toggleBold}>Bold</button>
        <button className={`button is-small ${italicActive ? "is-primary" : ""}`} onClick={toggleItalic}>Italic</button>
        <button className={`button is-small ${underlineActive ? "is-primary" : ""}`} onClick={toggleUnderline}>Underline</button>
        <button className="button is-small is-info" onClick={exportToCSV}>Export as CSV</button>
<button className="button is-small is-success" onClick={exportToExcel}>Export as Excel</button>

        <input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} />
        <select value={fontSize} onChange={(e) => setFontSize(e.target.value)}>
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
        </select>
      </div>
      <DataValidation onDataTypeChange={handleDataTypeChange} />
      <TableControls addRow={addRow} addColumn={addColumn} deleteRow={deleteRow} deleteColumn={deleteColumn} />
      <div className="table-container" style={{ overflow: "auto", maxHeight: "500px" }}>
        <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th></th>
              {Array.from({ length: cols }, (_, i) => (
                <th key={i} className="resizable">
                <ResizableBox width={80} height={30} axis="x" minConstraints={[50, 30]} maxConstraints={[300, 30]}>
                  <span>{String.fromCharCode(65 + i)}</span>
                </ResizableBox>
              </th>
              
              ))}
            </tr>
          </thead>
          <tbody>
            {cells.map((row, rowIndex) => (
              
              <tr key={rowIndex}>
                <th style={{ minWidth: "80px", textAlign: "center" }}>{rowIndex + 1}</th>
                {row.map((cell, colIndex) => (
                  
                  <td key={colIndex} className="custom-table-cell" style={cell.styles}  onClick={() => handleCellClick(rowIndex, colIndex)}>
                    <input className="input is-small" type="text" value={selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? cell.formula || cell.value : cell.value} onChange={(e) => handleChange(e, rowIndex, colIndex)} style={cell.styles} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Spreadsheet;