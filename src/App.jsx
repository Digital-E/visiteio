import { useState, useRef, useEffect } from 'react'
import './App.css'
import doctorImg from './assets/doctor.jpg'
import dental1Img from './assets/dental1.jpg'
import dental2Img from './assets/dental2.jpg'

const IMAGES = {
  doctor:    doctorImg,
  detartrage: dental1Img,
  caries:     dental2Img,
  justine:   'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/e62bc766-0073-4e0a-b00a-8459594c3520',
  maxime:    'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/ba41f309-a924-4fae-b55a-f38633e444df',
  salome:    'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/5eb08cb9-21b9-432e-a125-1ae4454de456',
  zoe:       'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/2d26c07f-ee6c-446c-b841-23618628dd3f',
  julien:    'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/15154f76-8f42-4e00-9f09-a44b1fb919cd',
}

const SCHEDULE = [
  ['Lundi',    '09:00 – 17:00'],
  ['Mardi',    '09:00 – 17:00'],
  ['Mercredi', '09:00 – 12:00'],
  ['Jeudi',    '09:00 – 12:00'],
  ['Vendredi', '09:00 – 12:00'],
  ['Samedi',   'Fermé'],
  ['Dimanche', 'Fermé'],
]

function isOpen() {
  const now = new Date()
  const day = now.getDay() // 0=Sun,1=Mon,...,6=Sat
  const minutes = now.getHours() * 60 + now.getMinutes()
  // SCHEDULE is Mon–Sun (index 0=Mon), JS day 0=Sun
  const scheduleIdx = day === 0 ? 6 : day - 1
  const hours = SCHEDULE[scheduleIdx][1]
  if (hours === 'Fermé') return false
  const [start, end] = hours.split(' – ').map(t => {
    const [h, m] = t.split(':').map(Number)
    return h * 60 + m
  })
  return minutes >= start && minutes < end
}

const ACCESS_TABS = [
  {
    id: 'transport',
    label: 'Moyens de transport',
    content: (
      <>
        Bus - France-Les Castors (lignes 4, 23 et 44)<br />
        Bus - St Hubert (lignes 23 et 44)<br />
        Bus - Carnot (lignes 4 et 23)
      </>
    ),
  },
  {
    id: 'parking',
    label: 'Stationnement',
    content: (
      <>
        Parking public disponible à proximité.<br />
        Stationnement gratuit en voirie (zone bleue).
      </>
    ),
  },
  {
    id: 'access',
    label: 'Accessibilité',
    content: (
      <>
        Cabinet accessible aux personnes à mobilité réduite.<br />
        Ascenseur disponible.
      </>
    ),
  },
]

const FAQ_ITEMS = [
  {
    q: 'À quelle fréquence dois-je faire un détartrage\u00a0?',
    a: 'Un détartrage est recommandé une à deux fois par an selon votre hygiène bucco-dentaire et votre tendance à former du tartre. Votre dentiste déterminera la fréquence la plus adaptée lors de votre bilan annuel.',
  },
  {
    q: "Est-ce qu\u2019une dévitalisation fait mal\u00a0?",
    a: "Non, l\u2019intervention se déroule sous anesthésie locale et est indolore. Des douleurs légères peuvent persister quelques jours après le soin, facilement soulagées par des antalgiques courants.",
  },
  {
    q: 'Quels sont les tarifs pratiqués et le cabinet prend-il la Carte Vitale\u00a0?',
    a: 'Le cabinet est conventionné secteur 1, les tarifs sont donc ceux fixés par la Sécurité sociale. La Carte Vitale est acceptée et le remboursement est transmis directement à votre caisse d\u2019assurance maladie.',
  },
  {
    q: 'Proposez-vous le tiers-payant\u00a0?',
    a: 'Oui, le tiers-payant est disponible pour la part prise en charge par l\u2019Assurance Maladie. Pour la part mutuelle, renseignez-vous auprès de votre complémentaire santé.',
  },
]

const REVIEWS = [
  {
    id: 1,
    name: 'Justine',
    rating: 4,
    ratingLabel: 'Excellent',
    title: 'Soin à la hauteur de mes attentes',
    comment: 'Super rendez-vous, ponctuel et consciencieux',
    avatar: IMAGES.justine,
    date: 'Il y a 2 jours',
  },
  {
    id: 2,
    name: 'Marie',
    rating: 5,
    ratingLabel: 'Parfait',
    title: 'Prestation impeccable',
    comment: 'Très professionnel, je recommande vivement ce service',
    avatar: IMAGES.salome,
    date: 'Il y a 5 jours',
  },
  {
    id: 3,
    name: 'Thomas',
    rating: 5,
    ratingLabel: 'Parfait',
    title: 'Excellent service',
    comment: "Rien à redire, tout était parfait du début à la fin",
    avatar: IMAGES.julien,
    date: 'Il y a 1 semaine',
  },
  {
    id: 4,
    name: 'Sophie',
    rating: 4,
    ratingLabel: 'Excellent',
    title: 'Très satisfaite',
    comment: "Bonne expérience, personnel à l'écoute et professionnel",
    avatar: IMAGES.zoe,
    date: 'Il y a 2 semaines',
  },
]

const SERVICES = [
  {
    title: 'Détartrage',
    img: IMAGES.detartrage,
    desc: 'Nettoyage professionnel en profondeur qui élimine le tartre et la plaque dentaire pour assainir les gencives et prévenir les caries.',
  },
  {
    title: 'Soins caries',
    img: IMAGES.caries,
    desc: 'Éliminer les tissus infectés pour ensuite obturer et reconstruire la dent, stoppant ainsi la progression de la lésion.',
  },
  {
    title: 'Blanchiment',
    img: IMAGES.detartrage,
    desc: 'Traitement esthétique qui éclaircit l\u2019émail et redonne aux dents un aspect naturellement blanc et lumineux.',
  },
  {
    title: 'Couronne dentaire',
    img: IMAGES.caries,
    desc: 'Prothèse fixe sur mesure qui recouvre et protège une dent fragilisée tout en restaurant son esthétique et sa fonction.',
  },
]

// ── Shared icons ──────────────────────────────────────────────────────────────

function ArrowRight({ color = '#000' }) {
  return (
    <svg width="5" height="9" viewBox="0 0 5 9" fill="none">
      <path d="M1 1L4 4.5L1 8" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function DropdownBtn({ open, onClick }) {
  return (
    <button className={`dropdown-btn${open ? ' open' : ''}`} onClick={onClick} aria-expanded={open}>
      <svg width="9" height="9" fill="none" viewBox="0 0 5 9" style={{ transform: open ? 'rotate(270deg)' : 'rotate(90deg)', transition: 'transform 0.2s ease' }}>
        <path d={ARROW_PATH} fill="#000" />
      </svg>
    </button>
  )
}

function Collapsible({ title, children }) {
  const [open, setOpen] = useState(false)
  const toggle = () => setOpen(o => !o)
  return (
    <div className="section">
      <div className="section-header clickable" onClick={toggle}>
        <span className="section-title">{title}</span>
        <DropdownBtn open={open} onClick={e => { e.stopPropagation(); toggle() }} />
      </div>
      <div className={`collapsible-content${open ? ' open' : ''}`}>
        <div className="collapsible-body">{children}</div>
      </div>
    </div>
  )
}

function Header() {
  return (
    <div className="header">
      <a className="pill" href="tel:+33616632760">
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
          <path d="M1.81 3.895C2.53 5.31 3.69 6.465 5.105 7.19L6.205 6.09C6.34 5.955 6.54 5.91 6.715 5.97C7.275 6.155 7.88 6.255 8.5 6.255C8.775 6.255 9 6.48 9 6.755V8.5C9 8.775 8.775 9 8.5 9C3.805 9 0 5.195 0 0.5C0 0.225 0.225 0 0.5 0H2.25C2.525 0 2.75 0.225 2.75 0.5C2.75 1.125 2.85 1.725 3.035 2.285C3.09 2.46 3.05 2.655 2.91 2.795L1.81 3.895Z" fill="black"/>
        </svg>
        Contact
      </a>
      <div className="pill pill-open">
        <span className={isOpen() ? 'dot-green' : 'dot-red'} />
        {isOpen() ? 'Ouvert' : 'Fermé'}
      </div>
    </div>
  )
}

function BioCard() {
  return (
    <div className="bio-card">
      <div className="bio-text">
        <div className="bio-name">Dr. Joao Maria Mendes</div>
        <div className="bio-specialty">Chirurgien-Dentiste à Pessac</div>
        <a className="bio-link" href="https://www.doctolib.fr/dentiste/pessac/maria-joao-mendes#presentation" target="_blank" rel="noreferrer">Doctolib</a>
        <div className="bio-label">Adresse</div>
        <div className="bio-address">
          73 Av. du Général Leclerc<br />33600 Pessac
        </div>
        <a className="bio-link" href="https://maps.app.goo.gl/J9Hnp76zi6duitAC7" target="_blank" rel="noreferrer">
          Ouvrir dans Maps
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style={{ marginLeft: 4, verticalAlign: 'middle' }}>
            <path d="M2 9L9 2M9 2H3.5M9 2V7.5" stroke="#1d19ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
      <img className="bio-photo" src={IMAGES.doctor} alt="Dr. Joao Maria Mendes" />
    </div>
  )
}

function AccessSection() {
  const [activeTab, setActiveTab] = useState('transport')
  const active = ACCESS_TABS.find(t => t.id === activeTab)
  return (
    <div className="section">
      <div className="access-tabs">
        {ACCESS_TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="access-info">{active.content}</div>
    </div>
  )
}

function HorairesSection() {
  const [open, setOpen] = useState(false)
  return (
    <div className="section">
      <div className="section-header clickable" onClick={() => setOpen(o => !o)}>
        <span className="section-title">Horaires</span>
        <DropdownBtn open={open} onClick={e => { e.stopPropagation(); setOpen(o => !o) }} />
      </div>
      <div className={`collapsible-content${open ? ' open' : ''}`}>
        <div className="schedule">
          {SCHEDULE.map(([day, hours], i) => (
            <div key={day} className={`schedule-row${i % 2 === 1 ? ' alt' : ''}`}>
              <span className="schedule-left">
                <span className={hours === 'Fermé' ? 'dot-gray' : 'dot-green'} />
                <span className="schedule-day">{day}</span>
              </span>
              <span className="schedule-hours" style={hours === 'Fermé' ? { color: '#999' } : undefined}>{hours}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PrestationsSection() {
  const [cardIndex, setCardIndex] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const wrapRef = useRef(null)
  const touchStartX = useRef(null)
  const dragOffsetRef = useRef(0)
  const cardIndexRef = useRef(0)

  const CARD_STEP = 372 // 360px card + 12px gap
  const MAX_OFFSET = Math.max(0, 25 + SERVICES.length * 360 + (SERVICES.length - 1) * 12 + 25 - 440)

  const goTo = index => {
    const clamped = Math.max(0, Math.min(SERVICES.length - 1, index))
    cardIndexRef.current = clamped
    setCardIndex(clamped)
  }
  const scroll = dir => goTo(cardIndexRef.current + dir)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const onTouchStart = e => {
      touchStartX.current = e.touches[0].clientX
      setDragging(true)
    }
    const onTouchMove = e => {
      if (touchStartX.current === null) return
      const dx = e.touches[0].clientX - touchStartX.current
      if (Math.abs(dx) > 5) e.preventDefault()
      dragOffsetRef.current = dx
      setDragOffset(dx)
    }
    const onTouchEnd = () => {
      const dx = dragOffsetRef.current
      if (dx < -30) goTo(cardIndexRef.current + 1)
      else if (dx > 30) goTo(cardIndexRef.current - 1)
      dragOffsetRef.current = 0
      setDragOffset(0)
      setDragging(false)
      touchStartX.current = null
    }
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [cardIndex])

  const offset = Math.min(cardIndex * CARD_STEP, MAX_OFFSET)
  const trackStyle = {
    transform: `translateX(calc(-${offset}px + ${dragOffset}px))`,
    transition: dragging ? 'none' : 'transform 0.3s ease',
  }

  return (
    <div className="section">
      <div className="section-header">
        <span className="section-title">Préstations</span>
        <div className="prestations-nav">
          <button className="prestations-nav-btn" onClick={() => scroll(-1)} aria-label="Previous">
            <svg width="9" height="9" fill="none" viewBox="0 0 5 9" style={{ transform: 'rotate(180deg)' }}>
              <path d={ARROW_PATH} fill="#000" />
            </svg>
          </button>
          <button className="prestations-nav-btn" onClick={() => scroll(1)} aria-label="Next">
            <svg width="9" height="9" fill="none" viewBox="0 0 5 9">
              <path d={ARROW_PATH} fill="#000" />
            </svg>
          </button>
        </div>
      </div>
      <div className="prestations-wrap" ref={wrapRef}>
        <div className="prestations-track" style={trackStyle}>
          {SERVICES.map(s => (
            <div key={s.title} className="prestations-slide">
              <div className="service-card">
                <img className="service-card-img" src={s.img} alt={s.title} />
                <div className="service-card-body">
                  <div className="service-card-title">{s.title}</div>
                  <div className="service-card-desc">{s.desc}</div>
                  <a className="learn-more" href="#">
                    En savoir plus <ArrowRight color="#1D19FF" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FaqSection() {
  const [openIdx, setOpenIdx] = useState(null)
  const toggle = i => setOpenIdx(prev => (prev === i ? null : i))
  return (
    <div className="section">
      <div className="section-header">
        <span className="section-title">FAQ</span>
      </div>
      <div className="faq-list">
        {FAQ_ITEMS.map(({ q, a }, i) => (
          <div key={i} className="faq-item-wrap">
            <div className="faq-item" onClick={() => toggle(i)}>
              <span className="faq-question">{q}</span>
              <DropdownBtn open={openIdx === i} onClick={() => toggle(i)} />
            </div>
            <div className={`collapsible-content${openIdx === i ? ' open' : ''}`} style={{ '--max-h': '200px' }}>
              <div className="collapsible-body faq-answer">{a}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const STAR_PATH = 'M2.42708 8.75L3.10417 5.82292L0.833333 3.85417L3.83333 3.59375L5 0.833333L6.16667 3.59375L9.16667 3.85417L6.89583 5.82292L7.57292 8.75L5 7.19792L2.42708 8.75Z'
const ARROW_PATH = 'M0 0.735543L0.743627 0L4.79398 4.00871C4.85927 4.07295 4.91108 4.14933 4.94644 4.23347C4.9818 4.3176 5 4.40783 5 4.49896C5 4.59009 4.9818 4.68032 4.94644 4.76445C4.91108 4.84859 4.85927 4.92497 4.79398 4.98921L0.743627 9L0.000700823 8.26446L3.80224 4.5L0 0.735543Z'

function ReviewStarIcon({ filled }) {
  return (
    <svg width="10" height="10" fill="none" viewBox="0 0 10 10">
      <path d={STAR_PATH} fill={filled ? '#000' : '#C6C6C6'} />
    </svg>
  )
}

function ReviewCard({ name, rating, ratingLabel, title, comment, avatar, date }) {
  return (
    <div className="rc-card">
      <div className="rc-top">
        <div className="rc-rating">
          <span className="rc-rating-label">{ratingLabel}</span>
          <div className="rc-stars">
            {[1,2,3,4,5].map(n => <ReviewStarIcon key={n} filled={n <= rating} />)}
          </div>
        </div>
        <span className="rc-date">{date}</span>
      </div>
      <h3 className="rc-title">{title}</h3>
      <p className="rc-comment">{comment}</p>
      <div className="rc-footer">
        <img className="rc-avatar" src={avatar} alt={name} />
        <span className="rc-name">{name}</span>
      </div>
    </div>
  )
}

// Infinite carousel: [clone of last, ...slides, clone of first]
const INFINITE = [REVIEWS[REVIEWS.length - 1], ...REVIEWS, REVIEWS[0]]

function AvisSection() {
  // Start at 1 (the real first slide)
  const [pos, setPos] = useState(1)
  const [animated, setAnimated] = useState(true)
  const [dragOffset, setDragOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const touchStartX = useRef(null)
  const carouselRef = useRef(null)
  const dragOffsetRef = useRef(0)
  const locked = useRef(false)
  const posRef = useRef(1)

  // Real index for display (0-based)
  const clampedPos = Math.max(0, Math.min(INFINITE.length - 1, pos))
  const realIndex = clampedPos === 0 ? REVIEWS.length - 1 : clampedPos === INFINITE.length - 1 ? 0 : clampedPos - 1

  const goTo = nextPos => {
    if (locked.current) return
    locked.current = true
    posRef.current = nextPos
    setAnimated(true)
    setPos(nextPos)
  }
  const next = () => goTo(posRef.current + 1)
  const prev = () => goTo(posRef.current - 1)

  // After sliding to a clone, silently jump to the real slide
  const onTransitionEnd = () => {
    if (posRef.current === 0) {
      setAnimated(false)
      posRef.current = REVIEWS.length
      setPos(REVIEWS.length)
    } else if (posRef.current === INFINITE.length - 1) {
      setAnimated(false)
      posRef.current = 1
      setPos(1)
    }
    locked.current = false
  }

  useEffect(() => {
    const el = carouselRef.current
    if (!el) return
    const onTouchStart = e => {
      touchStartX.current = e.touches[0].clientX
      setDragging(true)
    }
    const onTouchMove = e => {
      if (touchStartX.current === null) return
      const dx = e.touches[0].clientX - touchStartX.current
      if (Math.abs(dx) > 5) e.preventDefault()
      dragOffsetRef.current = dx
      setDragOffset(dx)
    }
    const onTouchEnd = () => {
      const dx = dragOffsetRef.current
      if (dx < -50) goTo(posRef.current + 1)
      else if (dx > 50) goTo(posRef.current - 1)
      dragOffsetRef.current = 0
      setDragOffset(0)
      setDragging(false)
      touchStartX.current = null
    }
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  const trackStyle = {
    transform: `translateX(calc(-${pos * 100}% + ${dragOffset}px))`,
    transition: dragging || !animated ? 'none' : 'transform 0.3s ease',
  }

  return (
    <div className="section">
      <div className="rs-header">
        <div className="rs-title-group">
          <span className="section-title">Avis</span>
          <span className="rs-count">({REVIEWS.length})</span>
        </div>
        <div className="rs-nav">
          <span className="rs-counter">{realIndex + 1} / {REVIEWS.length}</span>
          <div className="rs-nav-btns">
            <button className="rs-nav-btn" onClick={prev} aria-label="Previous">
              <svg width="9" height="9" fill="none" viewBox="0 0 5 9" style={{ transform: 'rotate(180deg)' }}>
                <path d={ARROW_PATH} fill="#000" />
              </svg>
            </button>
            <button className="rs-nav-btn" onClick={next} aria-label="Next">
              <svg width="9" height="9" fill="none" viewBox="0 0 5 9">
                <path d={ARROW_PATH} fill="#000" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="rs-carousel" ref={carouselRef}>
        <div className="rs-track" style={trackStyle} onTransitionEnd={onTransitionEnd}>
          {INFINITE.map((r, i) => (
            <div key={i} className="rs-slide">
              <ReviewCard {...r} />
            </div>
          ))}
        </div>
      </div>
      <button className="rs-voir-plus">
        Voir plus
        <svg width="9" height="9" fill="none" viewBox="0 0 5 9">
          <path d={ARROW_PATH} fill="#000" />
        </svg>
      </button>
    </div>
  )
}

function Footer() {
  return (
    <div className="footer">
      <div className="footer-created">
        Site créé avec&nbsp;<span className="footer-badge">Visite.io</span>
      </div>
      <div className="footer-copy">Copyright © 2026 Visite.io Tous droits réservés.</div>
      <div className="footer-legal">Utilisation des cookies | Conditions d'utilisation | Mentions légales</div>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="phone">
      <Header />
      <BioCard />
      <AccessSection />
      <HorairesSection />
      <PrestationsSection />
      <FaqSection />
      <AvisSection />
      <Collapsible title="Équipements">
        Radio numérique, Scanner intra-oral, Détartrage ultrasonique, Fauteuil ergonomique
      </Collapsible>
      <Collapsible title="Informations Complémentaires">
        Conventionné secteur 1. Carte Vitale acceptée. Prise en charge mutuelle selon contrat.
      </Collapsible>
      <Footer />
    </div>
  )
}
