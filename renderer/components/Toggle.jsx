import React from 'react'

const Toggle = ({ value, setValue, label }) => {
    return (
        <div
            style={{
                width: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '56px',
                borderRadius: '8px',
                border: '2px solid #555',
                backgroundColor: value ? '#666' : 'inherit',
                boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',

            }}
            onClick={() => setValue(!value)}
        >
            <span style={{
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                KhtmlUserSelect: 'none',
                MozUserSelect: 'none',
                MsUserSelect: 'none',
                userSelect: 'none'
            }}>{label}</span>
        </div>
    )
}

export default Toggle
