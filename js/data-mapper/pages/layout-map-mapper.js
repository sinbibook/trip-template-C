(function (global) {
  'use strict';

  function LayoutMapMapper() {
    BaseDataMapper.call(this);
  }
  LayoutMapMapper.prototype = Object.create(BaseDataMapper.prototype);
  LayoutMapMapper.prototype.constructor = LayoutMapMapper;

  LayoutMapMapper.prototype.mapPage = function () {
    this.mapHero();
    this.mapLayoutContent();
  };

  // MAPPER: customFields.pages.layoutMap.sections[0].hero.images[isSelected]
  LayoutMapMapper.prototype.mapHero = function () {
    var pages = this.getPages();
    var hero = pages.layoutMap && pages.layoutMap.sections && pages.layoutMap.sections[0] && pages.layoutMap.sections[0].hero;
    if (!hero) return;

    var images = this.getSelectedImages(hero.images || []);
    var wrapper = document.querySelector('[data-layout-map-hero-slides]');

    if (wrapper) {
      wrapper.innerHTML = '';
      if (images.length) {
        images.forEach(function (img) {
          var div = document.createElement('div');
          div.className = 'swiper-slide';
          div.innerHTML = '<img src="' + img.url + '" alt="" /><div class="tx1">배치도</div>';
          wrapper.appendChild(div);
        });
      } else {
        // Placeholder when no images
        var placeholderDiv = document.createElement('div');
        placeholderDiv.className = 'swiper-slide';
        var img = document.createElement('img');
        ImageHelpers.applyPlaceholder(img);
        img.alt = 'Layout Map Hero';
        var titleDiv = document.createElement('div');
        titleDiv.className = 'tx1';
        titleDiv.textContent = '배치도';
        placeholderDiv.appendChild(img);
        placeholderDiv.appendChild(titleDiv);
        wrapper.appendChild(placeholderDiv);
      }
    }

    // 또는 단일 이미지 요소
    var heroImg = document.querySelector('[data-layout-map-hero-image]');
    if (heroImg) {
      if (images.length) {
        heroImg.style.backgroundImage = 'url(' + images[0].url + ')';
        heroImg.style.backgroundPosition = 'center';
        heroImg.style.backgroundSize = 'cover';
        heroImg.style.backgroundRepeat = 'no-repeat';
      } else {
        // background-image placeholder
        heroImg.style.backgroundColor = '#f0f0f0';
        heroImg.style.backgroundImage = ImageHelpers.EMPTY_IMAGE_SVG;
        heroImg.style.backgroundRepeat = 'no-repeat';
        heroImg.style.backgroundPosition = 'center';
        heroImg.style.backgroundSize = 'cover';
      }
    }
  };

  // MAPPER: customFields.pages.layoutMap.sections[0].about (이미지 + 설명)
  LayoutMapMapper.prototype.mapLayoutContent = function () {
    var pages = this.getPages();
    var about = pages.layoutMap && pages.layoutMap.sections && pages.layoutMap.sections[0] && pages.layoutMap.sections[0].about;
    if (!about) return;

    // 제목
    var titleEl = document.querySelector('[data-layout-map-about-title]');
    if (titleEl && about.title) titleEl.textContent = about.title;

    // 설명
    var descEl = document.querySelector('[data-layout-map-about-description]');
    if (descEl && about.description) {
      descEl.textContent = about.description;
    }

    // 이미지들 (각 이미지마다 설명)
    if (about.images && about.images.length) {
      about.images.forEach(function (image, index) {
        var imgEl = document.querySelector('[data-layout-map-image-' + index + ']');
        if (imgEl) {
          if (image.url) {
            imgEl.src = image.url;
          } else {
            ImageHelpers.applyPlaceholder(imgEl);
          }
        }
      });
    } else {
      // Placeholder when no images
      for (var i = 0; i < 2; i++) {
        var imgEl = document.querySelector('[data-layout-map-image-' + i + ']');
        if (imgEl) {
          ImageHelpers.applyPlaceholder(imgEl);
        }
      }
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    if (window.previewHandler) return;
    var mapper = new LayoutMapMapper();
    mapper.initialize();
    global.layoutMapMapperInstance = mapper;
  });

  global.LayoutMapMapper = LayoutMapMapper;
})(window);
