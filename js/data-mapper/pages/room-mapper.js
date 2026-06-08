(function (global) {
  'use strict';

  function RoomMapper() {
    BaseDataMapper.call(this);
  }
  RoomMapper.prototype = Object.create(BaseDataMapper.prototype);
  RoomMapper.prototype.constructor = RoomMapper;

  RoomMapper.prototype.mapPage = function () {
    this.mapRoomDetail();
    this.mapRoomPreview();
  };

  RoomMapper.prototype.getCurrentRoom = function () {
    var rooms = (this.data && this.data.rooms) || [];
    var roomId = new URLSearchParams(window.location.search).get('id');
    if (roomId) {
      return rooms.find(function (r) { return r.id === roomId; }) || rooms[0];
    }
    return rooms[0];
  };

  RoomMapper.prototype.mapRoomDetail = function () {
    var room = this.getCurrentRoom();
    if (!room) return;

    // 히어로 슬라이드
    var wrapper = document.querySelector('.con0 .swiper-wrapper');
    if (wrapper && room.images && room.images[0] && room.images[0].interior) {
      var slides = room.images[0].interior.filter(function (i) { return i.isSelected !== false; });
      if (slides.length) {
        wrapper.innerHTML = '';
        slides.forEach(function (slide) {
          var div = document.createElement('div');
          div.className = 'swiper-slide';
          div.innerHTML = '<img src="' + slide.url + '" alt="" /><div class="tx1">' + (room.name || '') + '</div>';
          wrapper.appendChild(div);
        });
      }
    }

    // 객실 정보
    var tx2El = document.querySelector('.con8 .conTitle2 .tx2 .spot');
    if (tx2El) tx2El.textContent = room.name || '';

    var tx3El = document.querySelector('.con8 .conTitle2 .tx3');
    if (tx3El) tx3El.textContent = room.roomInfo || room.description || '';

    // 메인 이미지
    var mainImg = document.querySelector('.con8 .imgWrap img');
    if (mainImg && room.images && room.images[0] && room.images[0].thumbnail && room.images[0].thumbnail[0]) {
      mainImg.src = room.images[0].thumbnail[0].url || '';
    }

    // 추가 이미지
    var con10Imgs = document.querySelectorAll('.con10 img');
    if (room.images && room.images[0] && room.images[0].exterior) {
      room.images[0].exterior.slice(0, 2).forEach(function (img, i) {
        if (con10Imgs[i]) con10Imgs[i].src = img.url || '';
      });
    }

    // 예약 링크에 룸 ID 추가
    var bookingLinks = document.querySelectorAll('.con8 [data-booking-link], .con8 .btnBooking_2');
    bookingLinks.forEach(function (el) {
      var bookingUrl = room.bookingUrl || '#!';
      if (bookingUrl !== '#!') {
        el.addEventListener('click', function (e) {
          e.preventDefault();
          window.open(bookingUrl, '_blank');
        });
      }
    });
  };

  RoomMapper.prototype.mapRoomPreview = function () {
    var rooms = (this.data && this.data.rooms) || [];
    var wrapper = document.querySelector('.con1 .swiper-wrapper');
    if (!wrapper || !rooms.length) return;

    wrapper.innerHTML = '';
    rooms.forEach(function (room) {
      var thumbUrl = '';
      if (room.images && room.images[0] && room.images[0].thumbnail && room.images[0].thumbnail[0]) {
        thumbUrl = room.images[0].thumbnail[0].url || '';
      }
      var div = document.createElement('div');
      div.className = 'swiper-slide';
      div.setAttribute('data-title', room.name || '');
      div.innerHTML =
        '<img src="' + thumbUrl + '" alt="" />' +
        '<a href="room.html?id=' + room.id + '" class="tx">' +
        '<div class="tx1">' + (room.name || '') + '</div>' +
        '<div class="tx2">' + (room.roomInfo || '') + '</div>' +
        '<div class="more"></div>' +
        '</a>';
      wrapper.appendChild(div);
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    if (window.previewHandler) return;
    var mapper = new RoomMapper();
    mapper.initialize();
    global.roomMapperInstance = mapper;
  });

  global.RoomMapper = RoomMapper;
})(window);
