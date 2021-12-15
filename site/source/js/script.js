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
    var token = '?access_token=2e5dab8d64977e068397ac68f8766780'
    getGiteeTree('https://gitee.com/api/v5/repos/JaxsonWang/scriptable-audi/git/trees/master' + token, ['assets', 'fvw-audi-version.json', 'fvw-version.json', 'svw-version.json'], function(dataRoo1) {
      getGiteeTree(dataRoo1[0].url + token, ['audi_cars'], function(dataRoo2) {
        if (document.querySelector('.audi-car-images-list')) {
          getGiteeTree(dataRoo2[0].url + token, null, function(dataRoo3) {
            var imageArr = []
            for (var i = 0; i < dataRoo3.length; i++) {
              imageArr.push(dataRoo3[i].path)
            }
            renderAudiImageList(imageArr)
          })
        }
      })
      if (document.querySelector('#fvw-audi-version')) {
        getGiteeTree(dataRoo1[1].url + token, null, function(dataRoo4) {
          var base64 = dataRoo4.content
          var json = JSON.parse(window.atob(base64))
          document.querySelector('#fvw-audi-version').innerHTML = '一汽奥迪：v' + json.version
        })
      }
      if (document.querySelector('#fvw-version')) {
        getGiteeTree(dataRoo1[2].url + token, null, function(dataRoo5) {
          var base64 = dataRoo5.content
          var json = JSON.parse(window.atob(base64))
          document.querySelector('#fvw-version').innerHTML = '一汽大众：v' + json.version
        })
      }
      if (document.querySelector('#svw-version')) {
        getGiteeTree(dataRoo1[3].url + token, null, function(dataRoo6) {
          var base64 = dataRoo6.content
          var json = JSON.parse(window.atob(base64))
          document.querySelector('#svw-version').innerHTML = '上汽大众：v' + json.version
        })
      }
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

function renderAudiImageList(arr) {
  if (arr && arr.length !== 0) {
    arr.forEach(item => {
      var create = document.createElement('p')
      create.className = 'py-0'
      create.innerHTML = item.replace('.png', '').replace('_', ' ') + '：<a href="https://gitee.com/JaxsonWang/scriptable-audi/raw/master/assets/audi_cars/'+ encodeURI(item) +'" target="_blank">点击下载</a>'
      document.querySelector('.audi-car-images-list').appendChild(create)
    })
  } else {
    document.querySelector('.audi-car-images-list').innerHTML = '暂无数据'
  }
}
