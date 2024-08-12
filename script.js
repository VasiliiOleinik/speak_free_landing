$(document).ready(function () {
  $('.our-mission-tab-item').click(function () { 
    $('.our-mission-tab-item').removeClass('active')
    $(this).addClass('active')
    $('.our-mission-image').hide()
    $(`#data-image-${$(this).attr('data-tab')}`).show()
  })
})
