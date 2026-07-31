/* oss contributions listing — embedded in index.html #oss section */
(function(){
  "use strict";

  var logEl = document.getElementById('oss-commit-log');
  var filterRow = document.getElementById('oss-filter-row');
  if (!logEl || !filterRow) return;

  var allItems = [];
  var activeStatus = 'all';

  function fmtDate(iso){
    var d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-US', { year:'numeric', month:'short', day:'2-digit' });
  }

  function statusLabel(s){
    if (s === 'merged') return 'merged';
    if (s === 'review') return 'in review';
    return 'open';
  }

  function render(){
    var filtered = activeStatus === 'all'
      ? allItems
      : allItems.filter(function(i){ return i.status === activeStatus; });

    if (filtered.length === 0){
      logEl.innerHTML = '<div class="empty-state">nothing in this filter yet.</div>';
      return;
    }

    logEl.innerHTML = filtered.map(function(i){
      var tags = (i.tags||[]).map(function(t){ return '<span class="tag-pill">#'+t+'</span>'; }).join('');
      return (
        '<article class="commit">' +
          '<div class="repo-line">' +
            '<a class="repo" href="' + i.repo_url + '" target="_blank" rel="noopener">' + i.repo + '</a>' +
            '<span class="status-pill ' + i.status + '">' + statusLabel(i.status) + '</span>' +
          '</div>' +
          '<p class="desc">' + i.title + '</p>' +
          '<div class="commit-meta">' +
            '<span>' + fmtDate(i.date) + '</span>' +
            '<span class="diffstat"><span class="add">+' + i.additions + '</span> <span class="rem">−' + i.deletions + '</span></span>' +
            '<a href="' + i.pr_url + '" target="_blank" rel="noopener">view →</a>' +
          '</div>' +
          (tags ? '<div class="tags" style="margin-top:.6rem;">' + tags + '</div>' : '') +
        '</article>'
      );
    }).join('');
  }

  function renderStats(){
    var merged = allItems.filter(function(i){ return i.status === 'merged'; }).length;
    var open = allItems.filter(function(i){ return i.status !== 'merged'; }).length;
    var repos = new Set(allItems.map(function(i){ return i.repo; })).size;
    document.getElementById('oss-stat-merged').textContent = merged;
    document.getElementById('oss-stat-open').textContent = open;
    document.getElementById('oss-stat-repos').textContent = repos;
  }

  filterRow.addEventListener('click', function(e){
    var btn = e.target.closest('.filter-chip');
    if (!btn) return;
    Array.from(filterRow.children).forEach(function(c){ c.classList.remove('active'); });
    btn.classList.add('active');
    activeStatus = btn.getAttribute('data-status');
    render();
  });

  fetch('data/oss.json')
    .then(function(res){
      if (!res.ok) throw new Error('failed to load oss.json');
      return res.json();
    })
    .then(function(items){
      allItems = items.slice().sort(function(a,b){ return new Date(b.date) - new Date(a.date); });
      renderStats();
      render();
    })
    .catch(function(err){
      logEl.innerHTML = '<div class="empty-state">could not load oss.json — if you opened this file directly ' +
        '(file://), fetch() is blocked by the browser. Run a local server, e.g. <code>python3 -m http.server</code>, ' +
        'and open via http://localhost:8000/index.html instead.</div>';
      console.error(err);
    });
})();
