import React, { useEffect, useRef, useState } from 'react'

export default function LazyImage({ src, alt = '', className = '', style = {}, placeholder, eager = false, onLoad }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(Boolean(eager))
  const [loaded, setLoaded] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(eager ? src : null)

  useEffect(() => {
    if (visible && !currentSrc) setCurrentSrc(src)
  }, [visible, src, currentSrc])

  useEffect(() => {
    if (visible || eager) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            io.disconnect()
          }
        })
      },
      { rootMargin: '200px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [eager])

  return (
    <div ref={ref} className={`lazy-img ${className}`} style={{ position: 'relative', overflow: 'hidden', ...style }}>
      <div
        className="lazy-img__placeholder"
        style={placeholder ? { backgroundImage: `url(${placeholder})` } : undefined}
        aria-hidden
      />

      {currentSrc && (
        <img
          className="lazy-img__img"
          src={currentSrc}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={(e) => {
            setLoaded(true)
            if (typeof onLoad === 'function') onLoad(e)
          }}
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity .32s ease', width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
    </div>
  )
}
