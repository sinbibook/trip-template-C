(function (global) {
  'use strict';

  function NearbyAttractionsMapper() {
    BaseDataMapper.call(this);
  }
  NearbyAttractionsMapper.prototype = Object.create(BaseDataMapper.prototype);
  NearbyAttractionsMapper.prototype.constructor = NearbyAttractionsMapper;

  NearbyAttractionsMapper.prototype.mapPage = function () {
    this.mapHero();
    this.mapHeroTitle();
    this.mapAttractionCards();
  };

  NearbyAttractionsMapper.prototype.mapHero = function () {
    var pages = this.getPages();
    var page = pages.nearbyAttractions;
    if (!page || !page.sections || !page.sections[0]) return;

    var hero = page.sections[0].hero;
    if (!hero) return;

    var wrapper = document.querySelector('[data-nearby-attractions-hero-slides]');
    if (!wrapper) return;

    var images = this.getSelectedImages(hero.images || []);
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

  NearbyAttractionsMapper.prototype.mapHeroTitle = function () {
    var pages = this.getPages();
    var page = pages.nearbyAttractions;
    if (!page || !page.sections || !page.sections[0]) return;

    var hero = page.sections[0].hero;
    if (!hero) return;

    var titleEl = document.querySelector('[data-nearby-attractions-hero-title]');
    if (titleEl && hero.title) titleEl.textContent = hero.title;

    var descEl = document.querySelector('[data-nearby-attractions-hero-description]');
    if (descEl && hero.description) descEl.textContent = hero.description;
  };

  NearbyAttractionsMapper.prototype.mapAttractionCards = function () {
    var pages = this.getPages();
    var page = pages.nearbyAttractions;
    if (!page || !page.sections || !page.sections[0]) return;

    var about = page.sections[0].about;
    if (!about || !about.length) return;

    var itemWrap = document.querySelector('[data-nearby-attractions-items]');
    if (!itemWrap) return;

    itemWrap.innerHTML = '';
    about.forEach(function (item) {
      var div = document.createElement('div');
      div.className = 'item';
      div.setAttribute('data-aos', 'fade-up');

      // Get first selected image
      var images = item.images || [];
      var selectedImage = images.find(function (img) { return img.isSelected; }) || images[0];
      var selectedImageIndex = images.findIndex(function (img) { return img.isSelected; });
      if (selectedImageIndex === -1) selectedImageIndex = 0;

      // Create img element with placeholder handling
      var img = document.createElement('img');
      if (selectedImage && selectedImage.url) {
        img.src = selectedImage.url;
        img.alt = item.title || '';
      } else {
        ImageHelpers.applyPlaceholder(img);
        img.alt = item.title || '';
      }

      div.appendChild(img);

      // Get distance info from selected image description
      var distanceInfo = (selectedImage && selectedImage.description) ? selectedImage.description : '';

      var tx1 = document.createElement('div');
      tx1.className = 'tx1';
      tx1.innerHTML =
        '<span class="bold">' + (item.title || '') + '</span>' +
        '<span class="bar">｜</span>' +
        distanceInfo;

      var tx2 = document.createElement('div');
      tx2.className = 'tx2';
      tx2.textContent = item.description || '';

      div.appendChild(tx1);
      div.appendChild(tx2);
      itemWrap.appendChild(div);
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    if (window.previewHandler) return;
    var mapper = new NearbyAttractionsMapper();
    mapper.initialize();
    global.nearbyAttractionsMapperInstance = mapper;
  });

  global.NearbyAttractionsMapper = NearbyAttractionsMapper;
})(window);
