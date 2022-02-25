import React, { useCallback, useRef, useState } from 'react';
import { RgbColorPicker } from 'react-colorful';
import useClickOutside from '../lib/useClickOutside';
import ReactGPicker from 'react-gcolor-picker';
import useStyles from '../styles/GradientPicker.styles';

const ColorPicker = ({ color, onChange, disabled, label, gradient }) => {
  const popover = useRef();
  const classes = useStyles()
  const [isOpen, toggle] = useState(false);

  const [gcolors, setGcolors] = useState([        
    "linear-gradient(90deg, rgb(255, 0, 0) 0%, rgb(255, 120, 0) 14%, rgb(255, 200, 0) 28%, rgb(0, 255, 0) 42%, rgb(0, 199, 140) 56%, rgb(0, 0, 255) 70%, rgb(128, 0, 128) 84%, rgb(255, 0, 178) 98%)",
    "linear-gradient(90deg, rgb(255, 0, 0) 0%, rgb(255, 0, 178) 50%, rgb(0, 0, 255) 100%)",
    "linear-gradient(90deg, rgb(0, 0, 255) 0%, rgb(128, 0, 128) 25%, rgb(255, 0, 0) 50%, rgb(255, 40, 0) 75%, rgb(255, 200, 0) 100%)",
    "linear-gradient(90deg, rgb(0, 255, 255) 0%, rgb(0, 0, 255) 100%)",
    "linear-gradient(90deg, rgb(128, 0, 128) 0%, rgb(0, 0, 255) 25%, rgb(0, 128, 128) 50%, rgb(0, 255, 0) 75%, rgb(255, 200, 0) 100%)",
    "linear-gradient(90deg, rgb(0, 255, 0) 0%, rgb(34, 139, 34) 50%, rgb(255, 120, 0) 100%)",
    "linear-gradient(90deg, rgb(255, 0, 178) 0%, rgb(255, 40, 0) 50%, rgb(255, 200, 0) 100%)",
    "linear-gradient(90deg, rgb(0, 199, 140) 0%, rgb(0, 255, 50) 100%)",
    "linear-gradient(90deg, rgb(0, 0, 255) 0%, rgb(0, 255, 255) 33%, rgb(128, 0, 128) 66%, rgb(255, 0, 178) 99%)",
    "linear-gradient(90deg, rgb(0, 0, 128) 0%, rgb(255, 120, 0) 50%, rgb(255, 0, 0) 100%)",
    "linear-gradient(90deg, rgb(255, 40, 0) 0%, rgb(128, 0, 128) 33%, rgb(0, 199, 140) 66%, rgb(0, 255, 0) 99%)",
    "linear-gradient(90deg, rgb(255, 40, 0) 0%, rgb(255, 0, 0) 100%)",
    "linear-gradient(90deg, rgb(0, 255, 0) 0%, rgb(255, 200, 0) 25%, rgb(255, 120, 0) 50%, rgb(255, 40, 0) 75%, rgb(255, 0, 0) 100%)"        
])

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
          boxShadow:
            '0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
          background: gradient ? color : `rgb(${color.r}, ${color.g}, ${color.b})`,
        }}
        onClick={() => toggle(true)}>
        <span
          style={{
            textShadow:
              '-1px -1px 0 #111,1px -1px 0 #111,-1px 1px 0 #111,1px 1px 0 #111',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            KhtmlUserSelect: 'none',
            MozUserSelect: 'none',
            MsUserSelect: 'none',
            userSelect: 'none',
          }}>
          {label}
        </span>
      </div>
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            zIndex: 1,
            bottom: '100%',
            right: '0%',
            borderRadius: '9px',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
          }}
          className={`${classes.paper} gradient-picker`}
          ref={popover}>
          {gradient ? (
            <ReactGPicker
              value={color}
              debounce={false}
              onChange={onChange}
              format='rgb'
              gradient={true}
              solid={false}
              showAlpha={false}
              showInputs={false}
              showGradientResult={false}
              defaultActiveTab={'gradient'}
              defaultColors={gcolors}
            />
          ) : (
            <RgbColorPicker color={color} onChange={onChange} />
          )}
        </div>
      )}
    </div>
  );
};
export default ColorPicker;
