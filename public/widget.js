(function() {
  var s = document.currentScript;
  var slug = s && s.getAttribute('data-business');
  if (!slug) return;

  var base = s.src.replace('/widget.js', '');

  var c = document.createElement('div');
  c.id = 'rw-widget';
  c.innerHTML = '<style>' +
    '#rw-btn{position:fixed;right:20px;bottom:20px;z-index:999998;width:56px;height:56px;border-radius:50%;border:none;cursor:pointer;background:#00a884;color:#fff;font-size:26;box-shadow:0 4px 16px rgba(0,168,132,0.3);transition:all 250ms cubic-bezier(0.4,0,0.2,1);display:flex;align-items:center;justify-content:center;}' +
    '#rw-btn:hover{transform:scale(1.08);box-shadow:0 6px 24px rgba(0,168,132,0.4);}' +
    '#rw-btn:active{transform:scale(0.95);}' +
    '#rw-panel{position:fixed;right:20px;bottom:88px;z-index:999999;width:360px;max-height:520px;background:#111b21;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,0.5);border:1px solid #2a3942;overflow:hidden;display:none;flex-direction:column;animation:rw-slide-up 250ms cubic-bezier(0.4,0,0.2,1);}' +
    '@keyframes rw-slide-up{from{opacity:0;transform:translateY(12px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}' +
    '#rw-panel.open{display:flex;}' +
    '#rw-header{background:linear-gradient(180deg,#1f2c33,#1a2830);padding:14px 16px;display:flex;align-items:center;gap:10;border-bottom:1px solid #2a3942;}' +
    '#rw-avatar{width:32px;height:32px;border-radius:50%;background:#00a884;display:flex;align-items:center;justify-content:center;font-size:14;font-weight:700;color:#fff;flex-shrink:0;}' +
    '#rw-header-text p:first-child{font-weight:600;font-size:14;color:#e9edef;margin:0;}' +
    '#rw-header-text p:last-child{font-size:11;color:#8696a0;margin:0;}' +
    '#rw-body{flex:1;overflow-y:auto;padding:14px;background:#0b141a;display:flex;flex-direction:column;gap:8;min-height:120;}' +
    '#rw-body::-webkit-scrollbar{width:4px;}' +
    '#rw-body::-webkit-scrollbar-track{background:transparent;}' +
    '#rw-body::-webkit-scrollbar-thumb{background:#313d45;border-radius:2px;}' +
    '#rw-empty{padding:32px 20px;text-align:center;}' +
    '#rw-empty p:first-child{font-size:32;margin-bottom:8;}' +
    '#rw-empty p:last-child{font-size:13;color:#667781;margin:0;}' +
    '.rw-bubble{max-width:88%;align-self:flex-start;background:#1f2c33;border-radius:4px 14px 14px 14px;padding:9px 13px;border-left:3px solid rgba(0,168,132,0.3);box-shadow:0 1px 1px rgba(0,0,0,0.15);}' +
    '.rw-name{font-weight:600;font-size:12;color:#00a884;margin-bottom:3;}' +
    '.rw-stars{color:#f59e0b;font-size:10;letter-spacing:1.5px;}' +
    '.rw-text{font-size:12;color:#e9edef;margin:3px 0 0;line-height:1.4;}' +
    '#rw-footer{padding:0;border-top:1px solid #2a3942;}' +
    '#rw-write-btn{width:100%;padding:13px;border:none;background:#1f2c33;color:#00a884;font-size:13;font-weight:600;cursor:pointer;transition:all 150ms;}' +
    '#rw-write-btn:hover{background:#253641;}' +
    '#rw-form{padding:10px 14px 12px;background:#1f2c33;display:none;flex-direction:column;gap:8;}' +
    '#rw-form input,#rw-form textarea{width:100%;padding:9px 12px;border-radius:10;border:1.5px solid #313d45;font-size:13;color:#e9edef;outline:none;background:#111b21;box-sizing:border-box;font-family:inherit;transition:border-color 200ms;}' +
    '#rw-form input:focus,#rw-form textarea:focus{border-color:#00a884;}' +
    '#rw-form textarea{resize:none;min-height:60;}' +
    '#rw-form button{padding:10px;border:none;border-radius:10;background:#00a884;color:#fff;font-size:13;font-weight:600;cursor:pointer;transition:all 150ms;}' +
    '#rw-form button:hover{background:#00c392;}' +
    '#rw-close{position:absolute;top:12;right:12;width:28px;height:28px;border-radius:50%;border:none;background:rgba(134,150,160,0.15);color:#8696a0;font-size:14;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 150ms;}' +
    '#rw-close:hover{background:rgba(134,150,160,0.25);color:#e9edef;}' +
    '</style>' +
    '<button id="rw-btn">&#9733;</button>' +
    '<div id="rw-panel">' +
      '<div id="rw-header">' +
        '<div id="rw-avatar">&#9733;</div>' +
        '<div id="rw-header-text"><p>Leave a Review</p><p>Share your experience</p></div>' +
        '<button id="rw-close">&times;</button>' +
      '</div>' +
      '<div id="rw-body">' +
        '<div id="rw-empty"><p>&#128240;</p><p>No reviews yet. Be the first to share your experience!</p></div>' +
      '</div>' +
      '<div id="rw-footer">' +
        '<button id="rw-write-btn">&#9998; Write a review</button>' +
        '<div id="rw-form">' +
          '<input id="rw-name" placeholder="Your name" />' +
          '<div style="display:flex;gap:3;padding:4px 0;justify-content:center">' +
            '<span class="rw-star" data-v="1" style="font-size:22;cursor:pointer;color:#313d45;transition:color 150ms">&#9733;</span>' +
            '<span class="rw-star" data-v="2" style="font-size:22;cursor:pointer;color:#313d45;transition:color 150ms">&#9733;</span>' +
            '<span class="rw-star" data-v="3" style="font-size:22;cursor:pointer;color:#313d45;transition:color 150ms">&#9733;</span>' +
            '<span class="rw-star" data-v="4" style="font-size:22;cursor:pointer;color:#313d45;transition:color 150ms">&#9733;</span>' +
            '<span class="rw-star" data-v="5" style="font-size:22;cursor:pointer;color:#313d45;transition:color 150ms">&#9733;</span>' +
          '</div>' +
          '<textarea id="rw-review" placeholder="Write your review..." rows="2"></textarea>' +
          '<button id="rw-submit">&#10148; Send review</button>' +
        '</div>' +
      '</div>' +
    '</div>';

  document.body.appendChild(c);
  var p = document.getElementById('rw-panel');
  var btn = document.getElementById('rw-btn');
  var close = document.getElementById('rw-close');
  var writeBtn = document.getElementById('rw-write-btn');
  var form = document.getElementById('rw-form');
  var body = document.getElementById('rw-body');

  var rating = 0;
  var stars = form.querySelectorAll('.rw-star');
  for (var i = 0; i < stars.length; i++) {
    (function(el) {
      el.addEventListener('click', function() {
        rating = parseInt(el.getAttribute('data-v'));
        for (var j = 0; j < stars.length; j++) {
          stars[j].style.color = (j < rating) ? '#25d366' : '#313d45';
        }
      });
    })(stars[i]);
  }

  btn.addEventListener('click', function() {
    var isOpen = p.classList.contains('open');
    p.classList.toggle('open');
    btn.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(45deg)';
    if (!isOpen) loadReviews();
  });

  close.addEventListener('click', function() {
    p.classList.remove('open');
    btn.style.transform = 'rotate(0deg)';
    form.style.display = 'none';
    writeBtn.style.display = 'block';
  });

  writeBtn.addEventListener('click', function() {
    writeBtn.style.display = 'none';
    form.style.display = 'flex';
  });

  document.getElementById('rw-submit').addEventListener('click', function() {
    var name = document.getElementById('rw-name').value.trim();
    var review = document.getElementById('rw-review').value.trim();
    if (!name || !review || rating === 0) { alert('Fill all fields'); return; }
    fetch(base + '/api/submit-review', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({business_slug:slug, customer_name:name, rating:rating, review_text:review, source:'widget'})
    }).then(function(r) {
      if (!r.ok) throw new Error();
      form.style.display = 'none'; writeBtn.style.display = 'block';
      rating = 0;
      for (var j = 0; j < stars.length; j++) stars[j].style.color = '#313d45';
      document.getElementById('rw-name').value = '';
      document.getElementById('rw-review').value = '';
      loadReviews();
    }).catch(function() { alert('Something went wrong. Try again.'); });
  });

  function loadReviews() {
    fetch(base + '/api/reviews?slug=' + slug).then(function(r) { return r.json(); }).then(function(d) {
      body.innerHTML = '';
      if (!d.reviews || d.reviews.length === 0) {
        body.innerHTML = '<div id="rw-empty"><p>&#128240;</p><p>No reviews yet. Be the first to share your experience!</p></div>';
        return;
      }
      for (var i = 0; i < d.reviews.length; i++) {
        var rw = d.reviews[i];
        if (!rw.is_approved) continue;
        var bubble = document.createElement('div');
        bubble.className = 'rw-bubble';
        bubble.innerHTML = '<div class="rw-name">' + escape(rw.customer_name) + ' <span class="rw-stars">' + '&#9733;'.repeat(rw.rating) + '</span></div>' +
          '<div class="rw-text">' + escape(rw.review_text) + '</div>';
        body.appendChild(bubble);
      }
    });
  }

  function escape(t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
})();
