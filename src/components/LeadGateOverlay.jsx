import React, { useEffect, useMemo, useState } from 'react';

const BYPASS_UNTIL_KEY = 'estateHiveLeadGateBypassUntil';

function isAuthenticated() {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i) || '';
      if (/^sb-.*-auth-token$/.test(k)) {
        const v = localStorage.getItem(k);
        if (!v) continue;
        try { JSON.parse(v); } catch (_) {}
        return true;
      }
    }
  } catch (_) {}
  return false;
}

function hasRecentBypass() {
  try {
    const until = parseInt(localStorage.getItem(BYPASS_UNTIL_KEY) || '0', 10);
    if (!until) return false;
    if (Date.now() < until) return true;
    localStorage.removeItem(BYPASS_UNTIL_KEY);
  } catch (_) {}
  return false;
}

export default function LeadGateOverlay() {
  const returnTo = useMemo(() => {
    try {
      return (window.location.pathname + window.location.search + window.location.hash) || '/';
    } catch (_) {
      return '/';
    }
  }, []);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Decide if we need to show on mount
    if (!isAuthenticated() && !hasRecentBypass()) {
      setOpen(true);
      try { document.documentElement.style.overflow = 'hidden'; } catch {}
    }
    return () => {
      try { document.documentElement.style.overflow = ''; } catch {}
    };
  }, []);

  useEffect(() => {
    function onMessage(ev) {
      try {
        if (!ev || !ev.data || typeof ev.data !== 'object') return;
        if (ev.data.type === 'leadGateCompleted') {
          // Persist bypass if provided
          if (ev.data.bypassUntil) {
            try { localStorage.setItem(BYPASS_UNTIL_KEY, String(ev.data.bypassUntil)); } catch {}
          }
          setOpen(false);
          try { document.documentElement.style.overflow = ''; } catch {}
        } else if (ev.data.type === 'leadGateAuthenticated') {
          // Child detected auth; no need to show
          setOpen(false);
          try { document.documentElement.style.overflow = ''; } catch {}
        }
      } catch {}
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  if (!open) return null;

  // Fullscreen overlay with iframe
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(15, 23, 42, 0.66)', backdropFilter: 'blur(2px)' }}>
      <iframe
        title="Lead Gate"
        src={`/lead-gate.html?embed=1&returnTo=${encodeURIComponent(returnTo)}`}
        style={{ width: '100%', height: '100%', border: 0 }}
      />
    </div>
  );
}

