import React, { useState } from "react";
import "bulma/css/bulma.min.css";

const Toolbar = ({ applyStyle }) => {
  const [localStyles, setLocalStyles] = useState({});

  const toggleStyle = (style, value) => {
    setLocalStyles((prevStyles) => {
      const newStyles = { ...prevStyles, [style]: prevStyles[style] === value ? "normal" : value };
      applyStyle(newStyles);
      return newStyles;
    });
  };

  return (
    <div className="toolbar box">
      <button 
        className={`button is-light ${localStyles.fontWeight === "bold" ? "is-primary" : ""}`}
        onClick={() => toggleStyle("fontWeight", "bold")}
      >
        Bold
      </button>
      <button 
        className={`button is-light ${localStyles.fontStyle === "italic" ? "is-primary" : ""}`}
        onClick={() => toggleStyle("fontStyle", "italic")}
      >
        Italic
      </button>
      <button 
        className={`button is-light ${localStyles.textDecoration === "underline" ? "is-primary" : ""}`}
        onClick={() => toggleStyle("textDecoration", "underline")}
      >
        Underline
      </button>

      <div className="select">
        <select onChange={(e) => toggleStyle("fontSize", e.target.value)}>
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
        </select>
      </div>

      <input
        className="input is-small"
        type="color"
        onChange={(e) => toggleStyle("color", e.target.value)}
      />

      <div className="select">
        <select onChange={(e) => toggleStyle("fontFamily", e.target.value)}>
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="Verdana">Verdana</option>
        </select>
      </div>

      <button 
        className={`button is-light ${localStyles.textAlign === "left" ? "is-primary" : ""}`}
        onClick={() => toggleStyle("textAlign", "left")}
      >
        Left
      </button>
      <button 
        className={`button is-light ${localStyles.textAlign === "center" ? "is-primary" : ""}`}
        onClick={() => toggleStyle("textAlign", "center")}
      >
        Center
      </button>
      <button 
        className={`button is-light ${localStyles.textAlign === "right" ? "is-primary" : ""}`}
        onClick={() => toggleStyle("textAlign", "right")}
      >
        Right
      </button>
    </div>
  );
};

export default Toolbar;