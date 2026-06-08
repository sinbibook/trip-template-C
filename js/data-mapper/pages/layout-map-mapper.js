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
    if (wrapper && images.length) {
      wrapper.innerHTML = '';
      images.forEach(function (img) {
        var div = document.createElement('div');
        div.className = 'swiper-slide';
        div.innerHTML = '<img src="' + img.url + '" alt="" /><div class="tx1">배치도</div>';
        wrapper.appendChild(div);
      });
    }

    // 또는 단일 이미지 요소
    var heroImg = document.querySelector('[data-layout-map-hero-image]');
    if (heroImg && images.length) heroImg.src = images[0].url;
  };

  // MAPPER: customFields.pages.layoutMap.sections[0].about
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

    // 이미지
    if (about.images && about.images.length) {
      var imgEl = document.querySelector('[data-layout-map-image-0]');
      if (imgEl) imgEl.src = about.images[0].url || '';
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
