(function () {
  let projectSwiper;

function initSwiper() {
  if (projectSwiper) projectSwiper.destroy(true, true);

  projectSwiper = new Swiper(".tc-projects-style7 .projects-slider", {
    spaceBetween: 0,
    speed: 600,
    loop: true,
    slidesPerGroup: 1,
    navigation: {
      nextEl: ".tc-projects-style7 .swiper-button-next",
      prevEl: ".tc-projects-style7 .swiper-button-prev",
    },
    breakpoints: {
      480: { slidesPerView: 1, autoplay: { delay: 2500, disableOnInteraction: false } },
      787: { slidesPerView: 1, autoplay: { delay: 2500, disableOnInteraction: false } },
      991: { slidesPerView: 2 },
      1200: { slidesPerView: 3 },
    },
    on: {
      slideChange: function () {
        if (window.innerWidth < 992) {
          // Mobile: update .glry-img image on slide change
          const activeSlide = $(this.slides[this.activeIndex]);
          const tab_id = activeSlide.data("tab");
          $(".glry-img .tab-img").removeClass("current");
          if (tab_id) {
            $("#" + tab_id).addClass("current");
          }
        }
      }
    }
  });
}


function filterSlides(category) {
  const $wrapper = $(".tc-projects-style7 .swiper-wrapper");
  $wrapper.empty();

  $(".swiper-slide-template .swiper-slide")
    .filter(`[data-category="${category}"]`)
    .each(function () {
      $wrapper.append($(this).clone());
    });

  if (window.innerWidth >= 992) {
    // Desktop: use category background image
    const backgroundImages = {
      pipeline: "img/dynex-photo-bank/bg-solution-1.jpeg",
      infrastructure: "img/dynex-photo-bank/bg-solution-2.jpeg",
    };
    const bgImage = backgroundImages[category] || "";
    $(".glry-img").css("background-image", `url('${bgImage}')`);
    $(".glry-img .tab-img").removeClass("current"); // hover-based on desktop
  } else {
    // Mobile: show first relevant tab image immediately
    $(".glry-img").css("background-image", "none");
    $(".glry-img .tab-img").removeClass("current");
    const firstTabId = $(".swiper-slide-template .swiper-slide")
      .filter(`[data-category="${category}"]`)
      .first()
      .data("tab");
    $("#" + firstTabId).addClass("current");
  }

  initSwiper();
}

function initProjectsSection() {
  console.log("initProjectsSection called");
  if (!$('.tc-projects-style7').length) return;

  filterSlides("pipeline");
  $('.project-tab[data-category="pipeline"]').addClass("active");

  $(".project-tab").off("click").on("click", function () {
    const selectedCategory = $(this).data("category");
    $(".project-tab").removeClass("active");
    $(this).addClass("active");
    filterSlides(selectedCategory);
  });

  if (window.innerWidth >= 992) {
    // Desktop hover events
    $(document)
      .off("mouseenter", ".tc-projects-style7 .swiper-slide")
      .on("mouseenter", ".tc-projects-style7 .swiper-slide", function () {
        const tab_id = $(this).data("tab");
        $(".glry-img .tab-img").removeClass("current");
        $("#" + tab_id).addClass("current");
         $(".tc-projects-style7 .swiper-slide .info").css("opacity", "0");
      $(this).find(".info").css("opacity", "1");
    })

    $(document)
      .off("mouseleave", ".tc-projects-style7 .swiper-slide")
      .on("mouseleave", ".tc-projects-style7 .swiper-slide", function () {
        $(".glry-img .tab-img").removeClass("current");
         $(".tc-projects-style7 .swiper-slide .info").css("opacity", "1");
      });
  } else {
    // Mobile: no hover events
    $(document).off("mouseenter", ".tc-projects-style7 .swiper-slide");
    $(document).off("mouseleave", ".tc-projects-style7 .swiper-slide");
  }

  $(".tc-projects-style7 .swiper-button-next").off("click").on("click", function () {
    projectSwiper.slideNext();
  });

  $(".tc-projects-style7 .swiper-button-prev").off("click").on("click", function () {
    projectSwiper.slidePrev();
  });
}

  function initProcessSection() {
    $(".tc-proccess-style7 .accordion-item").off("click").on("click", function () {
      const tab_id = $(this).attr("data-tab");
      $(".tc-proccess-style7 .accordion-item").removeClass("current");
      $(this).addClass("current");

      $(".tc-proccess-style7 .prc-img").removeClass("current");
      $("#" + tab_id).addClass("current");
    });
  }

  function initFloatBox() {
    $(".float_box_container")
      .off("mousemove")
      .on("mousemove", function (e) {
        const parentOffset = $(this).offset();
        const relX = e.pageX - parentOffset.left;
        const relY = e.pageY - parentOffset.top;
        $(".float_box").css({ left: relX, top: relY }).addClass("show");
      });

    $(".float_box_container").off("mouseleave").on("mouseleave", function () {
      $(".float_box").removeClass("show");
    });
  }

  function initPageScripts() {
    initProjectsSection();
    initProcessSection();
    initFloatBox();
  }

  $(document).ready(function () {
    initPageScripts();

    // Auto-select tab from footer link (query/hash)
if (window.location.href.includes("our-solutions")) {
  setTimeout(() => {
    const hash = window.location.hash; // e.g. "#solution?tab=pipeline"

    if (hash.includes('?tab=')) {
      const parts = hash.split('?');
      const params = new URLSearchParams(parts[1]);
      const tabName = params.get('tab'); // "pipeline" or "infrastructure"

      if (tabName) {
        $(".project-tab").removeClass("active");
        $(`.project-tab[data-category="${tabName}"]`).addClass("active");
        filterSlides(tabName);

        // Scroll to section if needed
        const sectionId = parts[0].substring(1);
        if (sectionId && document.getElementById(sectionId)) {
          document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }, 150);
}

    if (window.location.href.includes("our-solutions")) {
      setTimeout(() => {
        initProjectsSection();
      }, 100);
    }
  });

  document.addEventListener("swup:contentReplaced", initPageScripts);
  if (window.barba) {
    barba.hooks.afterEnter(() => {
      initPageScripts();
    });
  }
})();
