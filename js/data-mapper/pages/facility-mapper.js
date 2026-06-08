(function (global) {
  'use strict';

  function FacilityMapper() {
    BaseDataMapper.call(this);
  }
  FacilityMapper.prototype = Object.create(BaseDataMapper.prototype);
  FacilityMapper.prototype.constructor = FacilityMapper;

  FacilityMapper.prototype.mapPage = function () {
    this.mapHero();
    this.mapFacilityInfo();
    this.mapFacilityImages();
    this.mapSpecialPreview();
  };

  // URL param ?id= 로 시설 선택, 없으면 첫 번째 시설
  FacilityMapper.prototype.getCurrentFacility = function () {
    var facilities = this.getProperty().facilities || [];
    var id = new URLSearchParams(window.location.search).get('id');
    if (id) return facilities.find(function (f) { return f.id === id; }) || facilities[0];
    return facilities[0];
  };

  // MAPPER: property.facilities[current].images[isSelected][0].url → con0 히어로
  FacilityMapper.prototype.mapHero = function () {
    var f = this.getCurrentFacility();
    if (!f) return;

    var wrapper = document.querySelector('[data-facility-hero-slides]');
    if (!wrapper) return;

    var images = this.getSelectedImages(f.images || []);
    if (!images.length) return;

    wrapper.innerHTML = '';
    images.slice(0, 3).forEach(function (img) {
      var div = document.createElement('div');
      div.className = 'swiper-slide';
      div.innerHTML = '<img src="' + img.url + '" alt="" /><div class="tx1">' + (f.name || '') + '</div>';
      wrapper.appendChild(div);
    });
  };

  // MAPPER: property.facilities[current].name → con11 타이틀
  // MAPPER: property.facilities[current].usageGuide → con11 설명 텍스트
  FacilityMapper.prototype.mapFacilityInfo = function () {
    var f = this.getCurrentFacility();
    if (!f) return;

    var nameEl = document.querySelector('[data-facility-name]');
    if (nameEl) nameEl.textContent = f.name || '';

    var usageEl = document.querySelector('[data-facility-usage]');
    if (usageEl && f.usageGuide) {
      usageEl.innerHTML = f.usageGuide
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');
    }
  };

  // MAPPER: property.facilities[current].images[isSelected][0~2] → con12 이미지 3장
  FacilityMapper.prototype.mapFacilityImages = function () {
    var f = this.getCurrentFacility();
    if (!f) return;

    var images = this.getSelectedImages(f.images || []);
    var selectors = [
      '[data-facility-image-0]',
      '[data-facility-image-1]',
      '[data-facility-image-2]',
    ];
    images.slice(0, 3).forEach(function (img, i) {
      var el = document.querySelector(selectors[i]);
      if (el) el.src = img.url;
    });
  };

  // MAPPER: property.facilities[].images[isSelected][0] + name → con3 슬라이더
  FacilityMapper.prototype.mapSpecialPreview = function () {
    var facilities = this.getProperty().facilities || [];
    var wrapper = document.querySelector('[data-facility-preview-slides]');
    if (!wrapper || !facilities.length) return;

    wrapper.innerHTML = '';
    facilities.forEach(function (f) {
      var imgUrl = this.getFirstSelectedImage(f.images || []);
      var div = document.createElement('div');
      div.className = 'swiper-slide';
      div.setAttribute('data-title', f.name || '');
      div.innerHTML =
        '<a href="facility.html?id=' + f.id + '">' +
          '<img src="' + imgUrl + '" alt="" />' +
        '</a>';
      wrapper.appendChild(div);
    }, this);
  };

  document.addEventListener('DOMContentLoaded', function () {
    if (window.previewHandler) return;
    var mapper = new FacilityMapper();
    mapper.initialize();
    global.facilityMapperInstance = mapper;
  });

  global.FacilityMapper = FacilityMapper;
})(window);
