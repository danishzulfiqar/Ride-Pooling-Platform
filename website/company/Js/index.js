const toggler = document.querySelector(".toggler");
const navMenu = document.querySelector("#navMenu");


window.addEventListener('DOMContentLoaded', (event) => {
    const viewportWidth = window.innerWidth;
    const vantaOptions = {
        el: "#Globe",
        gyroControls: false,
        minHeight: 300.00,
        minWidth: 350.00,
        backgroundColor: 0x221f2f,
        size: 0.70
    };

    if (viewportWidth >= 600) {
        vantaOptions.mouseControls = true;
        vantaOptions.touchControls = true;
        vantaOptions.size = 0.45;
        vantaOptions.minHeight = 200.00;
        vantaOptions.minWidth = 200.00;
    }

    VANTA.HALO(vantaOptions);
});

toggler.addEventListener('click', function () {
    navMenu.classList.toggle("active")
});

const scroll = document.getElementById("scroll");

scroll.addEventListener('click', () => {
    document.querySelector(".about").scrollIntoView({ behavior: 'smooth' });
})

window.addEventListener('scroll', function () {
    const navbar = document.getElementById('NavBar');
    const scrollValue = window.scrollY;

    if (scrollValue > 40) {
        navbar.style.backgroundColor = 'rgba(128, 128, 128, 0.02)';
        navbar.style.webkitBackdropFilter = 'saturate(180%) blur(20px)';
        navbar.style.backdropFilter = 'saturate(180%) blur(20px)';
    } else {
        navbar.style.backgroundColor = '';
        navbar.style.webkitBackdropFilter = '';
        navbar.style.backdropFilter = '';
    }
});
