// static/js/particles-config.js

// Yeh particlesJS library ko configure karta hai
particlesJS('particles-js', {
    "particles": {
        "number": {
            "value": 80,
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": "#ffffff" // Particles ka color white rakhein, sabpe achha dikhega
        },
        "shape": {
            "type": "circle"
        },
        "opacity": {
            "value": 0.8, // Value badha di taaki particles zyada bright dikhein
            "random": false
        },
        "size": {
            "value": 4, // Size thoda badha diya
            "random": true
        },
        "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#ffffff",
            "opacity": 0.6, // Lines ki opacity bhi badha di
            "width": 1
        },
        "move": {
            "enable": true,
            "speed": 3, // Thoda tezi se move karenge
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "grab"
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "grab": {
                "distance": 140,
                "line_linked": {
                    "opacity": 1
                }
            },
            "push": {
                "particles_nb": 4
            }
        }
    },
    "retina_detect": true
});