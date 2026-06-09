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
    this.mapConFooterInfo();
    this.mapDaumMap();
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
      imgDiv.style.backgroundImage = 'url(' + img.url + ')';
      imgDiv.style.backgroundPosition = 'center';
      imgDiv.style.backgroundSize = 'cover';
      div.appendChild(imgDiv);
      wrapper.appendChild(div);
    });
  };

  // MAPPER: property.latitude, property.longitude → 다음 Rough Map
  DirectionsMapper.prototype.mapDaumMap = function () {
    var property = this.getProperty();
    if (!property.latitude || !property.longitude) return;

    var container = document.getElementById('daumRoughMap');
    if (!container) return;

    var options = {
      center: new daum.maps.LatLng(property.latitude, property.longitude),
      level: 3,
      scrollwheel: false,
      draggable: false
    };

    var map = new daum.maps.Map(container, options);

    // 마커 표시
    var markerPosition = new daum.maps.LatLng(property.latitude, property.longitude);
    var marker = new daum.maps.Marker({
      position: markerPosition
    });
    marker.setMap(map);
  };

  // MAPPER: property.address → con14 주소 텍스트
  DirectionsMapper.prototype.mapAddress = function () {
    var address = this.getProperty().address || '';
    var el = document.querySelector('[data-directions-address]');
    if (el) el.textContent = address;
  };

  // MAPPER: property.name + property.nameEn → con4 하단 숙소명 영역
  DirectionsMapper.prototype.mapConFooterInfo = function () {
    var property = this.getProperty();
    var nameKr = property.name || '';
    var nameEn = property.nameEn || '';

    // t1: 숙소 한글명
    var t1El = document.querySelector('.con4 .t0 .t1');
    if (t1El) {
      t1El.textContent = nameKr;
    }

    // t2: "Welcome To [숙소 영문명]"
    var t2El = document.querySelector('.con4 .t0 .t2');
    if (t2El) {
      t2El.textContent = 'Welcome To ' + nameEn;
    }
  };

  // TODO: 타이핑 텍스트 JSON 경로 추후 결정
  DirectionsMapper.prototype.mapTypingSection = function () {
    var propertyName = this.getPropertyName();
    var typing1El = document.querySelector('#typing1');
    var typing2El = document.querySelector('#typing2');

    if (typing1El) {
      typing1El.textContent = propertyName + '에서 사랑하는 사람들과 함께';
    }

    if (typing2El) {
      typing2El.textContent = '특별하고 소중한 시간을 보내보세요';
    }
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
