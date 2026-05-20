fetch('https://retner-intent-platform.onrender.com/api/v1/public/sessions?limit=100&page=1', {
  headers: { 'X-Retner-Key': 'rtk_3ccbb71c4b0e8bca171163e27fab6f372fba677e85b57499' }
})
  .then(r => r.json())
  .then(d => {
    console.log('=== API SUMMARY ===');
    console.log('Total:', d.total, '| Pages:', d.pages, '| Limit:', d.limit, '| Received:', d.sessions.length);
    console.log('');
    console.log('=== ALL SESSIONS ===');
    d.sessions.forEach((s, i) => {
      console.log(
        `[${String(i + 1).padStart(2, '0')}]`,
        s.session_id,
        '|', 'visitor:', s.visitor_id,
        '|', 'level:', s.scoring.final_level.padEnd(8),
        '|', 'score:', String(s.scoring.final_score).padStart(3),
        '|', 'duration:', String(s.duration_seconds).padStart(4) + 's',
        '|', 'device:', (s.device.type + '/' + s.device.browser + '/' + s.device.os).padEnd(25),
        '|', 'source:', (s.referrer && s.referrer.source ? s.referrer.source : 'direct').padEnd(10),
        '|', 'pages:', s.metrics.page_count,
        '|', 'cart_adds:', s.metrics.cart_adds,
        '|', 'cart_value:', s.metrics.cart_value,
        '|', 'product_views:', s.metrics.product_views,
        '|', 'exit_intents:', s.metrics.exit_intents,
        '|', 'started:', s.started_at
      );
    });
    console.log('');
    console.log('=== INTENT BREAKDOWN ===');
    const counts = {};
    d.sessions.forEach(s => {
      counts[s.scoring.final_level] = (counts[s.scoring.final_level] || 0) + 1;
    });
    Object.entries(counts).forEach(([k, v]) => {
      console.log(k.padEnd(10), ':', v, 'sessions', `(${((v / d.sessions.length) * 100).toFixed(1)}%)`);
    });
    console.log('');
    console.log('=== REFERRER SOURCES ===');
    const sources = {};
    d.sessions.forEach(s => {
      const src = s.referrer && s.referrer.source ? s.referrer.source : 'direct';
      sources[src] = (sources[src] || 0) + 1;
    });
    Object.entries(sources).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => {
      console.log(k.padEnd(15), ':', v, 'sessions');
    });
  })
  .catch(err => console.error('Error:', err.message));
