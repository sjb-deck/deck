/** @format */

function inventory() {
	window.location = "/inventory";
}
function portal() {
	window.location.href = "https://nhhs-sjb.org/";
}
function go() {
	if (
		document.querySelector(".screen.active").querySelector("div").className ==
		"media books"
	) {
		window.location = "/inventory";
	} else if (
		document.querySelector(".screen.active").querySelector("div").className ==
		"media files"
	) {
		window.location.href = "https://nhhs-sjb.org/";
	}
}
jQuery(document).ready(function initiator($) {
	$(".search-button").parent().toggleClass("open");
	let check = false;
	(function (a) {
		if (
			/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
				a
			) ||
			/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
				a.substr(0, 4)
			)
		)
			check = true;
	})(navigator.userAgent || navigator.vendor || window.opera);
	/** 
  if (check) {
    document.getElementById("slideshow-container").style.display = "none";
    document.getElementById("slideshow-container").innerHTML = "";
    document.getElementById("mobile").style.display = "block";
    document.getElementById("user_list_mobile").style.display = "flex";
    document.getElementById("user_list").style.display = "none";
  }*/
});
var slideshow_container = document.getElementById("slideshow-container"),
	slides_container = document.getElementById("slides-container"),
	previous_arrow = document.getElementById("previous-arrow"),
	next_arrow = document.getElementById("next-arrow");

$(document).ready(function () {
	slideshow_container.classList.add("animation-reveal");
	$(".text").css("opacity", "0");
	$(".image").css("opacity", "0");
	$(".image1").css("opacity", "0");
	$(".image2").css("opacity", "0");
	$(".previous-arrow").css("opacity", "0");
	$(".next-arrow").css("opacity", "0");
	setTimeout(() => {
		slideshow_container.classList.remove("animation-reveal");
		$(".text").css("opacity", "1");
		$(".image").css("opacity", "1");
		$(".image1").css("opacity", "1");
		$(".image2").css("opacity", "1");
		$(".previous-arrow").css("opacity", "0.8");
		$(".next-arrow").css("opacity", "0.8");
	}, 1000);
});

const bg_color_options = ["#88D3CE", "#141414"];
const text_color_options = ["#000", "#fff"];
const arrow_color_options = [
	"data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 256 256'%3E%3Cpolygon points='225.813,48.907 128,146.72 30.187,48.907 0,79.093 128,207.093 256,79.093' fill='%23000'%3E%3C/polygon%3E%3C/svg%3E",
	"data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 256 256'%3E%3Cpolygon points='225.813,48.907 128,146.72 30.187,48.907 0,79.093 128,207.093 256,79.093' fill='%23fff'%3E%3C/polygon%3E%3C/svg%3E",
	"data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 256 256'%3E%3Cpolygon points='225.813,48.907 128,146.72 30.187,48.907 0,79.093 128,207.093 256,79.093' fill='%23fff'%3E%3C/polygon%3E%3C/svg%3E",
	"data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 256 256'%3E%3Cpolygon points='225.813,48.907 128,146.72 30.187,48.907 0,79.093 128,207.093 256,79.093' fill='%23fff'%3E%3C/polygon%3E%3C/svg%3E",
];
var k = 0;

function slide(
	slideshow_container,
	slides_container,
	previous_arrow,
	next_arrow
) {
	var posX1 = 0,
		posX2 = 0,
		posInitial,
		posFinal,
		threshold = 100,
		slides = slides_container.getElementsByClassName("slide"),
		slidesLength = slides.length,
		slideSize = slides_container.getElementsByClassName("slide")[0].offsetWidth,
		firstSlide = slides[0],
		lastSlide = slides[slidesLength - 1],
		cloneFirst = firstSlide.cloneNode(true),
		cloneLast = lastSlide.cloneNode(true),
		index = 0,
		allowShift = true;

	slides_container.appendChild(cloneFirst);
	slides_container.insertBefore(cloneLast, firstSlide);
	slideshow_container.classList.add("loaded");

	slides_container.onmousedown = dragStart;

	slides_container.addEventListener("touchstart", dragStart);
	slides_container.addEventListener("touchend", dragEnd);
	slides_container.addEventListener("touchmove", dragAction);

	slideshow_container.style.background = bg_color_options[k];

	$(".previous-arrow").css(
		"background-image",
		'url("' + arrow_color_options[k] + '")'
	);
	$(".next-arrow").css(
		"background-image",
		'url("' + arrow_color_options[k] + '")'
	);
	$(".text").css("color", text_color_options[k]);

	previous_arrow.addEventListener("click", function () {
		shiftSlide(-1);
		mouse.moved = false;

		slideshow_container.classList.add("animation-next");
		setTimeout(() => {
			slideshow_container.classList.remove("animation-next");
		}, 650);

		if (k === 0) {
			k = bg_color_options.length;
		}
		k = k - 1;
		slideshow_container.style.background = bg_color_options[k];
		document
			.querySelector('meta[name="theme-color"]')
			.setAttribute("content", bg_color_options[k]);
		$(".previous-arrow").css(
			"background-image",
			'url("' + arrow_color_options[k] + '")'
		);
		$(".next-arrow").css(
			"background-image",
			'url("' + arrow_color_options[k] + '")'
		);
		$(".text").css("color", text_color_options[k]);
	});

	next_arrow.addEventListener("click", function () {
		shiftSlide(1);
		mouse.moved = false;

		slideshow_container.classList.add("animation-previous");
		setTimeout(() => {
			slideshow_container.classList.remove("animation-previous");
		}, 650);

		k = k + 1;
		k = k % bg_color_options.length;
		slideshow_container.style.background = bg_color_options[k];
		document
			.querySelector('meta[name="theme-color"]')
			.setAttribute("content", bg_color_options[k]);
		$(".previous-arrow").css(
			"background-image",
			'url("' + arrow_color_options[k] + '")'
		);
		$(".next-arrow").css(
			"background-image",
			'url("' + arrow_color_options[k] + '")'
		);
		$(".text").css("color", text_color_options[k]);
	});

	slides_container.addEventListener("transitionend", checkIndex);

	function dragStart(e) {
		e = e || window.event;
		e.preventDefault();
		posInitial = slides_container.offsetLeft;

		if (e.type == "touchstart") {
			posX1 = e.touches[0].clientX;
		} else {
			posX1 = e.clientX;
			document.onmouseup = dragEnd;
			document.onmousemove = dragAction;
		}
	}

	function dragAction(e) {
		e = e || window.event;

		if (e.type == "touchmove") {
			posX2 = posX1 - e.touches[0].clientX;
			posX1 = e.touches[0].clientX;
		} else {
			posX2 = posX1 - e.clientX;
			posX1 = e.clientX;
		}
		/** slides_container.style.left =
			slides_container.offsetLeft - posX2 + "px";*/
	}

	function dragEnd(e) {
		posFinal = slides_container.offsetLeft;
		if (posFinal - posInitial < -threshold) {
			shiftSlide(1, "drag");
			slideshow_container.classList.add("animation-previous");
			setTimeout(() => {
				slideshow_container.classList.remove("animation-previous");
			}, 650);
			k = k + 1;
			k = k % bg_color_options.length;
			slideshow_container.style.background = bg_color_options[k];
			document
				.querySelector('meta[name="theme-color"]')
				.setAttribute("content", bg_color_options[k]);
			$(".previous-arrow").css(
				"background-image",
				'url("' + arrow_color_options[k] + '")'
			);
			$(".next-arrow").css(
				"background-image",
				'url("' + arrow_color_options[k] + '")'
			);
			$(".text").css("color", text_color_options[k]);
		} else if (posFinal - posInitial > threshold) {
			shiftSlide(-1, "drag");
			slideshow_container.classList.add("animation-next");
			setTimeout(() => {
				slideshow_container.classList.remove("animation-next");
			}, 650);
			if (k === 0) {
				k = bg_color_options.length;
			}
			k = k - 1;
			slideshow_container.style.background = bg_color_options[k];
			document
				.querySelector('meta[name="theme-color"]')
				.setAttribute("content", bg_color_options[k]);
			$(".previous-arrow").css(
				"background-image",
				'url("' + arrow_color_options[k] + '")'
			);
			$(".next-arrow").css(
				"background-image",
				'url("' + arrow_color_options[k] + '")'
			);
			$(".text").css("color", text_color_options[k]);
		} else {
			slides_container.style.left = posInitial + "px";
		}

		document.onmouseup = null;
		document.onmousemove = null;
	}

	function shiftSlide(direction, action) {
		slides_container.classList.add("shifting");

		if (allowShift) {
			if (!action) {
				posInitial = slides_container.offsetLeft;
			}

			if (direction == 1) {
				slides_container.style.left = posInitial - slideSize + "px";
				index++;
			} else if (direction == -1) {
				slides_container.style.left = posInitial + slideSize + "px";
				index--;
			}
		}

		allowShift = false;
	}

	function checkIndex() {
		slides_container.classList.remove("shifting");

		if (index == -1) {
			slides_container.style.left = -(slidesLength * slideSize) + "px";
			index = slidesLength - 1;
		}

		if (index == slidesLength) {
			slides_container.style.left = -(1 * slideSize) + "px";
			index = 0;
		}

		allowShift = true;
	}
}
slide(slideshow_container, slides_container, previous_arrow, next_arrow);

//---___---___---___---___---___---___---___---___---//
var slideshow_parameters = $(".slideshow-container")[0].getBoundingClientRect();
var mouse = { x: 0, y: 0, moved: false };

$(".slideshow-container").mousemove(function (e) {
	mouse.moved = true;
	mouse.x = e.clientX - slideshow_parameters.left;
	mouse.y = e.clientY - slideshow_parameters.top;
});

$(".slideshow-container").mouseleave(function (e) {
	mouse.moved = false;
	mouse.x = e.clientX - slideshow_parameters.left;
	mouse.y = e.clientY - slideshow_parameters.top;
});

TweenLite.ticker.addEventListener("tick", function () {
	if (mouse.moved) {
		parallaxIt(".image-container", 25);
		parallaxIt(".text", -65);
	} else if (!mouse.moved) {
		parallaxIt(".image-container", 0);
		parallaxIt(".text", 0);
	}
});

function parallaxIt(target, movement) {
	TweenMax.to(target, 0.3, {
		x:
			((mouse.x - slideshow_parameters.width / 2) /
				slideshow_parameters.width /
				2) *
			movement,
		y:
			((mouse.y - slideshow_parameters.height / 2) /
				slideshow_parameters.height /
				2) *
			movement,
	});
}