import { useEffect, useMemo, useRef, useState } from 'react'

const INVITATION = {
  childName: 'AYLANA ATENEA',
  subtitle: 'Cumple 2 años',
  age: '2',
  date: '2026-06-13T18:30:00',
  dayName: 'SÁBADO',
  dayNumber: '13',
  month: 'JUNIO',
  year: '2026',
  time: '6:30 PM',
  place: '518 Kennesaw Dr, Smyrna, GA 30080',
  mapsQuery: '518 Kennesaw Dr, Smyrna, GA 30080',
  whatsapp:
    'https://wa.me/527751514487?text=Hola%2C%20confirmo%20mi%20asistencia%20al%20cumplea%C3%B1os%20de%20Aylana%20Atenea%20%F0%9F%92%96%0A%0ANombre%3A%0AN%C3%BAmero%20de%20personas%3A',
  musicTitle: 'Este episodio de Bluey se llama',

  giftClothesSize: 'Talla 3',
  giftEnvelopeRain: 'Lluvia de sobres',
}

const ASSETS = {
  blueyBingo: '/bluey/bluey-bingo.png',
  bluey: '/bluey/bluey.png',
  bingo: '/bluey/bingo.png',
  family: '/bluey/family.png',
  childPhoto: '/bluey/foto-nino.jpeg',
  danceGif: '/bluey/bluey-bingo-baile.gif',
}

const AUDIO = {
  song: '/music/cancion.mp3',
}

function getTimeLeft(eventDate) {
  const difference = eventDate - new Date()

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

function App() {
  const eventDate = useMemo(() => new Date(INVITATION.date), [])
  const audioRef = useRef(null)

  const [timeLeft, setTimeLeft] = useState(getTimeLeft(eventDate))
  const [opened, setOpened] = useState(false)
  const [audioStarted, setAudioStarted] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(eventDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [eventDate])

  const playMusic = () => {
    if (!audioRef.current) return

    audioRef.current.volume = 0.5

    audioRef.current
      .play()
      .then(() => {
        setAudioStarted(true)
      })
      .catch(() => {
        setAudioStarted(false)
      })
  }

  const pauseMusic = () => {
    if (!audioRef.current) return

    audioRef.current.pause()
    setAudioStarted(false)
  }

  const toggleMusic = () => {
    if (audioStarted) {
      pauseMusic()
    } else {
      playMusic()
    }
  }

  const openInvitation = () => {
    setOpened(true)
    playMusic()
  }

  return (
    <main className="min-h-screen bg-[#101018] text-[#21345b]">
      <audio ref={audioRef} src={AUDIO.song} loop preload="auto" />

      {!opened && <EnvelopeScreen onOpen={openInvitation} />}

      <section
        className={`mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-gradient-to-b from-[#ffe3f1] via-[#ffd1e8] to-[#dff3ff] shadow-2xl transition duration-700 ${
          opened ? 'opacity-100' : 'pointer-events-none h-screen opacity-0'
        }`}
      >
        <Hero audioStarted={audioStarted} onToggleMusic={toggleMusic} />
        <DateSection />
        <CountdownSection timeLeft={timeLeft} />
        <LocationSection />
        <GiftSection />
        <ConfirmSection />
      </section>

      {opened && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-4 right-4 z-50 rounded-full bg-white/90 px-4 py-3 text-sm font-black text-[#ff4fa3] shadow-xl active:scale-95"
        >
          {audioStarted ? '♪' : '▶'}
        </button>
      )}
    </main>
  )
}

function EnvelopeScreen({ onOpen }) {
  return (
    <section className="fixed inset-0 z-[100] flex items-center justify-center bg-[#101018] px-6">
      <div className="relative w-full max-w-[390px] overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#dff3ff] via-[#e9f7ff] to-[#ffdced] px-6 py-10 text-center shadow-2xl">
        <PawBackground />
        <Clouds />

        <EpisodeHeader />

        <div className="relative z-10 mx-auto mt-6 h-48 w-72">
          <div className="absolute left-1/2 top-2 h-40 w-64 -translate-x-1/2 rounded-xl border-2 border-[#d8c9b8] bg-[#eee0cf] shadow-lg">
            <div className="absolute inset-0 bg-[linear-gradient(145deg,transparent_49%,#cdbda9_50%,transparent_51%),linear-gradient(35deg,transparent_49%,#cdbda9_50%,transparent_51%)]" />
            <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffb8d8] shadow-inner" />
          </div>

          <div className="absolute -bottom-4 left-1/2 flex h-32 w-40 -translate-x-1/2 items-end justify-center">
            <SafeImage
              src={ASSETS.blueyBingo}
              alt="Bluey y Bingo"
              className="h-32 w-auto object-contain drop-shadow-xl"
              fallback="🐶"
            />
          </div>
        </div>

        <button
          onClick={onOpen}
          className="relative z-10 mt-4 rounded-full bg-[#ff6fb1] px-8 py-4 text-lg font-black text-white shadow-xl ring-4 ring-white/70 active:scale-95"
        >
          Abrir invitación
        </button>

        <p className="relative z-10 mt-5 text-sm font-semibold text-[#7d88a8]">
          Toca el sobre para descubrir la fiesta
        </p>
      </div>
    </section>
  )
}

function Hero({ audioStarted, onToggleMusic }) {
  return (
    <section className="relative min-h-screen overflow-hidden px-5 pb-8 pt-7 text-center">
      <PawBackground />
      <Clouds />

      <div className="absolute right-4 top-24 z-10 flex flex-col items-center gap-1">
        <div className="h-16 w-12 rounded-full bg-pink-300 shadow-lg" />
        <div className="-mt-10 ml-10 h-14 w-10 rounded-full bg-yellow-300 shadow-lg" />
        <div className="-mt-10 mr-10 h-14 w-10 rounded-full bg-purple-300 shadow-lg" />
      </div>

      <div className="relative z-20 mx-auto flex min-h-[92vh] max-w-[360px] flex-col items-center justify-start">
        <EpisodeHeader />

        <SafeImage
          src={ASSETS.blueyBingo}
          alt="Bluey y Bingo"
          className="mx-auto mt-3 h-48 max-w-[330px] object-contain drop-shadow-xl"
          fallback="🐶"
        />

        <p className="mt-1 max-w-[270px] text-[13px] font-bold leading-relaxed text-[#8b89a7]">
          Dale clic al reproductor para escuchar nuestra canción especial
        </p>

        <MusicPlayer audioStarted={audioStarted} onToggleMusic={onToggleMusic} />

        <div className="mt-4 w-full">
          <SafeImage
            src={ASSETS.danceGif}
            alt="Bluey y Bingo bailando"
            className="mx-auto h-32 max-w-[260px] rounded-[1.5rem] object-contain drop-shadow-xl"
            fallback="💃"
          />
        </div>

        <div className="relative z-30 mt-5 w-full rounded-[2rem] bg-[#fff0f8]/85 px-4 pb-7 pt-7 shadow-xl backdrop-blur-sm ring-4 ring-white/70">
          <div className="absolute -top-6 left-1/2 flex -translate-x-1/2 gap-2 text-4xl">
            <span className="-rotate-12">🐾</span>
            <span className="rotate-12">🐾</span>
          </div>

          <h1 className="mt-2 text-[30px] font-black uppercase leading-tight tracking-wide text-[#ff4fa3] drop-shadow-[0_3px_0_white]">
            {INVITATION.childName}
          </h1>

          <p className="text-[12px] font-black uppercase tracking-[0.35em] text-[#c85b9a]">
            {INVITATION.subtitle}
          </p>

          <div className="mx-auto mt-4 h-40 w-36 overflow-hidden rounded-[1.5rem] bg-white p-2 shadow-xl ring-4 ring-white/70">
            <SafeImage
              src={ASSETS.childPhoto}
              alt="Foto del festejado"
              className="h-full w-full rounded-[1.15rem] object-cover"
              fallback="👧"
            />
          </div>

          <p className="relative z-40 mx-auto mt-4 max-w-[300px] rounded-2xl bg-white/90 px-4 py-3 text-sm font-black leading-relaxed text-[#9b5c7d] shadow-md">
            Acompáñame a festejar este día especial
          </p>
        </div>
      </div>

      <Hill className="bottom-0" />

      <SafeImage
        src={ASSETS.bluey}
        alt="Bluey"
        className="absolute bottom-1 left-1 z-20 h-28 object-contain drop-shadow-xl"
        fallback="🐶"
      />

      <SafeImage
        src={ASSETS.bingo}
        alt="Bingo"
        className="absolute bottom-2 right-1 z-20 h-28 object-contain drop-shadow-xl"
        fallback="🐶"
      />

      <Tree className="absolute -bottom-8 right-0 z-10 opacity-80" />
    </section>
  )
}

function EpisodeHeader() {
  return (
    <div className="relative z-10 mx-auto mt-2 w-full max-w-[320px]">
      <div className="pointer-events-none absolute left-2 top-3 h-12 w-24 rounded-full bg-white/75 blur-sm" />
      <div className="pointer-events-none absolute right-1 top-10 h-10 w-20 rounded-full bg-white/65 blur-sm" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-8 w-16 -translate-x-1/2 rounded-full bg-white/55 blur-sm" />

      <div className="relative rounded-[2rem] bg-white/15 px-4 py-3">
        <p
          className="text-[13px] font-black uppercase tracking-[0.18em] text-[#6f91b7]"
          style={{
            textShadow: '0 2px 0 rgba(255,255,255,0.9)',
          }}
        >
          ESTE EPISODIO DE
        </p>

        <h2
          className="mt-1 text-5xl font-black leading-none text-[#5faee7]"
          style={{
            textShadow:
              '0 3px 0 rgba(255,255,255,0.95), 0 5px 10px rgba(84,143,190,0.22)',
          }}
        >
          Bluey
        </h2>
      </div>
    </div>
  )
}

function DateSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#ffd1e8] to-[#dff3ff] px-5 py-8 text-center">
      <PawBackground />

      <Tree className="absolute bottom-0 right-0 opacity-80" />

      <SafeImage
        src={ASSETS.blueyBingo}
        alt="Bluey y Bingo"
        className="absolute bottom-6 left-0 h-32 object-contain drop-shadow-xl"
        fallback="🐶"
      />

      <div className="relative z-10 mx-auto max-w-[360px] rounded-[2rem] bg-white/60 px-4 py-6 shadow-lg backdrop-blur-sm ring-4 ring-white/60">
        <p className="text-sm font-bold text-[#9b5c7d]">
          Ven y disfruta conmigo
        </p>

        <div className="mt-5 grid grid-cols-3 items-center gap-2 text-[#25385e]">
          <div className="rounded-2xl bg-white/70 py-3 shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-widest text-[#c85b9a]">
              {INVITATION.dayName}
            </p>
          </div>

          <div className="rounded-2xl bg-white py-3 shadow-md ring-2 ring-pink-100">
            <p className="text-6xl font-black leading-none text-[#ff4fa3] drop-shadow-[0_2px_0_white]">
              {INVITATION.dayNumber}
            </p>
            <p className="text-xs font-black uppercase tracking-widest text-[#c85b9a]">
              {INVITATION.year}
            </p>
          </div>

          <div className="rounded-2xl bg-white/70 py-3 shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-widest text-[#c85b9a]">
              {INVITATION.month}
            </p>
          </div>
        </div>

        <div className="mx-auto mt-5 flex w-fit items-center justify-center gap-2 rounded-full bg-white/90 px-5 py-3 text-lg font-black text-[#ff4fa3] shadow-md ring-2 ring-pink-100">
          <span>🕒</span>
          <span>{INVITATION.time}</span>
        </div>

        <div className="mx-auto mt-5 h-32 w-32 overflow-hidden rounded-full bg-white p-2 shadow-xl ring-4 ring-white/80">
          <SafeImage
            src={ASSETS.childPhoto}
            alt="Foto del festejado"
            className="h-full w-full rounded-full object-cover"
            fallback="👧"
          />
        </div>
      </div>
    </section>
  )
}

function CountdownSection({ timeLeft }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#dff3ff] to-[#ffe3f1] px-5 py-10 text-center">
      <PawBackground />

      <div className="relative z-10 mx-auto max-w-[360px]">
        <h2 className="text-sm font-black uppercase tracking-widest text-[#ff4fa3] drop-shadow-[0_2px_0_white]">
          ¿Cuánto falta?
        </h2>

        <div className="mx-auto mt-3 grid max-w-[300px] grid-cols-4 overflow-hidden rounded-xl bg-[#ff91c5] text-white shadow-lg ring-4 ring-white/60">
          {[
            ['Días', timeLeft.days],
            ['Horas', timeLeft.hours],
            ['Min', timeLeft.minutes],
            ['Seg', timeLeft.seconds],
          ].map(([label, value]) => (
            <div
              key={label}
              className="border-r border-white/40 px-2 py-3 last:border-r-0"
            >
              <p className="text-xl font-black">
                {String(value).padStart(2, '0')}
              </p>
              <p className="text-[10px] font-bold uppercase">{label}</p>
            </div>
          ))}
        </div>

        <SafeImage
          src={ASSETS.bingo}
          alt="Bingo"
          className="mx-auto mt-4 h-32 object-contain"
          fallback="🐶"
        />
      </div>
    </section>
  )
}

function LocationSection() {
  return (
    <section className="relative overflow-hidden bg-[#ffb8d8] px-5 py-10 text-center text-white">
      <div className="absolute left-0 top-0 h-32 w-32 rounded-br-full bg-[#dff3ff]" />
      <div className="absolute right-0 bottom-0 h-32 w-32 rounded-tl-full bg-[#8dbd72]" />

      <div className="relative z-10 mx-auto max-w-[360px]">
        <div className="mb-3 flex justify-center gap-1 text-3xl">
          <span>🎈</span>
          <span>🎈</span>
          <span>🎈</span>
        </div>

        <h2 className="text-2xl font-black uppercase tracking-widest text-white drop-shadow-[0_3px_0_#c85b9a]">
          Ubicación
        </h2>

        <p className="mt-1 text-sm font-bold text-white/90">
          {INVITATION.place}
        </p>

        <div className="mt-5 overflow-hidden rounded-[1.5rem] bg-white p-2 shadow-2xl">
          <iframe
            title="Mapa"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              INVITATION.mapsQuery
            )}&output=embed`}
            className="h-56 w-full rounded-[1rem]"
          />
        </div>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            INVITATION.mapsQuery
          )}`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-black text-[#ff4fa3] shadow-lg active:scale-95"
        >
          📍 Abrir ubicación
        </a>
      </div>
    </section>
  )
}

function GiftSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#ffd1e8] to-[#ffeef7] px-5 py-10 text-center">
      <EnvelopeRain />
      <PawBackground />

      <SafeImage
        src={ASSETS.bluey}
        alt="Bluey"
        className="absolute bottom-4 right-0 z-10 h-36 object-contain drop-shadow-xl"
        fallback="🐶"
      />

      <div className="relative z-20 mx-auto max-w-[360px] rounded-[2rem] bg-white/70 px-5 py-7 shadow-xl backdrop-blur-sm ring-4 ring-white/70">
        <h2 className="text-2xl font-black uppercase text-[#ff4fa3] drop-shadow-[0_2px_0_white]">
          Sugerencias de regalo
        </h2>

        <p className="mt-3 text-sm font-bold leading-relaxed text-[#9b5c7d]">
          Si deseas obsequiarme algo, aquí te dejamos unas recomendaciones:
        </p>

        <div className="mt-5 space-y-3">
          <GiftItem label="Talla de ropa" value={INVITATION.giftClothesSize} />
          <GiftItem label="Lluvia de sobres" value={<MoneyEnvelopeIcon />} />
        </div>
      </div>
    </section>
  )
}

function GiftItem({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/90 px-4 py-5 shadow-md ring-2 ring-pink-100">
      <p className="text-xs font-black uppercase tracking-widest text-[#c85b9a]">
        {label}
      </p>

      <div className="mt-2 flex justify-center text-3xl font-black text-[#d94695]">
        {value}
      </div>
    </div>
  )
}

function MoneyEnvelopeIcon({ small = false }) {
  return (
    <div
      className={`relative mx-auto ${
        small ? 'h-8 w-10' : 'h-16 w-20'
      } rounded-lg bg-[#fff6cf] shadow-md ring-2 ring-[#f3c96d]`}
    >
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        <div className="absolute left-0 top-0 h-full w-full bg-[linear-gradient(145deg,transparent_49%,#e7bd5c_50%,transparent_51%),linear-gradient(35deg,transparent_49%,#e7bd5c_50%,transparent_51%)]" />
      </div>

      <div
        className={`absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#7bcf7a] font-black text-white shadow-sm ${
          small ? 'h-5 w-5 text-[11px]' : 'h-9 w-9 text-lg'
        }`}
      >
        $
      </div>
    </div>
  )
}

function EnvelopeRain() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-80">
      {Array.from({ length: 14 }).map((_, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            left: `${(index * 17) % 95}%`,
            top: `${(index * 29) % 100}%`,
            transform: `rotate(${index % 2 === 0 ? '-12deg' : '14deg'})`,
            opacity: index % 3 === 0 ? 0.45 : 0.75,
          }}
        >
          {index % 4 === 0 ? (
            <MoneyEnvelopeIcon small />
          ) : (
            <span className="text-2xl">✉️</span>
          )}
        </div>
      ))}
    </div>
  )
}

function ConfirmSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#dff3ff] to-[#ffe3f1] px-5 py-12 text-center">
      <PawBackground />
      <Hill className="bottom-0" />

      <div className="relative z-10 mx-auto max-w-[360px]">
        <h2 className="text-2xl font-black uppercase tracking-widest text-[#ff4fa3] drop-shadow-[0_2px_0_white]">
          Confirma
        </h2>

        <p className="mt-2 text-sm font-bold text-[#9b5c7d]">
          Tu asistencia por WhatsApp
        </p>

        <a
          href={INVITATION.whatsapp}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#40bf63] px-6 py-4 text-lg font-black text-white shadow-xl ring-4 ring-white/60 active:scale-95"
        >
          💬 Confirmar asistencia
        </a>

        <p className="mt-8 text-xs font-black uppercase tracking-widest text-[#9b5c7d]">
          Te esperamos
        </p>

        <SafeImage
          src={ASSETS.blueyBingo}
          alt="Bluey y Bingo"
          className="mx-auto mt-3 h-32 object-contain"
          fallback="🐾"
        />
      </div>
    </section>
  )
}

function MusicPlayer({ audioStarted, onToggleMusic }) {
  return (
    <div className="mx-auto mt-4 w-full max-w-[285px] rounded-[1.5rem] bg-white/70 px-4 py-3 shadow-lg ring-2 ring-white/80 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMusic}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#ff6fb1] text-lg font-black text-white shadow-md ring-4 ring-white/70 active:scale-95"
          aria-label={audioStarted ? 'Pausar música' : 'Reproducir música'}
        >
          {audioStarted ? '⏸' : '▶'}
        </button>

        <div className="min-w-0 flex-1 text-left">
          <p className="truncate text-[11px] font-black uppercase tracking-widest text-[#c85b9a]">
            Música de la fiesta
          </p>

          <div className="mt-2 flex h-7 items-end gap-1">
            {[10, 18, 13, 24, 16, 21, 12, 26, 15, 20].map((height, index) => (
              <span
                key={index}
                className={`w-1.5 rounded-full ${
                  audioStarted ? 'bg-[#ff6fb1]' : 'bg-[#ffd1e8]'
                }`}
                style={{
                  height: `${height}px`,
                  opacity: audioStarted ? 1 : 0.65,
                }}
              />
            ))}
          </div>
        </div>

        <span className="text-2xl">🎵</span>
      </div>
    </div>
  )
}

function SafeImage({ src, alt, className, fallback }) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className={`${className} grid place-items-center text-6xl`}>
        {fallback}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  )
}

function PawBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-30">
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="absolute text-xl text-[#d94695]"
          style={{
            left: `${(i * 23) % 95}%`,
            top: `${(i * 37) % 92}%`,
            transform: `rotate(${i * 18}deg)`,
          }}
        >
          🐾
        </span>
      ))}
    </div>
  )
}

function Clouds() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-4 top-16 h-10 w-28 rounded-full bg-white/70 blur-sm" />
      <div className="absolute right-6 top-28 h-9 w-24 rounded-full bg-white/60 blur-sm" />
      <div className="absolute left-20 bottom-32 h-8 w-28 rounded-full bg-white/50 blur-sm" />
    </div>
  )
}

function Hill({ className = '' }) {
  return (
    <div
      className={`pointer-events-none absolute left-0 right-0 h-32 ${className}`}
    >
      <div className="absolute bottom-0 left-0 right-0 h-24 rounded-t-[55%] bg-[#b9db6a]" />
      <div className="absolute bottom-0 left-[-20%] h-16 w-[70%] rounded-t-full bg-[#d6ee91]" />
      <div className="absolute bottom-0 right-[-10%] h-20 w-[70%] rounded-t-full bg-[#a9ce5e]" />
      <div className="absolute bottom-4 left-[18%] h-10 w-20 rounded-full bg-[#f7bfd8]/70 blur-sm" />
      <div className="absolute bottom-8 right-[12%] h-10 w-24 rounded-full bg-[#ffd8e8]/70 blur-sm" />
    </div>
  )
}

function Tree({ className = '' }) {
  return (
    <div className={`pointer-events-none h-44 w-36 ${className}`}>
      <div className="absolute bottom-0 right-10 h-28 w-5 rounded-full bg-[#7b573b]" />
      <div className="absolute bottom-20 right-2 h-20 w-24 rounded-full bg-[#76b95c]" />
      <div className="absolute bottom-16 right-14 h-16 w-20 rounded-full bg-[#8cca6a]" />
      <div className="absolute bottom-28 right-8 h-5 w-5 rounded-full bg-[#e84b5e]" />
      <div className="absolute bottom-30 right-20 h-4 w-4 rounded-full bg-[#ffb347]" />
      <div className="absolute bottom-10 right-[-2px] h-14 w-10 rounded-full bg-[#f48fb1]" />
      <div className="absolute bottom-26 right-[-6px] h-10 w-8 rounded-full bg-[#ffd54f]" />
    </div>
  )
}

export default App