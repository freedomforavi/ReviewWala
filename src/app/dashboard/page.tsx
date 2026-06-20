'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

interface Review { id: string; created_at: string; customer_name: string; rating: number; review_text: string; is_approved: boolean; source: string }
interface Business { id: string; business_name: string; business_slug: string; email: string; plan_tier: string; whatsapp_number?: string; website_url?: string; phone?: string; address?: string }

function DashboardInner() {
  const sp = useSearchParams(); const router = useRouter()
  const token = sp.get('token'); const slug = sp.get('business')
  const [b, setB] = useState<Business | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true); const [copied, setCopied] = useState('')
  const [tab, setTab] = useState<'pending' | 'approved' | 'profile'>('pending')
  const [origin, setOrigin] = useState('')
  const [profileForm, setProfileForm] = useState({ phone: '', address: '', whatsapp_number: '', website_url: '' })
  const [saving, setSaving] = useState(false); const [saved, setSaved] = useState(false)

  useEffect(() => { setOrigin(window.location.origin) }, [])

  useEffect(() => {
    if (!token || !slug) { router.push('/'); return }
    fetch(`/api/reviews?token=${token}&slug=${slug}`).then(r => r.json()).then(d => {
      if (d.business) {
        setB(d.business);
        setProfileForm({
          phone: d.business.phone || '',
          address: d.business.address || '',
          whatsapp_number: d.business.whatsapp_number || '',
          website_url: d.business.website_url || '',
        })
      }
      if (d.reviews) setReviews(d.reviews)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [token, slug, router])

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    const r = await fetch('/api/review-action', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ review_id: id, action, token }) })
    if (!r.ok) return
    if (action === 'reject') setReviews(p => p.filter(x => x.id !== id))
    else setReviews(p => p.map(x => x.id === id ? { ...x, is_approved: true } : x))
  }

  const rl = b && origin ? `${origin}/r/${b.business_slug}` : ''
  const ec = b && origin ? `<script src="${origin}/widget.js" data-business="${b.business_slug}"></script>` : ''
  const copy = (t: string, l: string) => { navigator.clipboard.writeText(t); setCopied(l); setTimeout(() => setCopied(''), 2000) }
  const pending = reviews.filter(r => !r.is_approved)
  const approved = reviews.filter(r => r.is_approved)

  const saveProfile = async () => {
    setSaving(true); setSaved(false)
    try {
      const r = await fetch('/api/business', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profileForm, token })
      })
      if (r.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000) }
    } catch {} finally { setSaving(false) }
  }

  const updatePF = (k: string, v: string) => setProfileForm(p => ({ ...p, [k]: v }))

  const bg = '#111b21'; const surface = '#1f2c33'; const text = '#e9edef'; const muted = '#8696a0'
  const green = '#00a884'; const accent = '#25d366'; const border = '#313d45'

  if (loading) return (
    <div style={{ fontFamily: 'var(--font-sans)', background: bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, color: muted, fontSize: 14 }}>
      <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.06)', borderTopColor: green, animation: 'rw-spin 0.8s linear infinite' }} />
      <span>Loading your dashboard...</span>
    </div>
  )
  if (!b) return (
    <div style={{ fontFamily: 'var(--font-sans)', background: bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: '#ea0038', fontSize: 14 }}>
      <span>❌</span>
      <span>Invalid access. Please sign up again.</span>
    </div>
  )

  const glass = (addon = '') => ({
    background: 'rgba(31,44,51,0.75)', backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.06)',
    transition: 'all 300ms cubic-bezier(0.2, 0, 0, 1)',
    ...(addon ? eval('(' + addon + ')') : {}),
  })

  return (
    <div style={{ fontFamily: 'var(--font-sans)', background: bg, minHeight: '100vh', color: text }}>
      <style>{`@keyframes rw-spin { to { transform: rotate(360deg) } }`}</style>

      {/* Glass Header */}
      <header style={{
        background: 'rgba(17,27,33,0.82)', backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%', background: green,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, flexShrink: 0,
              boxShadow: `0 0 0 2px ${bg}, 0 0 0 4px rgba(0,168,132,0.15)`,
            }}>⭐</div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, margin: 0, letterSpacing: '-0.3px' }}>ReviewWala</p>
              <p style={{ fontSize: 11, color: muted, margin: 0 }}>{b.email} · <span style={{ color: green, textTransform: 'capitalize' }}>{b.plan_tier}</span></p>
            </div>
          </div>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'rgba(0,168,132,0.15)', color: green,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, border: '1px solid rgba(0,168,132,0.2)',
          }}>{b.business_name.charAt(0).toUpperCase()}</div>
        </div>
      </header>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '20px 16px 80px' }}>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
          {[
            { label: 'Total', value: reviews.length, color: text, icon: '📝' },
            { label: 'Pending', value: pending.length, color: '#f59e0b', icon: '⏳' },
            { label: 'Approved', value: approved.length, color: accent, icon: '✓' },
          ].map(s => (
            <div key={s.label} style={{
              ...glass(),
              borderRadius: 14, padding: '18px 12px', textAlign: 'center',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,168,132,0.25)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{ fontSize: 16, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: s.color, letterSpacing: '-0.5px' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: muted, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Share Link */}
        <div style={{ ...glass(), borderRadius: 16, padding: '20px', marginBottom: 10 }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,168,132,0.25)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 14 }}>🔗</span>
            <h3 style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>Share review link</h3>
          </div>
          <p style={{ fontSize: 12, color: muted, margin: '2px 0 12px', paddingLeft: 22 }}>Send this to customers on WhatsApp so they can leave a review.</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input readOnly value={rl} style={{
              flex: 1, padding: '9px 14px', borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.08)', fontSize: 13, color: muted,
              background: 'rgba(17,27,33,0.6)', outline: 'none', fontFamily: 'inherit',
            }} />
            <button onClick={() => copy(rl, 'link')} style={{
              padding: '9px 20px', borderRadius: 12, border: 'none',
              background: copied === 'link' ? '#005c4b' : green,
              color: copied === 'link' ? accent : '#fff',
              fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'all 200ms cubic-bezier(0.2, 0, 0, 1)',
            }}
              onMouseEnter={e => { if (copied !== 'link') { e.currentTarget.style.background = '#00c392'; e.currentTarget.style.transform = 'translateY(-1px)' } }}
              onMouseLeave={e => { if (copied !== 'link') { e.currentTarget.style.background = green; e.currentTarget.style.transform = 'translateY(0)' } }}
            >{copied === 'link' ? '✓ Copied' : 'Copy'}</button>
          </div>
        </div>

        {/* Embed Widget */}
        <div style={{ ...glass(), borderRadius: 16, padding: '20px', marginBottom: 20 }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,168,132,0.25)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14 }}>🖥️</span>
              <h3 style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>Embed widget</h3>
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 9999, background: 'rgba(0,168,132,0.12)', color: green, letterSpacing: '0.3px' }}>FREE</span>
          </div>
          <p style={{ fontSize: 12, color: muted, margin: '2px 0 12px', paddingLeft: 22 }}>Paste before <code style={{ background: 'rgba(17,27,33,0.6)', padding: '1px 6px', borderRadius: 4, fontSize: 11, color: muted }}>{'</body>'}</code> on your website.</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input readOnly value={ec} style={{
              flex: 1, padding: '9px 14px', borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.08)', fontSize: 11, color: muted,
              background: 'rgba(17,27,33,0.6)', outline: 'none', fontFamily: 'monospace',
            }} />
            <button onClick={() => copy(ec, 'embed')} style={{
              padding: '9px 20px', borderRadius: 12, border: 'none',
              background: copied === 'embed' ? '#005c4b' : green,
              color: copied === 'embed' ? accent : '#fff',
              fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'all 200ms cubic-bezier(0.2, 0, 0, 1)',
            }}
              onMouseEnter={e => { if (copied !== 'embed') { e.currentTarget.style.background = '#00c392'; e.currentTarget.style.transform = 'translateY(-1px)' } } }
              onMouseLeave={e => { if (copied !== 'embed') { e.currentTarget.style.background = green; e.currentTarget.style.transform = 'translateY(0)' } } }
            >{copied === 'embed' ? '✓ Copied' : 'Copy'}</button>
          </div>

          <details style={{ marginTop: 14 }}>
            <summary style={{ fontSize: 13, color: green, cursor: 'pointer', fontWeight: 500, transition: 'color 200ms', userSelect: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = '#00c392'}
              onMouseLeave={e => e.currentTarget.style.color = green}
            >Integration guides ▼</summary>
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { name: 'WordPress', steps: 'Appearance → Theme Editor → footer.php → paste before </body>', icon: '🔵' },
                { name: 'Shopify', steps: 'Online Store → Themes → Edit Code → theme.liquid → paste before </body>', icon: '🟢' },
                { name: 'Any HTML', steps: 'Open .html file → paste before </body> → Upload', icon: '📄' },
                { name: 'Wix', steps: 'Settings → Custom Code → + Add → paste → All Pages', icon: '📦' },
              ].map(p => (
                <div key={p.name} style={{
                  background: 'rgba(17,27,33,0.6)', borderRadius: 12, padding: '10px 14px',
                  border: '1px solid transparent', transition: 'all 200ms',
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
                >
                  <span style={{ fontSize: 14 }}>{p.icon}</span>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 13, margin: '0 0 1px' }}>{p.name}</p>
                    <p style={{ fontSize: 12, color: muted, margin: 0 }}>{p.steps}</p>
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>

        {/* Tab Bar */}
        <div style={{
          background: 'rgba(31,44,51,0.75)', backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: 14, padding: 3,
          border: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', gap: 0, marginBottom: 14,
        }}>
          {(['pending', 'approved', 'profile'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '10px', border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, borderRadius: 11,
              background: tab === t ? green : 'transparent',
              color: tab === t ? '#fff' : muted,
              transition: 'all 250ms cubic-bezier(0.2, 0, 0, 1)',
              fontFamily: 'inherit',
            }}>{t === 'pending' ? `Pending (${pending.length})` : `Approved (${approved.length})`}</button>
          ))}
        </div>

        {/* Pending Tab */}
        {tab === 'pending' && (
          pending.length === 0
            ? <div style={{ textAlign: 'center', padding: '48px 20px', background: 'rgba(31,44,51,0.75)', backdropFilter: 'blur(12px)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.4 }}>⏳</div>
                <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 4px' }}>No pending reviews</p>
                <p style={{ fontSize: 13, color: muted, margin: 0 }}>Share your review link to get started.</p>
              </div>
            : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {pending.map(r => (
                  <div key={r.id} style={{
                    background: 'rgba(31,44,51,0.75)', backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    borderRadius: 16, padding: '16px 18px',
                    border: '1px solid rgba(255,255,255,0.06)',
                    transition: 'all 300ms cubic-bezier(0.2, 0, 0, 1)',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,168,132,0.25)'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 30, height: 30, borderRadius: '50%',
                          background: 'rgba(0,168,132,0.15)', color: green,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 700,
                        }}>{r.customer_name.charAt(0).toUpperCase()}</div>
                        <div>
                          <span style={{ fontWeight: 600, fontSize: 14 }}>{r.customer_name}</span>
                          <span style={{ color: '#f59e0b', fontSize: 13, marginLeft: 6, letterSpacing: '1px' }}>{'★'.repeat(r.rating)}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => handleAction(r.id, 'approve')} style={{
                          padding: '6px 14px', borderRadius: 8, border: 'none',
                          background: accent, color: '#fff', fontSize: 12, fontWeight: 500,
                          cursor: 'pointer', transition: 'all 150ms',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'scale(1.04)' }}
                          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)' }}
                        >✓ Approve</button>
                        <button onClick={() => handleAction(r.id, 'reject')} style={{
                          padding: '6px 14px', borderRadius: 8, border: 'none',
                          background: '#ea0038', color: '#fff', fontSize: 12, fontWeight: 500,
                          cursor: 'pointer', transition: 'all 150ms',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'scale(1.04)' }}
                          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)' }}
                        >✕ Reject</button>
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: muted, margin: 0, lineHeight: 1.5, paddingLeft: 40 }}>{r.review_text}</p>
                  </div>
                ))}
              </div>
        )}

        {/* Approved Tab */}
        {tab === 'approved' && (
          approved.length === 0
            ? <div style={{ textAlign: 'center', padding: '48px 20px', background: 'rgba(31,44,51,0.75)', backdropFilter: 'blur(12px)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.4 }}>✓</div>
                <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 4px' }}>No approved reviews yet</p>
                <p style={{ fontSize: 13, color: muted, margin: 0 }}>Approve reviews from the Pending tab.</p>
              </div>
            : <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {approved.map(r => (
                  <div key={r.id} style={{
                    background: 'rgba(31,44,51,0.75)', backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    borderRadius: 14, padding: '12px 16px',
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', gap: 12,
                    transition: 'all 300ms cubic-bezier(0.2, 0, 0, 1)',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,168,132,0.25)'; e.currentTarget.style.transform = 'translateX(3px)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateX(0)' }}
                  >
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: accent, flexShrink: 0, boxShadow: '0 0 8px rgba(37,211,102,0.3)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{r.customer_name}</span>
                        <span style={{ color: accent, fontSize: 11, letterSpacing: '1px' }}>{'★'.repeat(r.rating)}</span>
                      </div>
                      <p style={{ fontSize: 12, color: muted, margin: '2px 0 0' }}>{r.review_text}</p>
                    </div>
                  </div>
                ))}
              </div>
        )}

        {/* Profile Tab */}
        {tab === 'profile' && (
          <div style={{ ...glass(), borderRadius: 16, padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 16 }}>⚙️</span>
              <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Business profile</h3>
            </div>
            <p style={{ fontSize: 12, color: muted, margin: '2px 0 20px', paddingLeft: 24 }}>This info shows on your public showcase page at <strong style={{ color: text }}>{rl}</strong></p>

            {[
              { key: 'phone', label: 'Phone number', placeholder: '+91 9876543210', type: 'tel' },
              { key: 'whatsapp_number', label: 'WhatsApp number (for contact button)', placeholder: '+919876543210', type: 'tel' },
              { key: 'address', label: 'Address', placeholder: '123, Main Road, Mumbai - 400001', type: 'text' },
              { key: 'website_url', label: 'Website URL', placeholder: 'https://example.com', type: 'url' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: muted, marginBottom: 4, letterSpacing: '0.3px', textTransform: 'uppercase' }}>{f.label}</label>
                <input type={f.type} value={(profileForm as any)[f.key]} onChange={e => updatePF(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 12, boxSizing: 'border-box',
                    border: '1px solid rgba(255,255,255,0.08)', fontSize: 13, color: text,
                    background: 'rgba(17,27,33,0.6)', outline: 'none', fontFamily: 'inherit',
                    transition: 'all 200ms',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = green; e.currentTarget.style.boxShadow = `0 0 0 3px rgba(0,168,132,0.1)` }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>
            ))}

            <button onClick={saveProfile} disabled={saving} style={{
              width: '100%', padding: '12px', borderRadius: 12, border: 'none',
              background: saving ? '#005c4b' : (saved ? '#005c4b' : green),
              color: saved ? accent : '#fff', fontSize: 14, fontWeight: 600,
              cursor: saving ? 'default' : 'pointer', fontFamily: 'inherit',
              transition: 'all 200ms',
            }}
              onMouseEnter={e => { if (!saving && !saved) { e.currentTarget.style.background = '#00c392'; e.currentTarget.style.transform = 'translateY(-1px)' } }}
              onMouseLeave={e => { if (!saving && !saved) { e.currentTarget.style.background = green; e.currentTarget.style.transform = 'translateY(0)' } }}
            >{saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save profile'}</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const bg = '#111b21'
  return (
    <Suspense fallback={<div style={{ fontFamily: 'var(--font-sans)', background: bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8696a0', fontSize: 14 }}>Loading...</div>}>
      <DashboardInner />
    </Suspense>
  )
}
