/* script.js - enhanced: dynamic places, gallery, favorites, comments (with delete),
   mini-theater controls, search, and contact form */

// Simple LocalStorage helper
const storage = {
  get(key){ try { return JSON.parse(localStorage.getItem(key)) ?? null } catch(e){ return null } },
  set(key,val){ localStorage.setItem(key, JSON.stringify(val)); },
  remove(key){ localStorage.removeItem(key); }
};

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const placesRow = document.getElementById('placesRow');
  const galleryGrid = document.getElementById('galleryGrid');
  const favoritesSection = document.getElementById('favoritesSection');
  const favoritesRow = document.getElementById('favoritesRow');
  const viewFavoritesBtn = document.getElementById('viewFavoritesBtn');
  const favCount = document.getElementById('favCount');
  const clearFavoritesBtn = document.getElementById('clearFavoritesBtn');
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');

  const placeModal = new bootstrap.Modal(document.getElementById('placeModal'));
  const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
  const modalTitle = document.getElementById('modalTitle');
  const modalImg = document.getElementById('modalImg');
  const modalDesc = document.getElementById('modalDesc');
  const modalCountry = document.getElementById('modalCountry');
  const modalFavBtn = document.getElementById('modalFavBtn');
  const commentsList = document.getElementById('commentsList');
  const commentInput = document.getElementById('commentInput');
  const addCommentBtn = document.getElementById('addCommentBtn');
  const openMapsBtn = document.getElementById('openMapsBtn');

  const lightboxImg = document.getElementById('lightboxImg');

  const heroVideo = document.getElementById('heroVideo');
  const videoPlayBtn = document.getElementById('videoPlayBtn');
  const videoMuteBtn = document.getElementById('videoMuteBtn');

  const contactForm = document.getElementById('contactForm');
  const contactAlert = document.getElementById('contactAlert');
  const yearSpan = document.getElementById('year');

  if(yearSpan) yearSpan.textContent = new Date().getFullYear();

  // Unique keys
  const favoritesKey = 'te_favorites_v2';
  const commentsKey = 'te_comments_v2';
  const contactsKey = 'te_contacts_v2';

  // Place dataset (6 places)
  const places = [
    {
      id: 'place-1',
      title: 'Kabul',
      country: 'Afghanistan',
      img: 'photo_2025-09-20_08-30-23.jpg',
      desc: 'Kabul is the historic capital with vibrant bazaars and cultural sites.'
    },
    {
      id: 'place-2',
      title: 'Paris',
      country: 'France',
      img: 'photo-1502602898657-3e91760cbb34.avif',
      desc: 'Paris is known for art, romance and iconic landmarks like the Eiffel Tower.'
    },
    {
      id: 'place-3',
      title: 'Naples',
      country: 'Italy',
      img: '1-2.webp',
      desc: 'Coastal city with mountains, beaches and a rich cultural scene.'
    },
    {
      id: 'place-4',
      title: 'Kyoto',
      country: 'Japan',
      img: 'images (1).jpg',
      desc: 'Kyoto offers historic temples, traditional tea houses and serene gardens.'
    },
    {
      id: 'place-5',
      title: 'Reykjavik',
      country: 'Iceland',
      img: 'the-ever-popular-blue-lagoon-spa.jpg',
      desc: 'Gateway to northern lights, unique landscapes and geothermal wonders.'
    },
    {
      id: 'place-6',
      title: 'Marrakech',
      country: 'Morocco',
      img: 'images.jpg',
      desc: 'A colorful city of markets, palaces and aromatic cuisine.'
    }
  ];

  // Gallery images (can reuse place images + extras)
  // (Removed duplicate galleryImgs declaration; see below for actual galleryImgs)

  // --- Render places ---
  function renderPlaces(list = places){
    placesRow.innerHTML = '';
    list.forEach(p => {
      const col = document.createElement('div');
      col.className = 'col place-card';
      col.dataset.title = p.title;
      col.dataset.country = p.country;
      col.dataset.desc = p.desc;
      col.dataset.img = p.img;
      col.dataset.id = p.id;
      col.innerHTML = `
        <div class="card h-100 hover-card shadow-sm">
          <img src="${p.img}" class="card-img-top place-img" alt="${escapeHTML(p.title)}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title mb-1">${escapeHTML(p.title)}</h5>
            <p class="card-text text-muted small mb-2">${escapeHTML(p.country)}</p>
            <p class="card-text truncate">${escapeHTML(p.desc)}</p>
            <div class="mt-auto d-flex gap-2">
              <button class="btn btn-sm btn-outline-primary w-100 btn-more" data-id="${p.id}" data-bs-toggle="modal" data-bs-target="#placeModal">
                <i class="bi bi-info-circle me-1"></i> Details
              </button>
              <button class="btn btn-sm btn-primary w-100 btn-fav" data-id="${p.id}">
                <i class="bi bi-heart me-1"></i> Add
              </button>
            </div>
          </div>
        </div>
      `;
      placesRow.appendChild(col);
    });
    refreshFavButtons();
  }


  // --- Render gallery ---
const galleryImgs = [
  "07cb5760-d04e-410f-9377-451c4fb004b0-1536x1023.jpg",
  "photo-1502602898657-3e91760cbb34.avif",
  "photo-1501785888041-af3ef285b470.avif",
  "photo_2025-09-20_08-30-23.jpg",
  "photo-1512453979798-5ea266f8880c.jpg",
  "shutterstock_1157705677.jpg",
  "italy-500.jpg",
  "350-5347506b59a4.jpg",
  "nature-in-isfahan.webp",
  "spring-isfahan.webp",
  "ezgif.com-jpg-to-webp-converted-4-1.webp",
  "094b3870-04b7-4f0a-8edc-c7f44b5e3373-900x506.jpg",
];

// Render Gallery 
function renderGallery() {
  const galleryGrid = document.getElementById('galleryGrid');
  galleryGrid.innerHTML = '';
  galleryImgs.forEach((src, idx) => {
    const col = document.createElement('div');
    col.className = 'col-6 col-md-3';
    col.innerHTML = `<img src="${src}" alt="gallery-${idx}" class="img-fluid rounded">`;
    galleryGrid.appendChild(col);
  });
}
renderGallery();


// const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
// const lightboxImg = document.getElementById('lightboxImg');

document.getElementById('galleryGrid').addEventListener('click', e => {
  const img = e.target.closest('img');
  if (!img) return;
  lightboxImg.src = img.src;
  imageModal.show();
});


  // --- Favorites logic ---
  function getFavorites(){ return storage.get(favoritesKey) || []; }
  function saveFavorites(list){ storage.set(favoritesKey, list); updateFavCount(); }

  function updateFavCount(){
    const c = getFavorites().length || 0;
    favCount.textContent = c;
  }

  function refreshFavButtons(){
    const favs = getFavorites();
    document.querySelectorAll('.btn-fav').forEach(btn => {
      const id = btn.dataset.id;
      if(favs.includes(id)){
        btn.classList.add('added');
        btn.innerHTML = '<i class="bi bi-heart-fill me-1"></i> Remove';
      } else {
        btn.classList.remove('added');
        btn.innerHTML = '<i class="bi bi-heart me-1"></i> Add';
      }
    });
  }

  // Init render
  renderPlaces();
  renderGallery();
  updateFavCount();

  // Delegate places clicks (details / add fav)
  placesRow.addEventListener('click', (e) => {
    const moreBtn = e.target.closest('.btn-more');
    const favBtn = e.target.closest('.btn-fav');
    if(moreBtn){
      const card = moreBtn.closest('.place-card');
      const data = {
        id: card.dataset.id,
        title: card.dataset.title,
        country: card.dataset.country,
        desc: card.dataset.desc,
        img: card.dataset.img
      };
      openModalWithData(data);
    } else if(favBtn){
      const id = favBtn.dataset.id;
      toggleFavorite(id);
      refreshFavButtons();
    }
  });

  // toggle favorite
  function toggleFavorite(id){
    let favs = getFavorites();
    if(favs.includes(id)) favs = favs.filter(x => x !== id);
    else favs.push(id);
    saveFavorites(favs);
    refreshFavButtons();
  }

  // show favorites section
  viewFavoritesBtn.addEventListener('click', () => {
    const favs = getFavorites();
    favoritesRow.innerHTML = '';
    if(!favs.length){
      favoritesRow.innerHTML = `<div class="col-12"><div class="alert alert-info py-2 small mb-0">No favorites yet.</div></div>`;
    } else {
      favs.forEach(fid => {
        const p = places.find(x => x.id === fid) || { id: fid, title: 'Unknown', country:'-', img: galleryImgs[0] };
        const col = document.createElement('div');
        col.className = 'col-12 col-md-4';
        col.innerHTML = `
          <div class="card h-100 shadow-sm">
            <img src="${p.img}" class="card-img-top" style="height:160px; object-fit:cover" alt="${escapeHTML(p.title)}">
            <div class="card-body d-flex flex-column">
              <h6 class="card-title mb-1">${escapeHTML(p.title)}</h6>
              <p class="text-muted small mb-2">${escapeHTML(p.country)}</p>
              <div class="mt-auto d-flex gap-2">
                <button class="btn btn-sm btn-outline-primary w-100 btn-open-from-fav" data-id="${p.id}">View</button>
                <button class="btn btn-sm btn-danger w-100 btn-remove-fav" data-id="${p.id}">Remove</button>
              </div>
            </div>
          </div>
        `;
        favoritesRow.appendChild(col);
      });
    }
    favoritesSection.classList.remove('d-none');
    favoritesSection.scrollIntoView({behavior:'smooth'});
  });

  // favoritesRow delegation
  favoritesRow.addEventListener('click', (e) => {
    const rem = e.target.closest('.btn-remove-fav');
    const open = e.target.closest('.btn-open-from-fav');
    if(rem){
      const id = rem.dataset.id;
      let favs = getFavorites();
      favs = favs.filter(x => x !== id);
      saveFavorites(favs);
      viewFavoritesBtn.click(); // refresh view
      refreshFavButtons();
    } else if(open){
      const id = open.dataset.id;
      const p = places.find(x => x.id === id);
      if(p) openModalWithData(p);
    }
  });

  clearFavoritesBtn.addEventListener('click', () => {
    if(confirm('Clear all favorites?')){
      storage.remove(favoritesKey);
      refreshFavButtons();
      favoritesRow.innerHTML = '';
      favoritesSection.classList.add('d-none');
      updateFavCount();
    }
  });

  // --- Modal data and comments (comments deletable) ---
  function openModalWithData(data){
    modalTitle.textContent = data.title || 'No title';
    modalCountry.textContent = data.country || '';
    modalDesc.textContent = data.desc || '';
    modalImg.src = data.img || '';
    modalImg.alt = data.title || 'place';
    modalFavBtn.dataset.id = data.id || '';
    // Store current place data for map button
    openMapsBtn.dataset.title = data.title || '';
    openMapsBtn.dataset.country = data.country || '';
    renderComments(data.id);
    placeModal.show();
  }

  // Comments storage: { placeId: [ {id, text, at} ] }
  function getAllComments(){ return storage.get(commentsKey) || {}; }
  function saveAllComments(obj){ storage.set(commentsKey, obj); }

  function renderComments(placeId){
    const all = getAllComments();
    const list = all[placeId] || [];
    if(!list.length){
      commentsList.innerHTML = '<div class="text-muted small">No comments yet.</div>';
      return;
    }
    commentsList.innerHTML = list.map(c => `
      <div class="comment-item" data-cid="${c.id}">
        <div class="comment-text">${escapeHTML(c.text)}</div>
        <div class="d-flex flex-column align-items-end">
          <div class="comment-meta">${new Date(c.at).toLocaleString()}</div>
          <button class="btn btn-sm btn-link text-danger btn-delete-comment" title="Delete">Delete</button>
        </div>
      </div>
    `).join('');
  }

  addCommentBtn.addEventListener('click', () => {
    const placeId = modalFavBtn.dataset.id;
    const text = commentInput.value.trim();
    if(!text) return;
    const all = getAllComments();
    all[placeId] = all[placeId] || [];
    all[placeId].unshift({ id: 'c-' + Date.now(), text, at: new Date().toISOString() });
    saveAllComments(all);
    commentInput.value = '';
    renderComments(placeId);
  });

  // delete comment delegation
  commentsList.addEventListener('click', (e) => {
    const delBtn = e.target.closest('.btn-delete-comment');
    if(!delBtn) return;
    const cid = delBtn.closest('.comment-item').dataset.cid;
    const placeId = modalFavBtn.dataset.id;
    if(!cid || !placeId) return;
    const all = getAllComments();
    all[placeId] = (all[placeId] || []).filter(c => c.id !== cid);
    saveAllComments(all);
    renderComments(placeId);
  });

  // modal favorite button
  modalFavBtn.addEventListener('click', () => {
    const id = modalFavBtn.dataset.id;
    toggleFavorite(id);
    refreshFavButtons();
    updateFavCount();
    // small UI effect
    modalFavBtn.classList.toggle('btn-outline-primary');
    modalFavBtn.classList.toggle('btn-danger');
  // --- Gallery image lightbox ---
  galleryGrid.addEventListener('click', (e) => {
    const img = e.target.closest('img');
    if(!img) return;
    lightboxImg.src = img.dataset.src || img.src;
    imageModal.show();
  });

  // --- Open Maps Button ---
  openMapsBtn.addEventListener('click', () => {
    // Use the place title and country to search in Google Maps
    const title = openMapsBtn.dataset.title || '';
    const country = openMapsBtn.dataset.country || '';
    const query = encodeURIComponent(`${title} ${country}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  });
    lightboxImg.src = img.dataset.src || img.src;
    imageModal.show();
  });
  // --- Open Maps Button ---
  openMapsBtn.addEventListener('click', () => {
    // Use the place title and country to search in Google Maps
    const title = openMapsBtn.dataset.title || '';
    const country = openMapsBtn.dataset.country || '';
    const query = encodeURIComponent(`${title} ${country}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  });

  // --- Search functionality ---
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll('.place-card').forEach(card => {
      const title = card.dataset.title.toLowerCase();
      const country = card.dataset.country.toLowerCase();
      const desc = card.dataset.desc.toLowerCase();
      const match = q === '' || title.includes(q) || country.includes(q) || desc.includes(q);
      card.style.display = match ? '' : 'none';
    });
  });
  clearSearchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('input'));
  });

  // --- Quick buttons linking ---
  document.getElementById('openPlacesBtn').addEventListener('click', () => { document.getElementById('placesGrid').scrollIntoView({behavior:'smooth'}); });
  document.getElementById('openGalleryBtn').addEventListener('click', () => { document.getElementById('gallerySection').scrollIntoView({behavior:'smooth'}); });
  document.getElementById('openContactBtn').addEventListener('click', () => { document.getElementById('contactSection').scrollIntoView({behavior:'smooth'}); });

  // --- Hero video controls ---
  if(heroVideo){
    videoPlayBtn.addEventListener('click', () => {
      if(heroVideo.paused){ heroVideo.play(); videoPlayBtn.innerHTML = '<i class="bi bi-pause-fill"></i> Pause'; }
      else { heroVideo.pause(); videoPlayBtn.innerHTML = '<i class="bi bi-play-fill"></i> Play'; }
    });
    videoMuteBtn.addEventListener('click', () => {
      heroVideo.muted = !heroVideo.muted;
      videoMuteBtn.innerHTML = heroVideo.muted ? '<i class="bi bi-volume-mute"></i> Muted' : '<i class="bi bi-volume-up"></i> Unmuted';
    });
  }

  // --- Contact form ---
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const msg = document.getElementById('contactMessage').value.trim();
    if(!name || !email || !msg){
      contactAlert.innerHTML = '<div class="alert alert-danger py-2 small">Please fill all fields.</div>';
      return;
    }
    const saved = storage.get(contactsKey) || [];
    saved.unshift({ name, email, msg, at: new Date().toISOString() });
    storage.set(contactsKey, saved);
    contactForm.reset();
    contactAlert.innerHTML = '<div class="alert alert-success py-2 small">Your message has been sent. Thank you!</div>';
    setTimeout(()=> contactAlert.innerHTML = '', 3500);
  });

  // helper: escape
  function escapeHTML(s){ return (s+'').replace(/[&<>"']/g, (m)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])); }

});
