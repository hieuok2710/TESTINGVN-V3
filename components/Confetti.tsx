import React from 'react';

const ConfettiPiece: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
    <div className="absolute w-2 h-4" style={style}></div>
);

const Confetti: React.FC = () => {
    const confettiCount = 150;
    const confetti = [];
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];

    for (let i = 0; i < confettiCount; i++) {
        const style: React.CSSProperties = {
            left: `${Math.random() * 100}%`,
            top: `${-20 + Math.random() * 20}%`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            transform: `rotate(${Math.random() * 360}deg)`,
            animation: `fall ${4 + Math.random() * 6}s linear ${Math.random() * 5}s infinite`,
        };
        confetti.push(<ConfettiPiece key={i} style={style} />);
    }

    return <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">{confetti}</div>;
};

export default Confetti;
