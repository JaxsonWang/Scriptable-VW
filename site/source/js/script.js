(function ($) {
  'use strict'

  var copyOK = 0
  // ----------------------------
  // AOS
  // ----------------------------
  AOS.init({
    once: true
  })


  $(window).on('scroll', function () {
		//.Scroll to top show/hide
    var scrollToTop = $('.scroll-top-to'),
      scroll = $(window).scrollTop()
    if (scroll >= 200) {
      scrollToTop.fadeIn(200)
    } else {
      scrollToTop.fadeOut(100)
    }
  })
	// scroll-to-top
  $('.scroll-top-to').on('click', function () {
    $('body,html').animate({
      scrollTop: 0
    }, 500)
    return false
  })

  $(document).ready(function() {

    // navbarDropdown
    if ($(window).width() < 992) {
      $('.main-nav .dropdown-toggle').on('click', function () {
        $(this).siblings('.dropdown-menu').animate({
          height: 'toggle'
        }, 300)
      })
    }

    $('#copy').on('click', function (e) {
      var $temp = $('<input>')
      $('body').append($temp)
      $temp.val($('#js').val()).select()
      document.execCommand('copy')
      $temp.remove()
      copyOK ++
      document.getElementById('open').focus()
    })

    // 列表刷新
    getScriptVersion('https://cdn.jsdelivr.net/gh/JaxsonWang/Scriptable-VW@latest/build/comfort-version.json', function(response) {
      document.querySelector('#comfort-version').innerHTML = '体验版：v' + response.version
    })
    getScriptVersion('https://cdn.jsdelivr.net/gh/JaxsonWang/Scriptable-VW@latest/build/fvw-audi-version.json', function(response) {
      document.querySelector('#fvw-audi-version').innerHTML = '一汽奥迪：v' + response.version
    })
    getScriptVersion('https://cdn.jsdelivr.net/gh/JaxsonWang/Scriptable-VW@latest/build/fvw-version.json', function(response) {
      document.querySelector('#fvw-version').innerHTML = '一汽大众：v' + response.version
    })
  })
})(jQuery)

/**
 * 获取数据
 * @param url
 * @param callback
 */
function getScriptVersion(url, callback) {
  $.ajax({
    type: 'get',
    dataType: 'json',
    url: url,
    success: function (response) {
      callback(response)
    }
  })
}

