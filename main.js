const searchInput = document.getElementById("memberSearch");
const memberGrid = document.getElementById("memberGrid");
const resetBtn = document.getElementById("memberReset");

const filterMembers = () => {
  const query = searchInput.value.trim().toLowerCase();
  const members = memberGrid.querySelectorAll(".member");
  members.forEach((member) => {
    const text = member.textContent.toLowerCase();
    member.style.display = text.includes(query) ? "flex" : "none";
  });
};

searchInput?.addEventListener("input", filterMembers);
resetBtn?.addEventListener("click", () => {
  searchInput.value = "";
  filterMembers();
});

document.querySelectorAll("a[href^='#']").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const updateDday = () => {
  const items = document.querySelectorAll("[data-dday]");
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  items.forEach((item) => {
    const raw = item.getAttribute("data-dday");
    if (!raw) return;
    const target = new Date(`${raw}T00:00:00`);
    const diff = Math.ceil((target - startOfDay) / (1000 * 60 * 60 * 24));
    if (Number.isNaN(diff)) return;
    if (diff > 0) item.textContent = `D-${diff}`;
    else if (diff === 0) item.textContent = "D-Day";
    else item.textContent = `D+${Math.abs(diff)}`;
  });
};

updateDday();

const rsvpOpen = document.getElementById("rsvpOpen");
const joinOpen = document.getElementById("joinOpen");
const mapPopupTrigger = document.getElementById("mapPopupTrigger");
const rsvpModal = document.getElementById("rsvpModal");
const joinModal = document.getElementById("joinModal");
const locationModal = document.getElementById("locationModal");
const rsvpClose = document.getElementById("rsvpClose");
const rsvpConfirm = document.getElementById("rsvpConfirm");
const joinClose = document.getElementById("joinClose");
const joinConfirm = document.getElementById("joinConfirm");
const locationClose = document.getElementById("locationClose");
const locationConfirm = document.getElementById("locationConfirm");
const locationNaviLink = document.getElementById("locationNaviLink");
const photoLightbox = document.getElementById("photoLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
const lightboxThumbs = document.getElementById("lightboxThumbs");
const KAKAO_JS_KEY = "b8632f1a142a8d6e3f172f23b0d5ed5c";
const NAVI_DEST_NAME = "울산골프존 스크린골프연습장";
const NAVI_DEST_ADDRESS = "울산 남구 화합로 108";
const isMobileDevice = () =>
  /Android|iPhone|iPad|iPod|Windows Phone|webOS/i.test(navigator.userAgent);

const canUseKakaoNavi = () =>
  typeof window !== "undefined" &&
  window.Kakao &&
  window.kakao &&
  window.kakao.maps &&
  window.kakao.maps.services;

const ensureKakaoInitialized = () => {
  if (!canUseKakaoNavi()) return false;
  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(KAKAO_JS_KEY);
  }
  return true;
};

const geocodeAddress = (address) =>
  new Promise((resolve, reject) => {
    try {
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, (result, status) => {
        if (status !== window.kakao.maps.services.Status.OK || !result?.length) {
          reject(new Error("Address geocoding failed"));
          return;
        }
        resolve({ x: result[0].x, y: result[0].y });
      });
    } catch (error) {
      reject(error);
    }
  });

const startKakaoNavi = async () => {
  if (!ensureKakaoInitialized()) throw new Error("Kakao SDK unavailable");
  const { x, y } = await geocodeAddress(NAVI_DEST_ADDRESS);
  window.Kakao.Navi.start({
    name: NAVI_DEST_NAME,
    x,
    y,
    coordType: "wgs84",
  });
};

const openModal = (modal) => {
  if (!modal) return;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const closeModal = (modal) => {
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

const galleryItems = [];
let currentLightboxIndex = 0;

const renderLightbox = (index) => {
  if (!galleryItems.length || !lightboxImage) return;
  currentLightboxIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[currentLightboxIndex];
  lightboxImage.src = item.imageUrl;
  if (lightboxTitle) lightboxTitle.textContent = item.titleText;
  if (lightboxCaption) lightboxCaption.textContent = item.captionText;
  lightboxThumbs?.querySelectorAll(".lightbox-thumb").forEach((thumb, thumbIndex) => {
    thumb.classList.toggle("active", thumbIndex === currentLightboxIndex);
  });
};

const openLightbox = (index) => {
  if (!photoLightbox || !lightboxImage || !galleryItems.length) return;
  renderLightbox(index);
  photoLightbox.classList.add("open");
  photoLightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const closeLightbox = () => {
  if (!photoLightbox || !lightboxImage) return;
  photoLightbox.classList.remove("open");
  photoLightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  document.body.style.overflow = "";
};

rsvpOpen?.addEventListener("click", () => openModal(rsvpModal));
joinOpen?.addEventListener("click", () => openModal(joinModal));
mapPopupTrigger?.addEventListener("click", (event) => {
  event.preventDefault();
  openModal(locationModal);
});
rsvpClose?.addEventListener("click", () => closeModal(rsvpModal));
rsvpConfirm?.addEventListener("click", () => closeModal(rsvpModal));
joinClose?.addEventListener("click", () => closeModal(joinModal));
joinConfirm?.addEventListener("click", () => closeModal(joinModal));
locationClose?.addEventListener("click", () => closeModal(locationModal));
locationConfirm?.addEventListener("click", () => closeModal(locationModal));
locationNaviLink?.addEventListener("click", async (event) => {
  event.preventDefault();
  if (!isMobileDevice()) {
    window.open(locationNaviLink.href, "_blank", "noopener,noreferrer");
    return;
  }
  try {
    await startKakaoNavi();
  } catch (error) {
    window.open(locationNaviLink.href, "_blank", "noopener,noreferrer");
  }
});
rsvpModal?.addEventListener("click", (event) => {
  if (event.target === rsvpModal) closeModal(rsvpModal);
});
joinModal?.addEventListener("click", (event) => {
  if (event.target === joinModal) closeModal(joinModal);
});
locationModal?.addEventListener("click", (event) => {
  if (event.target === locationModal) closeModal(locationModal);
});
lightboxClose?.addEventListener("click", closeLightbox);
photoLightbox?.addEventListener("click", (event) => {
  if (event.target === photoLightbox) closeLightbox();
});

const buildGalleryItem = (node) => {
  const imageUrl = node.style.backgroundImage.replace(/^url\(["']?/, "").replace(/["']?\)$/, "");
  const titleText =
    node.dataset.title ||
    node.closest(".timeline-content")?.querySelector("h3")?.textContent?.trim() ||
    "행사 사진";
  const captionText =
    node.dataset.caption ||
    node.closest(".timeline-content")?.querySelector(".meta")?.textContent?.trim() ||
    "행사 기록";

  if (!imageUrl) return;
  galleryItems.push({ imageUrl, titleText, captionText });
};

document.querySelectorAll(".timeline-photo").forEach((photo) => {
  buildGalleryItem(photo);
});

if (lightboxThumbs) {
  lightboxThumbs.innerHTML = "";
  galleryItems.forEach((item, index) => {
    const thumb = document.createElement("button");
    thumb.className = "lightbox-thumb";
    thumb.type = "button";
    thumb.style.backgroundImage = `url("${item.imageUrl}")`;
    thumb.setAttribute("aria-label", `${index + 1}번째 사진`);
    thumb.addEventListener("click", () => renderLightbox(index));
    lightboxThumbs.append(thumb);
  });
}

document.querySelectorAll(".timeline-photo").forEach((photo, index) => {
  const clickable = photo;
  clickable.setAttribute("role", "button");
  clickable.setAttribute("tabindex", "0");
  const handleOpen = () => openLightbox(index);

  clickable.addEventListener("click", handleOpen);
  clickable.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleOpen();
    }
  });
});

lightboxPrev?.addEventListener("click", () => renderLightbox(currentLightboxIndex - 1));
lightboxNext?.addEventListener("click", () => renderLightbox(currentLightboxIndex + 1));

document.addEventListener("keydown", (event) => {
  const isLightboxOpen = photoLightbox?.classList.contains("open");
  if (event.key === "Escape") {
    closeModal(rsvpModal);
    closeModal(joinModal);
    closeModal(locationModal);
    closeLightbox();
  }
  if (!isLightboxOpen) return;
  if (event.key === "ArrowLeft") renderLightbox(currentLightboxIndex - 1);
  if (event.key === "ArrowRight") renderLightbox(currentLightboxIndex + 1);
});

const revealTargets = document.querySelectorAll(
  ".feature-card, .schedule-card, .member, .timeline-item"
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.18 }
);

revealTargets.forEach((target, index) => {
  target.style.opacity = "0";
  target.style.transform = "translateY(18px)";
  target.style.transition = `opacity 0.55s ease ${Math.min(index * 0.03, 0.24)}s, transform 0.55s ease ${Math.min(index * 0.03, 0.24)}s`;
  revealObserver.observe(target);
});
