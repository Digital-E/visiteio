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
    detail: "Le détartrage est un acte préventif essentiel réalisé à l'aide d'ultrasons et d'instruments manuels. Il permet d'éliminer les dépôts de tartre qui s'accumulent sur les dents et sous les gencives, zones inaccessibles au brossage quotidien.\n\nLe tartre est une plaque bactérienne calcifiée qui favorise les inflammations gingivales, la parodontite et l'apparition de caries. En le retirant régulièrement, on réduit significativement ces risques et on maintient une bonne santé bucco-dentaire.\n\nL'acte se termine par un polissage des surfaces dentaires pour éliminer les colorations superficielles dues au café, au thé ou au tabac. Un détartrage est recommandé une à deux fois par an selon votre situation.",
  },
  {
    title: 'Soins caries',
    img: IMAGES.caries,
    desc: 'Éliminer les tissus infectés pour ensuite obturer et reconstruire la dent, stoppant ainsi la progression de la lésion.',
    detail: "Les soins de caries consistent à traiter une lésion avant qu'elle n'atteigne la pulpe dentaire. Sous anesthésie locale, le praticien retire les tissus infectés à l'aide d'une fraise puis nettoie soigneusement la cavité.\n\nLa dent est ensuite reconstruite avec un composite (résine blanche) ou un amalgame selon la localisation et l'étendue de la lésion. Le composite est photopolymérisé couche par couche pour garantir une solidité optimale et un rendu esthétique naturel.\n\nSans traitement, une carie évolue progressivement vers la pulpe, nécessitant alors une dévitalisation. Intervenir tôt permet de préserver un maximum de tissu dentaire sain et de prolonger la durée de vie de la dent.",
  },
  {
    title: 'Blanchiment',
    img: IMAGES.detartrage,
    desc: 'Traitement esthétique qui éclaircit l\u2019émail et redonne aux dents un aspect naturellement blanc et lumineux.',
    detail: "Le blanchiment dentaire est un soin esthétique qui permet d'éclaircir la couleur naturelle des dents de plusieurs teintes, sans altérer la structure de l'émail. Il agit sur les colorations intrinsèques liées à l'âge, au tabac, à l'alimentation ou à certains médicaments.\n\nNous proposons un blanchiment ambulatoire réalisé à domicile à l'aide de gouttières sur mesure et d'un gel à base de peroxyde d'hydrogène. Le traitement s'étale généralement sur deux à trois semaines pour un résultat progressif et durable.\n\nUn bilan préalable est indispensable pour vérifier l'état de vos dents et de vos gencives. Le blanchiment est déconseillé en cas de caries non traitées, de sensibilités importantes ou pendant la grossesse.",
  },
  {
    title: 'Couronne dentaire',
    img: IMAGES.caries,
    desc: 'Prothèse fixe sur mesure qui recouvre et protège une dent fragilisée tout en restaurant son esthétique et sa fonction.',
    detail: "La couronne dentaire est une prothèse fixe qui recouvre intégralement la partie visible d'une dent trop abîmée pour être reconstituée par un simple composite. Elle est indiquée après une dévitalisation, une fracture importante ou une usure sévère.\n\nLa pose se déroule en deux séances. Lors de la première, la dent est taillée et une empreinte numérique ou physique est réalisée pour confectionner la couronne en laboratoire. Une couronne provisoire est posée dans l'intervalle. Lors de la seconde séance, la couronne définitive — en céramique, zircone ou métal-céramique — est scellée.\n\nBien entretenue, une couronne dure en moyenne 10 à 15 ans. Elle redonne à la dent sa forme, sa solidité et son apparence naturelle.",
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
  const avgRating = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1)
  return (
    <div className="bio-card">
      <div className="bio-text">
        <div className="bio-name">Dr. Joao Maria Mendes</div>
        <div className="bio-specialty">Chirurgien-Dentiste à Pessac</div>
        <div className="bio-rating">
          <svg width="11" height="11" fill="none" viewBox="0 0 10 10">
            <path d={STAR_PATH} fill="#000" />
          </svg>
          <span className="bio-rating-score">{avgRating}</span>
          <span className="bio-rating-count">({REVIEWS.length} avis)</span>
        </div>
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
      <div className="bio-photo-wrap">
        <img className="bio-photo" src={IMAGES.doctor} alt="Dr. Joao Maria Mendes" />
        <div className="bio-photo-fade" />
      </div>
    </div>
  )
}

function TarifsSection() {
  const [open, setOpen] = useState(false)
  return (
    <div className="section">
      <div className="section-header clickable" onClick={() => setOpen(o => !o)}>
        <span className="section-title">Tarifs et remboursement</span>
        <DropdownBtn open={open} onClick={e => { e.stopPropagation(); setOpen(o => !o) }} />
      </div>
      <div className={`collapsible-content${open ? ' open' : ''}`} style={{ '--max-h': '600px' }}>
        <div className="tarifs-list">
          <div className="tarifs-row">
            <span className="tarifs-name">Conventionné</span>
            <span className="tarifs-methods">Secteur 1</span>
          </div>
          <div className="tarifs-row tarifs-row-bordered">
            <span className="tarifs-name">Carte Vitale</span>
            <span className="tarifs-methods">Acceptée</span>
          </div>
          <div className="tarifs-row tarifs-row-bordered">
            <span className="tarifs-name">Moyens de paiement</span>
            <span className="tarifs-methods">Chèques, espèces et carte bancaire</span>
          </div>
        </div>
        <div className="tarifs-detail-list" style={{ marginTop: 16 }}>
          {TARIFS_DETAIL.map((item, i) => (
            <div key={i} className={`tarifs-detail-item${i > 0 ? ' tarifs-row-bordered' : ''}`}>
              <div className="tarifs-detail-top">
                <span className="tarifs-detail-title">{item.title}</span>
                <span className="tarifs-price">{item.price}</span>
              </div>
              {item.desc && <p className="tarifs-detail-desc">{item.desc}</p>}
              {item.disclaimer && <p className="tarifs-disclaimer">{TARIF_DISCLAIMER}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const EXPERTISES = [
  'Blanchiment des dents',
  'Chirurgie buccale',
  'Chirurgie des gencives',
  'Extraction dentaire',
  'Greffe de gencive',
  'Greffe osseuse',
  'Implant dentaire',
  'Implantologie',
  'Implantologie dentaire',
  'Parodontie',
  'Parodontite',
  'Prothèse sur implant',
  'Surfaçage',
  'Urgence dentaire',
]


function ExpertisesSection() {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="section">
      <div className="section-header">
        <span className="section-title">Expertises et actes</span>
      </div>
      <div className={`expertises-wrap${expanded ? ' expanded' : ''}`}>
        <div className="expertises-list">
          {EXPERTISES.map(e => (
            <span key={e} className="expertises-tag">{e}</span>
          ))}
        </div>
        {!expanded && <div className="expertises-fade" />}
      </div>
      <button className="expertises-voir-plus" onClick={() => setExpanded(e => !e)}>
        {expanded ? 'Voir moins' : 'Voir plus'}
        <svg width="9" height="9" fill="none" viewBox="0 0 5 9" style={{ transform: expanded ? 'rotate(270deg)' : 'rotate(90deg)', transition: 'transform 0.2s' }}>
          <path d={ARROW_PATH} fill="#000" />
        </svg>
      </button>
    </div>
  )
}

function AccessSection() {
  const [open, setOpen] = useState(false)
  return (
    <div className="section">
      <div className="section-header clickable" onClick={() => setOpen(o => !o)}>
        <span className="section-title">Accès</span>
        <DropdownBtn open={open} onClick={e => { e.stopPropagation(); setOpen(o => !o) }} />
      </div>
      <div className={`collapsible-content${open ? ' open' : ''}`}>
        <div className="access-list">
          {ACCESS_TABS.map((item, i) => (
            <div key={item.id} className={`access-item${i < ACCESS_TABS.length - 1 ? ' access-item-bordered' : ''}`}>
              <span className="access-item-label">{item.label}</span>
              <span className="access-item-content">{item.content}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const GALLERY = [
  'https://images.pexels.com/photos/287237/pexels-photo-287237.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/6812453/pexels-photo-6812453.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/6812479/pexels-photo-6812479.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/5355867/pexels-photo-5355867.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/30902075/pexels-photo-30902075.jpeg?auto=compress&cs=tinysrgb&w=400',
]

function Lightbox({ images, index, onClose, onPrev, onNext }) {
  const overlayRef = useRef(null)
  const touchStartX = useRef(null)
  const swiped = useRef(false)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])

  useEffect(() => {
    const el = overlayRef.current
    if (!el) return
    const onTouchStart = e => {
      touchStartX.current = e.touches[0].clientX
      swiped.current = false
    }
    const onTouchEnd = e => {
      if (touchStartX.current === null) return
      const dx = e.changedTouches[0].clientX - touchStartX.current
      if (dx < -50) { onNext(); swiped.current = true }
      else if (dx > 50) { onPrev(); swiped.current = true }
      touchStartX.current = null
    }
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [onNext, onPrev])

  const handleClick = () => {
    if (swiped.current) { swiped.current = false; return }
    onClose()
  }

  return (
    <div className="lightbox-overlay" ref={overlayRef} onClick={handleClick}>
      <button className="lightbox-close" onClick={onClose}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 1L13 13M13 1L1 13" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
      <button className="lightbox-nav lightbox-prev" onClick={e => { e.stopPropagation(); onPrev() }}>
        <svg width="9" height="9" fill="none" viewBox="0 0 5 9" style={{ transform: 'rotate(180deg)' }}>
          <path d={ARROW_PATH} fill="#fff" />
        </svg>
      </button>
      <img
        className="lightbox-img"
        src={images[index].replace('w=400', 'w=1200')}
        alt=""
        onClick={e => e.stopPropagation()}
      />
      <button className="lightbox-nav lightbox-next" onClick={e => { e.stopPropagation(); onNext() }}>
        <svg width="9" height="9" fill="none" viewBox="0 0 5 9">
          <path d={ARROW_PATH} fill="#fff" />
        </svg>
      </button>
      <span className="lightbox-counter">{index + 1} / {images.length}</span>
    </div>
  )
}

function GallerySection() {
  const [activeIndex, setActiveIndex] = useState(null)
  const count = GALLERY.length
  const open = i => setActiveIndex(i)
  const close = () => setActiveIndex(null)
  const prev = () => setActiveIndex(i => (i - 1 + count) % count)
  const next = () => setActiveIndex(i => (i + 1) % count)

  return (
    <>
      <div className="gallery-strip">
        {GALLERY.map((src, i) => (
          <img key={i} className="gallery-img" src={src} alt="" onClick={() => open(i)} />
        ))}
      </div>
      {activeIndex !== null && (
        <Lightbox images={GALLERY} index={activeIndex} onClose={close} onPrev={prev} onNext={next} />
      )}
    </>
  )
}

function DiplomesGroup({ title, items }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="diplomes-group">
      <div className="diplomes-group-header" onClick={() => setOpen(o => !o)}>
        <span className="diplomes-group-title">{title}</span>
        <DropdownBtn open={open} onClick={e => { e.stopPropagation(); setOpen(o => !o) }} />
      </div>
      <div className={`collapsible-content${open ? ' open' : ''}`}>
        <div className="diplomes-body">
          {items.map((item, i) => (
            <div key={i} className="diplomes-item">
              <span className="diplomes-label">{item.label}</span>
              {item.year && <span className="diplomes-year">{item.year}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PresentationSection() {
  return (
    <div className="section">
      <div className="section-header">
        <span className="section-title">Présentation</span>
      </div>
      <p className="presentation-text">
        Chirurgien-dentiste diplômée de la faculté de Bordeaux, le dr Thibon a complété sa formation par des DU d'implantologie, d'endodontie et des CES de prothèse et parodontologie. Sa pratique est désormais orientée vers la chirurgie implantaire, osseuse, les greffes gingivales et les prothèses complètes sur implants (PACSI). Son parcours nous permets de proposer une prise en charge globale et personnalisée, centrée sur des plans de traitement complets et adaptés à chaque patient.
      </p>
      <p className="presentation-text">
        Elle accorde une attention particulière à la confiance, l'écoute et au confort de chacun, veillant à offrir une expérience de soin aussi rassurante qu'efficace. Le dr Thibon essaie chaque jour d'allier exigence technique et approche humaine pour garantir à mes patients des résultats durables et sur mesure.
      </p>
      <GallerySection />
      <div className="diplomes">
        <DiplomesGroup title="Diplômes nationaux et universitaires" items={[
          { label: "D.U. Dermatologie buccale — UFR d'odontologie de Nice", year: '2025' },
          { label: "Diplôme d'État de docteur en chirurgie dentaire — UFR d'odontologie de Nantes", year: '2023' },
        ]} />
        <DiplomesGroup title="Autres formations" items={[
          { label: "Attestation de formation aux actes bucco-dentaires sous sédation consciente de MEOPA — BORDEAUX" },
        ]} />
      </div>
      <div className="presentation-meta">
        <span className="presentation-meta-label">Langues parlées</span>
        <span className="presentation-meta-value">Anglais et Français</span>
      </div>
      <div className="presentation-meta">
        <span className="presentation-meta-label">Site web</span>
        <a className="presentation-meta-link" href="#" target="_blank" rel="noreferrer">
          Voir le site
          <svg width="10" height="10" viewBox="0 0 11 11" fill="none" style={{ marginLeft: 4, verticalAlign: 'middle' }}>
            <path d="M2 9L9 2M9 2H3.5M9 2V7.5" stroke="#1d19ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </div>
  )
}

const TARIF_DISCLAIMER = "Ces honoraires vous sont communiqués à titre indicatif par le soignant. Ils peuvent varier selon le type de soins finalement réalisés en cabinet, le nombre de consultations et les actes additionnels nécessaires. En cas de dépassement des tarifs, le soignant doit en avertir préalablement le patient."

const TARIFS_DETAIL = [
  {
    title: 'Consultation dentaire',
    price: '23 €',
  },
  {
    title: "Prise en charge spécifique de l\u2019enfant",
    price: '40 €',
    desc: "Ce complément d'honoraires est appliqué lors de chaque soin. Il n'est pas remboursé par la Sécurité sociale. Il s'ajoute aux soins qui eux, pourront être remboursés par la Sécurité sociale.",
  },
  {
    title: 'Maintenance prophylactique',
    price: '30 €',
    desc: "Ce complément d'honoraires est appliqué à chaque rendez-vous de 1ère consultation ou bilan annuel bucco-dentaire. Il n'est pas remboursé par la Sécurité sociale.",
    disclaimer: true,
  },
]


function CoordonneesSection() {
  const [open, setOpen] = useState(false)
  return (
    <div className="section">
      <div className="section-header clickable" onClick={() => setOpen(o => !o)}>
        <span className="section-title">Coordonnées</span>
        <DropdownBtn open={open} onClick={e => { e.stopPropagation(); setOpen(o => !o) }} />
      </div>
      <div className={`collapsible-content${open ? ' open' : ''}`}>
        <div className="tarifs-list">
          <div className="tarifs-row">
            <span className="tarifs-name">Téléphone</span>
            <a className="coordonnees-phone" href="tel:+33556992070">05 56 99 20 70</a>
          </div>
          <div className="tarifs-row tarifs-row-bordered">
            <span className="tarifs-name">Contact d'urgence</span>
            <span className="tarifs-methods">En cas d'urgence, contactez le 15 (Samu)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function HorairesSection() {
  const [open, setOpen] = useState(false)
  const jsDay = new Date().getDay() // 0=Sun
  const todayIdx = jsDay === 0 ? 6 : jsDay - 1 // SCHEDULE: 0=Mon

  return (
    <div className="section" style={{ marginTop: 56 }}>
      <div className="section-header clickable" onClick={() => setOpen(o => !o)}>
        <span className="section-title">Horaires</span>
        <DropdownBtn open={open} onClick={e => { e.stopPropagation(); setOpen(o => !o) }} />
      </div>
      <div className={`collapsible-content${open ? ' open' : ''}`}>
        <div className="tarifs-list">
          {SCHEDULE.map(([day, hours], i) => (
            <div key={day} className={`tarifs-row${i > 0 ? ' tarifs-row-bordered' : ''}${i === todayIdx ? ' schedule-today' : ''}`}>
              <span className="schedule-left">
                <span className={hours === 'Fermé' ? 'dot-gray' : 'dot-green'} />
                <span className={`tarifs-name${i === todayIdx ? ' schedule-today-label' : ''}`}>{day}</span>
              </span>
              <span className="schedule-hours" style={hours === 'Fermé' ? { color: '#999' } : undefined}>{hours}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ServiceModal({ service, onClose }) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  return (
    <div className="reviews-modal-overlay" onClick={onClose}>
      <div className="reviews-modal" onClick={e => e.stopPropagation()} style={{ position: 'relative' }}>
        <button className="service-modal-close" onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M13 1L1 13" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <img className="service-modal-img" src={service.img} alt={service.title} />
        <div className="service-modal-body">
          <span className="service-modal-title">{service.title}</span>
          <div className="service-modal-texts">
            {(service.detail || service.desc).split('\n\n').map((p, i) => (
              <p key={i} className="service-modal-desc">{p}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PrestationsSection() {
  const [activeService, setActiveService] = useState(null)
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
        <span className="section-title">Prestations</span>
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
                  <button className="learn-more" onClick={() => setActiveService(s)}>
                    En savoir plus <ArrowRight color="#1D19FF" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {activeService && <ServiceModal service={activeService} onClose={() => setActiveService(null)} />}
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

function ReviewsModal({ onClose }) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  return (
    <div className="reviews-modal-overlay" onClick={onClose}>
      <div className="reviews-modal" onClick={e => e.stopPropagation()}>
        <div className="reviews-modal-header">
          <span className="reviews-modal-title">Avis ({REVIEWS.length})</span>
          <button className="reviews-modal-close" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="reviews-modal-list">
          {REVIEWS.map(r => <ReviewCard key={r.id} {...r} />)}
        </div>
      </div>
    </div>
  )
}

function AvisSection() {
  const [modalOpen, setModalOpen] = useState(false)
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
      <button className="rs-voir-plus" onClick={() => setModalOpen(true)}>
        Voir plus
        <svg width="9" height="9" fill="none" viewBox="0 0 5 9">
          <path d={ARROW_PATH} fill="#000" />
        </svg>
      </button>
      {modalOpen && <ReviewsModal onClose={() => setModalOpen(false)} />}
    </div>
  )
}

const THEMES = [
  { label: 'Default',  bg: '#ffffff', surface: '#f6f6f6', active: '#e0e0e0' },
  { label: 'Lavande',  bg: '#f8f5ff', surface: '#ede8f5', active: '#d8d0ed' },
  { label: 'Menthe',   bg: '#f2fdf6', surface: '#e2f5ea', active: '#c8ebd4' },
  { label: 'Pêche',    bg: '#fff5f0', surface: '#fde8de', active: '#f5d4c4' },
  { label: 'Ciel',     bg: '#f0f7ff', surface: '#dff0ff', active: '#c8e0f5' },
  { label: 'Citron',   bg: '#fffdf0', surface: '#f5f0d8', active: '#e8e0b8' },
]

function ThemePicker({ theme, setTheme }) {
  return (
    <div className="theme-picker">
      <span className="theme-picker-label">Couleur</span>
      <div className="theme-swatches">
        {THEMES.map(t => (
          <button
            key={t.label}
            className={`theme-swatch${theme.label === t.label ? ' active' : ''}`}
            style={{ '--swatch-bg': t.bg, '--swatch-surface': t.surface }}
            onClick={() => setTheme(t)}
            aria-label={t.label}
          />
        ))}
      </div>
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
  const [theme, setTheme] = useState(THEMES[0])
  return (
    <div className="phone" style={{ '--color-bg': theme.bg, '--color-surface': theme.surface, '--color-active': theme.active }}>
      <Header />
      <BioCard />
      <TarifsSection />
      <ExpertisesSection />
      <AccessSection />
      <PresentationSection />
      <HorairesSection />
      <CoordonneesSection />
      <PrestationsSection />
      <FaqSection />
      <AvisSection />
      <Collapsible title="Équipements">
        Radio numérique, Scanner intra-oral, Détartrage ultrasonique, Fauteuil ergonomique
      </Collapsible>
      <Collapsible title="Informations Complémentaires">
        Conventionné secteur 1. Carte Vitale acceptée. Prise en charge mutuelle selon contrat.
      </Collapsible>
      <ThemePicker theme={theme} setTheme={setTheme} />
      <Footer />
    </div>
  )
}
