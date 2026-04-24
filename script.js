var prevScrollpos = window.pageYOffset;
const navMenu = document.getElementById("navMenu");
const about_subnav = document.getElementById("about_subnav");
window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
  if (window.innerWidth < 850){
    if (prevScrollpos > currentScrollPos){
      navMenu.style.left = "-50vw";
      about_subnav.style.left = "-100vw";
    } else{
      navMenu.style.left = "-200vw"
      about_subnav.style.left = "-100vw";
    }
  }
  if (window.innerWidth > 850){
    if (prevScrollpos > currentScrollPos){
      about_subnav.style.top = "-50vh";
    } else{
      about_subnav.style.top = "-50vh";
    }
  }

  if (prevScrollpos > currentScrollPos) {
    document.getElementById("navBar").style.top = "0";
  } else {
    document.getElementById("navBar").style.top = "-20vh";
  }
  prevScrollpos = currentScrollPos;
}

function showMenu() {
  if (navMenu.style.left === "0vw") {
    navMenu.style.left = "-50vw";
  } else {
    navMenu.style.left = "0vw";
  }
}

const aboutButton = document.getElementById('aboutBtn');
document.addEventListener('click', (event) => {
  
  if (!about_subnav.contains(event.target) && event.target !== aboutButton && window.innerWidth < 850) {
    about_subnav.style.left = "-100vw";
  }
  if (!about_subnav.contains(event.target) && event.target !== aboutButton && window.innerWidth > 850) {
    about_subnav.style.top = "-100vw";
  }
  if (!navMenu.contains(event.target) && event.target !== document.getElementById("menuBtn") && window.innerWidth < 850){
    navMenu.style.left = "-50vw";
  }
});

function showAboutSection(event) {
  if (event) {
    event.stopPropagation();
  }

  if(window.innerWidth > 850){
    about_subnav.style.top = "10rem";
  } else{
    about_subnav.style.left = "40vw";
  }
}

let closeTimer;

const openMenu = () => {
  if(window.innerWidth > 850){
    clearTimeout(closeTimer); // Cancel any pending close
    about_subnav.style.top = "10rem";
  }
};

const startCloseTimer = () => {
  // Give the user 200ms to reach the submenu
  if(window.innerWidth > 850){
    closeTimer = setTimeout(() => {
      about_subnav.style.top = "-100vw";
    }, 500); 
  }
};

// 1. Button Events
aboutButton.addEventListener('mouseenter', openMenu);
aboutButton.addEventListener('mouseleave', startCloseTimer);

// 2. Submenu Events (crucial so it stays open when you move inside)
about_subnav.addEventListener('mouseenter', openMenu);
about_subnav.addEventListener('mouseleave', startCloseTimer);

let slideIndex = 0;

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}
  slides[slideIndex-1].style.display = "block";
  setTimeout(showSlides, 3000); // Change image every 2 seconds
}