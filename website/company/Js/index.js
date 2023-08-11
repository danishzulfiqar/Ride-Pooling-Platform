const toggler = document.querySelector(".toggler");
const navMenu = document.querySelector("#navMenu");

toggler.addEventListener('click', function () {
    navMenu.classList.toggle("active")
});

const scroll = document.getElementById("scroll");

scroll.addEventListener('click', () => {
    document.querySelector(".about").scrollIntoView({ behavior: 'smooth' });
})

window.addEventListener('scroll', function() {
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
