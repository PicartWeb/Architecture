const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.querySelector(".contact-form");
const navLinks = document.querySelectorAll(".site-nav a");
const sections = document.querySelectorAll("main section[id]");

const syncHeader = () => {
    header.classList.toggle("scrolled", window.scrollY > 30);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

menuToggle?.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

const closeMenu = () => {
    siteNav.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
};

siteNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        closeMenu();
    });
});

document.addEventListener("click", (event) => {
    if (!siteNav?.classList.contains("is-open")) {
        return;
    }

    if (!siteNav.contains(event.target) && !menuToggle?.contains(event.target)) {
        closeMenu();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
    }
});

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;

        filterButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");

        projectCards.forEach((card) => {
            const category = card.dataset.category;
            const shouldShow = filter === "all" || category === filter;
            card.classList.toggle("is-hidden", !shouldShow);
        });
    });
});

projectCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 55}ms`;
});

revealItems.forEach((item, index) => {
    const sequenceOffset = item.classList.contains("project-card")
        ? 40
        : item.dataset.reveal === "up"
            ? 50
            : 80;
    item.style.transitionDelay = `${Math.min(index * sequenceOffset, 280)}ms`;
});

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.18,
        rootMargin: "0px 0px -60px 0px"
    }
);

revealItems.forEach((item) => revealObserver.observe(item));

const navObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            navLinks.forEach((link) => {
                const isMatch = link.getAttribute("href") === `#${entry.target.id}`;
                link.classList.toggle("is-active", isMatch);
            });
        });
    },
    {
        threshold: 0.45,
        rootMargin: "-15% 0px -35% 0px"
    }
);

sections.forEach((section) => navObserver.observe(section));

contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector("button[type='submit']");
    const originalLabel = submitButton.textContent;

    submitButton.textContent = "Inquiry Sent";
    submitButton.disabled = true;

    setTimeout(() => {
        contactForm.reset();
        submitButton.textContent = originalLabel;
        submitButton.disabled = false;
    }, 1800);
});
