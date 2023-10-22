; (function (w, d) {
	function R() {
		this.dom = typeof arguments[0] == 'object' ? [arguments[0]] : d.querySelectorAll(arguments[0]);
		this.s = {
			number: null,
			width: null,
			bgColor: null,
			rotateColor: null,
			space: 10,
			speed: 1000,
			hide: false
		};
	};
	R.prototype = {
		init: function (o) {
			var t = this;
			this.extend(this.s, o);
			this.create();
			;[].forEach.call(this.dom, function (o) {
				var n = t.s.number ? t.s.number : o.dataset.num;
				if (!n) { alert('no number'); return }
				var num = 'rotate(' + n * 1.8 + 'deg)';
				var s = 4;
				if (+n == 0 && n < 96) { s = 0; };
				if (n >= 96 && n < 100) { s = 1 } else if (n >= 100) { s = 0 };
				var num2 = 'rotate(' + (n * 1.8 + s) + 'deg)';
				o.querySelector('.progress').innerHTML = t.s.show;
				var dom1 = o.querySelector('.rotate-f');
				var dom2 = o.querySelector('.rotate-f .rotate-c');
				var dom3 = o.querySelector('.rotate-h .rotate-c');
				t.trans2(dom1, 'transform: rotate(0deg);');
				t.trans2(dom2, 'transform: rotate(0deg);');
				t.trans2(dom3, 'transform: rotate(0deg);');
				t.trans(dom1, 0); t.trans(dom2, 0); t.trans(dom3, 0);
				var dom4 = o.querySelector('.rotate-h');
				if (t.s.rotateColor) {
					dom2.style.background = dom3.style.background = t.s.rotateColor;
				};
				dom1.style.clip = dom4.style.clip = 'rect(0, ' + o.offsetWidth + 'px, ' + o.offsetWidth + 'px,' + o.offsetWidth / 2 + 'px)';

				setTimeout(function () {
					t.trans(dom1, t.s.speed / 1000); t.trans(dom2, t.s.speed / 1000); t.trans(dom3, t.s.speed / 1000);
					t.trans2(dom1, num); t.trans2(dom2, num);
					t.trans2(dom3, num2);
				}, 16);
			});
		},
		trans: function (o, s) {
			o.style.transition = o.style.MozTransition = o.style.WebkitTransition = 'all ' + s + 's ease-in-out';
		},
		trans2: function (o, s) {
			o.style.transform = o.style.MozTransform = o.style.WebkitTransform = s;
		},
		create: function () {
			var t = this;
			;[].forEach.call(this.dom, function (o) {
				if (t.s.width) {
					o.style.width = t.s.width + (t.s.width.toString().indexOf('%') > 0 ? '' : 'px');
					o.style.width = (o.offsetWidth % 2 == 0 ? o.offsetWidth : (o.offsetWidth + 1)) + 'px';
					o.style.height = o.offsetWidth + 'px';
				};
				if (t.s.bgColor) {
					o.style.background = t.s.bgColor;
				};
				if (!o.querySelector('.rotate-h')) {
					o.classList.add('progress-circle');
					o.insertAdjacentHTML("beforeend", '<span class="rotate-h"><span class="rotate-c"></span></span><span class="rotate-f"><span class="rotate-c"></span></span><span class="progress"></span>');
				};
				var pro = o.querySelector('.progress');
				if (t.s.space) {
					pro.style.width = pro.style.height = (o.offsetWidth - Math.floor(t.s.space * 2)) + 'px';
				};
				pro.style.opacity = t.s.hide ? 0 : 1
				pro.style.lineHeight = (o.offsetWidth - t.s.space * 2) + 'px';

			});
		},
		extend: function (n, n1) {
			for (var i in n1) { n[i] = n1[i] };
		}
	};
	function r(o) { return new R(o) }; w.rotate = r;
})(window, document);