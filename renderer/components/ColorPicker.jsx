import React, { useCallback, useRef, useState } from "react";
import { RgbColorPicker } from "react-colorful";

import useClickOutside from "../lib/useClickOutside";

const ColorPicker = ({ color, onChange, disabled, label }) => {
  const popover = useRef();
  const [isOpen, toggle] = useState(false);

  const close = useCallback(() => toggle(false), []);
  useClickOutside(popover, close);

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          width: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '56px',
          borderRadius: '8px',
          opacity: disabled ? 0.2 : 1,
          pointerEvents: disabled ? 'none' : 'auto',
          border: '2px solid #555',
          boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
          backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`

        }}
        onClick={() => toggle(true)}
      >
        <span style={{
          textShadow: "-1px -1px 0 #111,1px -1px 0 #111,-1px 1px 0 #111,1px 1px 0 #111",
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          KhtmlUserSelect: 'none',
          MozUserSelect: 'none',
          MsUserSelect: 'none',
          userSelect: 'none'
        }}>{label}</span>
      </div>
      {isOpen && (
        <div style={{
          position: 'absolute',
          zIndex: 1,
          top: '50%',
          right: '100%',
          borderRadius: '9px',
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
        }
        } ref={popover}>
          <RgbColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  );
};
export default ColorPicker