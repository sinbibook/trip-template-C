(function (global) {
  'use strict';

  function MainMapper() {
    BaseDataMapper.call(this);
  }
  MainMapper.prototype = Object.create(BaseDataMapper.prototype);
  MainMapper.prototype.constructor = MainMapper;

  MainMapper.prototype.mapPage = function () {
    this.mapHero();
    this.mapAboutSection();
    this.mapGalleryRolling();
    this.mapTypingSection();
    this.mapPropertyNames();
  };

  // MAPPER: customFields.pages.main.sections[0].hero.images[isSelected]
  MainMapper.prototype.mapHero = function () {
    var pages = this.getPages();
    var hero = pages.main && pages.main.sections && pages.main.sections[0] && pages.main.sections[0].hero;
    if (!hero) return;

    var images = this.getSelectedImages(hero.images || []);
    if (!images.length) return;

    var wrapper = document.querySelector('[data-main-hero-slides]');
    if (!wrapper) return;

    wrapper.innerHTML = '';
    images.forEach(function (img) {
      var div = document.createElement('div');
      div.className = 'swiper-slide';
      div.innerHTML = '<img src="' + img.url + '" alt="" /><div class="tx1">' + (hero.title || '') + '</div>';
      wrapper.appendChild(div);
    });
  };

  // MAPPER: customFields.pages.main.sections[0].about[0]
  //   .images[0].url → con6 대표 이미지
  //   .description   → con6 텍스트 (줄바꿈 \n → <br>)
  MainMapper.prototype.mapAboutSection = function () {
    var pages = this.getPages();
    var about = pages.main && pages.main.sections && pages.main.sections[0] && pages.main.sections[0].about;
    if (!about || !about.length) return;

    var item = about[0];

    // 대표 이미지
    var imgEl = document.querySelector('[data-main-about-image]');
    if (imgEl) {
      var imgUrl = this.getFirstSelectedImage(item.images || []);
      if (imgUrl) imgEl.src = imgUrl;
    }

    // 설명 텍스트 (줄바꿈 처리)
    var descEl = document.querySelector('[data-main-about-description]');
    if (descEl && item.description) {
      descEl.innerHTML = item.description
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');
    }
  };

  // MAPPER: homepage.customFields.property.images[category=property_exterior]
  MainMapper.prototype.mapGalleryRolling = function () {
    var cf = this.getCustomFields();
    var propImages = (cf.property && cf.property.images) || [];
    var exterior = propImages.filter(function (img) {
      return img.isSelected && img.category === 'property_exterior';
    }).sort(function (a, b) { return a.sortOrder - b.sortOrder; });

    if (!exterior.length) return;

    var con7 = document.querySelector('[data-main-gallery]');
    if (!con7) return;

    con7.innerHTML = '';
    exterior.forEach(function (img) {
      var div = document.createElement('div');
      div.className = 'img';
      div.innerHTML = '<img src="' + img.url + '" alt="" />';
      con7.appendChild(div);
    });
  };

  // TODO: 타이핑 텍스트 JSON 경로 추후 결정
  MainMapper.prototype.mapTypingSection = function () {
    // TODO: 타이핑 텍스트 매핑 추후 결정
  };

  // MAPPER: homepage.customFields.property.name
  MainMapper.prototype.mapPropertyNames = function () {
    var name = this.getPropertyName();
    document.querySelectorAll('[data-property-name]').forEach(function (el) {
      el.textContent = name;
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    if (window.previewHandler) return;
    var mapper = new MainMapper();
    mapper.initialize();
    global.mainMapperInstance = mapper;
  });

  global.MainMapper = MainMapper;
})(window);
