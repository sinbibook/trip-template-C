$(document).ready(function () {
  // enabled=false이면 404로 리다이렉트
  document.addEventListener('headerFooterLoaded', function () {
    var nearbyAttractions = window.templateData && window.templateData.homepage &&
                            window.templateData.homepage.customFields &&
                            window.templateData.homepage.customFields.pages &&
                            window.templateData.homepage.customFields.pages.nearbyAttractions;

    if (nearbyAttractions &&
        nearbyAttractions.sections &&
        nearbyAttractions.sections[0] &&
        nearbyAttractions.sections[0].enabled === false) {
      window.location.href = '404.html';
    }
  });

  // con0은 noSwiper (단일 이미지), Swiper 초기화 불필요
});
