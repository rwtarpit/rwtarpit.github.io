/* blog listing — embedded in index.html #blog section */
(function(){
  "use strict";

  var listEl = document.getElementById('blog-post-list');
  var filterRow = document.getElementById('blog-filter-row');
  if (!listEl || !filterRow) return;

  var allPosts = [];
  var activeTag = 'all';

  function fmtDate(iso){
    var d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-US', { year:'numeric', month:'short', day:'2-digit' });
  }

  function render(){
    var filtered = activeTag === 'all'
      ? allPosts
      : allPosts.filter(function(p){ return (p.tags||[]).indexOf(activeTag) !== -1; });

    if (filtered.length === 0){
      listEl.innerHTML = '<div class="empty-state">no posts tagged "' + activeTag + '" yet.</div>';
      return;
    }

    listEl.innerHTML = filtered.map(function(p){
      var tags = (p.tags||[]).map(function(t){ return '<span class="tag-pill">#'+t+'</span>'; }).join('');
      return (
        '<a class="post-row" href="' + p.slug + '">' +
          '<div class="meta-line">' +
            '<span class="date">' + fmtDate(p.date) + '</span>' +
            '<h3>' + p.title + '</h3>' +
          '</div>' +
          '<p class="excerpt">' + p.excerpt + '</p>' +
          (tags ? '<div class="tags">' + tags + '</div>' : '') +
        '</a>'
      );
    }).join('');
  }

  function buildFilters(){
    var tagSet = {};
    allPosts.forEach(function(p){ (p.tags||[]).forEach(function(t){ tagSet[t] = true; }); });
    var tags = Object.keys(tagSet).sort();

    tags.forEach(function(t){
      var btn = document.createElement('button');
      btn.className = 'filter-chip';
      btn.setAttribute('data-tag', t);
      btn.textContent = t;
      filterRow.appendChild(btn);
    });

    filterRow.addEventListener('click', function(e){
      var btn = e.target.closest('.filter-chip');
      if (!btn) return;
      Array.from(filterRow.children).forEach(function(c){ c.classList.remove('active'); });
      btn.classList.add('active');
      activeTag = btn.getAttribute('data-tag');
      render();
    });
  }

  fetch('data/posts.json')
    .then(function(res){
      if (!res.ok) throw new Error('failed to load posts.json');
      return res.json();
    })
    .then(function(posts){
      allPosts = posts.slice().sort(function(a,b){ return new Date(b.date) - new Date(a.date); });
      buildFilters();
      render();
    })
    .catch(function(err){
      listEl.innerHTML = '<div class="empty-state">could not load posts.json — if you opened this file directly ' +
        '(file://), fetch() is blocked by the browser. Run a local server, e.g. <code>python3 -m http.server</code>, ' +
        'and open via http://localhost:8000/index.html instead.</div>';
      console.error(err);
    });
})();
