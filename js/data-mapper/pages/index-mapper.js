(function (global) {
  'use strict';

  function IndexMapper() {
    BaseDataMapper.call(this);
  }
  IndexMapper.prototype = Object.create(BaseDataMapper.prototype);
  IndexMapper.prototype.constructor = IndexMapper;

  IndexMapper.prototype.mapPage = function () {
    this.mapHeroSlides();
    this.mapRoomPreview();
    this.mapSpecialPreview();
    this.mapTypingSection();
    this.mapDirectionsPreview();
    this.mapPropertyNames();
  };

  // MAPPER: customFields.pages.index.sections[0].hero.images[isSelected]
  IndexMapper.prototype.mapHeroSlides = function () {
    var pages = this.getPages();
    var hero = pages.index && pages.index.sections && pages.index.sections[0] && pages.index.sections[0].hero;
    if (!hero) return;

    var images = this.getSelectedImages(hero.images || []);
    if (!images.length) return;

    var wrapper = document.querySelector('[data-index-hero-slides]');
    if (!wrapper) return;

    wrapper.innerHTML = '';
    images.forEach(function (img) {
      var div = document.createElement('div');
      div.className = 'swiper-slide';
      div.innerHTML = '<img src="' + img.url + '" alt="" /><div class="tx1">' + (hero.title || '') + '</div>';
      wrapper.appendChild(div);
    });
  };

  // MAPPER: rooms[].images[0].thumbnail[0].url + name + description
  IndexMapper.prototype.mapRoomPreview = function () {
    var rooms = (this.data && this.data.rooms) || [];
    var wrapper = document.querySelector('[data-index-room-slides]');
    if (!wrapper || !rooms.length) return;

    wrapper.innerHTML = '';
    rooms.forEach(function (room) {
      var self = this;
      var thumbUrl = self.getFirstSelectedImage(
        room.images && room.images[0] && room.images[0].thumbnail || []
      );
      var div = document.createElement('div');
      div.className = 'swiper-slide';
      div.setAttribute('data-title', room.name || '');
      div.innerHTML =
        '<img src="' + thumbUrl + '" alt="" />' +
        '<a href="room.html?id=' + room.id + '" class="tx">' +
          '<div class="tx1">' + (room.name || '') + '</div>' +
          '<div class="tx2">' + (room.description || '') + '</div>' +
          '<div class="more"></div>' +
        '</a>';
      wrapper.appendChild(div);
    }, this);
  };

  // MAPPER: property.facilities[].images[isSelected][0].url + name
  IndexMapper.prototype.mapSpecialPreview = function () {
    var facilities = this.getProperty().facilities || [];
    var wrapper = document.querySelector('[data-index-facility-slides]');
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

  // TODO: 타이핑 텍스트 JSON 경로 추후 결정
  // 후보: customFields.pages.index.sections[0].essence.title
  IndexMapper.prototype.mapTypingSection = function () {
    // TODO: 타이핑 텍스트 매핑 추후 결정
  };

  // MAPPER: property.address → con5 주소 텍스트
  IndexMapper.prototype.mapDirectionsPreview = function () {
    var address = this.getProperty().address || '';
    var el = document.querySelector('[data-directions-address]');
    if (el) el.textContent = address;
  };

  // MAPPER: homepage.customFields.property.name → 숙소명 표기 요소들
  IndexMapper.prototype.mapPropertyNames = function () {
    var name = this.getPropertyName();
    document.querySelectorAll('[data-property-name]').forEach(function (el) {
      el.textContent = name;
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    if (window.previewHandler) return;
    var mapper = new IndexMapper();
    mapper.initialize();
    global.indexMapperInstance = mapper;
  });

  global.IndexMapper = IndexMapper;
})(window);
