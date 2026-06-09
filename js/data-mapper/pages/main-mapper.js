(function (global) {
  'use strict';

  function MainMapper() {
    BaseDataMapper.call(this);
  }
  MainMapper.prototype = Object.create(BaseDataMapper.prototype);
  MainMapper.prototype.constructor = MainMapper;

  MainMapper.prototype.mapPage = function () {
    this.mapHero();
    this.mapAboutTitle();
    this.mapAboutSection();
    this.mapGalleryRolling();
    this.mapTypingSection();
    this.mapConFooterInfo();
    this.mapPropertyNames();
  };

  // 한글 받침 판별하여 "을/를" 선택
  MainMapper.prototype.getKoreanObjectParticle = function (word) {
    if (!word || word.length === 0) return '을';
    var lastChar = word.charCodeAt(word.length - 1);
    if (lastChar >= 0xAC00 && lastChar <= 0xD7A3) {
      var code = lastChar - 0xAC00;
      return (code % 28 !== 0) ? '을' : '를';
    }
    return '을';
  };

  // MAPPER: customFields.pages.main.sections[0].hero.images[isSelected]
  // TEXT: property.name (숙소 한글명)
  MainMapper.prototype.mapHero = function () {
    var pages = this.getPages();
    var hero = pages.main && pages.main.sections && pages.main.sections[0] && pages.main.sections[0].hero;
    if (!hero) return;

    var images = this.getSelectedImages(hero.images || []);
    var wrapper = document.querySelector('[data-main-hero-slides]');
    var propertyName = this.getPropertyName();
    if (!wrapper) return;

    wrapper.innerHTML = '';

    if (!images.length) {
      // Show placeholder when no images
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

  // MAPPER: property.name → "쉼이 필요한 날, [숙소명]을/를 만나다"
  MainMapper.prototype.mapAboutTitle = function () {
    var propertyName = this.getPropertyName();
    var particle = this.getKoreanObjectParticle(propertyName);
    var aboutTitleEl = document.querySelector('[data-about-title]');
    if (aboutTitleEl) {
      aboutTitleEl.textContent = propertyName + particle + ' 만나다';
    }
  };

  // MAPPER: customFields.pages.main.sections[0].about[0]
  //   .images[0].url → con6 대표 이미지
  //   .description   → con6 텍스트 (줄바꿈 \n → <br>)
  MainMapper.prototype.mapAboutSection = function () {
    var pages = this.getPages();
    var about = pages.main && pages.main.sections && pages.main.sections[0] && pages.main.sections[0].about;
    if (!about || !about.length) return;

    var item = about[0];

    // 대표 이미지
    var imgEl = document.querySelector('[data-main-about-image]');
    if (imgEl) {
      var imgUrl = this.getFirstSelectedImage(item.images || []);
      if (imgUrl) {
        imgEl.src = imgUrl;
        imgEl.classList.remove('empty-image-placeholder');
      } else {
        ImageHelpers.applyPlaceholder(imgEl);
      }
    }

    // 설명 텍스트 (줄바꿈 처리)
    var descEl = document.querySelector('[data-main-about-description]');
    if (descEl && item.description) {
      descEl.innerHTML = item.description
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');
    }
  };

  // MAPPER: homepage.customFields.property.images[category=property_exterior]
  MainMapper.prototype.mapGalleryRolling = function () {
    var cf = this.getCustomFields();
    var propImages = (cf.property && cf.property.images) || [];
    var exterior = propImages.filter(function (img) {
      return img.isSelected && img.category === 'property_exterior';
    }).sort(function (a, b) { return a.sortOrder - b.sortOrder; });

    var con7 = document.querySelector('[data-main-gallery]');
    if (!con7) return;

    con7.innerHTML = '';

    if (!exterior.length) {
      // Show placeholder when no images
      var placeholderDiv = document.createElement('div');
      placeholderDiv.className = 'img';
      var img = document.createElement('img');
      ImageHelpers.applyPlaceholder(img);
      placeholderDiv.appendChild(img);
      con7.appendChild(placeholderDiv);
      return;
    }

    exterior.forEach(function (img) {
      var div = document.createElement('div');
      div.className = 'img';
      div.innerHTML = '<img src="' + img.url + '" alt="" />';
      con7.appendChild(div);
    });
  };

  // MAPPER: property.name → typing section (index.html과 동일)
  MainMapper.prototype.mapTypingSection = function () {
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

  // MAPPER: property.name + property.nameEn → con4 하단 숙소명 영역
  MainMapper.prototype.mapConFooterInfo = function () {
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

  // MAPPER: homepage.customFields.property.name
  MainMapper.prototype.mapPropertyNames = function () {
    var name = this.getPropertyName();
    document.querySelectorAll('[data-property-name]').forEach(function (el) {
      el.textContent = name;
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    if (window.previewHandler) return;
    var mapper = new MainMapper();
    mapper.initialize();
    global.mainMapperInstance = mapper;
  });

  global.MainMapper = MainMapper;
})(window);
