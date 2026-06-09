(function (global) {
  'use strict';

  function ReservationMapper() {
    BaseDataMapper.call(this);
  }
  ReservationMapper.prototype = Object.create(BaseDataMapper.prototype);
  ReservationMapper.prototype.constructor = ReservationMapper;

  ReservationMapper.prototype.mapPage = function () {
    this.mapHero();
    this.mapContent();
    this.mapRefundTable();
  };

  // MAPPER: customFields.pages.reservation.sections[0].hero.images[isSelected]
  ReservationMapper.prototype.mapHero = function () {
    var pages = this.getPages();
    var hero = pages.reservation && pages.reservation.sections && pages.reservation.sections[0] && pages.reservation.sections[0].hero;
    if (!hero) return;

    var images = this.getSelectedImages(hero.images || []);
    var wrapper = document.querySelector('[data-reservation-hero-slides]');
    if (!wrapper) return;

    wrapper.innerHTML = '';

    if (!images.length) {
      var placeholderDiv = document.createElement('div');
      placeholderDiv.className = 'swiper-slide';
      var imgDiv = document.createElement('div');
      imgDiv.className = 'img';
      imgDiv.style.backgroundColor = '#f0f0f0';
      imgDiv.style.backgroundImage = ImageHelpers.EMPTY_IMAGE_SVG;
      imgDiv.style.backgroundRepeat = 'no-repeat';
      imgDiv.style.backgroundPosition = 'center';
      imgDiv.style.backgroundSize = 'cover';
      placeholderDiv.appendChild(imgDiv);
      wrapper.appendChild(placeholderDiv);
      return;
    }

    images.forEach(function (img) {
      var div = document.createElement('div');
      div.className = 'swiper-slide';
      var imgDiv = document.createElement('div');
      imgDiv.className = 'img';
      if (img.url) {
        imgDiv.style.backgroundImage = 'url(' + img.url + ')';
        imgDiv.style.backgroundPosition = 'center';
        imgDiv.style.backgroundSize = 'cover';
      } else {
        imgDiv.style.backgroundColor = '#f0f0f0';
        imgDiv.style.backgroundImage = ImageHelpers.EMPTY_IMAGE_SVG;
        imgDiv.style.backgroundRepeat = 'no-repeat';
        imgDiv.style.backgroundPosition = 'center';
        imgDiv.style.backgroundSize = 'cover';
      }
      div.appendChild(imgDiv);
      wrapper.appendChild(div);
    });
  };

  // MAPPER: property.usageGuide, reservationGuide, checkInOutInfo
  ReservationMapper.prototype.mapContent = function () {
    var prop = this.getProperty();

    // 이용안내
    var usageEl = document.querySelector('[data-reservation-usage-content]');
    if (usageEl && prop.usageGuide) {
      usageEl.innerHTML = prop.usageGuide
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');
    }

    // 예약안내
    var guideEl = document.querySelector('[data-reservation-guide-content]');
    if (guideEl && prop.reservationGuide) {
      guideEl.innerHTML = prop.reservationGuide
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');
    }

    // 입/퇴실 안내
    var checkinEl = document.querySelector('[data-reservation-checkin-content]');
    if (checkinEl && prop.checkInOutInfo) {
      checkinEl.innerHTML = prop.checkInOutInfo
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');
    }
  };

  // MAPPER: property.refundPolicies[] → 표 동적 생성
  ReservationMapper.prototype.mapRefundTable = function () {
    var prop = this.getProperty();
    var policies = prop.refundPolicies || [];
    var container = document.querySelector('[data-reservation-refund-table]');
    if (!container || !policies.length) return;

    var html = '';
    policies.forEach(function (p) {
      var days = p.refundProcessingDays;
      var daysLabel = days === 0 ? '당일' : days + '일전';
      var refundText = p.refundRate === 100 ? '전액 환불' : p.refundRate + '% 환불';
      html += '* 이용일 ' + daysLabel + ' 취소시 ' + refundText + '<br>';
    });
    container.innerHTML = html;
  };

  document.addEventListener('DOMContentLoaded', function () {
    if (window.previewHandler) return;
    var mapper = new ReservationMapper();
    mapper.initialize();
    global.reservationMapperInstance = mapper;
  });

  global.ReservationMapper = ReservationMapper;
})(window);
