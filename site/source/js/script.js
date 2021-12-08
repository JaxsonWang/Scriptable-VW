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

    // 列表刷新
    var token = '?access_token=aa19b0893e94790f3a253e1a19e5f91d'
    getGiteeTree('https://gitee.com/api/v5/repos/JaxsonWang/scriptable-audi/git/trees/master' + token, ['assets', 'version.json'], function(dataRoo1) {
      getGiteeTree(dataRoo1[0].url + token, ['cars'], function(dataRoo2) {
        getGiteeTree(dataRoo2[0].url + token, null, function(dataRoo3) {
          var imageArr = []
          for (var i = 0; i < dataRoo3.length; i++) {
            imageArr.push(dataRoo3[i].path)
          }
          renderImageList(imageArr)
        })
      })
      getGiteeTree(dataRoo1[1].url + token, null, function(dataRoo4) {
        var base64 = dataRoo4.content
        var json = JSON.parse(window.atob(base64))
        document.querySelector('#version').innerHTML = '当前版本号：v' + json.version
      })
    })
  })
})(jQuery)

/**
 * 从 gitee 获取数据
 * @param url
 * @param name
 * @param callback
 */
function getGiteeTree(url, name, callback) {
  $.ajax({
    type: 'get',
    dataType: 'json',
    url: url,
    success: function (response) {
      if (response.tree && response.tree.length !== 0) {
        var treeList = response.tree
        if (name) {
          var params = []
          for (var i = 0; i < treeList.length; i++) {
            if (name.indexOf(treeList[i].path) !== -1) {
              params.push(treeList[i])
            }
          }
          callback(params)
        } else {
          callback(treeList)
        }
      } else {
        callback(response)
      }
    }
  })
}

function renderImageList(arr) {
  if (arr && arr.length !== 0) {
    arr.forEach(item => {
      var create = document.createElement('p')
      create.className = 'py-0'
      create.innerHTML = item.replace('.png', '').replace('_', ' ') + '：<a href="https://gitee.com/JaxsonWang/scriptable-audi/raw/master/assets/cars/'+ encodeURI(item) +'" target="_blank">点击下载</a>'
      document.querySelector('.car-images-list').appendChild(create)
    })
  } else {
    document.querySelector('.car-images-list').innerHTML = '暂无数据'
  }
}
