import './style.css'
import Carousel from './carousel'

new Carousel('.carousel', {
    speed: 300,
    slides_per_view: 2,
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