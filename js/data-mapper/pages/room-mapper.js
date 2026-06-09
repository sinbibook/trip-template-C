(function (global) {
  'use strict';

  function RoomMapper() {
    BaseDataMapper.call(this);
  }
  RoomMapper.prototype = Object.create(BaseDataMapper.prototype);
  RoomMapper.prototype.constructor = RoomMapper;

  RoomMapper.prototype.mapPage = function () {
    this.mapRoomDetail();
    this.mapAmenities();
    this.mapRoomPreview();
    this.mapPropertyNames();
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
    if (wrapper) {
      var slides = (room.images && room.images[0] && room.images[0].interior) ?
        room.images[0].interior.filter(function (i) { return i.isSelected !== false; }) : [];

      wrapper.innerHTML = '';

      if (!slides.length) {
        var placeholderDiv = document.createElement('div');
        placeholderDiv.className = 'swiper-slide';
        var img = document.createElement('img');
        ImageHelpers.applyPlaceholder(img);
        img.alt = room.name || '';
        var tx1 = document.createElement('div');
        tx1.className = 'tx1';
        tx1.textContent = room.name || '';
        placeholderDiv.appendChild(img);
        placeholderDiv.appendChild(tx1);
        wrapper.appendChild(placeholderDiv);
      } else {
        slides.forEach(function (slide) {
          var div = document.createElement('div');
          div.className = 'swiper-slide';
          var imgEl = document.createElement('img');
          if (slide.url) {
            imgEl.src = slide.url;
          } else {
            ImageHelpers.applyPlaceholder(imgEl);
          }
          imgEl.alt = room.name || '';
          var tx1 = document.createElement('div');
          tx1.className = 'tx1';
          tx1.textContent = room.name || '';
          div.appendChild(imgEl);
          div.appendChild(tx1);
          wrapper.appendChild(div);
        });
      }
    }

    // 객실 정보
    var tx2El = document.querySelector('.con8 .conTitle2 .tx2 .spot');
    if (tx2El) tx2El.textContent = room.name || '';

    var tx3El = document.querySelector('.con8 .conTitle2 .tx3');
    if (tx3El) tx3El.textContent = room.roomInfo || room.description || '';

    // 테이블 정보 매핑 (PC + 모바일 테이블 모두)
    document.querySelectorAll('[data-room-name]').forEach(function (el) {
      el.textContent = room.name || '';
    });

    document.querySelectorAll('[data-room-size]').forEach(function (el) {
      el.textContent = (room.size || 0) + '㎡';
    });

    document.querySelectorAll('[data-room-type]').forEach(function (el) {
      el.textContent = room.description || '';
    });

    document.querySelectorAll('[data-room-base-occupancy]').forEach(function (el) {
      el.textContent = room.baseOccupancy || '';
    });

    document.querySelectorAll('[data-room-max-occupancy]').forEach(function (el) {
      el.textContent = room.maxOccupancy || '';
    });

    // 메인 이미지
    var mainImg = document.querySelector('.con8 .imgWrap img');
    if (mainImg) {
      var thumbUrl = (room.images && room.images[0] && room.images[0].thumbnail && room.images[0].thumbnail[0]) ?
        room.images[0].thumbnail[0].url : '';
      if (thumbUrl) {
        mainImg.src = thumbUrl;
      } else {
        ImageHelpers.applyPlaceholder(mainImg);
      }
    }

    // 추가 이미지
    var con10Imgs = document.querySelectorAll('.con10 img');
    if (con10Imgs.length) {
      var exteriorImages = (room.images && room.images[0] && room.images[0].exterior) ? room.images[0].exterior : [];
      exteriorImages.slice(0, 2).forEach(function (img, i) {
        if (con10Imgs[i]) {
          if (img.url) {
            con10Imgs[i].src = img.url;
          } else {
            ImageHelpers.applyPlaceholder(con10Imgs[i]);
          }
        }
      });
      // 나머지 이미지에 placeholder 적용
      for (var i = exteriorImages.length; i < con10Imgs.length && i < 2; i++) {
        ImageHelpers.applyPlaceholder(con10Imgs[i]);
      }
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
    if (!wrapper) return;

    wrapper.innerHTML = '';

    // rooms가 없으면 placeholder 표시
    if (!rooms.length) {
      for (var i = 0; i < 6; i++) {
        var div = document.createElement('div');
        div.className = 'swiper-slide';
        div.setAttribute('data-title', '');

        var img = document.createElement('img');
        ImageHelpers.applyPlaceholder(img);
        img.alt = '';

        var tx = document.createElement('a');
        tx.className = 'tx';
        tx.href = '#';
        var tx1 = document.createElement('div');
        tx1.className = 'tx1';
        var tx2 = document.createElement('div');
        tx2.className = 'tx2';
        var more = document.createElement('div');
        more.className = 'more';

        tx.appendChild(tx1);
        tx.appendChild(tx2);
        tx.appendChild(more);

        div.appendChild(img);
        div.appendChild(tx);
        wrapper.appendChild(div);
      }
      return;
    }

    rooms.forEach(function (room) {
      var thumbUrl = '';
      if (room.images && room.images[0] && room.images[0].thumbnail && room.images[0].thumbnail[0]) {
        thumbUrl = room.images[0].thumbnail[0].url || '';
      }
      var div = document.createElement('div');
      div.className = 'swiper-slide';
      div.setAttribute('data-title', room.name || '');

      var img = document.createElement('img');
      if (thumbUrl) {
        img.src = thumbUrl;
      } else {
        ImageHelpers.applyPlaceholder(img);
      }
      img.alt = '';

      var tx = document.createElement('a');
      tx.className = 'tx';
      tx.href = 'room.html?id=' + room.id;
      var tx1 = document.createElement('div');
      tx1.className = 'tx1';
      tx1.textContent = room.name || '';
      var tx2 = document.createElement('div');
      tx2.className = 'tx2';
      tx2.textContent = room.roomInfo || '';
      var more = document.createElement('div');
      more.className = 'more';

      tx.appendChild(tx1);
      tx.appendChild(tx2);
      tx.appendChild(more);

      div.appendChild(img);
      div.appendChild(tx);
      wrapper.appendChild(div);
    });
  };

  // MAPPER: rooms[current].amenities → 집기품목 (inline, 쉼표 구분) - PC/모바일 모두
  RoomMapper.prototype.mapAmenities = function () {
    var room = this.getCurrentRoom();
    if (!room || !room.amenities || !room.amenities.length) return;

    // 쉼표로 구분된 텍스트 생성
    var amenitiesText = room.amenities.join(', ');

    // PC와 모바일 모두 업데이트
    document.querySelectorAll('[data-room-amenities]').forEach(function (container) {
      container.textContent = amenitiesText;
    });
  };

  // MAPPER: property.name → 숙소명 표기 요소들
  RoomMapper.prototype.mapPropertyNames = function () {
    var name = this.getPropertyName();
    document.querySelectorAll('[data-property-name]').forEach(function (el) {
      el.textContent = name;
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
