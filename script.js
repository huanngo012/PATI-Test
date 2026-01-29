class ProductSelector extends HTMLElement {
  constructor() {
    super();
    this.items = this.querySelectorAll(".product-selector-item");
    this.productAtcRefills = document.querySelector(".product_atc-refills");
    this.items.forEach((item) => {
      item.addEventListener("click", this.setActive.bind(this));
    });
  }

  setActive(event) {
    const $this = event.currentTarget;

    this.items.forEach((item) => {
      item.classList.remove("active");
    });
    $this.classList.add("active");
    this.productAtcRefills.textContent = $this.dataset.refills;
  }
}
customElements.define("product-selector", ProductSelector);

class FAQAccordion extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.items = this.querySelectorAll(".faq-item");

    this.items.forEach((item) => {
      item.addEventListener("click", this.toggle.bind(this));
    });
  }

  toggle(event) {
    event.preventDefault();
    event.stopPropagation();

    const $this = event.currentTarget;
    const $thisContent = $this.querySelector(".faq-content");
    $this.classList.toggle("active");
    $($thisContent).slideToggle(300);
  }
}
customElements.define("faq-accordion", FAQAccordion);

class ProductCarousel extends HTMLElement {
  connectedCallback() {
    const nav = this.querySelector(".productView-nav");
    const forEl = this.querySelector(".productView-for");

    if (!nav || !forEl) return;

    $(nav).slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      dots: false,
      infinite: true,
      asNavFor: forEl,
      mobileFirst: true,
      prevArrow: `
        <button class="slick-prev custom-arrow left-6! w-8! h-8! z-2! before:content-none!">
          <img class="object-cover aspect-square rounded-lg w-full"
            src="https://cdn.shopify.com/s/files/1/0917/5649/5191/files/iconamoon_arrow-up-2-thin_1.png?v=1752126281" />
        </button>
      `,
      nextArrow: `
        <button class="slick-next custom-arrow right-6! w-8! h-8! z-2! before:content-none!">
          <img class="object-cover aspect-square rounded-lg w-full"
            src="https://cdn.shopify.com/s/files/1/0917/5649/5191/files/iconamoon_arrow-up-2-thin.png?v=1752126281" />
        </button>
      `,
    });

    $(forEl).slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      asNavFor: nav,
      focusOnSelect: true,
      arrows: false,
      dots: false,
      infinite: true,
      centerMode: false,
    });
  }

  disconnectedCallback() {
    const nav = this.querySelector(".productView-nav");
    const forEl = this.querySelector(".productView-for");

    nav && $(nav).slick("unslick");
    forEl && $(forEl).slick("unslick");
  }
}
customElements.define("product-carousel", ProductCarousel);

class VideoCarousel extends HTMLElement {
  connectedCallback() {
    this.slider = this.querySelector(".slick-custom");
    this.prevBtn = this.querySelector(".carousel-prev");
    this.nextBtn = this.querySelector(".carousel-next");
    this.videos = this.querySelectorAll("video");

    this.initSlick();
    this.bindVideoEvents();
  }

  initSlick() {
    if (!this.slider || !window.$ || !$.fn.slick) return;

    $(this.slider).slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      arrows: false,
      dots: true,
      infinite: false,
      responsive: [
        {
          breakpoint: 678,
          settings: { slidesToShow: 1.3 },
        },
      ],
    });

    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", () => {
        $(this.slider).slick("slickPrev");
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", () => {
        $(this.slider).slick("slickNext");
      });
    }
  }

  bindVideoEvents() {
    this.querySelectorAll(".video-item").forEach((item) => {
      const video = item.querySelector("video");
      const icon = item.querySelector(".play-icon");

      item.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!video) return;

        this.pauseAll(video);

        if (video.paused) {
          video.play();
          item.classList.add("is-playing");
          if (icon) icon.style.opacity = "0";
        } else {
          video.pause();
          item.classList.remove("is-playing");
          if (icon) icon.style.opacity = "1";
        }
      });

      video.addEventListener("ended", () => {
        item.classList.remove("is-playing");
        if (icon) icon.style.opacity = "1";
      });
    });
  }

  pauseAll(currentVideo) {
    this.querySelectorAll("video").forEach((vid) => {
      if (vid !== currentVideo) {
        vid.pause();
        const item = vid.closest(".video-item");
        const icon = item?.querySelector(".play-icon");
        if (item) item.classList.remove("is-playing");
        if (icon) icon.style.opacity = "1";
      }
    });
  }
}

customElements.define("video-carousel", VideoCarousel);

class ReviewForm extends HTMLElement {
  constructor() {
    super();
    this.toggleBtn = null;
    this.formEl = null;
    this.cancelBtn = null;

    this.stars = [];
    this.selectedRating = 0;
  }

  connectedCallback() {
    this.isOpen = true;
    this.toggleBtn = document.querySelector("[data-review-toggle]");
    this.formEl = this.querySelector("[data-review-form]");
    this.cancelBtn = this.querySelector("[data-review-cancel]");

    if (!this.toggleBtn || !this.formEl) return;

    this.toggleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.toggle();
    });

    if (this.cancelBtn) {
      this.cancelBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggle();
      });
    }

    this.initStars();
  }
  toggle() {
    $(this.formEl).slideToggle(300);
    this.toggleBtn.textContent = this.isOpen
      ? this.toggleBtn.dataset.closeText || "Cancel review"
      : this.toggleBtn.dataset.openText || "Write a review";
    this.isOpen = !this.isOpen;
  }

  initStars() {
    const wrap = this.querySelector("[data-star-rating]");
    if (!wrap) return;

    this.stars = [...wrap.querySelectorAll("a")];
    this.selected = 0;

    this.stars.forEach((star, idx) => {
      star.addEventListener("mouseenter", () => {
        this.paintStars(idx + 1);
      });

      star.addEventListener("click", () => {
        this.selected = idx + 1;
        this.paintStars(this.selected);
      });
    });

    wrap.addEventListener("mouseleave", () => {
      this.paintStars(this.selected);
    });
  }

  paintStars(n) {
    const EMPTY = "before:content-['\\e001']";
    const FULL = "before:content-['\\e000']";

    this.stars.forEach((star, i) => {
      if (i < n) {
        star.classList.remove(EMPTY);
        star.classList.add(FULL);
      } else {
        star.classList.remove(FULL);
        star.classList.add(EMPTY);
      }
    });
  }
}

customElements.define("review-form", ReviewForm);
