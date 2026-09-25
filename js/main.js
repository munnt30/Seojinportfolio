// 1) 작품 필터: 버튼을 누르면 해당 카테고리만 보여줘요
const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".card");

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");

    const category = button.dataset.filter;
    cards.forEach((card) => {
      const show = category === "all" || card.dataset.category === category;
      card.classList.toggle("hidden", !show);
    });
  });
});

// 2) 다크 모드: 선택한 테마를 기억해요
const toggle = document.querySelector(".theme-toggle");
const saved = localStorage.getItem("theme");
if (saved) document.documentElement.dataset.theme = saved;

toggle?.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("theme", next);
});

// 3) 스크롤 애니메이션: 화면에 들어오면 부드럽게 나타나요
const revealTargets = document.querySelectorAll(".section, .card, .case h2, .case p, .gallery-item");
revealTargets.forEach((el) => el.classList.add("reveal"));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealTargets.forEach((el) => observer.observe(el));

// 4) 드로잉 갤러리: 그림을 누르면 크게 보여줘요 (←/→ 키로 넘기고, Esc로 닫기)
const lightbox = document.querySelector(".lightbox");
const galleryItems = [...document.querySelectorAll(".gallery-item")];

if (lightbox && galleryItems.length) {
  const media = lightbox.querySelector(".lb-media");
  const caption = lightbox.querySelector(".lb-caption");
  let current = 0;
  let lastFocused = null;

  const show = (index) => {
    current = (index + galleryItems.length) % galleryItems.length; // 끝에서 처음으로 돌아가기
    const item = galleryItems[current];
    media.innerHTML = item.querySelector(".gallery-open").innerHTML;
    caption.innerHTML = item.querySelector("figcaption").innerHTML;
  };

  const open = (index) => {
    lastFocused = document.activeElement;
    show(index);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden"; // 뒤 페이지 스크롤 막기
    lightbox.querySelector(".lb-close").focus();
  };

  const close = () => {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    lastFocused?.focus();
  };

  galleryItems.forEach((item, i) => {
    item.querySelector(".gallery-open").addEventListener("click", () => open(i));
  });

  lightbox.querySelector(".lb-close").addEventListener("click", close);
  lightbox.querySelector(".lb-prev").addEventListener("click", () => show(current - 1));
  lightbox.querySelector(".lb-next").addEventListener("click", () => show(current + 1));
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) close(); }); // 바깥 누르면 닫기

  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
}
