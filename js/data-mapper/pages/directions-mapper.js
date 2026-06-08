(function (global) {
  'use strict';

  function DirectionsMapper() {
    BaseDataMapper.call(this);
  }
  DirectionsMapper.prototype = Object.create(BaseDataMapper.prototype);
  DirectionsMapper.prototype.constructor = DirectionsMapper;

  DirectionsMapper.prototype.mapPage = function () {
    this.mapHero();
    this.mapAddress();
    this.mapTypingSection();
    this.mapPropertyNames();
  };

  // MAPPER: customFields.pages.directions.sections[0].hero.images[isSelected]
  DirectionsMapper.prototype.mapHero = function () {
    var pages = this.getPages();
    var hero = pages.directions && pages.directions.sections && pages.directions.sections[0] && pages.directions.sections[0].hero;
    if (!hero) return;

    var images = this.getSelectedImages(hero.images || []);
    var wrapper = document.querySelector('[data-directions-hero-slides]');
    if (!wrapper) return;

    if (images.length) {
      wrapper.innerHTML = '';
      images.forEach(function (img) {
        var div = document.createElement('div');
        div.className = 'swiper-slide';
        div.innerHTML = '<img src="' + img.url + '" alt="" /><div class="tx1">' + (hero.title || '오시는 길') + '</div>';
        wrapper.appendChild(div);
      });
    }
  };

  // MAPPER: property.address → con14 주소 텍스트
  // TODO: con14 지도 이미지 - JSON 내 지도 이미지 경로 추후 결정
  DirectionsMapper.prototype.mapAddress = function () {
    var address = this.getProperty().address || '';
    var el = document.querySelector('[data-directions-address]');
    if (el) el.textContent = address;
  };

  // TODO: 타이핑 텍스트 JSON 경로 추후 결정
  DirectionsMapper.prototype.mapTypingSection = function () {
    // TODO: 타이핑 텍스트 매핑 추후 결정
  };

  // MAPPER: homepage.customFields.property.name
  DirectionsMapper.prototype.mapPropertyNames = function () {
    var name = this.getPropertyName();
    document.querySelectorAll('[data-property-name]').forEach(function (el) {
      el.textContent = name;
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    if (window.previewHandler) return;
    var mapper = new DirectionsMapper();
    mapper.initialize();
    global.directionsMapperInstance = mapper;
  });

  global.DirectionsMapper = DirectionsMapper;
})(window);
