import { MARQUEE_ITEMS } from '../constants.js'

export default function Marquee() {
  const row = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {row.map((t, i) => (<span key={i}>{t}<i>✦</i></span>))}
      </div>
    </div>
  )
}
