if (document.body.classList.contains("page-home")) {
  const legacyPages = new Map([
    ["#intro", "games.html#after-haven"],
    ["#work", "games.html#game-collection"],
    ["#PrivacyPolicy", "privacy.html#PrivacyPolicy"],
    ["#contact", "contact.html#inquiries"]
  ]);

  function openLegacyPage() {
    const destination = legacyPages.get(window.location.hash);
    if (destination) window.location.replace(destination);
  }

  window.addEventListener("hashchange", openLegacyPage);
  openLegacyPage();
}

const header = document.querySelector(".site-header");
const toggle = header?.querySelector(".menu-toggle");
const nav = document.getElementById("site-nav");

if (toggle && nav) {
  header.classList.add("has-menu");
  toggle.hidden = false;

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  }

  toggle.addEventListener("click", () => {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });

  header.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      toggle.focus();
    }
  });

  const desktopLayout = window.matchMedia("(min-width: 48.01rem)");
  desktopLayout.addEventListener("change", ({ matches }) => {
    if (matches) setMenu(false);
  });
}

const linkedProjects = document.querySelectorAll("details.project[id]");

if (linkedProjects.length) {
  function openLinkedProject() {
    const project = document.getElementById(window.location.hash.slice(1));
    if (!project?.matches("details.project")) return;

    project.open = true;
    project.scrollIntoView({ block: "start" });
  }

  window.addEventListener("hashchange", openLinkedProject);
  openLinkedProject();
}

const contactForm = document.querySelector("[data-contact-form]");

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const fields = new FormData(contactForm);
  const name = fields.get("name").trim();
  const email = fields.get("email").trim();
  const message = fields.get("message").trim();

  for (const [value, field] of [[name, "name"], [message, "message"]]) {
    if (value) continue;

    const input = contactForm.elements.namedItem(field);
    input.setCustomValidity(field === "name" ? "Enter your name." : "Enter a message.");
    input.addEventListener("input", () => input.setCustomValidity(""), { once: true });
    input.reportValidity();
    return;
  }

  const subject = encodeURIComponent("80o Studio inquiry");
  const body = encodeURIComponent(`Name: ${name}\r\nEmail: ${email}\r\n\r\n${message}`);
  window.location.href = `${contactForm.action}?subject=${subject}&body=${body}`;
  contactForm.querySelector("[data-contact-status]").textContent =
    "Send the message from your email app. You can also email support@80ostudio.com directly.";
});
