import { useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'

const galleryItems = [
  'Community outreach in Linda Ward',
  'Meeting women and youth leaders',
  'Townhall engagement with residents',
  'Door-to-door campaign moments',
]

const supportButtonClasses =
  'inline-flex items-center justify-center rounded-md bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2'

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.trim().split(' ')
  let line = ''
  let lineCount = 0
  const maxLines = 5

  for (const word of words) {
    const testLine = `${line}${word} `
    const metrics = ctx.measureText(testLine)

    if (metrics.width > maxWidth && line && lineCount < maxLines) {
      ctx.fillText(line.trim(), x, y)
      line = `${word} `
      y += lineHeight
      lineCount += 1
    } else {
      line = testLine
    }
  }

  if (line && lineCount <= maxLines) {
    ctx.fillText(line.trim(), x, y)
  }
}

function loadImageFromUrl(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Unable to load image: ${src}`))
    img.src = src
  })
}

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = async () => {
      try {
        const image = await loadImageFromUrl(fileReader.result)
        resolve(image)
      } catch (error) {
        reject(error)
      }
    }
    fileReader.onerror = () => reject(new Error('Could not read uploaded file.'))
    fileReader.readAsDataURL(file)
  })
}

function countWords(text) {
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/support" element={<SupportPage />} />
    </Routes>
  )
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <a href="#" className="text-xl font-extrabold tracking-tight text-rose-700">
            Linda Campaign
          </a>
          <Link to="/support" className={supportButtonClasses}>
            I support Linda
          </Link>
        </div>
      </header>

      <main>
        <section className="bg-white">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-20 sm:px-6 md:grid-cols-2 md:items-center">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-rose-700">
                Hon. Linda 2026
              </p>
              <h1 className="mb-4 text-4xl font-extrabold leading-tight sm:text-5xl">
                Together we can build a stronger community.
              </h1>
              <p className="mb-8 text-lg text-slate-600">
                Join supporters of Hon. Linda and share your reason for standing with
                progressive, people-centered leadership.
              </p>
              <Link to="/support" className={supportButtonClasses}>
                I support Linda
              </Link>
            </div>
            <div className="rounded-2xl bg-linear-to-br from-rose-700 to-orange-500 p-10 text-white shadow-lg">
              <p className="text-sm uppercase tracking-widest text-rose-100">Campaign Promise</p>
              <p className="mt-3 text-2xl font-bold leading-snug">
                Better education, safer communities, and economic opportunities for every family.
              </p>
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="mb-4 text-3xl font-bold">About Hon. Linda</h2>
          <p className="max-w-3xl text-lg leading-relaxed text-slate-600">
            Hon. Linda is committed to transparent leadership, youth empowerment, and local
            development. This campaign is about listening to people, creating practical solutions,
            and building a future where everyone has a fair chance to thrive.
          </p>
        </section>

        <section id="gallery" className="bg-white py-16">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <h2 className="mb-8 text-3xl font-bold">Gallery</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {galleryItems.map((item) => (
                <div key={item} className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <div className="h-40 bg-linear-to-br from-rose-100 via-orange-100 to-amber-100" />
                  <p className="p-4 text-sm font-medium text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-slate-600 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
          <p>Linda Campaign 2026</p>
          <p>Powered by the voices of the people.</p>
        </div>
      </footer>
    </div>
  )
}

function SupportPage() {
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const [photo, setPhoto] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [message, setMessage] = useState('')
  const noteWordCount = countWords(note)
  const hasTooManyWords = noteWordCount > 50

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!photo || !name.trim() || !note.trim()) {
      setMessage('Please fill all fields and upload your picture.')
      return
    }

    if (hasTooManyWords) {
      setMessage('Your support note must not be more than 50 words.')
      return
    }

    try {
      setIsGenerating(true)
      setMessage('Generating your certificate...')

      const canvas = document.createElement('canvas')
      canvas.width = 1600
      canvas.height = 1131
      const ctx = canvas.getContext('2d')

      const [templateImage, supporterImage] = await Promise.all([
        loadImageFromUrl('/flyer-template.png'),
        loadImageFromFile(photo),
      ])

      ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height)

      // Replace these coordinates after your final flyer is added.
      ctx.drawImage(supporterImage, 140, 300, 300, 300)

      ctx.fillStyle = '#111827'
      ctx.textBaseline = 'top'

      ctx.font = 'bold 62px Inter, Segoe UI, sans-serif'
      ctx.fillText(name.trim(), 500, 330)

      ctx.font = '34px Inter, Segoe UI, sans-serif'
      wrapText(ctx, note.trim(), 500, 430, 920, 48)

      const dataURL = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.href = dataURL
      downloadLink.download = `${name.trim().replace(/\s+/g, '_')}_support_certificate.png`
      downloadLink.click()

      setMessage('Certificate generated and downloaded successfully.')
    } catch (error) {
      setMessage(
        'Could not generate certificate. Add your designed flyer as public/flyer-template.png and try again.',
      )
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="text-xl font-extrabold tracking-tight text-rose-700">
            Linda Campaign
          </Link>
          <Link to="/" className="text-sm font-semibold text-slate-700 hover:text-rose-700">
            Home
          </Link>
        </div>
      </header>

      <main>
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-2 text-3xl font-bold">Support Hon. Linda</h2>
            <p className="mb-8 text-slate-600">
              Fill this form and download your personalized campaign flyer certificate.
            </p>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="photo" className="mb-2 block text-sm font-semibold text-slate-700">
                  Upload your picture
                </label>
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={(event) => setPhoto(event.target.files?.[0] ?? null)}
                  className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-rose-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-rose-700"
                  required
                />
              </div>

              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">
                  Your name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-rose-200 focus:ring-2"
                  required
                />
              </div>

              <div>
                <label htmlFor="note" className="mb-2 block text-sm font-semibold text-slate-700">
                  Why are you supporting Hon. Linda?
                </label>
                <textarea
                  id="note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  rows={4}
                  placeholder="Write a short message of support..."
                  className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-rose-200 focus:ring-2"
                  required
                />
                <p className={`mt-1 text-xs ${hasTooManyWords ? 'text-red-600' : 'text-slate-500'}`}>
                  {noteWordCount}/50 words
                </p>
              </div>

              <button type="submit" disabled={isGenerating} className={`${supportButtonClasses} w-full sm:w-auto`}>
                {isGenerating ? 'Generating...' : 'Submit and download flyer'}
              </button>
            </form>

            {message && (
              <p className="mt-4 rounded-md bg-slate-100 p-3 text-sm font-medium text-slate-700">
                {message}
              </p>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-slate-600 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
          <p>Linda Campaign 2026</p>
          <p>Powered by the voices of the people.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
