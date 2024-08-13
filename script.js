$(document).ready(function () {
  // Tabs for our mission section
  $('.our-mission-tab-item').click(function () { 
    $('.our-mission-tab-item').removeClass('active')
    $(this).addClass('active')
    $('.our-mission-image').hide()
    $(`#data-image-${$(this).attr('data-tab')}`).show()
  })
    
  $('.online-btn').click(function () {
    $(this).addClass('active')
    $('.offline-btn').removeClass('active')

    $('.offline-plan').hide()
    $('.online-plan').show().css('display', 'flex')
  })

  $('.offline-btn').click(function () {
    $(this).addClass('active')
    $('.online-btn').removeClass('active')

    $('.online-plan').hide()
    $('.offline-plan').show().css('display', 'flex')
  })

// Initialize intlTelInput
var phoneInput = document.querySelector("#phone")
var iti = intlTelInput(phoneInput, {
  initialCountry: "auto",
  geoIpLookup: function (callback) {
    $.get('https://ipinfo.io', function () {}, "jsonp").always(function (resp) {
      var countryCode = (resp && resp.country) ? resp.country : "us"
      callback(countryCode)
    })
  },
  utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
  nationalMode: false // Ensure the full international number is used
})

// Function to apply the appropriate input mask
function applyInputMask() {
  var countryData = iti.getSelectedCountryData()
  var dialCode = countryData.dialCode
  var mask = intlTelInputUtils.getExampleNumber(countryData.iso2, true, intlTelInputUtils.numberFormat.NATIONAL)
  mask = "+" + dialCode + " " + mask.replace(/[0-9]/g, "9") // Include country code and replace all digits with 9 for input mask
  $(phoneInput).inputmask(mask, {
    placeholder: "",
    clearMaskOnLostFocus: true
  })
}

// Apply input mask on country change
$(phoneInput).on('countrychange', function () {
  applyInputMask()
})

// Trigger the countrychange event to apply the initial mask
$(phoneInput).trigger('countrychange')

  // Smooth scrolling for anchor links
  $('a[href^="#"]').on('click', function (event) {
    event.preventDefault()
    var target = this.hash
    var $target = $(target)

    $('a[href^="#"]').removeClass('active')
    $(this).addClass('active')
  
    $('html, body').animate({
      scrollTop: $target.offset().top - 100
    }, 700, 'swing', function () {
      // Update the hash without jumping
      if (history.pushState) {
        history.pushState(null, null, target)
      } else {
        window.location.hash = target
      }
    })
  })

   // Function to check if all fields are filled
  function validateForm() {
    let isValid = true;
  
    // Validate inputs with class 'form-input'
    $('#main-form .form-input').each(function () {
      if ($(this).val() === '') {
        isValid = false;
        $(this).removeClass('success');
        return false; // Break out of the loop
      }
      $(this).addClass('success');
    });
     
  // Validate checkboxes separately
  $('#main-form input[type="checkbox"]').each(function () {
    if (!$(this).is(':checked')) {
      isValid = false;
      $(this).removeClass('success');
      return false; // Break out of the loop
    }
    $(this).addClass('success');
  });

  return isValid;
   }
  
  const plans = {
    "2800": "8 занять оффлайн у групі",
    "7200": "24 заняття оффлайн у групі",
    "2600": "8 занять онлайн у групі",
    "6600": "24 заняття онлайн у групі",
    "650": "1 індивідуальне заняття",
    "4500": "8 індивідуальних занять",
  }
  
  function getFormValues() {
    const values = {}
    
    $('#main-form .form-input').each(function () {
      values[$(this).attr('name')] = $(this).val()
    })


    return values
  }

  // Event listener for input changes
  $('#main-form .form-input').on('input change', function () {
    if (validateForm()) {
      $('#submit-btn').prop('disabled', false)
    } else {
      $('#submit-btn').prop('disabled', true)
    }
  })

  $('#personal_data_consent').on('change', function () {
    if (validateForm()) {
      $('#submit-btn').prop('disabled', false);
    } else {
      $('#submit-btn').prop('disabled', true);
    }
  });

  $('#accept_offer_agreement').on('change', function () {
    if (validateForm()) {
      $('#submit-btn').prop('disabled', false);
    } else {
      $('#submit-btn').prop('disabled', true);
    }
  });

  // Initial validation check
  if (validateForm()) {
    $('#submit-btn').prop('disabled', false)
  } else {
    $('#submit-btn').prop('disabled', true)
  }

  // Way for pay
    var wayforpay = new Wayforpay()
    var pay = function () {
      wayforpay.run({
        merchantAccount: "englishcampwithdi_com",
        merchantDomainName: "englishcampwithdi.com",
        authorizationType: "SimpleSignature",
        merchantSignature: "2a4d0453a88a0b071b73493c44f6cfa667dbf0b5",
        orderReference: "DH783023",
        orderDate: "1415379863",
        amount: "1547.36",
        currency: "UAH",
        productName: "Процессор Intel Core i5-4670 3.4GHz",
        productPrice: "1000",
        productCount: "1",
        clientFirstName: "Вася",
        clientLastName: "Васечкин",
        clientEmail: "some@mail.com",
        clientPhone: "380631234567",
        language: "UA"
      },
        function (response) {
          // on approved				 			
        },
        function (response) {
          // on declined 			
        },
        function (response) {
          // on pending or in processing 			
        }
      )
    }


  // Form submission event
  $('#main-form').on('submit', function (event) {
    event.preventDefault()

    if (!validateForm()) {
      alert('Please fill out all fields.')
    }

    const phoneNumber = String(iti.getNumber()).split(' ').join('')

    if (phoneNumber.length < 13) {
      alert('Please enter a valid phone number.')

      return
    }

    const formValues = getFormValues()
    formValues["status"] = "Pending Payment"
    formValues["plan"] = plans[formValues["plan"]]
    
      $.ajax({
        type: 'POST',
        url: './mailer.php',
        data: formValues,
        success: function (response) {
          pay()
        },
        error: function(xhr, status, error) {
          console.error('xhr', xhr);
          console.error('status', status);
          console.error('error', error)
        }
      });
  })

  $('.owl-carousel').owlCarousel({
    loop: true,
    margin: 10,
    nav: false,
    autoplay: true,
    responsive: {
        0: {
            items: 1
        },
        600: {
            items: 2
        },
        1000: {
            items: 4
        }
    }
  })

  $('.plan-btn').click(function () {
    const plan = $(this).attr('data-price')
    $('.form-input.select').val(plan)
  })
})
