const myName = "Amaan";
const h1 = document.querySelector(".heading-primary");
const dataInput = document.getElementById("dataInputOpen");
const estimateButton = document.querySelector(".estimationButton");
let powerInput = document.querySelector(".powerInput");
let hoursInput = document.querySelector(".hoursInput");
let daysInput = document.querySelector(".daysInput");

const btnNavEl = document.querySelector(".btn-mobile-nav");
const headerEl = document.querySelector(".header");

// Backend API URL
const API_URL = "https://wattwiseai-2nov.onrender.com";

document
  .getElementById("energyForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    // Get form values
    const power = parseFloat(document.getElementById("power").value);
    const days = parseFloat(document.getElementById("days").value);
    const hours = parseFloat(document.getElementById("hours").value);
    const place = document.getElementById("place").value;

    // Show loading state
    showLoadingState();

    try {
      // Call the backend API
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          power: power,
          days: days,
          hours: hours,
          place: place,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Prediction failed");
      }

      const data = await response.json();

      // Update dashboard with backend predictions
      updateDashboard(
        data.estimated_units,
        data.estimated_cost,
        data.accuracy,
        data.yearly_expenditure,
      );
    } catch (error) {
      console.error("Error:", error);
      alert(
        "Failed to get prediction. Please make sure:\n1. Backend server is running at http://127.0.0.1:8002\n2. Run: python backend.py",
      );
      hideLoadingState();
    }
  });

function showLoadingState() {
  document.querySelectorAll(".result-value").forEach((el) => {
    el.textContent = "...";
    el.classList.add("placeholder-state");
  });
}

function hideLoadingState() {
  document.querySelectorAll(".result-value").forEach((el) => {
    el.textContent = "--";
  });
}

function updateDashboard(units, cost, accuracy, yearlyExpenditure) {
  // Remove placeholder state
  document.querySelectorAll(".result-value").forEach((el) => {
    el.classList.remove("placeholder-state");
  });

  // Update values with animation
  animateValue("units", 0, units, 1000, (val) => val.toFixed(2));
  animateValue("cost", 0, cost, 1000, (val) => "₹" + val.toFixed(2));
  animateValue("accuracy", 0, accuracy, 1000, (val) => val.toFixed(1) + "%");
  animateValue(
    "yearlyExpenditure",
    0,
    yearlyExpenditure,
    1000,
    (val) => "₹" + val.toFixed(2),
  );
}

function animateValue(id, start, end, duration, formatter) {
  const element = document.getElementById(id);
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const current = start + (end - start) * easeOutCubic(progress);
    element.textContent = formatter(current);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// Test backend connection on page load
async function testBackendConnection() {
  try {
    const response = await fetch(`${API_URL}/`);
    if (response.ok) {
      console.log("✓ Backend connected successfully");
    }
  } catch (error) {
    console.warn(
      "⚠ Backend not connected. Make sure to run: python backend.py",
    );
  }
}

testBackendConnection();

btnNavEl.addEventListener("click", function () {
  headerEl.classList.toggle("nav-open");
});
// Fetching from backend

///////////////////////////////////////////////////////////j
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
