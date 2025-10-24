import React from 'react';
import HeroSlider from './HeroSlider';
import Leaderboard from './Leaderboard';
import FeaturedNews from './FeaturedNews';

const MainContent: React.FC = () => {
    return (
        <>
            <HeroSlider />
            <Leaderboard />
            <FeaturedNews />
        </>
    );
};

export default MainContent;