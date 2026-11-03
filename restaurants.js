(() => {
  const research = window.HAWAII_RESTAURANTS;
  const panel = document.getElementById('restaurantsPanel');
  const list = document.getElementById('restaurantList');
  const dialog = document.getElementById('restaurantMenuDialog');
  const positions = { breakfast: 0, lunchDinner: 0 };
  const esc = value => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  let meal = 'breakfast', items = [], current = 0, frame;
  function distance(item) {
    const meters = Math.max(50, Math.round(item.distanceMeters / 50) * 50);
    const label = meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${meters} m`;
    return item.distanceKind === 'walking' ? `~${label} walk · ${item.walkingMinutes} min from hotel` : `~${label} from hotel · direct distance`;
  }
  function updatePosition() {
    if (!list.clientHeight) return;
    current = Math.min(items.length - 1, Math.max(0, Math.round(list.scrollTop / list.clientHeight)));
    positions[meal] = current;
    document.getElementById('restaurantCount').textContent = `${current + 1} / ${items.length}`;
    // Keep five consecutive full pages ready; the rest retain their DOM and load on demand.
    [...list.children].forEach((page, index) => {
      page.inert = index !== current;
      page.setAttribute('aria-current', index === current ? 'true' : 'false');
      if (Math.abs(index - current) <= 2) page.querySelectorAll('img').forEach(img => { img.loading = 'eager'; });
    });
  }
  function updateMedia(feed) {
    const menu = feed.scrollLeft >= feed.clientWidth / 2;
    const page = feed.closest('.restaurant-page');
    page.classList.toggle('show-menu', menu);
    [...feed.children].forEach((slide, index) => { slide.inert = index !== Number(menu); });
    // A hidden food caption must not hide the restaurant's identity on its menu.
    page.querySelector('.restaurant-caption').hidden = !menu && page.classList.contains('details-hidden');
  }
  function renderMeal(next) {
    meal = next;
    list.setAttribute('aria-labelledby', `${meal}Tab`);
    items = research.items.filter(item => item.meal === meal).sort((a, b) => a.distanceMeters - b.distanceMeters);
    current = positions[meal];
    list.innerHTML = items.map((item, index) => {
      const walkingUrl = `https://www.google.com/maps/dir/?api=1&origin=${research.hotel.lat},${research.hotel.lng}&destination=${encodeURIComponent(item.name + ', ' + item.address)}&travelmode=walking`;
      const photo = item.foodPhoto;
      const loading = Math.abs(index - current) <= 2 ? 'eager' : 'lazy';
      const preview = item.menuPreview ? `<button class="restaurant-menu-preview" type="button" aria-label="Enlarge ${esc(item.name)} menu"><img src="${esc(item.menuPreview)}" alt="Published menu for ${esc(item.name)}" loading="${loading}" decoding="async"><span>Tap to enlarge · Full menu ↗</span><small>${esc(item.menuPhotoNote || "Published menu · dishes and prices may change.")}</small></button>` : `<div class="restaurant-menu-preview menu-unavailable"><p>${esc(item.name)}</p><a href="${esc(item.menu)}" target="_blank" rel="noopener">View restaurant menu ↗</a></div>`;
      return `<article class="restaurant-page" data-restaurant="${esc(item.id)}" aria-label="${esc(item.name)} · ${index + 1} of ${items.length}">
        <div class="restaurant-media-feed" tabindex="0" role="region" aria-label="Restaurant photos and menu">
        <div class="restaurant-media-page"><picture class="restaurant-photo"><source media="(max-width: 767px)" srcset="${esc(photo.mobile)}"><img src="${esc(photo.desktop)}" alt="Food at ${esc(item.name)}" loading="${loading}" decoding="async" tabindex="0" role="button" aria-label="Hide restaurant details" aria-expanded="true"></picture>
        </div><div class="restaurant-media-page" inert>${preview}</div>
        </div><div class="restaurant-shade" aria-hidden="true"></div>
        <section class="restaurant-caption" aria-label="Restaurant details">
          <h2>${esc(item.name)}</h2>
          <a class="restaurant-rating" href="${esc(item.googleMapsUrl)}" target="_blank" rel="noopener">★ ${item.googleRating.toFixed(1)} <span>· ${item.googleReviewCount.toLocaleString('en-US')} Google reviews ↗</span></a>
          <p class="restaurant-distance">${distance(item)}</p>
          <div class="restaurant-caption-scroll" tabindex="0" role="region" aria-label="About ${esc(item.name)}">
            <p>${esc(item.reason)}</p>${item.order ? `<p><strong>Try:</strong> ${esc(item.order)}</p>` : ''}
            <div class="restaurant-extra" hidden><p>${esc(item.tip)}</p><p>${esc(item.address)}</p>
              <p class="restaurant-research-note">Google snapshot via <a href="${esc(item.ratingSource)}" target="_blank" rel="noopener">${esc(item.ratingSourceLabel || 'LOCAL Waikiki')}</a> · checked 3 Nov 2026. Walking routes are approximate, to the restaurant or its building entrance. Allow extra time for crossings and indoor access. <a href="${esc(item.routeSource)}" target="_blank" rel="noopener">Route source</a> · <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© OpenStreetMap</a>.</p>
              <p class="restaurant-research-note">${esc(item.menuPhotoNote || 'Published menu preview; prices and dishes may change.')} <a href="${esc(item.menuPreviewSource || item.menu)}" target="_blank" rel="noopener">Menu source ↗</a></p>
              <p class="restaurant-photo-credit">Food photo: <a href="${esc(photo.source)}" target="_blank" rel="noopener">${esc(photo.credit)}</a>. Food shown may be from another service period. <button class="restaurant-less" type="button">See less</button></p>
            </div>
          </div>
          <div class="restaurant-actions"><a href="${walkingUrl}" target="_blank" rel="noopener">Directions ↗</a><a href="${esc(item.menu)}" target="_blank" rel="noopener">Full menu ↗</a><button class="restaurant-more" type="button" aria-expanded="false">See more</button></div>
        </section>
      </article>`;
    }).join('');
    list.querySelectorAll('.restaurant-media-feed').forEach(feed => {
      feed.addEventListener('scroll', () => updateMedia(feed), { passive: true });
    });
    list.scrollTo({ top: current * list.clientHeight, behavior: 'instant' });
    updatePosition();
  }
  function toggleCaption(page) {
    const hidden = page.classList.toggle('details-hidden');
    page.querySelector('.restaurant-caption').hidden = hidden;
    const image = page.querySelector('.restaurant-photo img');
    image.setAttribute('aria-expanded', String(!hidden));
    image.setAttribute('aria-label', hidden ? 'Show restaurant details' : 'Hide restaurant details');
  }
  list.addEventListener('click', event => {
    const page = event.target.closest('.restaurant-page');
    if (!page) return;
    if (event.target.closest('.restaurant-caption')) {
      const expanded = event.target.closest('.restaurant-more, .restaurant-less');
      if (expanded) {
        const on = expanded.classList.contains('restaurant-more');
        page.classList.toggle('caption-expanded', on);
        page.querySelector('.restaurant-extra').hidden = !on;
        page.querySelector('.restaurant-more').hidden = on;
        page.querySelector('.restaurant-more').setAttribute('aria-expanded', String(on));
        if (!on) page.querySelector('.restaurant-caption-scroll').scrollTop = 0;
      }
      return;
    }
    if (event.target.closest('.restaurant-menu-preview')) {
      const item = items.find(item => item.id === page.dataset.restaurant);
      if (!item.menuPreview || event.target.closest('a')) return;
      const img = document.getElementById('restaurantMenuFull'); img.src = item.menuPreview; img.alt = `${item.name} published menu`;
      document.getElementById('restaurantMenuSource').href = item.menuPreviewSource || item.menu;
      dialog.showModal(); return;
    }
    if (event.target.closest('.restaurant-photo')) toggleCaption(page);
  });
  list.addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('.restaurant-photo img')) { event.preventDefault(); toggleCaption(event.target.closest('.restaurant-page')); }
    if (['ArrowLeft', 'ArrowRight'].includes(event.key) && !event.target.closest('.restaurant-caption')) {
      const feed = event.target.closest('.restaurant-media-feed') || list.children[current].querySelector('.restaurant-media-feed');
      event.preventDefault(); event.stopPropagation();
      feed.scrollTo({ left: event.key === 'ArrowRight' ? feed.clientWidth : 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      return;
    }
    if (!['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(event.key) || event.target.closest('.restaurant-caption')) return;
    event.preventDefault(); event.stopPropagation();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : Math.max(0, Math.min(items.length - 1, current + (['ArrowUp', 'PageUp'].includes(event.key) ? -1 : 1)));
    list.scrollTo({ top: next * list.clientHeight, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  });
  list.addEventListener('scroll', () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(updatePosition); }, { passive: true });
  panel.addEventListener('restaurant-meal', event => {
    if (event.detail !== meal) renderMeal(event.detail);
  });
  document.getElementById('closeRestaurantMenu').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  // Restore the chosen restaurant after a top-tab round trip or a viewport resize.
  new ResizeObserver(() => {
    if (panel.hidden || !list.clientHeight) return;
    list.scrollTo({ top: positions[meal] * list.clientHeight, behavior: 'instant' });
    list.querySelectorAll('.restaurant-media-feed').forEach(feed => {
      feed.scrollTo({ left: feed.closest('.restaurant-page').classList.contains('show-menu') ? feed.clientWidth : 0, behavior: 'instant' });
      updateMedia(feed);
    });
    updatePosition();
  }).observe(list);
  renderMeal(meal);
})();
