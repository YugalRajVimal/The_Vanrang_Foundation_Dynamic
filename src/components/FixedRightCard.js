import React from 'react'
import { useNavigate } from 'react-router-dom'

const FixedRightCard = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/donate');
  };

  return (
    <div
      className="fixed top-1/2 right-0 -translate-y-1/2 flex flex-col items-center gap-2
                 bg-orange-600 text-orange-50 px-2 py-3 rounded-l-xl
                 text-lg font-extrabold shadow-xl cursor-pointer select-none z-50 border-l-4 border-orange-800"
      style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', letterSpacing: '0.04em' }}
      onClick={handleClick}
      tabIndex={0}
      role="button"
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
      aria-label="Donate Monthly"
    >
      <span
        style={{
          transform: 'rotate(0deg)',
          display: 'flex',
          alignItems: 'center',
          gap:4,
          fontWeight: 900,
          textShadow: '1px 2px 16px #b13d08, 0 1px 4px #f35623'
        }}
      >
        Donate Monthly
        <span
          style={{
            fontSize: '1.5em',
            marginBottom: 2,
            display: 'inline-block',
            transform: 'rotate(90deg)',
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" style={{ verticalAlign: 'middle' }}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </span>
      </span>
    </div>
  )
}

export default FixedRightCard