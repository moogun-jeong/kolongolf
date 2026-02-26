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
