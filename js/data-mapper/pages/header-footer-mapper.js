(function (global) {
  'use strict';

  function HeaderFooterMapper() {
    BaseDataMapper.call(this);
  }
  HeaderFooterMapper.prototype = Object.create(BaseDataMapper.prototype);
  HeaderFooterMapper.prototype.constructor = HeaderFooterMapper;

  HeaderFooterMapper.prototype.mapPage = function () {
    this.mapLogo();
    this.mapBookingLinks();
    this.mapRoomMenu();
    this.mapFacilityMenu();
    this.mapFooter();
  };

  // MAPPER: homepage.images[0].logo[isSelected].url
  HeaderFooterMapper.prototype.mapLogo = function () {
    var logoUrl = this.getLogo();
    if (!logoUrl) return;
    var el = document.querySelector('[data-logo]');
    if (el) el.src = logoUrl;
  };

  // MAPPER: property.realtimeBookingId
  HeaderFooterMapper.prototype.mapBookingLinks = function () {
    var bookingUrl = this.getBookingUrl();
    document.querySelectorAll('[data-booking-link]').forEach(function (el) {
      if (bookingUrl && bookingUrl !== '#!') {
        el.href = 'javascript:void(0)';
        el.addEventListener('click', function () {
          window.open(bookingUrl, '_blank');
        });
      }
    });
  };

  // MAPPER: rooms[].name → ROOMS 메뉴 동적 생성
  HeaderFooterMapper.prototype.mapRoomMenu = function () {
    var rooms = (this.data && this.data.rooms) || [];
    var container = document.querySelector('[data-room-menu-link]');
    if (!container || !rooms.length) return;

    var parent = container.parentNode;
    parent.innerHTML = '';
    rooms.forEach(function (room) {
      var a = document.createElement('a');
      a.href = 'room.html?id=' + room.id;
      a.textContent = room.name;
      parent.appendChild(a);
    });
  };

  // MAPPER: property.facilities[].name → SPECIAL 메뉴 동적 생성
  HeaderFooterMapper.prototype.mapFacilityMenu = function () {
    var facilities = this.getProperty().facilities || [];
    var container = document.querySelector('[data-facility-menu-link]');
    if (!container || !facilities.length) return;

    var parent = container.parentNode;
    parent.innerHTML = '';
    facilities.forEach(function (f) {
      var a = document.createElement('a');
      a.href = 'facility.html?id=' + f.id;
      a.textContent = f.name;
      parent.appendChild(a);
    });
  };

  // MAPPER: property.contactPhone, businessInfo, footer slogan
  HeaderFooterMapper.prototype.mapFooter = function () {
    var prop = this.getProperty();

    // 전화번호
    var phoneEl = document.querySelector('[data-footer-phone]');
    if (phoneEl && prop.contactPhone) {
      phoneEl.textContent = '+ ' + prop.contactPhone;
    }

    // 사업자 정보
    var bizEl = document.querySelector('[data-footer-business-info]');
    if (bizEl && prop.businessInfo) {
      var b = prop.businessInfo;
      var name = b.businessName || this.getPropertyName();
      bizEl.textContent =
        '상호 : ' + name +
        ' ｜대표자 : ' + (b.representativeName || '') +
        '｜ 주소 : ' + (b.businessAddress || '') +
        '｜ 사업자번호 : ' + (b.businessNumber || '');
    }

    // 저작권 숙소명
    var copyrightEl = document.querySelector('[data-footer-copyright]');
    if (copyrightEl) {
      var bizName = (prop.businessInfo && prop.businessInfo.businessName) || this.getPropertyName();
      if (bizName) copyrightEl.textContent = bizName;
    }
  };

  document.addEventListener('headerFooterLoaded', function () {
    var mapper = new HeaderFooterMapper();
    mapper.initialize();
    global.headerFooterMapperInstance = mapper;
  });

  global.HeaderFooterMapper = HeaderFooterMapper;
})(window);
