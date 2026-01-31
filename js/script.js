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

function pad(n) {
  return n.toString().padStart(2, "0");
}

function tick() {
  const now = new Date();
  const h = now.getHours(),
    m = now.getMinutes(),
    s = now.getSeconds();
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  document.getElementById("clock").textContent =
    `${h12}:${pad(m)}:${pad(s)} ${ampm}`;

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  document.getElementById("dateStr").textContent =
    `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;

  // greeting
  let g =
    h < 12
      ? "Good Morning ☀️"
      : h < 17
        ? "Good Afternoon 🌤️"
        : "Good Evening 🌙";
  document.getElementById("greeting").textContent = g;

  // header theme
  const hdr = document.getElementById("header");
  hdr.classList.remove("night", "afternoon");
  if (h < 6 || h >= 20) hdr.classList.add("night");
  else if (h >= 12) hdr.classList.add("afternoon");
}
tick();
setInterval(tick, 1000);

// ─── Location Detector ────────────────────────────
let detected = false;

function showError(msg) {
  document.getElementById("errorMsg").textContent = msg;
  document.getElementById("errorStrip").classList.add("show");
}
function hideError() {
  document.getElementById("errorStrip").classList.remove("show");
}

function setDetectLoading(on) {
  const btn = document.getElementById("detectBtn");
  const icon = document.getElementById("detectIcon");
  const txt = document.getElementById("detectText");
  btn.disabled = on;

  if (on) {
    // spinner icon
    icon.outerHTML = `<svg id="detectIcon" class="spin" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M23 4v6h-6M1 20v-6h6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/>
      </svg>`;
    txt.textContent = "Detecting…";
  } else if (detected) {
    // refresh icon (no spin)
    document.getElementById("detectIcon").outerHTML =
      `<svg id="detectIcon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M23 4v6h-6M1 20v-6h6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/>
      </svg>`;
    txt.textContent = "Refresh Location";
    btn.classList.add("detected");
  } else {
    // crosshair icon
    document.getElementById("detectIcon").outerHTML =
      `<svg id="detectIcon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
        <line x1="12" y1="1" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="23"/>
        <line x1="1" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="23" y2="12"/>
      </svg>`;
    txt.textContent = "Detect Location";
    btn.classList.remove("detected");
  }
}

async function detectLocation() {
  hideError();
  setDetectLoading(true);

  if (!navigator.geolocation) {
    showError("Geolocation is not supported by your browser.");
    setDetectLoading(false);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async function (pos) {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      try {
        // 1) Reverse geocode — OpenStreetMap Nominatim (free)
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        );
        const geo = await geoRes.json();
        const city =
          geo.address?.city ||
          geo.address?.town ||
          geo.address?.village ||
          geo.address?.county ||
          "Unknown";
        const state = geo.address?.state || "";
        const country = geo.address?.country || "";

        // 2) Weather — Open-Meteo (free, no key)
        const wRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=relativehumidity_2m&timezone=auto`,
        );
        const w = await wRes.json();
        const temp = w.current_weather?.temperature ?? "—";
        const wind = w.current_weather?.windspeed ?? "—";
        const hourIdx = new Date().getHours();
        const humidity = w.hourly?.relativehumidity_2m?.[hourIdx] ?? "—";

        // populate cards
        document.getElementById("wCity").textContent = city;
        document.getElementById("wRegion").textContent = `${state}, ${country}`;
        document.getElementById("wTemp").textContent = temp + " °C";
        document.getElementById("wHumidity").textContent = humidity + " %";
        document.getElementById("wWind").innerHTML =
          wind + ' <span class="unit">km/h</span>';

        // show weather row
        document.getElementById("weatherCards").classList.add("visible");

        // badge in form
        document.getElementById("badgeCity").textContent = city;
        document.getElementById("autoBadge").classList.add("show");

        detected = true;
        setDetectLoading(false);
      } catch (e) {
        // showError("Failed to fetch weather data. Please try again.");
        setDetectLoading(false);
      }
    },
    function (err) {
      showError("Location access denied. Please enable location permissions.");
      setDetectLoading(false);
    },
  );
}

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
