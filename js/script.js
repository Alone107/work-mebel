const get_url_params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

const utm_params = [
  "utm_content",
  "utm_medium",
  "utm_campaign",
  "utm_source",
  "utm_term",
  "utm_referrer",
  "roistat",
  "referrer",
  "openstat_service",
  "openstat_campaign",
  "openstat_ad",
  "openstat_source",
  "from",
  "gclientid",
  "_ym_uid",
  "_ym_counter",
  "gclid",
  "yclid",
  "fbclid"
];

$(document).ready(function() {
	$('.card').each(function() {
		calculateProductPrice($(this));
	});

	$('[data-send-request]').on("click", function (e) {
		e.preventDefault();

		const form = $(this).closest('form');
		const inputPhone = form.find('[name="phone"]');
		const data = form.serializeArray();

		data.forEach(item => {
			if(item.name == "city") {
				item.value = get_url_params.region ? get_url_params.region : "moscov";
			}
		});

		if ($(inputPhone).inputmask("isComplete")) {
            utm_params.forEach(utm_label => {
              let utm_val = get_url_params[utm_label];
              console.log('utm_label', utm_label);
              if (utm_val) {
                console.log('utm_val', utm_val);
                data.push({ name: utm_label, value: utm_val});
              }
            });
    
			$.ajax({
				url: 'https://easymebel.com/amo/amoHook.php',
				type: 'POST',
				data: {data},
				success: (data) => {
					console.debug(data);
				},
				error: (error) => {
					console.debug(error);
				}
			});
		}

		form.submit();
	});

	$(document).on('click', '.card [data-price]:not(.active)', function() {
	    $(this).siblings().removeClass('active');
	    $(this).addClass('active');
	    if ($(this).parents('.swiper-container-initialized')) {
	        let slider = $(this).parents('.swiper-container'),
	            slideIndex = $(this).parents('.swiper-slide').data('swiper-slide-index'),
	            duplicates = slider.find('.swiper-slide[data-swiper-slide-index="'+slideIndex+'"]'),
	            parameter = $(this).data('parameter'),
	            parameterValue = $(this).data('parameter-value');
	        if (duplicates.length > 1) {
	            duplicates.find('[data-parameter="' + parameter + '"]').removeClass('active');
	            duplicates.find('[data-parameter="' + parameter + '"][data-parameter-value="' + parameterValue + '"]').addClass('active');
	        }
	    }
		calculateProductPrice($(this).parents('.card'));
	});

	new Swiper('.review__list', {
		slidesPerView: 'auto',
        centeredSlides: true,
		loop: true,
		slidePrevClass: 'review__item--prev',
		slideNextClass: 'review__item--next',
		slideActiveClass: 'review__item--center',
		navigation: {
			prevEl: '.review__btn-prev',
			nextEl: '.review__btn-next',
		}
	});

	const quiz = new Swiper('.quiz__question-list', {
		slidesPerView: "auto",
		allowTouchMove: false,
		autoHeight: true,
		navigation: {
			prevEl: '.quiz__prev',
			nextEl: '.quiz__next',
		},
		breakpoints: {
			768: {
				autoHeight: false
			}
		},
		on: {
			slideChange: function (s) {
				let index = s.realIndex,
					nextIndex = index + 1;
				if (nextIndex < 8) {
					$('.quiz__question').eq(index).find('input[type=radio]').prop('checked', false);
					$('.quiz__current-question').text(nextIndex);
					if ($('.quiz__tracker-item').eq(index).hasClass('quiz__tracker-item--active')) {
						$('.quiz__tracker-item').eq(nextIndex).removeClass('quiz__tracker-item--active');
					} else {
						$('.quiz__tracker-item').eq(index).addClass('quiz__tracker-item--active');
					}

				} else if (nextIndex == 8) {
					$('[data-finish-quiz]').each(function() {
						$(this).html($(this).data('finish-quiz'));
					});
				}
			},
		},
	});

	if ($(window).width() < 1024) {
		$('.card__gallery').each(function() {
			new Swiper($(this)[0], {
				loop: true,
				pagination: {
					el: $(this).find('.card__gallery-pagination')[0]
				},
				navigation: {
					prevEl: $(this).find('.card__gallery-btn-prev')[0],
					nextEl: $(this).find('.card__gallery-btn-next')[0],
				}
			});
		});
	} else {
		$('.card__img-container:nth-child(1), .card__gallery-pagination-item:nth-child(1)').addClass('active');

		$('.card__img-container').hover(function() {
			let index = $(this).index();
		    $(this).closest('.card').find('.card__gallery-pagination-item.active').removeClass('active');
		    $(this).closest('.card').find('.card__gallery-pagination-item').eq(index).addClass('active');
		    $(this).siblings().removeClass('active');
		    $(this).addClass('active');
		},
		function() {
		    $(this).closest('.card').find('.card__gallery-pagination-item.active').removeClass('active');
		    $(this).closest('.card').find('.card__gallery-pagination-item').eq(0).addClass('active');
		    $(this).removeClass('active');
		    $(this).parent().children(':nth-child(1)').addClass('active');
		});
	}

	if ($(window).width() > 480) {
		new Swiper('.showroom__gallery', {
			effect: 'fade',
			slidesPerView: 1,
	        centeredSlides: false,
			spaceBetween: 0,
			loop: false,
			navigation: {
				prevEl: '.showroom__gallery-btn-prev',
				nextEl: '.showroom__gallery-btn-next',
			}
		});
	} else {
		new Swiper('.showroom__gallery', {
			slidesPerView: 'auto',
	        centeredSlides: true,
			spaceBetween: 10,
			loop: true,
			navigation: {
				prevEl: '.showroom__gallery-btn-prev',
				nextEl: '.showroom__gallery-btn-next',
			}
		});
	}

	$(document).on('change', '.quiz__answer', function () {
		quiz.slideNext();
	});

	$(".phone-mask").inputmask("+7 (999) 999 - 99 - 99", {
        "oncomplete": function() {
            $(this).removeClass('incomplete');
            $(this).addClass('complete');
        },
        "onincomplete": function() {
            $(this).removeClass('complete');
            $(this).addClass('incomplete');
        }
    });

	$().fancybox({
		selector: '.review__item:not(.swiper-slide-duplicate) .review__link',
		backFocus: false,
		loop: true
	});

	$(document).on('click', '.review__item.swiper-slide-duplicate .review__link', function(e) {
		var $slides = $(this).parent().parent().children('.review__item:not(.swiper-slide-duplicate)').children('.review__link');
		$slides.eq( ( $(this).parent().attr("data-swiper-slide-index") || 0) % $slides.length ).trigger("click.fb-start", { $trigger: $(this) });
		return false;
	});

	$(document).on('click', '.anchor', function (e) {
        e.preventDefault();
        var id  = $(this).attr('href'),
            top = $(id).offset().top;
        $('body,html').animate({scrollTop: top}, 1500);
    });

    $(document).on('click', '[data-modal]', function (e) {
    	let modal = $(this).data('modal');
    	e.preventDefault();
    	if (modal == 'modalCatalog' || modal == 'modalCatalogOrder') {
    		let card = $(this).parents('.card'),
    			product = card.data('product-name'),
    			price = card.data('price'),
    			size = card.find('[data-parameter="size"].active').data('parameter-value'),
    			mechanism = card.find('[data-parameter="mechanism"].active').data('parameter-value');
    		$('#' + modal + ' [name=product_name]').val(product);
    		$('#' + modal + ' [name=price]').val(price);
    		$('#' + modal + ' [name=size]').val(size);
    		$('#' + modal + ' [name=mechanism]').val(mechanism);
    	}
    	$('#' + modal).arcticmodal();
    	if (modal == 'modalProducts') {
    		$('#modalProducts .card__gallery').each(function() {
				$(this)[0].swiper.update();
			});
    	}
    });

    $(document).on('click', '.show-more-btn', function (e) {
    	let container = $(this).siblings('.show-more-container');
    	e.preventDefault();
    	container.addClass('active');
    	container.css('height', container.children().innerHeight());
    	$(this).remove();
    });

    $(document).on('click', '.menu__btn', function() {
    	$(this).siblings('.menu__list').slideToggle();
    });

    $(document).on('submit', 'form', function (e) {
    	e.preventDefault();
    	leadSend($(this));
    });

    if ($(window).width() > 480) {
    	$('.care__text').unwrap();

    	$('.show-more-container').css('height', $(this).find('.card').eq(0).innerHeight() * 1.3);

	    $('.card-list').each(function() {
			new Swiper($(this)[0], {
				slidesPerView: 'auto',
				spaceBetween: 10,
				centeredSlides: true,
				loop: true,
				navigation: {
					prevEl: $(this).find('.card-list__btn-prev')[0],
					nextEl: $(this).find('.card-list__btn-next')[0]
				},
		        on: {
		            init: function () {
		                $('.card-list').find('.card').each(function() {
		            		calculateProductPrice($(this));
		            	});
		            }
		        }
			});
		});

		$('.card-list-container').css('height', $('.card-list-container').find('.card-list').eq(0).outerHeight() * 1.35);
    }

	function leadSend (form) {
	    form.find('.input--error').removeClass('input--error');
	        
	    if (!form.find('[name=phone]').hasClass('complete')) {
	        form.find('[name=phone]').addClass('input--error');
	    } else {
	        let cityField = form.find('[name=city]');
	        
	        cityField.val(cityField.data('city'));
	        
	        let msg = form.serialize();
	        
    	    $.ajax({
    	        type: "POST",
    	        url: "mail.php",
    	        data: msg,
    	        success: function(data) {
    	        	if (data == 'success') {
    			        try {
        			        ym(87990484,'reachGoal','lead');
    			        } catch (e) {
                            console.log('Не удалось отправить запрос.');
                        }
    		        	if (form.hasClass('quiz__question-list')) {
    		        		quiz.slideNext();
    		        	} else {
    			            $.arcticmodal('close');
    			            $('#modalThank').arcticmodal();
    			        }
    		        } else {
    		        	alert('Возникла ошибка! ' + data);
    		        }
    	        },
    	        error:  function(xhr, str){
    	            alert("Возникла ошибка! Попробуйте повторить отправку позже.");
    	        }
    	    });
	    }
	}

	function calculateProductPrice (product) {
		let activeOptions = product.find('[data-price].active'),
			containerOldPrice = product.find('.card__cost-old'),
			containerPrice = product.find('.card__cost'),
			resultOldPrice = 0,
			resultPrice = 0;

		activeOptions.each(function() {
			resultOldPrice += $(this).data('old-price');
			resultPrice += $(this).data('price');
		});
		if (containerOldPrice.length) {
	    	animateCount(containerOldPrice, resultOldPrice);
	    }
	    animateCount(containerPrice, resultPrice);
	    product.data('price', resultPrice);
	}

	function animateCount (container, result) {
		$({ countNum: parseInt(container.html().replace(/[&nbsp;\ ]/gi, '')) }).animate({
			countNum: result
		},
		{
			duration: 500,
			easing: "linear",
			step: function() {
				container.text(toRuLocale(Math.floor(this.countNum)));
			},
			complete: function() {
				container.text(toRuLocale(this.countNum));
			}
	    });
	}

	function toRuLocale(x) {
		return x.toLocaleString('ru');
	}
});