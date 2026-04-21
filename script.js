var prevScrollpos = window.pageYOffset;
var navBar = document.getElementById("navBar");
var about_subnav = document.getElementById("about_subnav");
window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos && window.innerWidth < 768){
    navBar.style.left = "-50vw";
    about_subnav.style.left = "-100vw";
  } else if(prevScrollpos > currentScrollPos && window.innerWidth < 768){
    navBar.style.left = "-500vw"
    about_subnav.style.left = "-100vw";
  }

  if (prevScrollpos > currentScrollPos) {
    document.getElementById("navbar").style.top = "0";
  } else {
    document.getElementById("navbar").style.top = "-20vh";
  }
  prevScrollpos = currentScrollPos;
}

function showMenu() {
  if (navBar.style.left === "0vw") {
    navBar.style.left = "-50vw";
  } else {
    navBar.style.left = "0vw";
  }
}

document.addEventListener('click', (event) => {
  const aboutButton = document.getElementById('aboutBtn');
  
  if (!about_subnav.contains(event.target) && event.target !== aboutButton) {
    about_subnav.style.left = "-100vw";
  }
});

function showAboutSection(event) {
  if (event) {
    event.stopPropagation();
  }

  if(window.innerWidth > 768){
    if (about_subnav.style.top === "10rem") {
      about_subnav.style.top = "-100vw";
    } else {
      about_subnav.style.top = "10rem";
    }
  } else{
    if (about_subnav.style.left === "40vw") {
      about_subnav.style.left = "-100vw";
    } else {
      about_subnav.style.left = "40vw";
    }
  }
}