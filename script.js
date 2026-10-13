/* ===== Solidarity Nutritions — Home ===== */
(function () {
  "use strict";

  /* ---------- Site settings (edit here) ---------- */
  var WHATSAPP_NUMBER = "917021764456"; // country code + number, no "+" or spaces. Confirm which number the client wants.

  var COURSES = {
    certificate: [
      "NABH Dietary Practices", "Fitness & Sports Medicine", "Advance Nutrition & Therapeutics",
      "Food Microbiology & Safety", "Play School Management", "Child Care Nutrition",
      "Plant Based Culinary Arts", "PCOS Management", "Diabetes Management", "Thyroid Management",
      "Lifestyle Management", "Nutrition & Lifestyle in Pregnancy", "Nutrition in Dermatology",
      "Nutrition in Dental Management", "Public Nutrition"
    ],
    diploma: ["Nutrition and Dietetics", "Entrepreneurship & Food Service Management"],
    workshop: [
      "Understanding Food Labels & Portion Sizes", "Image Revamping of Dietitians", "Meal Planning for Infants",
      "Fasting: A Vedic Approach Towards Fitness", "Health Supplements in Fitness Industry",
      "Breaking Weight Loss Plateau in Dieting", "Food Product Ecosystem", "Holistic Health Management",
      "Serving Styles & Management in Hotel Industry", "Yoga and Vedic Nutrition"
    ]
  };

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Header: shadow, mobile menu, active link ---------- */
  var header = $(".site-header"), toTop = $("#toTop");
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle("scrolled", y > 8);
    toTop.classList.toggle("show", y > 700);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var toggle = $("#menuToggle"), nav = $("#primaryNav");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  toggle.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
  $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  var navLinks = $$('.primary-nav a[href^="#"]:not(.btn)');
  if ("IntersectionObserver" in window) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id); });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    navLinks.forEach(function (l) {
      var t = $(l.getAttribute("href"));
      if (t) secObs.observe(t);
    });
  }

  toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  /* ---------- Reveal on scroll ---------- */
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window) {
    var revObs = new IntersectionObserver(function (entries, o) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var el = en.target;
          var sibs = el.parentElement ? $$(".reveal", el.parentElement) : [];
          el.style.transitionDelay = Math.min(sibs.indexOf(el), 6) * 70 + "ms";
          el.classList.add("in");
          o.unobserve(el);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { revObs.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Count-up stats ---------- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var counters = $$("[data-count]:not([data-plain])");
  function countUp(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduce) { el.textContent = target + suffix; return; }
    var start = null, dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var cObs = new IntersectionObserver(function (entries, o) {
      entries.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); o.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cObs.observe(c); });
  }

  /* ---------- Photo fallbacks (monogram shows if image is missing) ---------- */
  [["heroPhoto", "heroFallback"], ["aboutPhoto", "aboutFallback"]].forEach(function (pair) {
    var img = document.getElementById(pair[0]), fb = document.getElementById(pair[1]);
    if (!img || !fb) return;
    function hide() { fb.style.display = "none"; }
    function show() { img.style.display = "none"; fb.style.display = "grid"; }
    img.addEventListener("error", show);
    img.addEventListener("load", hide);
    if (img.complete) { img.naturalWidth ? hide() : show(); }
  });

  /* ---------- Service filters ---------- */
  var chips = $$(".chip"), cards = $$(".service");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.classList.remove("active"); });
      chip.classList.add("active");
      var f = chip.getAttribute("data-filter");
      cards.forEach(function (card) {
        var cats = (card.getAttribute("data-cat") || "").split(" ");
        card.classList.toggle("hide", f !== "all" && cats.indexOf(f) === -1);
        card.classList.add("in");
      });
    });
  });

  /* ---------- Courses: tabs + search ---------- */
  var list = $("#courseList"), noRes = $("#noResults"), search = $("#courseSearch"), tabs = $$(".tab");
  var currentTab = "certificate";
  function renderCourses() {
    var q = search.value.trim().toLowerCase();
    var items = COURSES[currentTab].filter(function (c) { return c.toLowerCase().indexOf(q) !== -1; });
    list.innerHTML = "";
    items.forEach(function (name, i) {
      var li = document.createElement("li");
      li.style.animationDelay = i * 25 + "ms";
      var n = document.createElement("span"); n.className = "n"; n.textContent = String(i + 1).padStart(2, "0");
      var t = document.createElement("span"); t.textContent = name;
      li.appendChild(n); li.appendChild(t);
      list.appendChild(li);
    });
    noRes.hidden = items.length > 0;
  }
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      currentTab = tab.getAttribute("data-tab");
      tabs.forEach(function (t) { var on = t === tab; t.classList.toggle("active", on); t.setAttribute("aria-selected", String(on)); });
      renderCourses();
    });
  });
  search.addEventListener("input", renderCourses);
  renderCourses();

  /* ---------- Testimonial slider ---------- */
  var slides = $$(".slide"), dotsWrap = $("#dots"), idx = 0, timer;
  slides.forEach(function (_, i) {
    var b = document.createElement("button");
    b.className = "dot-btn"; b.setAttribute("aria-label", "Show testimonial " + (i + 1));
    b.addEventListener("click", function () { go(i); restart(); });
    dotsWrap.appendChild(b);
  });
  var dotBtns = $$(".dot-btn", dotsWrap);
  function go(n) {
    idx = (n + slides.length) % slides.length;
    slides.forEach(function (s, i) { s.classList.toggle("active", i === idx); });
    dotBtns.forEach(function (d, i) { d.classList.toggle("active", i === idx); });
  }
  function restart() { clearInterval(timer); if (!reduce) timer = setInterval(function () { go(idx + 1); }, 6500); }
  $("#prevSlide").addEventListener("click", function () { go(idx - 1); restart(); });
  $("#nextSlide").addEventListener("click", function () { go(idx + 1); restart(); });
  $("#slider").addEventListener("mouseenter", function () { clearInterval(timer); });
  $("#slider").addEventListener("mouseleave", restart);
  go(0); restart();

  /* ---------- Booking form → WhatsApp ---------- */
  var form = $("#bookForm");
  var fName = $("#fName"), fPhone = $("#fPhone"), fGoal = $("#fGoal");
  function setErr(input, id, msg) {
    $(id).textContent = msg; input.classList.toggle("invalid", !!msg);
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = fName.value.trim(), phone = fPhone.value.replace(/[\s-]/g, "");
    var ok = true;
    setErr(fName, "#eName", name.length < 2 ? "Please enter your name." : "");
    if (name.length < 2) ok = false;
    var validPhone = /^(\+?91)?[6-9]\d{9}$/.test(phone);
    setErr(fPhone, "#ePhone", validPhone ? "" : "Please enter a valid 10-digit mobile number.");
    if (!validPhone) ok = false;
    if (!ok) return;
    var msg = "Hello Solidarity Nutritions! I'd like to book a free consultation.\n" +
      "Name: " + name + "\nPhone: " + phone + "\nInterested in: " + fGoal.value;
    window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
  });
  [fName, fPhone].forEach(function (i) {
    i.addEventListener("input", function () { i.classList.remove("invalid"); $(i === fName ? "#eName" : "#ePhone").textContent = ""; });
  });

  /* ---------- Floating WhatsApp + footer year ---------- */
  $("#waFloat").href = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent("Hello! I'd like to know more about Solidarity Nutritions.");
  $("#year").textContent = new Date().getFullYear();
})();