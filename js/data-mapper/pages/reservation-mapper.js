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
    if (!wrapper || !images.length) return;

    wrapper.innerHTML = '';
    images.forEach(function (img) {
      var div = document.createElement('div');
      div.className = 'swiper-slide';
      div.innerHTML = '<img src="' + img.url + '" alt="" /><div class="tx1">RESERVATION</div>';
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
    var tbody = document.querySelector('[data-reservation-refund-table]');
    if (!tbody || !policies.length) return;

    tbody.innerHTML = '';
    policies.forEach(function (p) {
      var tr = document.createElement('tr');
      var label = p.refundProcessingDays + '일 ' + (p.refundProcessingDays === 0 ? '당일' : '전');
      tr.innerHTML = '<td>' + label + '</td><td>' + p.refundRate + '%</td>';
      tbody.appendChild(tr);
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    if (window.previewHandler) return;
    var mapper = new ReservationMapper();
    mapper.initialize();
    global.reservationMapperInstance = mapper;
  });

  global.ReservationMapper = ReservationMapper;
})(window);
