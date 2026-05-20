import { useState, useEffect } from 'react';

export interface Session {
  session_id: string;
  visitor_id: string;
  started_at: string;
  ended_at: string;
  duration_seconds: number;
  metrics: {
    page_count: number;
    product_views: number;
    unique_products: number;
    avg_scroll_depth: number;
    cart_adds: number;
    cart_removes: number;
    cart_value: number;
    checkout_started: boolean;
    exit_intents: number;
    tab_switches: number;
    variant_changes: number;
    rage_clicks: number;
    image_zooms: number;
    review_reads: number;
    search_count: number;
  };
  scoring: {
    final_score: number;
    final_level: string;
    final_persona: string;
  };
  device: {
    type: string;
    browser: string;
    os: string;
  };
  referrer: {
    source: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
  };
  landing_page: {
    type: string;
  };
}

export interface SessionsData {
  ok: boolean;
  total: number;
  page: number;
  limit: number;
  pages: number;
  sessions: Session[];
}

const API_URL = 'https://retner-intent-platform.onrender.com/api/v1/public/sessions';
const API_KEY = 'rtk_3ccbb71c4b0e8bca171163e27fab6f372fba677e85b57499';

let cache: SessionsData | null = null;
let promise: Promise<SessionsData> | null = null;

async function fetchAllSessions(): Promise<SessionsData> {
  // First request to get total pages
  const first = await fetch(`${API_URL}?limit=100&page=1`, {
    headers: { 'X-Retner-Key': API_KEY }
  }).then(r => r.json()) as SessionsData;

  if (first.pages <= 1) return first;

  // Fetch remaining pages in parallel
  const pageNums = Array.from({ length: first.pages - 1 }, (_, i) => i + 2);
  const rest = await Promise.all(
    pageNums.map(p =>
      fetch(`${API_URL}?limit=100&page=${p}`, {
        headers: { 'X-Retner-Key': API_KEY }
      }).then(r => r.json()) as Promise<SessionsData>
    )
  );

  const allSessions = [
    ...first.sessions,
    ...rest.flatMap(d => d.sessions)
  ];

  return { ...first, sessions: allSessions, limit: 100 };
}

function fetchSessions(): Promise<SessionsData> {
  if (cache) return Promise.resolve(cache);
  if (!promise) {
    promise = fetchAllSessions().then(data => { cache = data; return data; });
  }
  return promise;
}

export function useSessions() {
  const [data, setData] = useState<SessionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSessions()
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  return { data, loading, error };
}
