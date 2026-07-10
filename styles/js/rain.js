/* matrix rain — shared background effect for all pages */
(function(){
  "use strict";

  function initMatrixRain(canvasId){
    var canvas = document.getElementById(canvasId || 'rain');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var W, H, cols, drops;
    var fontSize = 15;
    var chars = "01アイウエオカキクケコサシスセソ日ノハヒフ<>{}[]/*+=;:";

    function resize(){
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      cols = Math.floor(W / fontSize);
      drops = new Array(cols).fill(0).map(function(){ return Math.random() * -40; });
    }
    resize();
    window.addEventListener('resize', resize);

    function draw(){
      ctx.fillStyle = 'rgba(5,8,5,0.08)';
      ctx.fillRect(0,0,W,H);
      ctx.font = fontSize + 'px monospace';
      for (var i=0; i<cols; i++){
        var text = chars[Math.floor(Math.random()*chars.length)];
        ctx.fillStyle = Math.random() > 0.985 ? '#8dffc4' : 'rgba(61,255,154,0.55)';
        ctx.fillText(text, i*fontSize, drops[i]*fontSize);
        if (drops[i]*fontSize > H && Math.random() > 0.975){ drops[i] = 0; }
        drops[i]++;
      }
    }

    if (!reduceMotion){
      setInterval(draw, 55);
    } else {
      ctx.fillStyle = '#050805';
      ctx.fillRect(0,0,W,H);
    }
  }

  window.initMatrixRain = initMatrixRain;
})();
