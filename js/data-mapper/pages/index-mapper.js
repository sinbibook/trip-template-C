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
    this.mapConFooterInfo();
    this.mapDirectionsImages();
    this.mapDirectionsPreview();
    this.mapPropertyNames();
  };

  // MAPPER: customFields.pages.index.sections[0].hero.images[isSelected]
  // TEXT: property.name
  IndexMapper.prototype.mapHeroSlides = function () {
    var pages = this.getPages();
    var hero = pages.index && pages.index.sections && pages.index.sections[0] && pages.index.sections[0].hero;
    if (!hero) return;

    var images = this.getSelectedImages(hero.images || []);
    var wrapper = document.querySelector('[data-index-hero-slides]');
    var propertyName = this.getPropertyName();
    if (!wrapper) return;

    wrapper.innerHTML = '';

    if (!images.length) {
      var placeholderDiv = document.createElement('div');
      placeholderDiv.className = 'swiper-slide';
      var img = document.createElement('img');
      ImageHelpers.applyPlaceholder(img);
      img.alt = propertyName || 'Hero Image';
      var titleDiv = document.createElement('div');
      titleDiv.className = 'tx1';
      titleDiv.textContent = propertyName || '';
      placeholderDiv.appendChild(img);
      placeholderDiv.appendChild(titleDiv);
      wrapper.appendChild(placeholderDiv);
      return;
    }

    images.forEach(function (img) {
      var div = document.createElement('div');
      div.className = 'swiper-slide';
      div.innerHTML = '<img src="' + img.url + '" alt="" /><div class="tx1">' + propertyName + '</div>';
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

      var img = document.createElement('img');
      if (thumbUrl) {
        img.src = thumbUrl;
      } else {
        ImageHelpers.applyPlaceholder(img);
      }

      var a = document.createElement('a');
      a.href = 'room.html?id=' + room.id;
      a.className = 'tx';
      a.innerHTML =
        '<div class="tx1">' + (room.name || '') + '</div>' +
        '<div class="tx2">' + (room.description || '') + '</div>' +
        '<div class="more"></div>';

      div.appendChild(img);
      div.appendChild(a);
      wrapper.appendChild(div);
    }, this);
  };

  // MAPPER: property.facilities[].images[isSelected][0].url + name
  IndexMapper.prototype.mapSpecialPreview = function () {
    var facilities = this.getProperty().facilities || [];
    var wrapper = document.querySelector('[data-index-facility-slides]');
    if (!wrapper) return;

    wrapper.innerHTML = '';

    // facilities가 없으면 placeholder 표시
    if (!facilities.length) {
      for (var i = 0; i < 6; i++) {
        var div = document.createElement('div');
        div.className = 'swiper-slide';
        div.setAttribute('data-title', '');

        var a = document.createElement('a');
        a.href = '#';

        var imgWrap = document.createElement('div');
        imgWrap.className = 'img';
        imgWrap.style.backgroundColor = '#f0f0f0';
        imgWrap.style.display = 'flex';
        imgWrap.style.alignItems = 'center';
        imgWrap.style.justifyContent = 'center';
        imgWrap.style.backgroundImage = ImageHelpers.EMPTY_IMAGE_SVG;
        imgWrap.style.backgroundRepeat = 'no-repeat';
        imgWrap.style.backgroundPosition = 'center';
        imgWrap.style.backgroundSize = 'cover';

        var noImageText = document.createElement('div');
        noImageText.textContent = 'No Image';
        noImageText.style.fontSize = '24px';
        noImageText.style.color = '#999';
        noImageText.style.fontFamily = 'sans-serif';
        noImageText.style.pointerEvents = 'none';
        imgWrap.appendChild(noImageText);

        var more = document.createElement('div');
        more.className = 'more';

        a.appendChild(imgWrap);
        a.appendChild(more);
        div.appendChild(a);
        wrapper.appendChild(div);
      }
      return;
    }

    facilities.forEach(function (f) {
      var imgUrl = this.getFirstSelectedImage(f.images || []);
      var div = document.createElement('div');
      div.className = 'swiper-slide';
      div.setAttribute('data-title', f.name || '');

      var a = document.createElement('a');
      a.href = 'facility.html?id=' + f.id;

      var imgWrap = document.createElement('div');
      imgWrap.className = 'img';
      imgWrap.style.display = 'flex';
      imgWrap.style.alignItems = 'center';
      imgWrap.style.justifyContent = 'center';

      if (imgUrl) {
        imgWrap.style.backgroundImage = 'url(' + imgUrl + ')';
        imgWrap.style.backgroundPosition = 'center';
        imgWrap.style.backgroundSize = 'cover';
      } else {
        imgWrap.style.backgroundColor = '#f0f0f0';
        imgWrap.style.backgroundImage = ImageHelpers.EMPTY_IMAGE_SVG;
        imgWrap.style.backgroundRepeat = 'no-repeat';
        imgWrap.style.backgroundPosition = 'center';
        imgWrap.style.backgroundSize = 'cover';

        var noImageText = document.createElement('div');
        noImageText.textContent = 'No Image';
        noImageText.style.fontSize = '24px';
        noImageText.style.color = '#999';
        noImageText.style.fontFamily = 'sans-serif';
        noImageText.style.pointerEvents = 'none';
        imgWrap.appendChild(noImageText);
      }

      var more = document.createElement('div');
      more.className = 'more';

      a.appendChild(imgWrap);
      a.appendChild(more);
      div.appendChild(a);
      wrapper.appendChild(div);
    }, this);
  };

  // MAPPER: property.name → typing1 (타이핑 섹션)
  IndexMapper.prototype.mapTypingSection = function () {
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

  // MAPPER: customFields.pages.index.sections[0].signature.images[isSelected] → con5 이미지
  IndexMapper.prototype.mapDirectionsImages = function () {
    var pages = this.getPages();
    var signature = pages.index && pages.index.sections && pages.index.sections[0] && pages.index.sections[0].signature;
    if (!signature) return;

    var selectedImages = this.getSelectedImages(signature.images || []);
    var imgWrap = document.querySelector('.con5 .imgWrap');
    if (!imgWrap) return;

    imgWrap.innerHTML = '';

    // selectedImages가 없으면 2개의 placeholder 생성
    if (!selectedImages || !selectedImages.length) {
      for (var i = 0; i < 2; i++) {
        var img = document.createElement('img');
        ImageHelpers.applyPlaceholder(img);
        img.alt = '';
        img.setAttribute('data-aos', 'fade-up');
        imgWrap.appendChild(img);
      }
      return;
    }

    // selectedImages가 있으면 이미지 생성 (최대 2개)
    selectedImages.slice(0, 2).forEach(function (imgData, index) {
      var img = document.createElement('img');
      if (imgData && imgData.url) {
        img.src = imgData.url;
      } else {
        ImageHelpers.applyPlaceholder(img);
      }
      img.alt = '';
      img.setAttribute('data-aos', 'fade-up');
      imgWrap.appendChild(img);
    });
  };

  // MAPPER: property.address → con5 주소 텍스트
  IndexMapper.prototype.mapDirectionsPreview = function () {
    var address = this.getProperty().address || '';
    var el = document.querySelector('[data-directions-address]');
    if (el) el.textContent = address;
  };

  // MAPPER: property.name + property.nameEn → con4 하단 숙소명 영역
  IndexMapper.prototype.mapConFooterInfo = function () {
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
