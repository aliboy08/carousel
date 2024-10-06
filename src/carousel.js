import { touch_support } from './touch';

export default class Carousel {
    
    constructor(container, options){

        if( typeof container === 'string' ) {
            container = document.querySelector(container)
        }
        this.container = container;
        this.options = options;
        this.translate_x = 0;

        this.loop = this.options.loop ?? false;

        this.init_slides();
        this.init_nav();
        this.init_pagination();
        this.init_autoplay();
        this.init_touch();
    }

    init_slides(){

        this.slides_container = this.container.querySelector('.slides');
        this.slides = this.slides_container.querySelectorAll('.slide');

        const slides_per_view = this.options.slides_per_view ?? 1;
        const gap = this.options.gap ?? 0;
        const transition_duration = this.options.speed ?? 700;
        
        this.slides_count = Math.ceil(this.slides.length / slides_per_view);
        this.slide_index = 0;
        this.slide_index_last = this.slides_count-1
        
        this.slides_container.style.transitionDuration = transition_duration + 'ms';
        this.translate = this.slides_container.offsetWidth + gap;
        
        // calculate items widtdh
        let offset = (slides_per_view-1) * gap;
        let slide_width = (this.slides_container.offsetWidth - offset) / slides_per_view;
        this.slides.forEach(slide=>{
            slide.style.width = slide_width + 'px';
            slide.style.marginRight = gap + 'px';
        })
    }

    init_nav(){

        this.with_nav = false;

        if( typeof this.options.navigation === 'undefined' ) return;

        this.with_nav = true;
        
        let prev = this.options.navigation.prev;
        if( typeof prev === 'string' ) {
            prev = this.container.querySelector(prev);
        }
        this.nav_prev = prev;

        let next = this.options.navigation.next;
        if( typeof next === 'string' ) {
            next = this.container.querySelector(next);
        }
        this.nav_next = next;
        
        this.check_nav_state();

        prev.addEventListener('click', (e)=>{
            e.preventDefault();
            this.slide_prev();
        })
        
        next.addEventListener('click', (e)=>{
            e.preventDefault();
            this.slide_next();
        })
    }

    slide_prev(){

        if( this.slide_index == 0 ) {
            if( this.loop ) {
                this.slide_index = this.slide_index_last;
                this.slide_transition();
            }
            return;
        }

        this.slide_index--;
        this.slide_transition();
    }

    slide_next(){

        if( this.slide_index == this.slide_index_last ) {
            if( this.loop ) {
                this.slide_index = 0;
                this.slide_transition();
            }
            return;
        }

        this.slide_index++;
        this.slide_transition();
    }

    slide_transition(){
        let distance = -this.translate * this.slide_index;
        this.translate_x = distance;
        this.slides_container.style.transform = `translate3d(${distance}px, 0, 0)`;
        this.check_nav_state();
        this.check_pagination_state();
    }

    check_nav_state(){
        if( !this.with_nav ) return;
        if( this.loop ) return;
        this.nav_prev.disabled = this.slide_index == 0;
        this.nav_next.disabled = this.slide_index == this.slide_index_last;
    }
    
    init_autoplay(){
        this.autoplay = false;
        if( typeof this.options.autoplay === 'undefined' ) return;
        if( !this.options.autoplay ) return;
        this.autoplay = true;
        
        this.autoplay_duration = this.options.autoplay.duration ?? 4000;
        this.queue_autoplay();
        this.init_pause_on_hover();
    }

    queue_autoplay(){
        this.autoplay_interval = setInterval(()=>{
            this.slide_next();
        }, this.autoplay_duration);
    }

    init_pause_on_hover(){
        const pause_on_hover = this.options.autoplay.pause_on_hover ?? true;
        if( !pause_on_hover ) return;
        this.slides_container.addEventListener('pointerenter', ()=>{
            clearInterval(this.autoplay_interval);
        })
        this.slides_container.addEventListener('pointerleave', ()=>{
            this.queue_autoplay();
        })
    }

    init_pagination(){

        this.with_pagination = false;

        if( typeof this.options.pagination === 'undefined' ) return;

        let pagination = this.options.pagination;
        if( !pagination ) return;

        this.with_pagination = true;
        
        if( pagination === true ) {
            pagination = '.pagination';
        }

        if( typeof pagination === 'string' ) {
            pagination = this.container.querySelector(pagination);
        }

        this.bullets = [];
        
        this.current_bullet = null;

        for( let i = 0; i < this.slides_count; i++ ) {
            
            const bullet = document.createElement('div');
            bullet.className = 'bullet';
            pagination.append(bullet);
            this.bullets.push(bullet);

            bullet.addEventListener('click', ()=>{
                this.slide_index = i;
                this.slide_transition();
                clearInterval(this.autoplay_interval);
                this.queue_autoplay();
            }) 
        }

        this.check_pagination_state();
    }

    check_pagination_state(){
        if( !this.with_pagination ) return;

        if( this.current_bullet ) {
            this.current_bullet.classList.remove('active');
        }

        this.current_bullet = this.bullets[this.slide_index];
        this.current_bullet.classList.add('active');
    }

    init_touch(){
        touch_support(this);
    }

}