(function (global) {
  'use strict';

  function RoomListMapper() {
    BaseDataMapper.call(this);
  }
  RoomListMapper.prototype = Object.create(BaseDataMapper.prototype);
  RoomListMapper.prototype.constructor = RoomListMapper;

  RoomListMapper.prototype.mapPage = function () {
    this.mapHero();
    this.mapRoomGrid();
  };

  // MAPPER: customFields.pages.roomList.sections[0].hero.images[isSelected]
  RoomListMapper.prototype.mapHero = function () {
    var pages = this.getPages();
    var hero = pages.roomList && pages.roomList.sections && pages.roomList.sections[0] && pages.roomList.sections[0].hero;
    if (!hero) return;

    var images = this.getSelectedImages(hero.images || []);
    var wrapper = document.querySelector('[data-room-list-hero-slides]');
    if (!wrapper || !images.length) return;

    wrapper.innerHTML = '';
    images.forEach(function (img) {
      var div = document.createElement('div');
      div.className = 'swiper-slide';
      div.innerHTML = '<img src="' + img.url + '" alt="" /><div class="tx1">ROOMS</div>';
      wrapper.appendChild(div);
    });
  };

  // MAPPER: rooms[] → roomGrid 동적 생성
  RoomListMapper.prototype.mapRoomGrid = function () {
    var rooms = (this.data && this.data.rooms) || [];
    var grid = document.querySelector('[data-room-list-grid]');
    if (!grid) return;

    grid.innerHTML = '';
    rooms.forEach(function (room) {
      var thumbUrl = this.getFirstSelectedImage(
        room.images && room.images[0] && room.images[0].thumbnail || []
      );
      var card = document.createElement('div');
      card.className = 'roomCard';
      card.setAttribute('data-aos', 'fade-up');
      card.innerHTML =
        '<a href="room.html?id=' + room.id + '">' +
          '<div class="imgOb"><img src="' + thumbUrl + '" alt="" /></div>' +
          '<div class="info">' +
            '<div class="name">' + (room.name || '') + '</div>' +
            '<div class="desc">' + (room.description || room.roomInfo || '') + '</div>' +
            '<div class="more">VIEW MORE</div>' +
          '</div>' +
        '</a>';
      grid.appendChild(card);
    }, this);
  };

  document.addEventListener('DOMContentLoaded', function () {
    if (window.previewHandler) return;
    var mapper = new RoomListMapper();
    mapper.initialize();
    global.roomListMapperInstance = mapper;
  });

  global.RoomListMapper = RoomListMapper;
})(window);
