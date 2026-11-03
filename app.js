(() => {
  const { hotel, places, days: planDays, why } = window.HAWAII_PLAN;
  const labels = { tue: "Tue 3 Nov", wed: "Wed 4 Nov", thu: "Thu 5 Nov", fri: "Fri 6 Nov", sat: "Sat 7 Nov", sun: "Sun 8 Nov", mon: "Mon 9 Nov", tue10: "Tue 10 Nov" };
  const dayKeys = Object.keys(labels);
  const state = { key: "tue", stopIndex: 0, view: "map", map: null, mapDay: null, markers: [], captionHidden: false, captionExpanded: false };
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
    makapuu: "Lighthouse walk", kapiolani: "Kapiʻolani Park",
    shell: "Kilohana hula", royalgrove: "Royal courtyard", bandstand: "Park bandstand", beachwalk: "Beach Walk hula"
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

  function photoForStop(stop, dayKey) {
    const key = !stop ? "Waikīkī" : stop.place === "hotel" && dayKey === "sun" ? "Hotel pool" : photoKeys[stop.place];
    return window.HAWAII_PHOTOS[key];
  }
  function photoCredit(photo) {
    const license = photo.license ? ` · ${photo.licenseUrl ? `<a href="${esc(photo.licenseUrl)}" target="_blank" rel="noopener">${esc(photo.license)}</a>` : esc(photo.license)}` : "";
    return `${esc(photo.caption)} · <a href="${esc(photo.source)}" target="_blank" rel="noopener">${esc(photo.credit)}</a>${license}${photo.mobile ? " · cropped" : ""}`;
  }
  function renderPhoto() {
    const stop = selectedDay().stops[state.stopIndex];
    const photo = photoForStop(stop, state.key);
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
    $("photoCredit").innerHTML = photoCredit(photo);
  }
  function renderCaption() {
    setCaptionExpanded(false);
    setCaptionHidden(false);
    $("captionText").scrollTop = 0;
    const day = selectedDay();
    const stop = day.stops[state.stopIndex];
    const place = stop ? places[stop.place] : null;
    $("captionDate").textContent = labels[state.key];
    $("activityPosition").textContent = stop ? `${state.stopIndex + 1} / ${day.stops.length}${stop.optional ? " · Optional" : ""}` : "Day overview";
    $("activityTime").textContent = stop?.time || "";
    $("activityTime").hidden = !stop;
    $("activityTitle").textContent = place?.label || day.title.replace(/^[^—]+—\s*/, "");
    $("activityNote").textContent = stop?.note || day.summary;
    $("activityAddress").textContent = place?.disp || "";
    $("activityAddress").hidden = !stop;
    const url = stop ? directions(stop) : "";
    $("directionsLink").hidden = !url;
    $("directionsLink").href = url || "#";
    $("whyButton").setAttribute("aria-expanded", "false");
    $("activityWhy").hidden = true;
    $("activityWhy").textContent = why[state.key]?.[state.stopIndex] || "";
    $("whyButton").hidden = !$("activityWhy").textContent && $("captionText").scrollHeight <= $("captionText").clientHeight;
    $("previousActivity").disabled = state.stopIndex === 0;
    $("nextActivity").disabled = state.stopIndex >= day.stops.length - 1;
    $("activityNavigation").hidden = !day.stops.length;
    $("activityDots").innerHTML = day.stops.map((item, index) => `<button class="activity-dot" type="button" data-stop="${index}" aria-label="Activity ${index + 1}: ${esc(places[item.place].label)}" ${index === state.stopIndex ? 'aria-current="step"' : ""}></button>`).join("");
    $("feedStatus").textContent = stop ? `${labels[state.key]}, activity ${state.stopIndex + 1} of ${day.stops.length}: ${place.label}. ${stop.time}. ${stop.note}` : `${day.title}. ${day.summary}`;
    if (state.view === "images") renderPhoto();
  }
  function setCaptionHidden(hidden) {
    if (hidden) setCaptionExpanded(false);
    state.captionHidden = hidden;
    $("activityCaption").hidden = hidden;
    $("feed").classList.toggle("caption-hidden", hidden);
    $("activityArtwork").setAttribute("aria-expanded", String(!hidden));
    $("activityArtwork").setAttribute("aria-label", `${$("activityArtwork").alt || "Activity photo"}. ${hidden ? "Show" : "Hide"} activity details`);
  }
  function setCaptionExpanded(expanded) {
    const button = $("whyButton");
    if (!expanded) $("directionsLink").parentElement.append(button);
    state.captionExpanded = expanded;
    $("activityCaption").classList.toggle("is-expanded", expanded);
    $("feed").classList.toggle("caption-expanded", expanded);
    $("whyButton").textContent = expanded ? "See less" : "See more";
    $("whyButton").setAttribute("aria-expanded", String(expanded));
    $("activityWhy").hidden = !expanded || !$("activityWhy").textContent;
    if (expanded) ($("activityWhy").hidden ? $("activityNote") : $("activityWhy")).append(button);
    $("captionText").scrollTop = 0;
    updateCaptionShade();
    if (expanded && !$("activityWhy").hidden) {
      const text = $("captionText");
      const viewport = text.getBoundingClientRect();
      const explanation = $("activityWhy").getBoundingClientRect();
      const visibleEnd = Math.min(explanation.bottom, explanation.top + Math.min(180, text.clientHeight * .6));
      if (visibleEnd > viewport.bottom) text.scrollTop += visibleEnd - viewport.bottom + 8;
    }
  }
  function updateCaptionShade() {
    $("currentDayPage").style.setProperty("--caption-shade-top", `${Math.max(0, $("activityCaption").offsetTop - 56)}px`);
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
  function fitMap(map, key, container) {
    const points = planDays[key].stops.map((stop) => [places[stop.place].lat, places[stop.place].lng]);
    if (!points.length) {
      map.setView([hotel.lat, hotel.lng], 13, { animate: false });
      return;
    }
    map.fitBounds(points, {
      paddingTopLeft: [45, 90],
      paddingBottomRight: [95, Math.min(container.clientHeight * .55, 420)],
      maxZoom: 16, animate: false
    });
  }
  function fitDailyMap() {
    if (state.map && state.mapDay === state.key && state.view === "map") fitMap(state.map, state.key, $("map"));
  }
  function createDailyMap(container, key, selectedIndex = 0, status = null) {
    if (typeof L === "undefined") {
      if (status) status.textContent = "Map unavailable. Directions still open the route to this activity.";
      return { map: null, markers: [] };
    }
    if (status) status.textContent = "";
    const map = L.map(container, { scrollWheelZoom: false, dragging: false, touchZoom: false, doubleClickZoom: false, boxZoom: false, keyboard: false, zoomControl: false });
    map.attributionControl.setPosition("topleft");
    const tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(map);
    let errors = 0;
    tiles.on("tileerror", () => {
      if (++errors === 5 && status) status.textContent = "Map tiles are slow to load. Pins and Directions still work.";
    });
    const markers = planDays[key].stops.map((stop, index) => {
      const place = places[stop.place];
      return L.marker([place.lat, place.lng], { interactive: false, keyboard: false, title: place.label, alt: `Activity ${index + 1}: ${place.label}`, icon: L.divIcon({ className: "pin-wrap", html: `<span class="pin${index === selectedIndex ? " active" : ""}">${index + 1}</span>`, iconSize: [30, 30], iconAnchor: [15, 15] }) }).addTo(map);
    });
    fitMap(map, key, container);
    return { map, markers };
  }
  function renderMap() {
    state.map?.remove();
    const result = createDailyMap($("map"), state.key, state.stopIndex, $("mapStatus"));
    state.map = result.map;
    state.markers = result.markers;
    state.mapDay = state.key;
    $("map").setAttribute("aria-label", `${labels[state.key]}: overview of all ${selectedDay().stops.length} daily stops`);
  }

  const dateFeed = $("dateFeed");
  let previewMaps = [];
  let resettingDateScroll = false;
  let dateScrollTimer;
  let dateScrollReset = 0;
  let dateTouchActive = false;
  function makeDatePreview(key) {
    const day = planDays[key];
    const stop = day.stops[0];
    const place = stop ? places[stop.place] : null;
    const photo = photoForStop(stop, key);
    const page = document.createElement("section");
    page.className = "day-page date-preview";
    page.dataset.day = key;
    page.inert = true;
    page.setAttribute("aria-hidden", "true");
    page.innerHTML = `${state.view === "images" ? `<div class="view-panel"><picture class="activity-picture"><source media="(max-width: 767px)" srcset="${esc(photo.mobile?.src || photo.src)}"><img class="activity-artwork" src="${esc(photo.desktop?.src || photo.src)}" alt="${esc(photo.caption)}" decoding="async"></picture></div>` : '<div class="view-panel"><div class="map preview-map"></div></div>'}
      <div class="feed-shade"></div>
      <section class="activity-caption"><div class="caption-scroll"><div class="caption-body">
        <div class="caption-meta"><span>${labels[key]}</span><span class="preview-position">${stop ? `1 / ${day.stops.length}${stop.optional ? " · Optional" : ""}` : "Day overview"}</span></div>
        ${stop ? `<p class="activity-time">${esc(stop.time)}</p>` : ""}
        <h2 class="preview-title">${esc(place?.label || day.title.replace(/^[^—]+—\s*/, ""))}</h2>
        <p class="activity-note">${esc(stop?.note || day.summary)}</p>
        ${place ? `<p class="activity-address">${esc(place.disp)}</p>` : ""}
      </div></div><div class="caption-actions">${stop && directions(stop) ? `<a href="${esc(directions(stop))}">Directions ↗</a>` : ""}<button type="button">See more</button></div>${state.view === "images" ? `<p class="photo-credit">${photoCredit(photo)}</p>` : ""}</section>
      ${day.stops.length ? `<nav class="activity-navigation"><button type="button" disabled>←</button><div class="activity-dots">${day.stops.map((_, index) => `<span class="activity-dot"${index === 0 ? ' aria-current="step"' : ""}></span>`).join("")}</div><button type="button">→</button></nav>` : ""}`;
    return page;
  }
  function refreshDatePages() {
    resettingDateScroll = true;
    clearTimeout(dateScrollTimer);
    cancelAnimationFrame(dateScrollReset);
    previewMaps.forEach((entry) => entry.map?.remove());
    previewMaps = [];
    dateFeed.querySelectorAll(".date-preview").forEach((page) => page.remove());
    const current = $("currentDayPage");
    current.dataset.day = state.key;
    current.setAttribute("aria-label", labels[state.key]);
    const index = dayKeys.indexOf(state.key);
    const previous = dayKeys[index - 1], next = dayKeys[index + 1];
    if (previous) dateFeed.insertBefore(makeDatePreview(previous), current);
    if (next) dateFeed.append(makeDatePreview(next));
    if (state.view === "map") {
      dateFeed.querySelectorAll(".date-preview").forEach((page) => {
        const container = page.querySelector(".preview-map");
        previewMaps.push({ ...createDailyMap(container, page.dataset.day), key: page.dataset.day, container });
      });
    }
    dateFeed.scrollTo({ top: current.offsetTop, behavior: "instant" });
    dateScrollReset = requestAnimationFrame(() => {
      dateScrollReset = requestAnimationFrame(() => { resettingDateScroll = false; });
    });
  }
  function settleDateScroll() {
    if (resettingDateScroll || dateTouchActive) return;
    const pages = [...dateFeed.children];
    const nearest = pages.reduce((best, page) => Math.abs(page.offsetTop - dateFeed.scrollTop) < Math.abs(best.offsetTop - dateFeed.scrollTop) ? page : best);
    // A preview becomes the current date only after it has snapped fully into view.
    if (Math.abs(nearest.offsetTop - dateFeed.scrollTop) > 2) return;
    if (nearest.dataset.day !== state.key) {
      mount(nearest.dataset.day);
      showDateRail();
    }
  }
  dateFeed.addEventListener("scroll", () => {
    if (resettingDateScroll) return;
    showDateRail();
    clearTimeout(dateScrollTimer);
    dateScrollTimer = setTimeout(settleDateScroll, 180);
  }, { passive: true });
  dateFeed.addEventListener("scrollend", settleDateScroll);
  dateFeed.addEventListener("touchstart", () => { dateTouchActive = true; }, { passive: true });
  const endDateTouch = (event) => {
    dateTouchActive = event.touches.length > 0;
    if (!dateTouchActive) {
      clearTimeout(dateScrollTimer);
      dateScrollTimer = setTimeout(settleDateScroll, 180);
    }
  };
  dateFeed.addEventListener("touchend", endDateTouch, { passive: true });
  dateFeed.addEventListener("touchcancel", endDateTouch, { passive: true });
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
    refreshDatePages();
  }
  function moveDay(offset) {
    showDateRail();
    const index = dayKeys.indexOf(state.key) + offset;
    if (index >= 0 && index < dayKeys.length) {
      const page = [...dateFeed.children].find((item) => item.dataset.day === dayKeys[index]);
      if (page) dateFeed.scrollTo({ top: page.offsetTop, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
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
    setCaptionExpanded(false);
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
    refreshDatePages();
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
    setCaptionExpanded(!state.captionExpanded);
    if (state.captionExpanded) $("captionText").focus({ preventScroll: true });
    else $("whyButton").focus({ preventScroll: true });
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
    if (event.key === "Escape") {
      if (state.captionExpanded) { setCaptionExpanded(false); $("whyButton").focus({ preventScroll: true }); }
      setDayDetails(false); return;
    }
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.target.closest(".view-tabs, .day-details, .activity-caption")) return;
    const actions = { ArrowLeft: () => moveActivity(-1), ArrowRight: () => moveActivity(1), ArrowUp: () => moveDay(-1), ArrowDown: () => moveDay(1) };
    if (actions[event.key]) { event.preventDefault(); actions[event.key](); }
  });
  const surface = $("swipeSurface");
  const activePointers = new Set();
  let gesture = null;
  let suppressClickUntil = 0;
  const skipGesture = (target) => Boolean(target.closest("button, a, .day-details, .activity-caption, .leaflet-control"));
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
    // Vertical movement is handled by the native scroll-snap date feed.
    else return;
    suppressClickUntil = performance.now() + 350;
  });
  window.addEventListener("pointercancel", (event) => { activePointers.delete(event.pointerId); gesture = null; });
  surface.addEventListener("click", (event) => {
    if (performance.now() < suppressClickUntil) { event.preventDefault(); event.stopPropagation(); }
  }, true);
  let wheelX = 0, lastWheel = 0, wheelNavigated = false;
  surface.addEventListener("wheel", (event) => {
    if (event.ctrlKey || skipGesture(event.target) || Math.abs(event.deltaX) <= Math.abs(event.deltaY) * 1.2) return;
    event.preventDefault();
    const now = performance.now();
    if (now - lastWheel > 180) { wheelX = 0; wheelNavigated = false; }
    lastWheel = now;
    if (wheelNavigated) return;
    const scale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? surface.clientWidth : 1;
    wheelX += event.deltaX * scale;
    if (Math.abs(wheelX) < 80) return;
    moveActivity(wheelX > 0 ? 1 : -1);
    wheelX = 0; wheelNavigated = true;
  }, { passive: false });
  window.addEventListener("resize", () => {
    updateCaptionShade();
    resettingDateScroll = true;
    dateFeed.scrollTo({ top: $("currentDayPage").offsetTop, behavior: "instant" });
    if (state.view === "map") {
      state.map?.invalidateSize(); fitDailyMap();
      previewMaps.forEach(({map, key, container}) => { map?.invalidateSize(); if (map) fitMap(map, key, container); });
    }
    cancelAnimationFrame(dateScrollReset);
    dateScrollReset = requestAnimationFrame(() => { resettingDateScroll = false; });
  });
  mount(initialDay());
})();
