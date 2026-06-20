'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'signup' | 'login'>('signup')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState<Set<string>>(new Set())
  const observerRef = useRef<IntersectionObserver | null>(null)
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setVisible(prev => new Set(prev).add(entry.target.id))
      })
    }, { threshold: 0.08 })
    const els = document.querySelectorAll('[data-reveal]')
    els.forEach(el => observerRef.current?.observe(el))
    return () => observerRef.current?.disconnect()
  }, [])

  const v = (id: string) => visible.has(id) ? '1' : '0'

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    if (password !== rePassword) {
      setError('Passwords do not match'); setLoading(false); return
    }
    try {
      const res = await fetch('/api/signup', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone, businessName, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      router.push(`/dashboard?token=${data.token}&business=${data.business_slug}`)
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const res = await fetch('/api/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      router.push(`/dashboard?token=${data.token}&business=${data.business_slug}`)
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  const g = '#00a884'
  const ac = '#25d366'

  return (
    <div style={{ fontFamily: 'var(--font-sans)', background: '#fff', minHeight: '100vh', color: '#000', overflowX: 'hidden' }}>

      {/* ===== NAV ===== */}
      <header style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 50,
        background: scrolled ? '#000' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto', padding: '10px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: g,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, color: '#fff',
            }}>R</div>
            <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.3px', color: scrolled ? '#fff' : '#fff' }}>ReviewWala</span>
          </div>

          {/* Desktop nav */}
          <div className="rw-nav" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <div className="rw-nav-links" style={{ display: 'flex', gap: 28, alignItems: 'center', fontSize: 14 }}>
              {['Features', 'Pricing', 'Kyun ReviewWala?'].map(item => (
                <a key={item} href={`#${item === 'Kyun ReviewWala?' ? 'why' : item === 'Features' ? 'features' : 'pricing'}`} style={{
                  color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontWeight: 500,
                  fontSize: 13, letterSpacing: '0.3px', transition: 'color 200ms',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                >{item}</a>
              ))}
            </div>
            <a href="#signup" style={{
              padding: '8px 22px', borderRadius: 9999, border: 'none',
              background: g, color: '#fff', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', textDecoration: 'none', letterSpacing: '0.2px',
              transition: 'all 250ms',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#00c392'; e.currentTarget.style.transform = 'scale(1.03)' }}
              onMouseLeave={e => { e.currentTarget.style.background = g; e.currentTarget.style.transform = 'scale(1)' }}
            >Free shuru karein</a>
          </div>
        </div>
      </header>

      {/* ===== HERO — Split Layout ===== */}
      <section style={{
        background: '#000', minHeight: '100vh', display: 'flex', alignItems: 'center',
        padding: '80px 24px 0',
      }}>
        <style>{`
          @media (max-width: 768px) {
            .rw-hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
            .rw-hero-h1 { font-size: 36px !important; }
            .rw-hero-h1 br { display: none; }
            .rw-hero-sub { font-size: 15px !important; }
            .rw-phone-mockup { width: 280px !important; height: 560px !important; transform: scale(0.85); }
            .rw-metrics { gap: 20px !important; margin-top: 32px !important; flex-wrap: wrap; }
            nav.rw-nav { gap: 16px !important; }
            .rw-nav-links { gap: 16px !important; }
            .rw-feat-grid { grid-template-columns: 1fr 1fr !important; }
            .rw-why-split { grid-template-columns: 1fr !important; }
            .rw-pricing-grid { grid-template-columns: 1fr !important; max-width: 400px !important; }
            .rw-section-h2 { font-size: 28px !important; }
          }
          @media (max-width: 480px) {
            .rw-hero-h1 { font-size: 28px !important; }
            .rw-cta-row { flex-direction: column !important; align-items: stretch !important; }
            .rw-cta-row a { text-align: center; }
            .rw-phone-mockup { width: 240px !important; height: 480px !important; transform: scale(0.7); }
            nav.rw-nav { flex-wrap: wrap; justify-content: center; }
            .rw-nav-links { flex-wrap: wrap; justify-content: center; }
            .rw-feat-grid { grid-template-columns: 1fr !important; }
            .rw-section-h2 { font-size: 24px !important; }
          }
        `}</style>
        <div style={{
          maxWidth: 1100, margin: '0 auto', display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr', gap: 60, alignItems: 'center',
          width: '100%',
        }} className="rw-hero-grid">
          {/* Left */}
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 14px 4px 10px', borderRadius: 9999,
              border: '1px solid rgba(0,168,132,0.25)',
              background: 'rgba(0,168,132,0.08)', marginBottom: 24,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%', background: ac,
                animation: 'rw-pulse 2s infinite', display: 'inline-block',
              }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: g, letterSpacing: '0.4px', textTransform: 'uppercase' }}>
                Free · 2 minute mein setup
              </span>
            </div>

            <h1 className="rw-hero-h1" style={{
              fontSize: 52, fontWeight: 700, lineHeight: 1.05, margin: '0 0 20px',
              letterSpacing: '-1.5px', color: '#fff',
            }}>
              Apni dukaan ke liye<br />FREE website.<br />
              <span style={{ background: 'linear-gradient(135deg, #25d366, #00a884)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Google reviews dikhao, Grahak badhao.
              </span>
            </h1>

            <p className="rw-hero-sub" style={{
              fontSize: 17, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7,
              margin: '0 0 32px', maxWidth: 460,
            }}>
              WhatsApp pe ek link bhejo → Grahak rating dein → reviews aapki free website par dikhein. Koi app nahi, koi coding nahi. Sirf 2 minute.
            </p>

            <div className="rw-cta-row" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <a href="#signup" style={{
                display: 'inline-block', padding: '14px 32px', borderRadius: 9999, border: 'none',
                background: g, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer',
                textDecoration: 'none', letterSpacing: '-0.2px',
                transition: 'all 250ms cubic-bezier(0.2, 0, 0, 1)',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#00c392'; e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)' }}
                onMouseLeave={e => { e.currentTarget.style.background = g; e.currentTarget.style.transform = 'translateY(0) scale(1)' }}
              >Aaj hi shuru karein →</a>
              <a href="#features" style={{
                display: 'inline-block', padding: '14px 28px', borderRadius: 9999,
                border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)',
                fontSize: 14, fontWeight: 500, cursor: 'pointer', textDecoration: 'none',
                transition: 'all 250ms',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
              >Kaise kaam karta hai</a>
            </div>

            <div className="rw-metrics" style={{ display: 'flex', gap: 32, marginTop: 48, alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: 24, fontWeight: 700, margin: 0, color: '#fff' }}>2 min</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>Mein setup</p>
              </div>
              <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.1)' }} />
              <div>
                <p style={{ fontSize: 24, fontWeight: 700, margin: 0, color: '#fff' }}>1 line</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>Line copy-paste</p>
              </div>
              <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.1)' }} />
              <div>
                <p style={{ fontSize: 24, fontWeight: 700, margin: 0, color: '#fff' }}>₹0</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>Shuru karein</p>
              </div>
            </div>
          </div>

          {/* Right — Phone mockup */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="rw-phone-mockup" style={{
              width: 320, height: 640, borderRadius: 40,
              background: '#111b21', border: '3px solid #2a3942',
              boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
              position: 'relative',
            }}>
              {/* Phone notch */}
              <div style={{
                position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
                width: 120, height: 24, background: '#000', borderRadius: 20,
                zIndex: 2,
              }} />
              {/* Chat header */}
              <div style={{
                background: 'linear-gradient(180deg, #1f2c33, #1a2830)',
                padding: '28px 16px 10px', borderBottom: '1px solid #313d45',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: g, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>J</div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14, color: '#e9edef', margin: 0 }}>Jaikishan Chaat</p>
                  <p style={{ fontSize: 11, color: '#8696a0', margin: 0 }}>online</p>
                </div>
              </div>
              {/* Chat body */}
              <div style={{ flex: 1, background: '#0b141a', padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {/* Welcome bubble */}
                <div style={{
                  maxWidth: '85%', alignSelf: 'flex-start',
                  background: '#1f2c33', borderRadius: '4px 14px 14px 14px',
                  padding: '9px 13px', borderLeft: '3px solid rgba(0,168,132,0.3)',
                }}>
                  <p style={{ fontSize: 12, color: '#8696a0', margin: 0 }}>Namaste! Humein visit karne ke liye dhanyavaad. Kripya review dein 🙂</p>
                </div>
                {/* Existing review */}
                <div style={{
                  maxWidth: '85%', alignSelf: 'flex-start',
                  background: '#1f2c33', borderRadius: '4px 14px 14px 14px',
                  padding: '8px 12px', borderLeft: '3px solid rgba(0,168,132,0.3)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                    <span style={{ fontWeight: 600, fontSize: 12, color: g }}>Rahul</span>
                    <span style={{ color: '#f59e0b', fontSize: 10, letterSpacing: '1.5px' }}>★★★★★</span>
                  </div>
                  <p style={{ fontSize: 12, color: '#e9edef', margin: 0 }}>Best chaat in Delhi! Har baar same quality 🤤</p>
                </div>
                {/* Stars UI at bottom */}
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', gap: 2, padding: '8px 0' }}>
                  {[1,2,3,4,5].map(n => <span key={n} style={{ fontSize: 20, color: '#25d366' }}>★</span>)}
                </div>
                {/* Input area — always visible now */}
                <div style={{
                  background: g, borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 6, padding: '10px 12px', cursor: 'pointer',
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>⭐ Review dein</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES — Uber-style card grid ===== */}
      <section id="features" style={{ padding: '100px 24px', background: '#f6f6f6' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div id="features-h" data-reveal="true" style={{
            opacity: v('features-h'), transition: 'opacity 600ms, transform 600ms',
            transform: v('features-h') === '1' ? 'translateY(0)' : 'translateY(24px)',
            textAlign: 'center', marginBottom: 60,
          }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: g, letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px' }}>Kaise kaam karta hai</p>
            <h2 className="rw-section-h2" style={{ fontSize: 40, fontWeight: 700, margin: '0 auto', maxWidth: 500, letterSpacing: '-1px', lineHeight: 1.15 }}>
              Reviews collect karein — 3 steps
            </h2>
          </div>

          <div className="rw-feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              { num: '01', icon: '🔗', title: 'Apna review link paayein', desc: 'Register karein apna email aur dukaan ka naam. Aapko milega ek personal review link — yeh link aap kisi bhi customer ko WhatsApp pe bhej sakte hain. Jaise hi koi review deta hai, woh turant aapki free website par dikh jaata hai.' },
              { num: '02', icon: '💬', title: 'WhatsApp pe share karein', desc: 'Service ke baad customer ko link bhejein. Woh kholta hai, rating deta hai (1-5 stars), review likhta hai, submit karta hai. Total 30 second. Koi app download nahi, koi OTP nahi, koi login nahi. Isliye log karenge.' },
              { num: '03', icon: '🖥️', title: 'Website par dikhaayein', desc: 'Apni existing website par ek line copy-paste karein. Reviews apne aap update hote hain — naya review aate hi widget refresh. Mobile-friendly, beautiful, zero maintenance. Agar website nahi hai, toh hum aapko free website dete hain.' },
            ].map((f, i) => (
              <div key={f.num} id={`feat-${i}`} data-reveal="true" style={{
                opacity: v(`feat-${i}`),
                transition: 'opacity 600ms, transform 600ms, box-shadow 300ms',
                transitionDelay: `${i * 100}ms`,
                transform: v(`feat-${i}`) === '1' ? 'translateY(0)' : 'translateY(24px)',
                background: '#fff', borderRadius: 20, padding: '36px 28px',
                border: '1px solid rgba(0,0,0,0.04)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.07)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontSize: 32 }}>{f.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.15)', letterSpacing: '1px' }}>{f.num}</span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.3px' }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'rgba(0,0,0,0.55)', margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <a href="#signup" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              color: g, fontWeight: 600, fontSize: 14, textDecoration: 'none',
              letterSpacing: '-0.2px', transition: 'gap 200ms',
            }}
              onMouseEnter={e => e.currentTarget.style.gap = '12px'}
              onMouseLeave={e => e.currentTarget.style.gap = '8px'}
            >Saare features dekhein →</a>
          </div>
        </div>
      </section>

      {/* ===== WHY — Split section (Uber style) ===== */}
      <section id="why" style={{ padding: '100px 24px', background: '#fff' }}>
        <div className="rw-why-split" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div id="why-t" data-reveal="true" style={{
            opacity: v('why-t'), transition: 'opacity 600ms, transform 600ms',
            transform: v('why-t') === '1' ? 'translateY(0)' : 'translateY(24px)',
          }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: g, letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px' }}>Kyun ReviewWala?</p>
            <h2 className="rw-section-h2" style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.1, margin: '0 0 20px', letterSpacing: '-1px' }}>
              Reviews = Grahak.<br />ReviewWala = sabse easy<br />tareeka reviews collect karne ka.
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(0,0,0,0.55)', lineHeight: 1.7, margin: '0 0 28px', maxWidth: 420 }}>
              87% log review dekh kar hi shop jaate hain. ReviewWala se aapko free milta hai: ek website, ek review widget, aur ek WhatsApp collection link. Koi tech knowledge nahi chahiye, koi budget nahi. Sirf ek cheez chahiye — aapke customers.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { h: 'Free website + widget dono', d: 'Har business ko milegi ek free, professional website. Reviews apne aap dikhte hain. Mobile-optimized, Google-friendly. Agar website already hai, toh sirf 1-line widget lagaayein.' },
                { h: '30-second review process', d: 'Customer link kholta hai, rating deta hai, review likhta hai, submit karta hai. 30 second mein done. Koi OTP nahi, koi login nahi, koi app nahi. Agar easy nahi hoga, toh koi nahi karega.' },
                { h: 'Zero effort maintenance', d: 'Ek baar setup karo, bhool jao. Naya review aate hi website aur widget dono update ho jaate hain. Aapko kuch nahi karna — bas apna kaam karte raho.' },
              ].map(item => (
                <div key={item.h} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', background: 'rgba(0,168,132,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1, flexShrink: 0,
                  }}><span style={{ color: g, fontSize: 11 }}>✓</span></div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>{item.h}</p>
                    <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.45)', margin: '1px 0 0' }}>{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Right — device mockup stack */}
          <div id="why-i" data-reveal="true" style={{
            opacity: v('why-i'), transition: 'opacity 600ms, transform 600ms',
            transform: v('why-i') === '1' ? 'translateY(0)' : 'translateY(24px)',
            display: 'flex', justifyContent: 'center',
          }}>
            <div style={{
              width: '100%', maxWidth: 400, aspectRatio: '4/3',
              background: '#f6f6f6', borderRadius: 24, position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Desktop mockup */}
              <div style={{
                position: 'absolute', top: '8%', left: '8%', right: '8%', bottom: '8%',
                background: '#fff', borderRadius: 16, boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
                display: 'flex', flexDirection: 'column',
              }}>
                <div style={{ padding: '10px 14px', background: '#fafafa', borderBottom: '1px solid #eee', display: 'flex', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ddd' }} />
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ddd' }} />
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ddd' }} />
                  <div style={{ flex: 1, height: 8, background: '#eee', borderRadius: 4, marginLeft: 40 }} />
                </div>
                <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Jaikishan Chaat</div>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                    {[1,2,3,4,5].map(n => <span key={n} style={{ color: '#f59e0b', fontSize: 14 }}>★</span>)}
                    <span style={{ fontSize: 12, color: '#999', marginLeft: 4 }}>4.9 · 23 reviews</span>
                  </div>
                  {['"Best chaat in Chandni Chowk!"', '"Aloo tikki is amazing, must try."', '"Har baar same taste. Consistent!"'].map((t, i) => (
                    <div key={i} style={{ padding: '8px 10px', background: '#f6f6f6', borderRadius: 8 }}>
                      <p style={{ margin: 0, fontSize: 11, color: '#666' }}>{t}</p>
                    </div>
                  ))}
                  {/* Floating widget indicator */}
                  <div style={{ marginTop: 'auto', alignSelf: 'flex-end', padding: '4px 10px', borderRadius: 9999, background: g, color: '#fff', fontSize: 10, fontWeight: 600 }}>
                    ⭐ Review dein
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRICING — Clean cards ===== */}
      <section id="pricing" style={{ padding: '100px 24px', background: '#f6f6f6' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div id="price-h" data-reveal="true" style={{
            opacity: v('price-h'), transition: 'opacity 600ms, transform 600ms',
            transform: v('price-h') === '1' ? 'translateY(0)' : 'translateY(24px)',
            textAlign: 'center', marginBottom: 48,
          }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: g, letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px' }}>Pricing</p>
            <h2 className="rw-section-h2" style={{ fontSize: 36, fontWeight: 700, margin: '0 auto', maxWidth: 500, letterSpacing: '-1px', lineHeight: 1.15 }}>
              Free shuru karein. Jab reviews aane lagein, tab pay karein.
            </h2>
          </div>

          <div className="rw-pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, maxWidth: 600, margin: '0 auto' }}>
            {[
              { name: 'Free', price: '₹0', badge: null, features: ['15 reviews', 'Basic widget', 'Watermark', 'Email support'] },
              { name: 'Pro', price: '₹199/mo', badge: 'POPULAR', features: ['Unlimited reviews', 'No watermark', 'CSV export', 'Priority support', 'Custom colors'] },
            ].map((p, i) => (
              <div key={p.name} id={`price-${i}`} data-reveal="true" style={{
                opacity: v(`price-${i}`),
                transition: 'opacity 600ms, transform 600ms, box-shadow 300ms',
                transitionDelay: `${i * 100}ms`,
                transform: v(`price-${i}`) === '1' ? 'translateY(0)' : 'translateY(24px)',
                background: '#fff', borderRadius: 20, padding: '32px 28px',
                border: p.badge ? `2px solid ${g}` : '1px solid rgba(0,0,0,0.06)',
                boxShadow: p.badge ? '0 8px 32px rgba(0,168,132,0.1)' : 'none',
                position: 'relative',
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 48px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = p.badge ? '0 8px 32px rgba(0,168,132,0.1)' : 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                {p.badge && (
                  <div style={{
                    position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                    padding: '3px 16px', borderRadius: 9999, background: g, color: '#fff',
                    fontSize: 11, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase',
                  }}>{p.badge}</div>
                )}
                <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 4px', letterSpacing: '-0.2px' }}>{p.name}</p>
                <p style={{ fontSize: 32, fontWeight: 700, margin: '0 0 20px', letterSpacing: '-1px' }}>{p.price}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {p.features.map(f => (
                    <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ color: g, fontSize: 12 }}>✓</span>
                      <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.6)' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <a href="#signup" style={{
                  display: 'block', marginTop: 24, padding: '10px', borderRadius: 9999,
                  textAlign: 'center', border: p.badge ? 'none' : '1px solid rgba(0,0,0,0.1)',
                  background: p.badge ? g : 'transparent', color: p.badge ? '#fff' : '#000',
                  fontSize: 13, fontWeight: 600, textDecoration: 'none',
                  transition: 'all 200ms',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = p.badge ? '#00c392' : 'rgba(0,0,0,0.03)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = p.badge ? g : 'transparent' }}
                >Shuru karein</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SIGNUP — Clean form ===== */}
      <section id="signup" style={{ padding: '100px 24px', background: '#000' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div id="signup-s" data-reveal="true" style={{
            opacity: v('signup-s'), transition: 'opacity 600ms, transform 600ms',
            transform: v('signup-s') === '1' ? 'translateY(0)' : 'translateY(20px)',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: g, letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px' }}>{mode === 'signup' ? 'Shuru karein' : 'Welcome back'}</p>
            <h2 style={{ fontSize: 36, fontWeight: 700, color: '#fff', margin: '0 0 8px', letterSpacing: '-1px' }}>
              {mode === 'signup' ? 'Free account banayein' : 'Login karein'}
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', margin: '0 0 36px' }}>
              {mode === 'signup' ? 'Koi credit card nahi. Koi code nahi. 30 second.' : 'Apne account mein jayein.'}
            </p>
          </div>

          {/* Mode Toggle */}
          <div style={{ display: 'flex', gap: 0, marginBottom: 24, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4 }}>
            <button type="button" onClick={() => { setMode('signup'); setError(''); setPassword(''); setRePassword('') }}
              style={{
                flex: 1, padding: '10px', borderRadius: 10, border: 'none',
                background: mode === 'signup' ? g : 'transparent',
                color: mode === 'signup' ? '#fff' : 'rgba(255,255,255,0.5)',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                transition: 'all 200ms', fontFamily: 'inherit',
              }}
            >Sign Up</button>
            <button type="button" onClick={() => { setMode('login'); setError(''); setPassword('') }}
              style={{
                flex: 1, padding: '10px', borderRadius: 10, border: 'none',
                background: mode === 'login' ? g : 'transparent',
                color: mode === 'login' ? '#fff' : 'rgba(255,255,255,0.5)',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                transition: 'all 200ms', fontFamily: 'inherit',
              }}
            >Login</button>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.04)', borderRadius: 20, padding: 36,
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <form onSubmit={mode === 'signup' ? handleSignup : handleLogin}>
              <div style={{ marginBottom: 16 }}>
                <label style={{
                  display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)',
                  marginBottom: 6, letterSpacing: '0.5px', textTransform: 'uppercase',
                }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  required placeholder="aapka@email.com"
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 12, boxSizing: 'border-box',
                    border: '1.5px solid rgba(255,255,255,0.1)', fontSize: 15, color: '#fff',
                    outline: 'none', background: 'rgba(255,255,255,0.04)',
                    transition: 'all 200ms', fontFamily: 'inherit',
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = g}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
              {mode === 'signup' && (
              <div style={{ marginBottom: 16 }}>
                <label style={{
                  display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)',
                  marginBottom: 6, letterSpacing: '0.5px', textTransform: 'uppercase',
                }}>Phone number</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  required placeholder="+91 98765 43210"
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 12, boxSizing: 'border-box',
                    border: '1.5px solid rgba(255,255,255,0.1)', fontSize: 15, color: '#fff',
                    outline: 'none', background: 'rgba(255,255,255,0.04)',
                    transition: 'all 200ms', fontFamily: 'inherit',
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = g}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
              )}
              {mode === 'signup' && (
              <div style={{ marginBottom: 16 }}>
                <label style={{
                  display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)',
                  marginBottom: 6, letterSpacing: '0.5px', textTransform: 'uppercase',
                }}>Dukaan ka naam</label>
                <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)}
                  required placeholder="Jaikishan Chaat Bhandar"
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 12, boxSizing: 'border-box',
                    border: '1.5px solid rgba(255,255,255,0.1)', fontSize: 15, color: '#fff',
                    outline: 'none', background: 'rgba(255,255,255,0.04)',
                    transition: 'all 200ms', fontFamily: 'inherit',
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = g}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
              )}
              <div style={{ marginBottom: 16 }}>
                <label style={{
                  display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)',
                  marginBottom: 6, letterSpacing: '0.5px', textTransform: 'uppercase',
                }}>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  required placeholder="At least 8 characters"
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 12, boxSizing: 'border-box',
                    border: '1.5px solid rgba(255,255,255,0.1)', fontSize: 15, color: '#fff',
                    outline: 'none', background: 'rgba(255,255,255,0.04)',
                    transition: 'all 200ms', fontFamily: 'inherit',
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = g}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
              {mode === 'signup' && (
              <div style={{ marginBottom: 24 }}>
                <label style={{
                  display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)',
                  marginBottom: 6, letterSpacing: '0.5px', textTransform: 'uppercase',
                }}>Re-enter password</label>
                <input type="password" value={rePassword} onChange={e => setRePassword(e.target.value)}
                  required placeholder="Re-enter your password"
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 12, boxSizing: 'border-box',
                    border: '1.5px solid rgba(255,255,255,0.1)', fontSize: 15, color: '#fff',
                    outline: 'none', background: 'rgba(255,255,255,0.04)',
                    transition: 'all 200ms', fontFamily: 'inherit',
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = g}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
              )}

              {error && (
                <div style={{
                  padding: '10px 14px', borderRadius: 10,
                  background: 'rgba(234,0,56,0.08)', border: '1px solid rgba(234,0,56,0.15)',
                  fontSize: 13, color: '#ea0038', marginBottom: 16, textAlign: 'center',
                }}>{error}</div>
              )}

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '14px', borderRadius: 9999, border: 'none',
                background: loading ? '#555' : g,
                color: '#fff', fontSize: 15, fontWeight: 600, cursor: loading ? 'default' : 'pointer',
                transition: 'all 250ms cubic-bezier(0.2, 0, 0, 1)',
                letterSpacing: '-0.2px',
              }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#00c392'; e.currentTarget.style.transform = 'translateY(-1px)' } }}
                onMouseLeave={e => { if (!loading) { e.currentTarget.style.background = g; e.currentTarget.style.transform = 'translateY(0)' } }}
              >{loading
                ? (mode === 'signup' ? 'Account bana rahe hain...' : 'Login ho raha hai...')
                : (mode === 'signup' ? 'Free account banayein' : 'Login karein')}</button>
            </form>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{
        background: '#000', borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '24px 24px',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 24, height: 24, borderRadius: 6, background: g,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: '#fff',
            }}>R</div>
            <span style={{ fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>ReviewWala</span>
          </div>
          <div style={{ display: 'flex', gap: 24, fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
            <a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Features</a>
            <a href="#pricing" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing</a>
            <span>© 2026 ReviewWala</span>
          </div>
        </div>
      </footer>

      {/* Animations */}
      <style>{`
        @keyframes rw-pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(1.15); } }
      `}</style>
    </div>
  )
}
