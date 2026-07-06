/**
 * =============================================================================
 * FILE: product-grid.js
 * =============================================================================
 */

(function () {
  "use strict";

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    initGridColumns();
    initCustomSelect();
    initSortFunctionality();
    initImageHover();
    initFilterButton();
  }

  /* ===========================================================================
     GRID COLUMN TOGGLE
     =========================================================================== */

  function initGridColumns() {
    var grid = document.querySelector(".product-grid");
    var buttons = document.querySelectorAll(".grid-col-btn");

    if (!grid || !buttons.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cols = this.getAttribute("data-cols");

        grid.setAttribute("data-cols", cols);

        buttons.forEach(function (b) {
          b.classList.remove("active");
        });
        this.classList.add("active");
      });
    });
  }

  /* ===========================================================================
     CUSTOM SELECT DROPDOWN
     =========================================================================== */

  function initCustomSelect() {
    var selectWrappers = document.querySelectorAll('[data-select="sort"]');

    selectWrappers.forEach(function (wrapper) {
      var trigger = wrapper.querySelector(".select-trigger");
      var dropdown = wrapper.querySelector(".select-dropdown");
      var options = wrapper.querySelectorAll(".select-option");
      var valueDisplay = wrapper.querySelector(".select-value");

      if (!trigger || !dropdown || !options.length) return;

      trigger.addEventListener("click", function (e) {
        e.stopPropagation();
        var isActive = wrapper.classList.contains("active");
        closeAllSelects();

        if (!isActive) {
          wrapper.classList.add("active");
          trigger.setAttribute("aria-expanded", "true");
        }
      });

      options.forEach(function (option) {
        option.setAttribute("tabindex", "0");

        option.addEventListener("click", function () {
          var value = this.getAttribute("data-value");
          var text = this.textContent;

          valueDisplay.textContent = text;

          options.forEach(function (opt) {
            opt.classList.remove("selected");
          });
          this.classList.add("selected");

          wrapper.classList.remove("active");
          trigger.setAttribute("aria-expanded", "false");

          handleSortChange(value);
        });

        // Keyboard accessibility
        option.addEventListener("keydown", function (e) {
          if (e.key === "Enter") {
            this.click();
          }
        });
      });
    });

    document.addEventListener("click", function (e) {
      if (!e.target.closest(".custom-select")) {
        closeAllSelects();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeAllSelects();
      }
    });
  }

  function closeAllSelects() {
    document
      .querySelectorAll(".custom-select.active")
      .forEach(function (select) {
        select.classList.remove("active");
        var trigger = select.querySelector(".select-trigger");
        if (trigger) trigger.setAttribute("aria-expanded", "false");
      });
  }

  /* ===========================================================================
     SORT FUNCTIONALITY
     =========================================================================== */

  function initSortFunctionality() {
    var urlParams = new URLSearchParams(window.location.search);
    var currentSort = urlParams.get("sort_by") || "manual";

    var currentOption = document.querySelector(
      '[data-value="' + currentSort + '"]',
    );

    if (currentOption) {
      var select = currentOption.closest(".custom-select");
      var valueDisplay = select ? select.querySelector(".select-value") : null;

      if (valueDisplay) {
        valueDisplay.textContent = currentOption.textContent;
      }

      currentOption.classList.add("selected");
    }
  }

  function handleSortChange(sortValue) {
    var url = new URL(window.location.href);

    if (sortValue === "manual") {
      url.searchParams.delete("sort_by");
    } else {
      url.searchParams.set("sort_by", sortValue);
    }

    window.location.href = url.toString();
  }

  /* ===========================================================================
     IMAGE ZOOM PREVIEW (CSS handles hover swap)
     =========================================================================== */

  function initImageHover() {
    var productCards = document.querySelectorAll(".product-card");

    productCards.forEach(function (card) {
      var imageContainer = card.querySelector("[data-image-swap]");
      var zoomPreview = card.querySelector("[data-zoom-preview]");
      var zoomTimeout;

      if (!imageContainer || !zoomPreview) return;

      var zoomPreviewImage = zoomPreview.querySelector(".zoom-preview-image");

      imageContainer.addEventListener("mouseenter", function () {
        zoomTimeout = setTimeout(function () {
          if (card.matches(":hover")) {
            zoomPreview.classList.add("active");
          }
        }, 200);
      });

      imageContainer.addEventListener("mouseleave", function () {
        clearTimeout(zoomTimeout);
        zoomPreview.classList.remove("active");
      });

      imageContainer.addEventListener("mousemove", function (e) {
        if (!zoomPreview.classList.contains("active")) return;

        var rect = imageContainer.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width) * 100;
        var y = ((e.clientY - rect.top) / rect.height) * 100;

        var clampedX = Math.max(0, Math.min(100, x));
        var clampedY = Math.max(0, Math.min(100, y));

        if (zoomPreviewImage) {
          zoomPreviewImage.style.backgroundPosition =
            clampedX + "% " + clampedY + "%";
        }
      });
    });
  }

  /* ===========================================================================
     FILTER BUTTON
     =========================================================================== */

  function initFilterButton() {
    var filterButton = document.querySelector(".filter-button");

    if (filterButton) {
      filterButton.addEventListener("click", function () {
        console.log("Filter button clicked — add your filter logic here.");
      });
    }
  }
})();

/* =========================================
FILTER PANEL TOGGLE (OPEN / CLOSE)
========================================= */

document.addEventListener('DOMContentLoaded', function () {

const filterPanel = document.getElementById('filterPanel');
const openBtn = document.getElementById('openFilters');
const closeBtn = document.getElementById('closeFilters');
const clearBtn = document.getElementById('clearFilters');

if (!filterPanel) return;

/* OPEN PANEL */
if (openBtn) {
openBtn.addEventListener('click', function () {
filterPanel.classList.add('active');
});
}

/* CLOSE PANEL */
if (closeBtn) {
closeBtn.addEventListener('click', function () {
filterPanel.classList.remove('active');
});
}

/* CLICK OUTSIDE TO CLOSE (optional but nice UX) */
document.addEventListener('click', function (e) {
if (
filterPanel.classList.contains('active') &&
!filterPanel.contains(e.target) &&
!openBtn.contains(e.target)
) {
filterPanel.classList.remove('active');
}
});

/* CLEAR BUTTON (for now just UI reset) */
if (clearBtn) {
clearBtn.addEventListener('click', function () {
console.log('Clear filters clicked');
// You’ll hook real filter logic here later
});
}

});


document.addEventListener("DOMContentLoaded", () => {
  const products = document.querySelectorAll(".product-card");

  const filters = {
    type: [],
    colors: [],
    maxPrice: null,
    available: false,
  };

  // 🧩 GET INPUTS
  const typeInputs = document.querySelectorAll("[data-filter='type']");
  const colorInputs = document.querySelectorAll("[data-filter='color']");
  const priceInput = document.querySelector("[data-filter='price']");
  const availableInput = document.querySelector("[data-filter='available']");

  // 🎯 UPDATE FILTER STATE
  function updateFilters() {
    filters.type = Array.from(typeInputs)
      .filter((i) => i.checked)
      .map((i) => i.value);

    filters.colors = Array.from(colorInputs)
      .filter((i) => i.checked)
      .map((i) => i.value);

    filters.maxPrice = priceInput ? Number(priceInput.value) : null;
    filters.available = availableInput ? availableInput.checked : false;

    applyFilters();
  }

  // 🚀 MAIN FILTER FUNCTION
  function applyFilters() {
    products.forEach((product) => {
      const type = product.dataset.type;
      const price = Number(product.dataset.price);
      const available = product.dataset.available === "true";
      const colors = product.dataset.colors
        ? product.dataset.colors.split(",")
        : [];

      let show = true;

      // TYPE FILTER
      if (filters.type.length && !filters.type.includes(type)) {
        show = false;
      }

      // COLOR FILTER
      if (
        filters.colors.length &&
        !filters.colors.some((color) => colors.includes(color))
      ) {
        show = false;
      }

      // PRICE FILTER
      if (filters.maxPrice !== null && price > filters.maxPrice) {
        show = false;
      }

      // AVAILABILITY FILTER
      if (filters.available && !available) {
        show = false;
      }

      product.style.display = show ? "block" : "none";
    });
  }

  // 🎧 EVENT LISTENERS
  [...typeInputs, ...colorInputs].forEach((input) =>
    input.addEventListener("change", updateFilters),
  );

  if (priceInput) {
    priceInput.addEventListener("input", updateFilters);
  }

  if (availableInput) {
    availableInput.addEventListener("change", updateFilters);
  }
});
