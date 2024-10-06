import './style.css'

import './src/carousel.css';
import Carousel from './src/carousel'

new Carousel('.carousel', {
    speed: 300,
    slides_per_view: 4,
    loop: true,
    gap: 20,
    autoplay: {
        duration: 4000,
        pause_on_hover: true,
    },
    navigation: {
        prev: '.prev',
        next: '.next',
    },
    pagination: '.pagination',
});