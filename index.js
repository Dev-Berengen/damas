import { data } from "./data.js";
import { generateDialogHTML, generateProductHTML } from "./functions.js";

// selection des elements
const productsContainer = document.querySelector(".produits");
const carouselContainer = document.querySelector(".carousel");
const storieContainer = document.querySelector(".storie");
const storiesContainer = document.querySelector(".stories");
const footerContainer = document.querySelector("footer");
const dialog = document.querySelector("dialog");
const cartNumber = document.querySelector(".nombre");
let produitAffciher = data;
let cartItems = [];
let currentItem = null;

// Carousel functionality
const initCarousel = () => {
  const cards = document.querySelectorAll(".card");
  let currentIndex = 0;
  const showCard = (index) => {
    cards.forEach((card, i) => {
      card.classList.remove("active", "prev");
      if (i === index) {
        card.classList.add("active");
      } else {
        card.classList.add("prev");
      }
    });
  };
  const nextCard = () => {
    currentIndex = (currentIndex + 1) % cards.length;
    showCard(currentIndex);
  };

  // Initialize first card
  if (cards.length > 0) {
    showCard(0);
    // Auto-advance carousel every 4 seconds
    setInterval(nextCard, 4000);
  }
};

// Initialize carousel when DOM is loaded
document.addEventListener("DOMContentLoaded", initCarousel);

// Code pour looper entre différents produits et les afficher
const afficherProduit = (produits) => {
  produits.forEach((product) => {
    const productHTML = document.createElement("div");
    productHTML.classList.add("carte-produit");
    //Ajout de l'id pour identifier chaque produit cliqué
    productHTML.setAttribute("data-id", product.id);
    productHTML.innerHTML = generateProductHTML(product);
    productsContainer.appendChild(productHTML);
  });
};
afficherProduit(produitAffciher);

// Recherche des produits
  const input = document.querySelector(".recherche");
  input.addEventListener("keyup", (e) => {
  console.log(e.target.value);
	const query = (e.target.value || "").toLocaleLowerCase().trim();
	const resultat = data.filter((p) =>
		(p.nom || "").toLocaleLowerCase().includes(query)
	);
  productsContainer.innerHTML = "";
  carouselContainer.style.display = "none";
  storieContainer.style.display = "none";
  storiesContainer.style.display = "none";
  footerContainer.style.display = "none";

  if (resultat.length > 0) {
    afficherProduit(resultat);
    actionProduit();
  } else {
    const vide = document.createElement("h4");
    vide.textContent = "Aucun produit trouvé";
    productsContainer.appendChild(vide);
  }
});

const actionProduit = () => {
  // Ajout de l'action pour afficher la boite de dialogue
  const cards = document.querySelectorAll(".carte-produit");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      // Selection des elements
      const dialog = document.querySelector("dialog");
      // Effacer le contenu d'avant
      const dialogContent = document.querySelector(".dialog-menu");
      dialogContent && dialogContent.remove();
      dialog.showModal();
      dialog.scrollTo(0, 0);
      const section = document.createElement("section");
      section.classList.add("dialog-menu");
      currentItem = data.filter((i) => i.id == card.dataset.id)[0];
      section.innerHTML = generateDialogHTML(currentItem);
      dialog.appendChild(section);

      // Rendre le bouton "commander" cliquable pour ouvrir le lien du produit
      const btnAdd = dialog.querySelector('.ajouter');
      if (btnAdd) {
        btnAdd.addEventListener('click', (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          const link = currentItem.liens && currentItem.liens.toString().trim() !== ''
            ? currentItem.liens
            : `./product.html?id=${currentItem.id}`;
          // ouvrir dans un nouvel onglet
          window.open(link, '_blank', 'noopener');
        });
      }

      // Envoyer le lien du produit via WhatsApp au numéro spécifié
      const btnWhatsapp = dialog.querySelector('.send-whatsapp');
      if (btnWhatsapp) {
        btnWhatsapp.addEventListener('click', (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          const link = btnWhatsapp.getAttribute('data-product-link');
          const productName = btnWhatsapp.getAttribute('data-product-name');
          const phoneNumber = '22890381883'; // Numéro WhatsApp sans le +
          const message = `Bonjour, je suis intéressé par cet produit:\n${productName}\n\n${link}`;
          const encodedMessage = encodeURIComponent(message);
          const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
          window.open(whatsappUrl, '_blank', 'noopener');
        });
      }

    });
  });
};

actionProduit();
// Close popover
const btnClose = document.querySelector(".close");
btnClose.addEventListener("click", () => {
  dialog.close();
});

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('header[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 50,
            sectionId = current.getAttribute('id')

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link')
        }else{
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*=============== CHANGE BACKGROUND HEADER ===============*/
function scrollHeader(){
    const header = document.getElementById('header')
    // When the scroll is greater than 80 viewport height, add the scroll-header class to the header tag
    if(this.scrollY >= 80) header.classList.add('scroll-header'); else header.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then((registration) => {
        console.log('ServiceWorker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('ServiceWorker registration failed:', error);
      });
  });
}

// PWA install prompt handling (Add to Home Screen)
let deferredInstallPrompt = null;
const installBanner = document.getElementById('install-banner');
const installBtn = document.getElementById('install-btn');
const installDismiss = document.getElementById('install-dismiss');

console.log('PWA Install: Elements found', { installBanner: !!installBanner, installBtn: !!installBtn, installDismiss: !!installDismiss });

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('beforeinstallprompt event triggered');
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  deferredInstallPrompt = e;
  // Show our custom install banner
  if (installBanner) {
    installBanner.style.display = 'flex';
    console.log('Install banner shown');
  }
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    console.log('Install button clicked', deferredInstallPrompt);
    if (!deferredInstallPrompt) {
      console.warn('deferredInstallPrompt is null');
      return;
    }
    try {
      // Show native prompt
      deferredInstallPrompt.prompt();
      const choiceResult = await deferredInstallPrompt.userChoice;
      console.log('User choice result:', choiceResult);
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
    } catch (error) {
      console.error('Error showing install prompt:', error);
    }
    deferredInstallPrompt = null;
    if (installBanner) installBanner.style.display = 'none';
  });
}

if (installDismiss) {
  installDismiss.addEventListener('click', () => {
    console.log('Dismiss button clicked');
    if (installBanner) installBanner.style.display = 'none';
  });
}

window.addEventListener('appinstalled', () => {
  console.log('PWA installed successfully');
  if (installBanner) installBanner.style.display = 'none';
});
(function(){
      const storie = document.querySelector('.storie');
      if (!storie) return;
      const group = storie.querySelector('.groups');
      if (!group) return;

      const originalSlides = Array.from(group.querySelectorAll('.case'));
      if (originalSlides.length === 0) return;

      const originalCount = originalSlides.length;
      // Clone slides to allow seamless looping
      originalSlides.forEach(s => group.appendChild(s.cloneNode(true)));

      const gap = parseFloat(getComputedStyle(group).gap) || 0;
      let slideWidth = 0;
      function calcSlideWidth(){
        slideWidth = originalSlides[0].getBoundingClientRect().width + gap;
      }
      calcSlideWidth();
      window.addEventListener('resize', calcSlideWidth);

      let index = 0;
      let timer = null;
      const transitionDuration = 600; // ms (approx for smooth scroll)

      function scrollToIndex(i, smooth = true){
        const left = Math.round(i * slideWidth);
        storie.scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' });
      }

      function startAutoplay(){
        stopAutoplay();
        timer = setTimeout(() => next(), 5000);
      }

      function stopAutoplay(){
        if (timer) { clearTimeout(timer); timer = null; }
      }

      function next(){
        index++;
        scrollToIndex(index, true);
        if (index >= originalCount){
          // reached cloned first slide — after transition, reset to real start
          setTimeout(() => {
            storie.scrollTo({ left: 0, behavior: 'auto' });
            index = 0;
            startAutoplay();
          }, transitionDuration);
        } else {
          startAutoplay();
        }
      }

      // Pause/resume on user interaction
      ['mouseenter','focusin','touchstart','pointerdown'].forEach(ev => storie.addEventListener(ev, stopAutoplay, { passive: true }));
      ['mouseleave','focusout','touchend','pointerup'].forEach(ev => storie.addEventListener(ev, () => startAutoplay(), { passive: true }));

      // Start at first slide
      storie.scrollLeft = 0;
      startAutoplay();
    })();

