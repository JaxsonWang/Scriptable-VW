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
      // document.getElementById('js').select()
      // document.execCommand('Copy')
      // document.getElementById('copy').innerText = '复制成功！' + (copyOK > 0 ? '+'+copyOK :'')
      var $temp = $('<input>')
      $('body').append($temp)
      $temp.val($('#js').val()).select()
      document.execCommand('copy')
      $temp.remove()
      copyOK ++
      document.getElementById('open').focus()
    })

    // $.ajax({
    //   type : 'get',
    //   async: false,
    //   dataType : 'json',
    //   url: 'https://gitee.com/JaxsonWang/scriptable-audi/raw/master/version.json?jsoncallback=callback',
    //   success: function(response){
    //     console.log(response)
    //   }
    // })
  })
})(jQuery)
