$('document').ready(function () {
	var i = 0;
	var opened = false;
	var emailIsSent = false;
	// On load figure out what is the max-content height of see-more section, so we could use it later
	document.getElementById("see-more").style.maxHeight = "max-content";
	var height = $('#see-more').outerHeight();
	// Set it back to normal
	document.getElementById("see-more").style.maxHeight = "35vh";
	// For smooth scrolling with scrollspy(Top navigation)
	// If header and footer navigations are put under the same click event, the offsets mix up and causes errors
	$("#nav-ul li a[href^='#']").on('click', function (event) {
		var target = this.hash;
		event.preventDefault();
		var navOffset = $('#nav-ul').height();
		return $('html, body').animate({
			scrollTop: $(this.hash).offset().top - navOffset
		}, 500, function () {
			return window.history.pushState(null, null, target);
		});
	});
	// For smooth scrolling with scrollspy(Footer navigation)
	$("#footer-nav-ul li a[href ^= '#']").on('click', function (event) {
		var target = this.hash;
		event.preventDefault();
		var navOffset = $('#footer-nav-ul').height();
		return $('html, body').animate({
			scrollTop: $(this.hash).offset().top - navOffset
		}, 500, function () {
			return window.history.pushState(null, null, target);
		});
	});
	// Popup on button click
	$(".button-projects").on('click', function (event) {
		// If the modal is pressed for the first time - GET it
		$("#modal" + this.id).addClass("active-pop");
		if ($("#modal" + this.id).attr("loaded") == "false") {
			loadModal(this.id);
			$("#modal" + this.id).attr("loaded", "true");
		}
		$('body').addClass("scroll-block");
		$('#slider' + this.id).resize(); // Due to the way flexslider is designed, if the parents width is unknown (display none'd), every slide is being given 0px of width
		$('#carousel' + this.id).resize(); // Therefore, if resized just after the modal popup, it gets the widths correctly. Also, stack overflow says to do so.
		setTimeout(function () { // This is spaghetti, but if you don't time out it for a little bit it doesn't animate..
			$('.modal-pop').addClass("revealing-pop");
		}, 1);
	});
	// Popup close on ESC press
	$(document).keyup(function (e) {
		if (e.keyCode = 27) { // ESC key
			$('.modal-pop').removeClass("revealing-pop");
			$('.modal-pop').addClass("removing-pop");
			setTimeout(function () {
				$('.modal-pop').removeClass("active-pop");
				$('body').removeClass("scroll-block");
				$('.modal-pop').removeClass("removing-pop");
			}, 750);
		}
	});
	// "See more" section expansion w/ animations
	$('.see-more-btn').on('click', function (event) {
		// Setting the max-height value to the max-content value (If you set straight maxheight = "max-content", then transition (animation) doesn't work.)
		document.getElementById("see-more").style.maxHeight = height + "px";
		$('fade').addClass('hide');
		document.getElementById("see-more-text").innerHTML = "Show less";
		if (i == 0) {
			i = 1;
		} else {
			document.getElementById("see-more").style.maxHeight = "35vh";
			$('fade').removeClass('hide');
			document.getElementById("see-more-text").innerHTML = "Show more";
			i = 0;
		}
	});
	// Mimicing a <a> click on landing page's button
	$('#video-btn').on('click', function (event) {
		document.getElementById('video-btn-a').click();
	});
	// Revealing an element when in viewport
	window.addEventListener('scroll', function (e) {
		if (isinViewPort($('.reveal'))) { //Passing an element that I want to check
			$(".reveal").addClass('revealed');
		}
	});
	// Mobile navbar logic
	$(".openNav").click(function (event) {
		if (!opened) {
			$('.sideBar').addClass('navToggle');
			$('body').addClass("scroll-block");
			$('.openNav').addClass('active');
			opened = true;
		} else {
			$('.sideBar').removeClass('navToggle');
			$('body').removeClass("scroll-block");
			$('.openNav').removeClass('active');
			opened = false;
		}
	});
	// Closes the sidebar when <a> tag is clicked
	$("#sideBar-ul li a[href^='#']").click(function (event) {
		$(".openNav").trigger("click");
	});
	// Data validation 
	$('.contact-btn').on('click', function (event) {
		console.log(emailIsSent);
		if (!emailIsSent) {
			var validated = true;
			if (!validateText('name')) {
				$('#err-name').css("display", "block");
				validated = false;
			} else {
				$('#err-name').css("display", "none");
			}
			if (!validateEmail('email')) {
				$('#err-email').css("display", "block");
				validated = false;
			} else {
				$('#err-email').css("display", "none");
			}
			if (!validateText('message')) {
				$('#err-msg').css("display", "block");
				validated = false;
			} else {
				$('#err-msg').css("display", "none");
			}
			if (validated) {
				sendEmail(String(document.getElementById('email').value));
			}
		}
	});
});

function openAdventures() {
	//Simulate project's, related to recent adventures, "more" click
	$("#\\34").click();
}

function isinViewPort(element) {
	if (element.length == 0) {
		return; //If the passed element doesn't exist, return.
	}
	var $window = $(window);
	var screenTop = $window.scrollTop();
	var screenHeight = screen.height;
	var screenBottom = screenHeight + screenTop;
	var $element = $(element);
	var top = $element.offset().top;
	var height = $element.height();
	var bottom = top + height;
	return (bottom <= screenBottom);
}

function validateText(name) {
	if (document.getElementById(name).value == "") {
		return false;
	} else {
		return true;
	}
}

function validateEmail(id) {
	var email = String(document.getElementById(id).value);
	var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return regex.test(email);
}

function sendEmail(email) {
	// Just so it wouldn't be visible to spam bots:D
	var who = "vytenisd";
	var at = '@';
	var where = 'hotmail.com';
	Email.send(who + at + where,
		who + at + where,
		"Contact form on portfolio website, Name : " + document.getElementById('name').value + " , Sender: " + email,
		document.getElementById('message').value, {
			token: "31e69309-baa6-4455-bc10-0b0f9b42e2c7",
			callback: function done() {
				document.getElementById('send').innerHTML = "Email has been sent";
				$('#send').css("cursor", "default");
				emailIsSent = true;
			}
		});
}

function loadModal(id) {
	var element, file, xhttp;
	element = document.getElementById("modal" + id);
	file = "../modules/modal" + id + ".html";
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4) {
			if (this.status == 200) {
				element.innerHTML = this.responseText;

				$.getScript("js/flexslider.js");


			} else if (this.status == 404) {
				element.innerHTML = "Page not found.";
			}
		}
	}
	xhttp.open("GET", file, true);
	xhttp.send();
	/*exit the function:*/
	return;
}

function closeModal() {
	$('body').removeClass("scroll-block");
	$('.modal-pop').removeClass("revealing-pop");
	$('.modal-pop').addClass("removing-pop");
	setTimeout(function () {
		$('.modal-pop').removeClass("active-pop");
		$('.modal-pop').removeClass("removing-pop");
	}, 750);
};