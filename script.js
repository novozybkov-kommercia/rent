// Укажите точные имена файлов из папки photos/ в нужном порядке.
const photoFiles = [
  "photo_2025-07-12_14-10-04.jpg",
  "photo_2025-07-12_14-09-57.jpg",
  "photo_2025-07-12_13-56-46.jpg",
  "photo_2025-07-12_13-56-39.jpg"
];

const photos = photoFiles.map((file, index) => ({
  src: `photos/${file}`,
  alt: `Коммерческая недвижимость в Новозыбкове - фото ${index + 1}`
}));

const galleryGrid = document.getElementById("galleryGrid");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeButton = document.getElementById("lightboxClose");
const prevButton = document.getElementById("lightboxPrev");
const nextButton = document.getElementById("lightboxNext");

let activeIndex = 0;

function renderGallery() {
  if (!galleryGrid) return;

  if (photos.length === 0) {
    galleryGrid.innerHTML = `
      <p class="gallery-empty">
        Фотографии пока не подключены. Добавьте имена файлов в массив <code>photoFiles</code> в <code>script.js</code>.
      </p>
    `;
    return;
  }

  const html = photos
    .map((item, index) => {
      const classes = index === 0 ? "gallery-item is-primary" : "gallery-item";
      return `
        <button class="${classes}" type="button" data-index="${index}" aria-label="Открыть фото ${index + 1}">
          <img src="${item.src}" alt="${item.alt}" loading="lazy">
        </button>
      `;
    })
    .join("");

  galleryGrid.innerHTML = html;

  const items = galleryGrid.querySelectorAll(".gallery-item");
  items.forEach((item) => {
    item.addEventListener("click", () => {
      const index = Number(item.dataset.index || 0);
      openLightbox(index);
    });
  });
}

function openLightbox(index) {
  activeIndex = index;
  updateLightboxImage();
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = "";
}

function updateLightboxImage() {
  const photo = photos[activeIndex];
  if (!photo) return;
  lightboxImage.src = photo.src;
  lightboxImage.alt = photo.alt;
}

function showPrevious() {
  activeIndex = (activeIndex - 1 + photos.length) % photos.length;
  updateLightboxImage();
}

function showNext() {
  activeIndex = (activeIndex + 1) % photos.length;
  updateLightboxImage();
}

function setupRevealAnimation() {
  const revealElements = document.querySelectorAll(".hero-copy, .hero-card, .benefit, .gallery-section, .location-section, .faq-section, .contacts-section");
  revealElements.forEach((el) => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealElements.forEach((el) => observer.observe(el));
}

renderGallery();
setupRevealAnimation();

closeButton?.addEventListener("click", closeLightbox);
prevButton?.addEventListener("click", showPrevious);
nextButton?.addEventListener("click", showNext);

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (lightbox.hidden) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showPrevious();
  if (event.key === "ArrowRight") showNext();
});
