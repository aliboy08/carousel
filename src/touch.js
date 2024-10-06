const drag_transition_duration = 50; // ms
const drag_distance_threshold = 100;

export function touch_support(carousel){

    const el = carousel.slides_container;

    el.initial_transition_duration = el.style.transitionDuration;

    let x = 0;
    let origin_x;

    el.addEventListener('pointerdown',(e)=>{
        origin_x = e.x;
        el.style.transitionDuration = drag_transition_duration+'ms';
        el.addEventListener('pointermove', drag)
        pause_autoplay();
    })

    el.addEventListener('pointerup',(e)=>{
        el.style.transitionDuration = el.initial_transition_duration;
        el.removeEventListener('pointermove', drag);
        check_navigate();
    })

    function drag(e){
        x = origin_x - e.x;
        el.style.transform = `translate3d(${carousel.translate_x-x}px, 0, 0)`;
    }
    
    function check_navigate(){
        if( Math.abs(x) >= drag_distance_threshold ) {
            if( x > 0 ) {
                // next
                carousel.slide_next();
            }
            else {
                // prev
                carousel.slide_prev();
            }
        } else {
            // restore to initial position
            el.style.transform = `translate3d(${carousel.translate_x}px, 0, 0)`;
        }
    }

    function pause_autoplay(){
        if( !carousel.autoplay ) return;
        clearTimeout(carousel.autoplay_timeout);
    }

}