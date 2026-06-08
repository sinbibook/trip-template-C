(function (global) {
  'use strict';

  function NearbyAttractionsMapper() {
    BaseDataMapper.call(this);
  }
  NearbyAttractionsMapper.prototype = Object.create(BaseDataMapper.prototype);
  NearbyAttractionsMapper.prototype.constructor = NearbyAttractionsMapper;

  NearbyAttractionsMapper.prototype.mapPage = function () {
    this.mapHero();
    this.mapAttractionCards();
  };

  NearbyAttractionsMapper.prototype.mapHero = function () {
    var pages = this.getPages();
    var page = pages.nearbyAttractions;
    if (!page || !page.sections || !page.sections[0]) return;

    var hero = page.sections[0].hero;
    if (!hero) return;

    var tx1 = document.querySelector('.con0 .tx1');
    if (tx1 && hero.title) tx1.textContent = hero.title;

    if (hero.imageUrl) {
      var img = document.querySelector('.con0 .swiper-slide img');
      if (img) img.src = hero.imageUrl;
    }
  };

  NearbyAttractionsMapper.prototype.mapAttractionCards = function () {
    var pages = this.getPages();
    var page = pages.nearbyAttractions;
    if (!page || !page.sections || !page.sections[0]) return;

    var about = page.sections[0].about;
    if (!about || !about.length) return;

    var itemWrap = document.querySelector('.con13 .itemWrap');
    if (!itemWrap) return;

    itemWrap.innerHTML = '';
    about.forEach(function (item) {
      var div = document.createElement('div');
      div.className = 'item';
      div.setAttribute('data-aos', 'fade-up');
      var imgUrl = item.imageUrl || '';
      div.innerHTML =
        '<img src="' + imgUrl + '" alt="" />' +
        '<div class="tx1">' +
          '<span class="bold">' + (item.name || '') + '</span>' +
          '<span class="bar">｜</span>' +
          (item.distance || '') +
        '</div>' +
        '<div class="tx2">' + (item.description || '') + '</div>';
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
