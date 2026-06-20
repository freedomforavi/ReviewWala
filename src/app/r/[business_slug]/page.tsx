'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ShowcasePage() {
  const { business_slug } = useParams()
  const [bizName, setBizName] = useState('Style Studio Salon')
  const [reviews, setReviews] = useState<any[]>([{id:'1',customer_name:'Priya Sharma',rating:5,review_text:'Best salon in town! Got my bridal makeup done and it was stunning. Highly recommend!',created_at:'2026-06-15T10:30:00Z',is_approved:true},{id:'2',customer_name:'Rahul Verma',rating:4,review_text:'Great haircut and very professional staff. Will definitely come again.',created_at:'2026-06-14T15:20:00Z',is_approved:true},{id:'3',customer_name:'Ananya Patel',rating:5,review_text:'Love the new hairstyle! Ankush is a magician with scissors. ❤️',created_at:'2026-06-12T09:15:00Z',is_approved:true},{id:'4',customer_name:'Vikram Singh',rating:5,review_text:'Finally found my go-to barber. Clean, affordable, and great service.',created_at:'2026-06-10T18:45:00Z',is_approved:true},{id:'5',customer_name:'Neha Gupta',rating:4,review_text:'Good service overall. The manicure was perfect.',created_at:'2026-06-08T11:00:00Z',is_approved:true},{id:'6',customer_name:'Arjun Mehta',rating:3,review_text:'Decent place but waiting time was a bit long. Quality is good though.',created_at:'2026-06-05T14:30:00Z',is_approved:true}])
  const [phone, setPhone] = useState('+91 98765 43210')
  const [address, setAddress] = useState('42, MG Road, Opp. City Mall, Andheri West, Mumbai - 400058')
  const [whatsapp, setWhatsapp] = useState('+919876543210')
  const [website, setWebsite] = useState('https://stylestudiosalon.in')
  const [showForm, setShowForm] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  const [name, setName] = useState('')
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!business_slug) return
    fetch(`/api/reviews?slug=${business_slug}`)
      .then(r => r.json()).then(d => {
        if (d.reviews) setReviews(d.reviews)
        if (d.business_name) setBizName(d.business_name)
        if (d.phone) setPhone(d.phone)
        if (d.address) setAddress(d.address)
        if (d.whatsapp_number) setWhatsapp(d.whatsapp_number)
        if (d.website_url) setWebsite(d.website_url)
      }).catch(() => {})
    setMounted(true)
  }, [business_slug])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !text.trim() || rating === 0) { setError('Fill all fields'); return }
    setLoading(true); setError('')
    try {
      const r = await fetch('/api/submit-review', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_slug, customer_name: name, rating, review_text: text, source: 'link' })
      })
      if (!r.ok) throw new Error('Failed')
      setSubmitted(true)
    } catch { setError('Try again.') }
    finally { setLoading(false) }
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0'

  const fiveStarPct = reviews.length > 0
    ? Math.round((reviews.filter(r => r.rating === 5).length / reviews.length) * 100)
    : 0

  const g = '#00a884'
  const g2 = '#25d366'
  const starFull = '#f59e0b'

  if (submitted) return (
    <div style={{ fontFamily: 'var(--font-sans)', background: '#000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(0,168,132,0.2), rgba(37,211,102,0.1))', border: '2px solid rgba(0,168,132,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', animation: 'rw-scaleIn 0.4s cubic-bezier(0.2,0,0,1)' }}>
          <span style={{ fontSize: 36, color: g }}>✓</span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.5px' }}>Thank you!</h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', margin: '0 0 8px', lineHeight: 1.6 }}>
          Your review for <strong style={{ color: '#fff' }}>{bizName}</strong> will appear after the business approves it.
        </p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', margin: 0, lineHeight: 1.5 }}>Share this page with friends so they can leave a review too!</p>
      </div>
      <style>{`@keyframes rw-scaleIn{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
    </div>
  )

  return (
    <div style={{ fontFamily: 'var(--font-sans)', background: '#fff', minHeight: '100vh', color: '#000', overflowX: 'hidden' }}>
      <style>{`
        :root {
          --g: #00a884;
          --g2: #25d366;
          --g-dark: #075e54;
          --surface: #fff;
          --surface-alt: #f5f5f5;
          --text: #000;
          --text-secondary: rgba(0,0,0,0.5);
          --text-tertiary: rgba(0,0,0,0.3);
          --border: rgba(0,0,0,0.06);
          --border-hover: rgba(0,0,0,0.1);
          --star: #f59e0b;
          --radius-card: 20px;
          --radius-sm: 12px;
          --radius-pill: 9999px;
          --ease: cubic-bezier(0.2, 0, 0, 1);
        }
        @keyframes rw-fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes rw-fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes rw-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.6;transform:scale(1.2)}}
        @keyframes rw-glow{0%,100%{opacity:0.4}50%{opacity:0.8}}
        @keyframes rw-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes rw-shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes rw-slideDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes rw-ripple{to{transform:scale(4);opacity:0}}
        .rw-star:hover,.rw-star-active{transform:scale(1.15)!important}
      `}</style>

      {/* ===== NAV ===== */}
      <header style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
        transition: 'all 400ms var(--ease)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: 'linear-gradient(135deg, var(--g), var(--g2))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 800, color: '#fff',
              boxShadow: '0 2px 8px rgba(0,168,132,0.25)',
            }}>R</div>
            <span style={{
              fontWeight: 600, fontSize: 15,
              color: scrolled ? '#000' : '#fff',
              transition: 'color 300ms var(--ease)',
              letterSpacing: '-0.3px',
            }}>{bizName || 'Business'}</span>
            {reviews.length > 0 && (
              <span style={{
                fontSize: 12, padding: '2px 10px', borderRadius: 9999,
                background: scrolled ? 'rgba(0,168,132,0.08)' : 'rgba(255,255,255,0.08)',
                color: scrolled ? g : 'rgba(255,255,255,0.7)',
                fontWeight: 500,
                transition: 'all 300ms',
              }}
              >
                {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={() => setShowForm(true)}
              style={{
                padding: '9px 22px', borderRadius: 'var(--radius-pill)',
                border: scrolled ? '1.5px solid var(--g)' : '1.5px solid rgba(255,255,255,0.2)',
                background: 'transparent',
                color: scrolled ? g : '#fff',
                fontSize: 13, fontWeight: 600,
                cursor: 'pointer', transition: 'all 250ms var(--ease)',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = scrolled ? 'rgba(0,168,132,0.06)' : 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = scrolled ? g : 'rgba(255,255,255,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = scrolled ? 'var(--g)' : 'rgba(255,255,255,0.2)' }}
            >Write a review</button>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section style={{
        background: '#000',
        minHeight: '80vh', display: 'flex', alignItems: 'center',
        padding: '140px 28px 100px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Ambient glow orbs */}
        <div style={{
          position: 'absolute', top: '-30%', right: '-10%',
          width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,168,132,0.08) 0%, rgba(0,168,132,0.02) 40%, transparent 70%)',
          pointerEvents: 'none',
          animation: 'rw-float 8s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', left: '-5%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,211,102,0.05) 0%, rgba(37,211,102,0.01) 40%, transparent 70%)',
          pointerEvents: 'none',
          animation: 'rw-float 12s ease-in-out infinite reverse',
        }} />
        <div style={{
          position: 'absolute', top: '60%', left: '50%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,168,132,0.03) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: 680 }}>

            {/* Verified badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px 6px 12px', borderRadius: 'var(--radius-pill)',
              border: '1px solid rgba(0,168,132,0.15)',
              background: 'rgba(0,168,132,0.06)',
              marginBottom: 28,
              animation: 'rw-fadeUp 0.6s var(--ease) both',
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: '#25d366',
                animation: 'rw-pulse 2s infinite',
              }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: g, letterSpacing: '0.5px' }}>
                {reviews.length > 0
                  ? `Trusted by ${reviews.length} customer${reviews.length !== 1 ? 's' : ''}`
                  : 'Verified business'
                }
              </span>
            </div>

            {/* Business name */}
            <h1 style={{
              fontSize: 64, fontWeight: 800, lineHeight: 1.04,
              margin: '0 0 16px', letterSpacing: '-2px', color: '#fff',
              animation: 'rw-fadeUp 0.6s var(--ease) 0.1s both',
            }}>
              {bizName || 'Loading...'}
            </h1>

            {/* Tagline */}
            <p style={{
              fontSize: 20, color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.6, margin: '0 0 36px', maxWidth: 500,
              fontWeight: 400,
              animation: 'rw-fadeUp 0.6s var(--ease) 0.2s both',
            }}>
              Real reviews from real customers. Share your experience in seconds.
            </p>

            {/* CTA buttons */}
            <div style={{
              display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap',
              animation: 'rw-fadeUp 0.6s var(--ease) 0.3s both',
            }}>
              <button onClick={() => setShowForm(true)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '16px 36px', borderRadius: 'var(--radius-pill)',
                  border: 'none',
                  background: 'linear-gradient(135deg, var(--g), var(--g2))',
                  color: '#fff', fontSize: 16, fontWeight: 600,
                  cursor: 'pointer', textDecoration: 'none',
                  transition: 'all 300ms var(--ease)',
                  fontFamily: 'inherit',
                  boxShadow: '0 4px 20px rgba(0,168,132,0.3)',
                  position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,168,132,0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,168,132,0.3)';
                }}
              >
                Write a review
                <span style={{ fontSize: 20, lineHeight: 1, transition: 'transform 300ms var(--ease)', display: 'inline-block' }}
                  onMouseEnter={e => { if (e.currentTarget) e.currentTarget.style.transform = 'translateX(3px)' }}
                  onMouseLeave={e => { if (e.currentTarget) e.currentTarget.style.transform = 'translateX(0)' }}
                >→</span>
              </button>
              {reviews.length > 0 && (
                <a href="#reviews"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '16px 28px', borderRadius: 'var(--radius-pill)',
                    border: '1.5px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: 15, fontWeight: 500,
                    cursor: 'pointer', textDecoration: 'none',
                    transition: 'all 300ms var(--ease)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
                >
                  Read {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </a>
              )}
            </div>

            {/* Rating display */}
            {reviews.length > 0 && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 20,
                marginTop: 48, padding: '20px 28px',
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.02)',
                animation: 'rw-fadeUp 0.6s var(--ease) 0.4s both',
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 40, fontWeight: 800, color: '#fff', letterSpacing: '-1px', lineHeight: 1 }}>{avgRating}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>out of 5</div>
                </div>
                <div style={{ width: 1, height: 48, background: 'rgba(255,255,255,0.06)' }} />
                <div>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 4 }}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <span key={n} style={{
                        color: n <= Math.round(Number(avgRating)) ? starFull : 'rgba(255,255,255,0.08)',
                        fontSize: 22, letterSpacing: '2px', lineHeight: 1,
                      }}>★</span>
                    ))}
                  </div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
                    Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div style={{ width: 1, height: 48, background: 'rgba(255,255,255,0.06)' }} />
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{fiveStarPct}%</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>5-star reviews</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== CONTACT INFO ===== */}
      {(phone || address || whatsapp) && (
        <section style={{ padding: '40px 28px', background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 16,
              alignItems: 'flex-start',
            }}>
              {/* Phone */}
              {phone && (
                <a href={`tel:${phone}`} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '14px 22px', borderRadius: 14,
                  background: '#f8f8f8',
                  border: '1px solid rgba(0,0,0,0.04)',
                  textDecoration: 'none', color: '#000',
                  transition: 'all 250ms var(--ease)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f0f0f0'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#f8f8f8'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.04)' }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'rgba(0,168,132,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, flexShrink: 0,
                  }}>📞</div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.3px', textTransform: 'uppercase' }}>Phone</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#000' }}>{phone}</div>
                  </div>
                </a>
              )}

              {/* WhatsApp */}
              {whatsapp && (
                <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '14px 22px', borderRadius: 14,
                  background: 'rgba(0,168,132,0.04)',
                  border: '1px solid rgba(0,168,132,0.1)',
                  textDecoration: 'none', color: '#000',
                  transition: 'all 250ms var(--ease)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,168,132,0.08)'; e.currentTarget.style.borderColor = 'rgba(0,168,132,0.2)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,168,132,0.04)'; e.currentTarget.style.borderColor = 'rgba(0,168,132,0.1)' }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: '#25d366',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, flexShrink: 0, color: '#fff',
                    boxShadow: '0 2px 8px rgba(37,211,102,0.3)',
                  }}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="#fff">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: g, letterSpacing: '0.3px', textTransform: 'uppercase' }}>WhatsApp</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#000' }}>Chat on WhatsApp</div>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: 18, color: g, lineHeight: 1 }}>→</span>
                </a>
              )}

              {/* Address */}
              {address && (
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  padding: '14px 22px', borderRadius: 14,
                  background: '#f8f8f8',
                  border: '1px solid rgba(0,0,0,0.04)',
                  maxWidth: 360,
                  transition: 'all 250ms var(--ease)',
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'rgba(0,168,132,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, flexShrink: 0, marginTop: 2,
                  }}>📍</div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.3px', textTransform: 'uppercase', marginBottom: 2 }}>Address</div>
                    <div style={{ fontSize: 14, color: 'rgba(0,0,0,0.7)', lineHeight: 1.5 }}>{address}</div>
                    <a href={`https://www.google.com/maps/search/${encodeURIComponent(address)}`} target="_blank" rel="noopener noreferrer" style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      marginTop: 8, fontSize: 12, color: g, fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'color 200ms',
                    }}
                      onMouseEnter={e => e.currentTarget.style.color = '#00c392'}
                      onMouseLeave={e => e.currentTarget.style.color = g}
                    >
                      View on Google Maps →
                    </a>
                  </div>
                </div>
              )}

              {/* Website */}
              {website && (
                <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '14px 22px', borderRadius: 14,
                  background: '#f8f8f8',
                  border: '1px solid rgba(0,0,0,0.04)',
                  textDecoration: 'none', color: '#000',
                  transition: 'all 250ms var(--ease)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f0f0f0'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#f8f8f8'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.04)' }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'rgba(0,168,132,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, flexShrink: 0,
                  }}>🌐</div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.3px', textTransform: 'uppercase' }}>Website</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: g }}>{website.replace(/^https?:\/\//, '').replace(/\/$/, '')}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: 18, color: g, lineHeight: 1 }}>→</span>
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ===== REVIEWS ===== */}
      <section id="reviews" style={{
        padding: '100px 28px',
        background: 'linear-gradient(180deg, #f8f8f8 0%, #fff 100%)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Section header */}
          <div style={{
            textAlign: 'center', marginBottom: 56,
            opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.7s var(--ease)',
          }}>
            <p style={{
              display: 'inline-block',
              fontSize: 11, fontWeight: 700, color: g,
              letterSpacing: '3px', textTransform: 'uppercase',
              margin: '0 0 12px',
              padding: '4px 14px', borderRadius: 9999,
              background: 'rgba(0,168,132,0.06)',
            }}>Customer reviews</p>
            <h2 style={{
              fontSize: 40, fontWeight: 800, margin: '0 auto',
              maxWidth: 500, letterSpacing: '-1.5px', lineHeight: 1.12,
              color: '#000',
            }}>
              What people say about <span style={{ color: g }}>{bizName}</span>
            </h2>
          </div>

          {/* Empty state */}
          {reviews.length === 0 ? (
            <div style={{
              maxWidth: 480, margin: '0 auto', textAlign: 'center',
              padding: '70px 32px',
              background: '#fff', borderRadius: 24,
              border: '1px solid rgba(0,0,0,0.04)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(0,168,132,0.08), rgba(37,211,102,0.04))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <span style={{ fontSize: 32 }}>💬</span>
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.3px' }}>No reviews yet</h3>
              <p style={{ fontSize: 14, color: 'rgba(0,0,0,0.45)', margin: '0 0 24px', lineHeight: 1.6 }}>
                Be the first to share your experience! Your review helps others discover great businesses.
              </p>
              <button onClick={() => setShowForm(true)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 32px', borderRadius: 'var(--radius-pill)',
                  border: 'none', background: 'var(--g)',
                  color: '#fff', fontSize: 15, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 250ms var(--ease)',
                  boxShadow: '0 4px 16px rgba(0,168,132,0.2)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#00c392'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,168,132,0.3)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--g)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,168,132,0.2)' }}
              >
                <span>Write the first review</span>
                <span style={{ fontSize: 18 }}>→</span>
              </button>
            </div>
          ) : (
            <>
              {/* Review count header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 24, flexWrap: 'wrap', gap: 12,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    fontSize: 36, fontWeight: 800, color: '#000', letterSpacing: '-1px',
                  }}>{avgRating}</div>
                  <div>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[1, 2, 3, 4, 5].map(n => (
                        <span key={n} style={{
                          color: n <= Math.round(Number(avgRating)) ? starFull : '#e2e8f0',
                          fontSize: 16, lineHeight: 1,
                        }}>★</span>
                      ))}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.35)', marginTop: 1 }}>{reviews.length} total</div>
                  </div>
                </div>
                <button onClick={() => setShowForm(true)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '12px 26px', borderRadius: 'var(--radius-pill)',
                    border: '1.5px solid rgba(0,0,0,0.06)',
                    background: '#fff',
                    color: '#000', fontSize: 14, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 250ms var(--ease)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--g)'; e.currentTarget.style.color = g; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,168,132,0.1)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'; e.currentTarget.style.color = '#000'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  Write a review <span style={{ fontSize: 16 }}>→</span>
                </button>
              </div>

              {/* Review cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: 16,
              }}>
                {reviews.map((r, i) => (
                  <div key={r.id}
                    style={{
                      background: '#fff',
                      borderRadius: 20,
                      padding: '28px 28px 24px',
                      border: '1px solid rgba(0,0,0,0.04)',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.02)',
                      transition: 'all 400ms var(--ease)',
                      display: 'flex', flexDirection: 'column',
                      animation: `rw-fadeUp 0.5s var(--ease) ${i * 0.06}s both`,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.06)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.borderColor = 'rgba(0,168,132,0.08)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.02)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(0,0,0,0.04)';
                    }}
                  >
                    {/* Gradient accent top line */}
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0,
                      height: 3,
                      background: 'linear-gradient(90deg, var(--g), var(--g2))',
                    }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: '50%',
                        background: `linear-gradient(135deg, ${g}, ${g2})`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, fontWeight: 700, color: '#fff',
                        flexShrink: 0,
                        boxShadow: '0 2px 8px rgba(0,168,132,0.2)',
                      }}>
                        {r.customer_name ? r.customer_name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontWeight: 600, fontSize: 16, margin: '0 0 3px',
                          letterSpacing: '-0.2px', color: '#000',
                        }}>{r.customer_name}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{
                            color: starFull, fontSize: 13,
                            letterSpacing: '2px', lineHeight: 1,
                          }}>
                            {Array(r.rating).fill(null).map((_, j) => (
                              <span key={j}>★</span>
                            ))}
                            {Array(5 - r.rating).fill(null).map((_, j) => (
                              <span key={j} style={{ color: '#e2e8f0' }}>★</span>
                            ))}
                          </span>
                          <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.25)' }}>
                            {new Date(r.created_at).toLocaleDateString('en-IN', {
                              month: 'short', day: 'numeric', year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p style={{
                      fontSize: 15, color: 'rgba(0,0,0,0.6)',
                      margin: 0, lineHeight: 1.7, whiteSpace: 'pre-wrap',
                    }}>{r.review_text}</p>
                  </div>
                ))}
              </div>

              {/* Bottom CTA */}
              <div style={{ textAlign: 'center', marginTop: 40 }}>
                <button onClick={() => setShowForm(true)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    padding: '16px 36px', borderRadius: 'var(--radius-pill)',
                    border: 'none',
                    background: 'linear-gradient(135deg, var(--g), var(--g2))',
                    color: '#fff', fontSize: 16, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 300ms var(--ease)',
                    boxShadow: '0 4px 20px rgba(0,168,132,0.25)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,168,132,0.35)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,168,132,0.25)' }}
                >
                  Share your experience
                  <span style={{ fontSize: 20, lineHeight: 1 }}>→</span>
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ===== REVIEW FORM ===== */}
      {showForm && (
        <section id="write-review" style={{
          padding: '80px 28px 100px',
          background: '#fff',
          animation: 'rw-fadeIn 0.3s var(--ease)',
        }}>
          <div style={{ maxWidth: 520, margin: '0 auto' }}>
            <div style={{
              display: 'flex', alignItems: 'flex-start',
              justifyContent: 'space-between', marginBottom: 32,
            }}>
              <div>
                <p style={{
                  display: 'inline-block',
                  fontSize: 11, fontWeight: 700, color: g,
                  letterSpacing: '3px', textTransform: 'uppercase',
                  margin: '0 0 10px',
                  padding: '4px 14px', borderRadius: 9999,
                  background: 'rgba(0,168,132,0.06)',
                }}>Write a review</p>
                <h2 style={{
                  fontSize: 30, fontWeight: 800, margin: 0,
                  letterSpacing: '-0.8px', color: '#000',
                }}>Tell us about your experience</h2>
                <p style={{
                  fontSize: 14, color: 'rgba(0,0,0,0.35)',
                  margin: '6px 0 0', lineHeight: 1.5,
                }}>Your feedback helps {bizName} serve you better.</p>
              </div>
              <button onClick={() => setShowForm(false)}
                style={{
                  width: 40, height: 40, borderRadius: '50%',
                  border: '1px solid rgba(0,0,0,0.06)',
                  background: '#f8f8f8', cursor: 'pointer',
                  fontSize: 16, color: 'rgba(0,0,0,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 200ms', fontFamily: 'inherit',
                  flexShrink: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#eee'; e.currentTarget.style.color = 'rgba(0,0,0,0.6)' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f8f8f8'; e.currentTarget.style.color = 'rgba(0,0,0,0.3)' }}
              >✕</button>
            </div>

            <form onSubmit={handleSubmit}
              style={{
                background: 'linear-gradient(135deg, #f8f8f8, #f5f5f5)',
                borderRadius: 24, padding: 36,
                border: '1px solid rgba(0,0,0,0.04)',
              }}
            >
              {/* Name */}
              <div style={{ marginBottom: 24 }}>
                <label style={{
                  display: 'block', fontSize: 12, fontWeight: 600,
                  color: 'rgba(0,0,0,0.4)', marginBottom: 6,
                  letterSpacing: '0.5px', textTransform: 'uppercase',
                }}>Your name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  required placeholder="e.g., Ankush Sharma"
                  style={{
                    width: '100%', padding: '14px 18px', borderRadius: 14,
                    boxSizing: 'border-box',
                    border: '1.5px solid rgba(0,0,0,0.06)',
                    fontSize: 15, color: '#000', outline: 'none',
                    background: '#fff',
                    fontFamily: 'inherit',
                    transition: 'all 250ms var(--ease)',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = g; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(0,168,132,0.08)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>

              {/* Rating */}
              <div style={{ marginBottom: 24 }}>
                <label style={{
                  display: 'block', fontSize: 12, fontWeight: 600,
                  color: 'rgba(0,0,0,0.4)', marginBottom: 10,
                  letterSpacing: '0.5px', textTransform: 'uppercase',
                }}>Rating</label>
                <div style={{
                  display: 'flex', gap: 4,
                  background: '#fff', padding: '12px 16px',
                  borderRadius: 14,
                  border: '1.5px solid rgba(0,0,0,0.06)',
                }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} type="button"
                      onClick={() => { setRating(n); setHover(0) }}
                      onMouseEnter={() => setHover(n)}
                      onMouseLeave={() => setHover(0)}
                      style={{
                        background: 'none', border: 'none',
                        fontSize: 34, cursor: 'pointer',
                        padding: '0 3px', lineHeight: 1,
                        color: (hover || rating) >= n ? starFull : '#e2e8f0',
                        transition: 'all 150ms var(--ease)',
                        transform: (hover || rating) >= n ? 'scale(1.1)' : 'scale(1)',
                        filter: (hover || rating) >= n ? 'brightness(1.1)' : 'none',
                      }}
                    >★</button>
                  ))}
                </div>
                <p style={{
                  fontSize: 12, color: 'rgba(0,0,0,0.25)',
                  margin: '6px 0 0',
                }}>
                  {rating === 0 ? 'Tap a star to rate' : rating === 1 ? 'Poor' : rating === 2 ? 'Fair' : rating === 3 ? 'Good' : rating === 4 ? 'Great' : 'Excellent!'}
                </p>
              </div>

              {/* Review text */}
              <div style={{ marginBottom: 24 }}>
                <label style={{
                  display: 'block', fontSize: 12, fontWeight: 600,
                  color: 'rgba(0,0,0,0.4)', marginBottom: 6,
                  letterSpacing: '0.5px', textTransform: 'uppercase',
                }}>Your review</label>
                <textarea value={text} onChange={e => setText(e.target.value)}
                  required
                  placeholder="What did you like? What could be better?"
                  rows={4}
                  style={{
                    width: '100%', padding: '14px 18px', borderRadius: 14,
                    boxSizing: 'border-box',
                    border: '1.5px solid rgba(0,0,0,0.06)',
                    fontSize: 15, color: '#000', outline: 'none',
                    background: '#fff', resize: 'vertical',
                    fontFamily: 'inherit', minHeight: 110,
                    lineHeight: 1.6,
                    transition: 'all 250ms var(--ease)',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = g; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(0,168,132,0.08)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  padding: '12px 16px', borderRadius: 12,
                  background: 'rgba(234,0,56,0.05)',
                  border: '1px solid rgba(234,0,56,0.08)',
                  fontSize: 13, color: '#ea0038',
                  marginBottom: 20, textAlign: 'center',
                }}>{error}</div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loading}
                style={{
                  width: '100%', padding: '16px',
                  borderRadius: 'var(--radius-pill)',
                  border: 'none',
                  background: loading ? '#ccc' : 'linear-gradient(135deg, var(--g), var(--g2))',
                  color: '#fff', fontSize: 16, fontWeight: 600,
                  cursor: loading ? 'default' : 'pointer',
                  transition: 'all 300ms var(--ease)',
                  fontFamily: 'inherit',
                  boxShadow: loading ? 'none' : '0 4px 16px rgba(0,168,132,0.2)',
                }}
                onMouseEnter={e => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,168,132,0.35)';
                  }
                }}
                onMouseLeave={e => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,168,132,0.2)';
                  }
                }}
              >{loading ? 'Submitting...' : 'Submit review'}</button>
            </form>
          </div>
        </section>
      )}

      {/* ===== FOOTER ===== */}
      <footer style={{ background: '#000', padding: '32px 28px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 24, height: 24, borderRadius: 6,
              background: 'linear-gradient(135deg, var(--g), var(--g2))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800, color: '#fff',
            }}>R</div>
            <span style={{ fontWeight: 500, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>ReviewWala</span>
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', textAlign: 'right' }}>
            <span>Want a free page like this for your business?{' '}</span>
            <a href="/" style={{
              color: g, textDecoration: 'none', fontWeight: 600,
              transition: 'color 200ms',
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#00c392'}
              onMouseLeave={e => e.currentTarget.style.color = g}
            >Get started free →</a>
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: '16px auto 0', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.15)' }}>
          Turn WhatsApp conversations into 5-star reviews
        </div>
      </footer>
    </div>
  )
}
