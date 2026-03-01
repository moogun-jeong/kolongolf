document.documentElement.classList.add("js");

const scrollProgress = document.getElementById("scrollProgress");
const parallaxTargets = Array.from(document.querySelectorAll("[data-parallax]"));
const revealTargets = Array.from(document.querySelectorAll("[data-reveal]"));

const searchInput = document.getElementById("memberSearch");
const memberReset = document.getElementById("memberReset");
const memberCards = Array.from(document.querySelectorAll(".member-card"));

const modals = Array.from(document.querySelectorAll(".modal"));
const photoLightbox = document.getElementById("photoLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxThumbs = document.getElementById("lightboxThumbs");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

const archiveShots = Array.from(document.querySelectorAll(".archive-shot"));
const galleryItems = archiveShots.map((shot) => ({
  src: shot.dataset.lightboxSrc || "",
  title: shot.dataset.lightboxTitle || "행사 사진",
  caption: shot.dataset.lightboxCaption || "기록 이미지"
}));
let currentLightboxIndex = 0;
const waackyDrive = document.querySelector("[data-waacky-drive]");
const waackyDriveSticky = document.querySelector(".waacky-drive-sticky");
const waackyDriveMain = document.querySelector("[data-waacky-drive-char='main']");
const waackyDriveGhostA = document.querySelector("[data-waacky-drive-char='ghost-a']");
const waackyDriveGhostB = document.querySelector("[data-waacky-drive-char='ghost-b']");
const waackyDriveStepMain = document.querySelector("[data-waacky-drive-step='main']");
const waackyDriveStepGhostA = document.querySelector("[data-waacky-drive-step='ghost-a']");
const waackyDriveStepGhostB = document.querySelector("[data-waacky-drive-step='ghost-b']");
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const isMobileViewport = window.matchMedia?.("(max-width: 920px)")?.matches ?? false;
const isCoarsePointer = window.matchMedia?.("(hover: none) and (pointer: coarse)")?.matches ?? false;
const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
const disableHeavyScrollEffects = prefersReducedMotion || (isMobileViewport && isCoarsePointer);
let heavyEffectsMuted = false;

if (disableHeavyScrollEffects) {
  document.body.classList.add("low-motion-mobile");
}

revealTargets.forEach((target, index) => {
  target.classList.add("reveal-ready");
  target.style.setProperty("--reveal-delay", `${Math.min(index * 45, 220)}ms`);
});

const applyMemberFilter = () => {
  if (!searchInput) return;
  const query = searchInput.value.trim().toLowerCase();
  memberCards.forEach((card) => {
    const match = card.textContent.toLowerCase().includes(query);
    card.classList.toggle("is-hidden", !match);
  });
};

searchInput?.addEventListener("input", applyMemberFilter);
memberReset?.addEventListener("click", () => {
  if (!searchInput) return;
  searchInput.value = "";
  applyMemberFilter();
});

const updateDday = () => {
  const ddayNodes = document.querySelectorAll("[data-dday]");
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  ddayNodes.forEach((node) => {
    const raw = node.getAttribute("data-dday");
    if (!raw) return;
    const target = new Date(`${raw}T00:00:00`);
    if (Number.isNaN(target.getTime())) return;

    const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    if (diffDays > 0) node.textContent = `D-${diffDays}`;
    else if (diffDays === 0) node.textContent = "D-Day";
    else node.textContent = `D+${Math.abs(diffDays)}`;
  });
};

const syncModalState = () => {
  const hasOpenModal = modals.some((modal) => modal.classList.contains("open"));
  document.body.classList.toggle("modal-open", hasOpenModal);
};

const openModal = (modalId) => {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  syncModalState();
};

const closeModal = (modal) => {
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  syncModalState();
};

const closeAllModals = () => {
  modals.forEach((modal) => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  });
  syncModalState();
};

const renderLightbox = (index) => {
  if (!galleryItems.length || !lightboxImage) return;
  currentLightboxIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[currentLightboxIndex];

  lightboxImage.src = item.src;
  lightboxImage.alt = item.title;
  if (lightboxTitle) lightboxTitle.textContent = item.title;
  if (lightboxCaption) lightboxCaption.textContent = item.caption;

  lightboxThumbs?.querySelectorAll(".lightbox-thumb").forEach((thumb, thumbIndex) => {
    thumb.classList.toggle("active", thumbIndex === currentLightboxIndex);
  });
};

const openLightbox = (index) => {
  renderLightbox(index);
  openModal("photoLightbox");
};

if (lightboxThumbs) {
  lightboxThumbs.innerHTML = "";
  galleryItems.forEach((item, index) => {
    const thumb = document.createElement("button");
    thumb.type = "button";
    thumb.className = "lightbox-thumb";
    thumb.style.backgroundImage = `url("${item.src}")`;
    thumb.setAttribute("aria-label", `${index + 1}번째 사진`);
    thumb.addEventListener("click", () => renderLightbox(index));
    lightboxThumbs.append(thumb);
  });
}

archiveShots.forEach((shot, index) => {
  shot.addEventListener("click", () => openLightbox(index));
});

lightboxPrev?.addEventListener("click", () => renderLightbox(currentLightboxIndex - 1));
lightboxNext?.addEventListener("click", () => renderLightbox(currentLightboxIndex + 1));

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const openTrigger = target.closest("[data-open-modal]");
  if (openTrigger) {
    event.preventDefault();
    openModal(openTrigger.getAttribute("data-open-modal"));
    return;
  }

  const closeTrigger = target.closest("[data-close-modal]");
  if (closeTrigger) {
    event.preventDefault();
    closeModal(closeTrigger.closest(".modal"));
    return;
  }

  if (target.classList.contains("modal")) {
    closeModal(target);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeAllModals();
    return;
  }

  const lightboxOpen = photoLightbox?.classList.contains("open");
  if (!lightboxOpen || !galleryItems.length) return;

  if (event.key === "ArrowLeft") renderLightbox(currentLightboxIndex - 1);
  if (event.key === "ArrowRight") renderLightbox(currentLightboxIndex + 1);
});

document.querySelectorAll("a[href^='#']").forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const href = anchor.getAttribute("href");
    if (!href || href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

if ("IntersectionObserver" in window) {
  const revealIsMobile = window.matchMedia?.("(max-width: 920px)")?.matches ?? false;
  const revealObserverOptions = revealIsMobile
    ? { threshold: 0.22, rootMargin: "0px 0px -14% 0px" }
    : { threshold: 0.12, rootMargin: "0px 0px -8% 0px" };

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    revealObserverOptions
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

const updateScrollEffects = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  if (scrollProgress) {
    scrollProgress.style.setProperty("--progress", progress.toFixed(4));
  }

  if (disableHeavyScrollEffects) {
    if (!heavyEffectsMuted) {
      parallaxTargets.forEach((target) => target.style.setProperty("--parallax-y", "0px"));
      heavyEffectsMuted = true;
    }
    return;
  }

  parallaxTargets.forEach((target) => {
    const speed = Number(target.dataset.parallax || 0);
    const rect = target.getBoundingClientRect();
    const offsetToCenter = rect.top + rect.height / 2 - window.innerHeight / 2;
    const y = -offsetToCenter * speed * 0.18;
    target.style.setProperty("--parallax-y", `${y.toFixed(2)}px`);
  });

  if (waackyDrive && waackyDriveSticky && waackyDriveMain) {
    const rect = waackyDrive.getBoundingClientRect();
    const driveProgressRange = Math.max(rect.height + window.innerHeight, 1);
    const driveProgress = clamp((window.innerHeight - rect.top) / driveProgressRange, 0, 1);
    const laneRect = waackyDriveSticky.getBoundingClientRect();
    const wave = Math.sin(driveProgress * Math.PI * 2.8);

    if (laneRect.width < 1 || laneRect.height < 1) return;

    const moveDriveChar = (element, localProgress, options) => {
      if (!element) return null;
      const p = clamp(localProgress, 0, 1);
      const stride = Math.sin(p * Math.PI * 5.4 + options.stepPhase);
      const lift = Math.abs(stride);
      const x = 1.12 * laneRect.width - p * 1.34 * laneRect.width + (options.xNudge || 0);
      const yBase = 0.52 * laneRect.height - p * 0.08 * laneRect.height + (options.yNudge || 0) + Math.sin(p * 2.8) * 2.2;
      const y = yBase - lift * 11;
      const scale = (0.9 + p * 0.09) * options.scale;
      const rotate = 8 - p * 14 + stride * 4 + options.rotateNudge;
      const fadeIn = clamp((p + 0.06) / 0.14, 0, 1);
      const fadeOut = clamp((1 - p + 0.04) / 0.2, 0, 1);
      const opacity = Math.min(fadeIn, fadeOut) * options.alpha;

      element.style.opacity = opacity.toFixed(3);
      element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)}) rotate(${rotate.toFixed(2)}deg)`;
      return { p, x, yBase, opacity, lift };
    };

    const moveDriveStep = (element, motion, options) => {
      if (!element || !motion) return;
      const contact = clamp(1 - motion.lift * 1.4, 0, 1);
      const stepOpacity = motion.opacity * (0.26 + contact * 0.64) * options.alpha;
      const stepX = motion.x + laneRect.width * options.xFactor;
      const stepY = motion.yBase + laneRect.height * options.yFactor;
      const stepScaleX = (0.56 + contact * 0.66) * options.scale;
      const stepScaleY = (0.4 + contact * 0.38) * options.scale;

      element.style.setProperty("--step-ring", contact.toFixed(3));
      element.style.opacity = stepOpacity.toFixed(3);
      element.style.transform = `translate3d(${stepX.toFixed(1)}px, ${stepY.toFixed(1)}px, 0) scale(${stepScaleX.toFixed(3)}, ${stepScaleY.toFixed(3)})`;
    };

    const mainMotion = moveDriveChar(waackyDriveMain, driveProgress, {
      scale: 1,
      alpha: 1,
      rotateNudge: 0,
      xNudge: 0,
      yNudge: 0,
      stepPhase: 0
    });

    const ghostAMotion = moveDriveChar(waackyDriveGhostA, driveProgress - 0.09, {
      scale: 0.92,
      alpha: 0.4,
      rotateNudge: 7,
      xNudge: 16,
      yNudge: 6,
      stepPhase: 0.9
    });

    const ghostBMotion = moveDriveChar(waackyDriveGhostB, driveProgress - 0.16, {
      scale: 0.84,
      alpha: 0.24,
      rotateNudge: 11,
      xNudge: 30,
      yNudge: 9,
      stepPhase: 1.4
    });

    moveDriveStep(waackyDriveStepMain, mainMotion, {
      scale: 1,
      alpha: 1,
      xFactor: 0.006,
      yFactor: 0.36
    });

    moveDriveStep(waackyDriveStepGhostA, ghostAMotion, {
      scale: 0.9,
      alpha: 0.46,
      xFactor: 0.003,
      yFactor: 0.34
    });

    moveDriveStep(waackyDriveStepGhostB, ghostBMotion, {
      scale: 0.78,
      alpha: 0.3,
      xFactor: -0.002,
      yFactor: 0.32
    });

    waackyDrive.style.setProperty("--drive-lines", (0.05 + Math.abs(wave) * 0.08).toFixed(3));
  }

};

let ticking = false;
const requestScrollUpdate = () => {
  if (ticking) return;
  ticking = true;

  requestAnimationFrame(() => {
    updateScrollEffects();
    ticking = false;
  });
};

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);
window.addEventListener("pageshow", () => {
  syncModalState();
  requestScrollUpdate();
});

syncModalState();
updateDday();
requestScrollUpdate();
