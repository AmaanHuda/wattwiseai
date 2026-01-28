const myName = "Amaan";
const h1 = document.querySelector(".heading-primary");
const dataInput = document.getElementById("dataInputOpen");
const formOpen = document.querySelector(".offModal");
const formClose = document.querySelector(".closeButtonForm");
const heroSection = document.querySelector(".section-hero");
const mealSection = document.querySelector(".section-meals");
const ctaSection = document.querySelector(".section-cta");
const howSection = document.querySelector(".section-how");
const header = document.querySelector(".header");
const estimateButton = document.querySelector(".estimateButton");
let powerInput = document.querySelector(".powerInput");
let hoursInput = document.querySelector(".hoursInput");

console.log(powerInput, hoursInput);
console.log(h1);
console.log(formOpen);

const btnNavEl = document.querySelector(".btn-mobile-nav");
const headerEl = document.querySelector(".header");

estimateButton.addEventListener("click", function () {
  alert(
    `Your total consumption of electricity was ${powerInput.value * 0.001 * hoursInput.value} kwH in a day and ${powerInput.value * 0.001 * hoursInput.value * 30} kwH in a month and ${powerInput.value * 0.001 * hoursInput.value * 365} kwH in a year `,
  );
});
dataInput.addEventListener("click", function () {
  formOpen.classList.remove("offModal");
  formOpen.classList.toggle("onModal");
  heroSection.classList.add("blur");
  mealSection.classList.add("blur");
  ctaSection.classList.add("blur");
  howSection.classList.add("blur");
  header.classList.add("blur");
});

formClose.addEventListener("click", function () {
  console.log("Hola amigo");
  formOpen.classList.remove("onModal");
  formOpen.classList.toggle("offModal");
  heroSection.classList.remove("blur");
  mealSection.classList.remove("blur");
  ctaSection.classList.remove("blur");
  howSection.classList.remove("blur");
  header.classList.remove("blur");
});
btnNavEl.addEventListener("click", function () {
  headerEl.classList.toggle("nav-open");
});

///////////////////////////////////////////////////////////
// Smooth scrolling animation

const allLinks = document.querySelectorAll("a:link");

allLinks.forEach(function (link) {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const href = link.getAttribute("href");

    // Scroll back to top
    if (href === "#")
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    // Scroll to other links
    if (href !== "#" && href.startsWith("#")) {
      const sectionEl = document.querySelector(href);
      sectionEl.scrollIntoView({ behavior: "smooth" });
    }

    // Close mobile naviagtion
    if (link.classList.contains("main-nav-link"))
      headerEl.classList.toggle("nav-open");
  });
});

///////////////////////////////////////////////////////////
// Sticky navigation

const sectionHeroEl = document.querySelector(".section-hero");

const obs = new IntersectionObserver(
  function (entries) {
    const ent = entries[0];
    console.log(ent);

    if (ent.isIntersecting === false) {
      document.body.classList.add("sticky");
    }

    if (ent.isIntersecting === true) {
      document.body.classList.remove("sticky");
    }
  },
  {
    // In the viewport
    root: null,
    threshold: 0,
    rootMargin: "-80px",
  },
);
obs.observe(sectionHeroEl);

///////////////////////////////////////////////////////////
// Fixing flexbox gap property missing in some Safari versions
function checkFlexGap() {
  var flex = document.createElement("div");
  flex.style.display = "flex";
  flex.style.flexDirection = "column";
  flex.style.rowGap = "1px";

  flex.appendChild(document.createElement("div"));
  flex.appendChild(document.createElement("div"));

  document.body.appendChild(flex);
  var isSupported = flex.scrollHeight === 1;
  flex.parentNode.removeChild(flex);
  console.log(isSupported);

  if (!isSupported) document.body.classList.add("no-flexbox-gap");
}
checkFlexGap();

// https://unpkg.com/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js

/*
.no-flexbox-gap .main-nav-list li:not(:last-child) {
  margin-right: 4.8rem;
}

.no-flexbox-gap .list-item:not(:last-child) {
  margin-bottom: 1.6rem;
}

.no-flexbox-gap .list-icon:not(:last-child) {
  margin-right: 1.6rem;
}

.no-flexbox-gap .delivered-faces {
  margin-right: 1.6rem;
}

.no-flexbox-gap .meal-attribute:not(:last-child) {
  margin-bottom: 2rem;
}

.no-flexbox-gap .meal-icon {
  margin-right: 1.6rem;
}

.no-flexbox-gap .footer-row div:not(:last-child) {
  margin-right: 6.4rem;
}

.no-flexbox-gap .social-links li:not(:last-child) {
  margin-right: 2.4rem;
}

.no-flexbox-gap .footer-nav li:not(:last-child) {
  margin-bottom: 2.4rem;
}

@media (max-width: 75em) {
  .no-flexbox-gap .main-nav-list li:not(:last-child) {
    margin-right: 3.2rem;
  }
}

@media (max-width: 59em) {
  .no-flexbox-gap .main-nav-list li:not(:last-child) {
    margin-right: 0;
    margin-bottom: 4.8rem;
  }
}
*/
