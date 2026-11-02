(() => {
  const { hotel, places, days: planDays, why } = window.HAWAII_PLAN;
  const labels = { tue: "Tue 3 Nov", wed: "Wed 4 Nov", thu: "Thu 5 Nov", fri: "Fri 6 Nov", sat: "Sat 7 Nov", sun: "Sun 8 Nov", mon: "Mon 9 Nov", tue10: "Tue 10 Nov" };
  const dayKeys = Object.keys(labels);
  const state = { key: "tue", stopIndex: 0, view: "map", map: null, mapDay: null, markers: [], captionHidden: false };
  const photoKeys = {
    hotel: "Waikīkī", alawai: "Ala Wai Canal", target: "International Market Place", market: "Groceries",
    aquarium: "Waikīkī Aquarium", kaimana: "Kaimana", hwak: "Live music",
    hyatt: "Hyatt market", hanauma: "Hanauma Bay", halona: "Hālona Blowhole",
    sandy: "Sandy Beach, Hawaii", makapuulookout: "Makapuʻu Point Light",
    waimanalo: "Waimānalo, Hawaii", kailua: "Kailua beach", pali: "Nuʻuanu Pali",
    koolina: "Ko Olina", fortderussy: "Fireworks", kcc: "Farmers market",
    alamoana: "Magic Island (Hawaii)", kuhio: "Kūhiō Beach Park", paina: "Paina",
    ahaaina: "Ahaaina", magicisland: "Magic Island (Hawaii)", alamcenter: "Ala Moana shopping",
    royal: "Royal courtyard", imp: "International Market Place", zoo: "Honolulu Zoo",
    makapuu: "Lighthouse walk", kapiolani: "Kapiʻolani Park"
  };
  const $ = (id) => document.getElementById(id);
  const esc = (value) => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  function directions(stop) {
    if (stop.place === "hotel") return "";
    const place = places[stop.place];
    const destination = encodeURIComponent([place.venue || place.label, place.address, place.locality, place.region].filter(Boolean).join(", "));
    return `https://www.google.com/maps/dir/?api=1&destination=${destination}&origin=${hotel.lat},${hotel.lng}&travelmode=${encodeURIComponent(stop.mode)}`;
  }
  function selectedDay() { return planDays[state.key]; }

  function renderPhoto() {
    const stop = selectedDay().stops[state.stopIndex];
    const key = stop.place === "hotel" && state.key === "sun" ? "Hotel pool" : photoKeys[stop.place];
    const photo = window.HAWAII_PHOTOS[key];
    const image = $("activityArtwork");
    const mobileSource = $("mobileArtwork");
    const mobile = photo.mobile?.src || photo.src;
    const desktop = photo.desktop?.src || photo.src;
    if (image.getAttribute("src") !== desktop || mobileSource.getAttribute("srcset") !== mobile) {
      $("imageError").hidden = true;
      image.hidden = false;
      mobileSource.srcset = mobile;
      image.src = desktop;
    }
    image.alt = photo.caption;
    image.setAttribute("aria-label", `${photo.caption}. ${state.captionHidden ? "Show" : "Hide"} activity details`);
    const license = photo.license ? ` · ${photo.licenseUrl ? `<a href="${esc(photo.licenseUrl)}" target="_blank" rel="noopener">${esc(photo.license)}</a>` : esc(photo.license)}` : "";
    $("photoCredit").innerHTML = `${esc(photo.caption)} · <a href="${esc(photo.source)}" target="_blank" rel="noopener">${esc(photo.credit)}</a>${license}${photo.mobile ? " · cropped" : ""}`;
  }
  function renderCaption() {
    setCaptionHidden(false);
    $("captionText").scrollTop = 0;
    const day = selectedDay();
    const stop = day.stops[state.stopIndex];
    const place = places[stop.place];
    $("captionDate").textContent = labels[state.key];
    $("activityPosition").textContent = `${state.stopIndex + 1} / ${day.stops.length}${stop.optional ? " · Optional" : ""}`;
    $("activityTime").textContent = stop.time;
    $("activityTitle").textContent = place.label;
    $("activityNote").textContent = stop.note;
    $("activityAddress").textContent = place.disp;
    const url = directions(stop);
    $("directionsLink").hidden = !url;
    $("directionsLink").href = url || "#";
    $("whyButton").setAttribute("aria-expanded", "false");
    $("activityWhy").hidden = true;
    $("activityWhy").textContent = why[state.key]?.[state.stopIndex] || "";
    $("whyButton").hidden = !$("activityWhy").textContent;
    $("previousActivity").disabled = state.stopIndex === 0;
    $("nextActivity").disabled = state.stopIndex === day.stops.length - 1;
    $("activityDots").innerHTML = day.stops.map((item, index) => `<button class="activity-dot" type="button" data-stop="${index}" aria-label="Activity ${index + 1}: ${esc(places[item.place].label)}" ${index === state.stopIndex ? 'aria-current="step"' : ""}></button>`).join("");
    $("feedStatus").textContent = `${labels[state.key]}, activity ${state.stopIndex + 1} of ${day.stops.length}: ${place.label}. ${stop.time}. ${stop.note}`;
    if (state.view === "images") renderPhoto();
  }
  function setCaptionHidden(hidden) {
    state.captionHidden = hidden;
    $("activityCaption").hidden = hidden;
    $("feed").classList.toggle("caption-hidden", hidden);
    $("activityArtwork").setAttribute("aria-expanded", String(!hidden));
    $("activityArtwork").setAttribute("aria-label", `${$("activityArtwork").alt || "Activity photo"}. ${hidden ? "Show" : "Hide"} activity details`);
  }
  function renderDates() {
    $("dateList").innerHTML = dayKeys.map((key) => `<button class="date-button" type="button" data-day="${key}" aria-label="${labels[key]}" ${key === state.key ? 'aria-current="date"' : ""}><strong>${labels[key].split(" ")[1]}</strong><small>${labels[key].split(" ")[0]}</small></button>`).join("");
    $("previousDay").disabled = state.key === dayKeys[0];
    $("nextDay").disabled = state.key === dayKeys[dayKeys.length - 1];
    const day = selectedDay();
    $("dayTitle").textContent = day.title;
    $("dayBadge").innerHTML = day.badge;
    $("daySummary").textContent = day.summary;
    $("dayFoot").innerHTML = day.nap + (day.also ? " " + esc(day.also) : "");
  }
  function highlightMap() {
    state.markers.forEach((marker, index) => marker.getElement()?.querySelector(".pin")?.classList.toggle("active", index === state.stopIndex));
  }
  function fitDailyMap() {
    if (!state.map || state.mapDay !== state.key || state.view !== "map") return;
    const points = selectedDay().stops.map((stop) => [places[stop.place].lat, places[stop.place].lng]);
    state.map.fitBounds(points, {
      paddingTopLeft: [45, 90],
      paddingBottomRight: [95, Math.min($("map").clientHeight * .55, 420)],
      maxZoom: 16,
      animate: false
    });
  }
  function renderMap() {
    state.map?.remove();
    state.map = null;
    state.markers = [];
    if (typeof L === "undefined") {
      $("mapStatus").textContent = "Map unavailable. Directions still open the route to this activity.";
      return;
    }
    $("mapStatus").textContent = "";
    state.map = L.map("map", { scrollWheelZoom: false, dragging: false, touchZoom: false, doubleClickZoom: false, boxZoom: false, keyboard: false, zoomControl: false });
    state.map.attributionControl.setPosition("topleft");
    const tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(state.map);
    let errors = 0;
    tiles.on("tileerror", () => {
      if (++errors === 5) $("mapStatus").textContent = "Map tiles are slow to load. Pins and Directions still work.";
    });
    const stops = selectedDay().stops;
    state.markers = stops.map((stop, index) => {
      const place = places[stop.place];
      const marker = L.marker([place.lat, place.lng], { interactive: false, keyboard: false, title: place.label, alt: `Activity ${index + 1}: ${place.label}`, icon: L.divIcon({ className: "pin-wrap", html: `<span class="pin">${index + 1}</span>`, iconSize: [30, 30], iconAnchor: [15, 15] }) }).addTo(state.map);
      return marker;
    });
    state.mapDay = state.key;
    $("map").setAttribute("aria-label", `${labels[state.key]}: overview of all ${stops.length} daily stops`);
    fitDailyMap();
    highlightMap();
  }
  function selectStop(index) {
    if (index < 0 || index >= selectedDay().stops.length) return;
    state.stopIndex = index;
    renderCaption();
    highlightMap();
  }
  function animateChange(axis, offset) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const transform = `translate${axis}(${offset * 28}px)`;
    const elements = [$("activityCaption")];
    if (state.view === "images" || axis === "Y") elements.push($(`${state.view}Panel`));
    elements.forEach((element) => element.animate([
      { opacity: .65, transform }, { opacity: 1, transform: `translate${axis}(0)` }
    ], { duration: 190, easing: "ease-out" }));
  }
  function moveActivity(offset) {
    const previous = state.stopIndex;
    selectStop(state.stopIndex + offset);
    if (previous !== state.stopIndex) animateChange("X", offset);
  }
  function mount(key) {
    if (!dayKeys.includes(key)) return;
    state.key = key;
    state.stopIndex = 0;
    setDayDetails(false);
    renderDates();
    renderCaption();
    if (state.view === "map") renderMap();
  }
  function moveDay(offset) {
    showDateRail();
    const index = dayKeys.indexOf(state.key) + offset;
    if (index >= 0 && index < dayKeys.length) {
      mount(dayKeys[index]);
      animateChange("Y", offset);
    }
  }
  let dateRailTimer;
  function showDateRail() {
    const rail = $("dateRail");
    clearTimeout(dateRailTimer);
    rail.classList.add("is-visible");
    rail.inert = false;
    rail.setAttribute("aria-hidden", "false");
    dateRailTimer = setTimeout(() => {
      if (rail.contains(document.activeElement)) $("feed").focus({ preventScroll: true });
      rail.classList.remove("is-visible");
      rail.inert = true;
      rail.setAttribute("aria-hidden", "true");
    }, 1000);
  }
  function setDayDetails(open) {
    $("dayDetails").hidden = !open;
    $("dayDetailsButton").setAttribute("aria-expanded", String(open));
  }
  function setView(view) {
    state.view = view;
    setCaptionHidden(false);
    ["map", "images"].forEach((name) => {
      $(`${name}Tab`).setAttribute("aria-selected", String(name === view));
      $(`${name}Tab`).tabIndex = name === view ? 0 : -1;
      $(`${name}Panel`).hidden = name !== view;
    });
    $("photoCredit").hidden = view !== "images";
    if (view === "images") renderPhoto();
    else {
      if (state.mapDay !== state.key || !state.map) renderMap();
      state.map?.invalidateSize();
      fitDailyMap();
      highlightMap();
    }
  }
  function initialDay() {
    const today = new Date();
    const tripYear = 2026;
    const month = today.getMonth();
    const date = today.getDate();
    if (today.getFullYear() === tripYear && month === 10 && date >= 3 && date <= 10) {
      return date === 10 ? "tue10" : ["tue", "wed", "thu", "fri", "sat", "sun", "mon"][date - 3];
    }
    return "tue";
  }

  $("dateList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-day]");
    if (button) { mount(button.dataset.day); showDateRail(); }
  });
  $("activityDots").addEventListener("click", (event) => {
    const button = event.target.closest("[data-stop]");
    if (button) selectStop(Number(button.dataset.stop));
  });
  $("previousActivity").addEventListener("click", () => moveActivity(-1));
  $("nextActivity").addEventListener("click", () => moveActivity(1));
  $("previousDay").addEventListener("click", () => moveDay(-1));
  $("nextDay").addEventListener("click", () => moveDay(1));
  $("dateRail").addEventListener("pointerdown", () => clearTimeout(dateRailTimer));
  $("dateRail").addEventListener("pointerup", showDateRail);
  $("dateRail").addEventListener("pointercancel", showDateRail);
  $("whyButton").addEventListener("click", () => {
    const open = $("activityWhy").hidden;
    $("activityWhy").hidden = !open;
    $("whyButton").setAttribute("aria-expanded", String(open));
  });
  $("dayDetailsButton").addEventListener("click", () => setDayDetails($("dayDetails").hidden));
  $("closeDayDetails").addEventListener("click", () => { setDayDetails(false); $("dayDetailsButton").focus(); });
  $("activityArtwork").addEventListener("error", () => {
    $("activityArtwork").hidden = true;
    $("imageError").hidden = false;
  });
  $("activityArtwork").addEventListener("click", () => setCaptionHidden(!state.captionHidden));
  $("activityArtwork").addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault(); event.stopPropagation(); setCaptionHidden(!state.captionHidden);
    }
  });
  ["map", "images"].forEach((view) => {
    const tab = $(`${view}Tab`);
    tab.addEventListener("click", () => setView(view));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault(); event.stopPropagation();
      const next = event.key === "Home" ? "map" : event.key === "End" ? "images" : view === "map" ? "images" : "map";
      setView(next); $(`${next}Tab`).focus();
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { setDayDetails(false); return; }
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.target.closest(".view-tabs, .day-details, .caption-scroll")) return;
    const actions = { ArrowLeft: () => moveActivity(-1), ArrowRight: () => moveActivity(1), ArrowUp: () => moveDay(-1), ArrowDown: () => moveDay(1) };
    if (actions[event.key]) { event.preventDefault(); actions[event.key](); }
  });
  const surface = $("swipeSurface");
  const activePointers = new Set();
  let gesture = null;
  let suppressClickUntil = 0;
  const skipGesture = (target) => Boolean(target.closest("button, a, .day-details, .caption-scroll, .leaflet-control"));
  surface.addEventListener("pointerdown", (event) => {
    suppressClickUntil = 0;
    activePointers.add(event.pointerId);
    if (activePointers.size !== 1 || (event.pointerType === "mouse" && event.button !== 0) || skipGesture(event.target)) { gesture = null; return; }
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, time: performance.now() };
  });
  window.addEventListener("pointerup", (event) => {
    activePointers.delete(event.pointerId);
    if (!gesture || gesture.id !== event.pointerId) return;
    const start = gesture; gesture = null;
    const dx = event.clientX - start.x, dy = event.clientY - start.y;
    if (performance.now() - start.time > 1400 || Math.max(Math.abs(dx), Math.abs(dy)) < 48) return;
    if (Math.abs(dx) > Math.abs(dy) * 1.2) moveActivity(dx < 0 ? 1 : -1);
    else if (Math.abs(dy) > Math.abs(dx) * 1.2) moveDay(dy < 0 ? 1 : -1);
    else return;
    suppressClickUntil = performance.now() + 350;
  });
  window.addEventListener("pointercancel", (event) => { activePointers.delete(event.pointerId); gesture = null; });
  surface.addEventListener("click", (event) => {
    if (performance.now() < suppressClickUntil) { event.preventDefault(); event.stopPropagation(); }
  }, true);
  let wheelX = 0, wheelY = 0, lastWheel = 0, wheelNavigated = false;
  surface.addEventListener("wheel", (event) => {
    if (event.ctrlKey || skipGesture(event.target)) return;
    event.preventDefault();
    const now = performance.now();
    if (now - lastWheel > 180) { wheelX = 0; wheelY = 0; wheelNavigated = false; }
    lastWheel = now;
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX) * 1.2) showDateRail();
    if (wheelNavigated) return;
    const scale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? surface.clientHeight : 1;
    wheelX += event.deltaX * scale; wheelY += event.deltaY * scale;
    if (Math.max(Math.abs(wheelX), Math.abs(wheelY)) < 80) return;
    if (Math.abs(wheelX) > Math.abs(wheelY) * 1.2) moveActivity(wheelX > 0 ? 1 : -1);
    else if (Math.abs(wheelY) > Math.abs(wheelX) * 1.2) moveDay(wheelY > 0 ? 1 : -1);
    else return;
    wheelX = 0; wheelY = 0; wheelNavigated = true;
  }, { passive: false });
  window.addEventListener("resize", () => {
    if (state.view === "map") { state.map?.invalidateSize(); fitDailyMap(); }
  });
  mount(initialDay());
})();
