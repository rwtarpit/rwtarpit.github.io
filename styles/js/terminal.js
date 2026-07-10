/* boot sequence + interactive terminal — index.html only (the signature element) */
(function(){
  "use strict";
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var bootLines = [
    { text: "$ ssh guest@portfolio.dev", cls: "" },
    { text: "Last login: " + new Date().toDateString() + " from 127.0.0.1", cls: "dim" },
    { text: "Initializing profile...", cls: "dim" },
    { text: "[OK] loading kernels", cls: "ok" },
    { text: "[OK] mounting /dev/gpu0", cls: "ok" },
    { text: "[OK] starting inference-engine.service", cls: "ok" },
    { text: "[OK] starting scheduler.service", cls: "ok" },
    { text: "profile ready.", cls: "" }
  ];

  var bootEl = document.getElementById('boot-sequence');
  var form = document.getElementById('term-form');
  var termInput = document.getElementById('term-input');
  var output = document.getElementById('term-output');

  function typeLine(lineObj, done){
    var p = document.createElement('div');
    p.className = 'boot-line ' + (lineObj.cls || '');
    bootEl.appendChild(p);
    if (reduceMotion){
      p.textContent = lineObj.text;
      done();
      return;
    }
    var i = 0;
    var text = lineObj.text;
    var speed = 12;
    (function step(){
      p.textContent = text.slice(0, i);
      i++;
      if (i <= text.length){
        setTimeout(step, speed);
      } else {
        done();
      }
    })();
  }

  function runBoot(idx){
    if (idx >= bootLines.length){
      if (termInput) termInput.focus();
      return;
    }
    typeLine(bootLines[idx], function(){
      setTimeout(function(){ runBoot(idx+1); }, reduceMotion ? 0 : 90);
    });
  }

  var commands = {
    help: function(){
      return [
        "available commands:",
        "  whoami        — who runs this terminal",
        "  skills        — core focus areas",
        "  about         — jump to the about section",
        "  blog          — go to the blog",
        "  oss           — go to oss contributions",
        "  contact       — how to reach me",
        "  clear         — clear this terminal",
        "  sudo make me a sandwich"
      ].join("\n");
    },
    whoami: function(){
      return "an ML systems engineer who spends most days closer to CUDA than to a Jupyter notebook.";
    },
    skills: function(){
      return [
        "cuda-kernels          fused attention, custom ops",
        "inference-serving      batching, scheduling, kv-cache",
        "distributed-training   tensor / pipeline parallelism",
        "memory-management      paging, quantization",
        "model-architectures    attention variants, moe"
      ].join("\n");
    },
    about: function(){ location.hash = '#about'; return "jumping to #about"; },
    blog: function(){ setTimeout(function(){ location.href = 'blog.html'; }, 400); return "cd ./blog ..."; },
    oss: function(){ setTimeout(function(){ location.href = 'oss.html'; }, 400); return "cd ./oss-contributions ..."; },
    contact: function(){ return "reach me via the links in the footer — github, linkedin, or mail."; },
    clear: function(){ output.innerHTML = ""; return null; },
    "sudo make me a sandwich": function(){ return "okay."; },
    ls: function(){ return "about  blog  oss-contributions  README.md"; },
    "cat readme.md": function(){ return "a portfolio disguised as a terminal. or the other way around."; }
  };

  function printLine(text, cls){
    var p = document.createElement('p');
    if (cls) p.className = cls;
    p.textContent = text;
    output.appendChild(p);
  }

  document.addEventListener('DOMContentLoaded', function(){
    runBoot(0);

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var raw = termInput.value;
      var val = raw.trim().toLowerCase();
      if (!val) return;

      var echo = document.createElement('p');
      echo.className = 'cmd-echo';
      echo.textContent = raw;
      output.appendChild(echo);

      if (val === 'clear'){
        output.innerHTML = "";
      } else if (commands.hasOwnProperty(val)){
        var res = commands[val]();
        if (res){
          res.split("\n").forEach(function(line){ printLine(line); });
        }
      } else {
        printLine("command not found: " + raw + "  (try 'help')", "err");
      }

      termInput.value = "";
      output.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    document.addEventListener('click', function(){ termInput.focus(); }, { once:true });
  });
})();
