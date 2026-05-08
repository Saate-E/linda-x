import { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";

const galleryItems = [
  "Community outreach in Linda Ward",
  "Meeting women and youth leaders",
  "Townhall engagement with residents",
  "Door-to-door campaign moments",
];

const whyLindaItems = [
  {
    title: "Empowerment",
    description:
      "She has supported women and youth with practical skill programs, startup support, and mentoring that helps families build steady income.",
    icon: "empowerment",
  },
  {
    title: "Education",
    description:
      "She has consistently provided learning support initiatives, school outreach, and student encouragement programs across local communities.",
    icon: "education",
  },
  {
    title: "Healthcare",
    description:
      "She has promoted community health awareness and helped connect residents to medical outreach and preventive care opportunities.",
    icon: "healthcare",
  },
  {
    title: "Community Development",
    description:
      "She has championed people-centered engagement, listened to residents directly, and pushed for projects that improve daily living conditions.",
    icon: "community",
  },
];

const supportButtonClasses =
  "inline-flex items-center justify-center rounded-md bg-[#009ba5] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#087e89] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#009ba5] focus-visible:ring-offset-2";

function WhyLindaIcon({ type }) {
  if (type === "empowerment") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3l2.3 4.7L19 10l-4.7 2.3L12 17l-2.3-4.7L5 10l4.7-2.3L12 3z" />
      </svg>
    );
  }

  if (type === "education") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 8l9-4 9 4-9 4-9-4z" />
        <path d="M7 10v5c0 1.8 2.2 3 5 3s5-1.2 5-3v-5" />
      </svg>
    );
  }

  if (type === "healthcare") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 12h16" />
      <path d="M12 4v16" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 5) {
  const words = text.trim().split(" ");
  let line = "";
  let lineCount = 1;

  for (const word of words) {
    const testLine = `${line}${word} `;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && line) {
      ctx.fillText(line.trim(), x, y);
      line = `${word} `;
      y += lineHeight;
      lineCount += 1;
      if (lineCount > maxLines) return;
    } else {
      line = testLine;
    }
  }

  if (line && lineCount <= maxLines) {
    ctx.fillText(line.trim(), x, y);
  }
}

function drawImageCover(ctx, image, x, y, width, height) {
  const imageAspect = image.width / image.height;
  const frameAspect = width / height;

  let sx = 0;
  let sy = 0;
  let sWidth = image.width;
  let sHeight = image.height;

  if (imageAspect > frameAspect) {
    sWidth = image.height * frameAspect;
    sx = (image.width - sWidth) / 2;
  } else {
    sHeight = image.width / frameAspect;
    sy = (image.height - sHeight) / 2;
  }

  ctx.drawImage(image, sx, sy, sWidth, sHeight, x, y, width, height);
}

function drawCircularImageCover(ctx, image, x, y, diameter) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x + diameter / 2, y + diameter / 2, diameter / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  drawImageCover(ctx, image, x, y, diameter, diameter);
  ctx.restore();
}

function loadImageFromUrl(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Unable to load image: ${src}`));
    img.src = src;
  });
}

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = async () => {
      try {
        const image = await loadImageFromUrl(fileReader.result);
        resolve(image);
      } catch (error) {
        reject(error);
      }
    };
    fileReader.onerror = () =>
      reject(new Error("Could not read uploaded file."));
    fileReader.readAsDataURL(file);
  });
}

function countCharacters(text) {
  return text.length;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/support" element={<SupportPage />} />
    </Routes>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <a
            href="#"
            className="text-xl font-extrabold tracking-tight text-[#087e89]"
          >
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
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#087e89]">
                Hon. Linda 2026
              </p>
              <h1 className="mb-4 text-4xl font-extrabold leading-tight sm:text-5xl">
                Together we can build a stronger community.
              </h1>
              <p className="mb-8 text-lg text-slate-600">
                Join supporters of Hon. Linda and share your reason for standing
                with progressive, people-centered leadership.
              </p>
              <Link to="/support" className={supportButtonClasses}>
                I support Linda
              </Link>
            </div>
            <div className="rounded-2xl bg-linear-to-br from-[#009ba5] to-[#087e89] p-10 text-white shadow-lg">
              <p className="text-sm uppercase tracking-widest text-cyan-100">
                Campaign Promise
              </p>
              <p className="mt-3 text-2xl font-bold leading-snug">
                Better education, safer communities, and economic opportunities
                for every family.
              </p>
            </div>
          </div>
        </section>

        <section
          id="about"
          className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6"
        >
          <h2 className="mb-4 text-3xl font-bold">About Hon. Linda</h2>
          <p className="max-w-3xl text-lg leading-relaxed text-slate-600">
            Hon. Linda is committed to transparent leadership, youth
            empowerment, and local development. This campaign is about listening
            to people, creating practical solutions, and building a future where
            everyone has a fair chance to thrive.
          </p>
        </section>

        <section id="why-linda" className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
          <h2 className="mb-8 text-3xl font-bold">Why Linda</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {whyLindaItems.map((item) => (
              <article key={item.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-[#087e89]">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 text-[#087e89]">
                    <WhyLindaIcon type={item.icon} />
                  </span>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="gallery" className="bg-white py-16">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <h2 className="mb-8 text-3xl font-bold">Gallery</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {galleryItems.map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                >
                  <div className="h-40 bg-linear-to-br from-cyan-100 via-teal-100 to-slate-100" />
                  <p className="p-4 text-sm font-medium text-slate-700">
                    {item}
                  </p>
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
  );
}

function SupportPage() {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState("");
  const noteCharacterCount = countCharacters(note);
  const hasTooManyCharacters = noteCharacterCount > 50;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!photo || !name.trim() || !note.trim()) {
      setMessage("Please fill all fields and upload your picture.");
      return;
    }

    if (hasTooManyCharacters) {
      setMessage("Your support note must not be more than 50 characters.");
      return;
    }

    try {
      setIsGenerating(true);
      setMessage("Generating your certificate...");

      const [templateImage, supporterImage] = await Promise.all([
        loadImageFromUrl("/flyer.png"),
        loadImageFromFile(photo),
      ]);

      const canvas = document.createElement("canvas");
      canvas.width = templateImage.naturalWidth || templateImage.width;
      canvas.height = templateImage.naturalHeight || templateImage.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);

      // Layout zones tuned for a 1080x1350 flyer and scaled for any template size.
      const baseWidth = 1080;
      const baseHeight = 1350;
      const scaleX = canvas.width / baseWidth;
      const scaleY = canvas.height / baseHeight;

      const imageZone = {
        x: 640 * scaleX,
        y: 920 * scaleY,
        width: 363 * scaleX,
        height: 329 * scaleY,
      };

      const textZone = {
        x: canvas.width * 0.065,
        y: canvas.height * 0.74,
        maxWidth: canvas.width * 0.42,
        lineHeight: canvas.height * 0.03,
      };

      const nameBox = {
        x: (canvas.width - Math.min(canvas.width, 1090 * scaleX)) / 2,
        y: canvas.height - 101 * scaleY,
        width: Math.min(canvas.width, 1090 * scaleX),
        height: 101 * scaleY,
      };

      const photoDiameter = Math.min(imageZone.width, imageZone.height);
      const photoX = imageZone.x + (imageZone.width - photoDiameter) / 2;
      const photoY = imageZone.y + (imageZone.height - photoDiameter) / 2;
      drawCircularImageCover(
        ctx,
        supporterImage,
        photoX,
        photoY,
        photoDiameter,
      );

      ctx.fillStyle = "#073b44";
      ctx.textBaseline = "top";
      ctx.font = `600 ${Math.round(canvas.height * 0.028)}px Inter, Segoe UI, sans-serif`;
      wrapText(
        ctx,
        note.trim(),
        textZone.x,
        textZone.y,
        textZone.maxWidth,
        textZone.lineHeight,
        3,
      );

      ctx.fillStyle = "#ffffff";
      ctx.font = `700 ${Math.round(canvas.height * 0.027)}px Inter, Segoe UI, sans-serif`;
      ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
      ctx.shadowBlur = Math.max(2, Math.round(canvas.height * 0.002));
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        name.trim(),
        nameBox.x + nameBox.width / 2,
        nameBox.y + nameBox.height / 2,
      );
      ctx.textAlign = "start";
      ctx.textBaseline = "top";
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      const dataURL = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = dataURL;
      downloadLink.download = `${name.trim().replace(/\s+/g, "_")}_support_certificate.png`;
      downloadLink.click();

      setMessage("Certificate generated and downloaded successfully.");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      setMessage(
        "Could not generate certificate. Add your designed flyer as public/flyer.png and try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            to="/"
            className="text-xl font-extrabold tracking-tight text-[#087e89]"
          >
            Linda Campaign
          </Link>
          <Link
            to="/"
            className="text-sm font-semibold text-slate-700 hover:text-[#087e89]"
          >
            Home
          </Link>
        </div>
      </header>

      <main>
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-2 text-3xl font-bold">Support Hon. Linda</h2>
            <p className="mb-8 text-slate-600">
              Fill this form and download your personalized campaign flyer
              certificate.
            </p>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="photo"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Upload your picture
                </label>
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setPhoto(event.target.files?.[0] ?? null)
                  }
                  className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-[#009ba5] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#087e89]"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Your name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-cyan-200 focus:ring-2"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="note"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Why are you supporting Hon. Linda?
                </label>
                <textarea
                  id="note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  maxLength={50}
                  rows={4}
                  placeholder="Write a short message of support..."
                  className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-cyan-200 focus:ring-2"
                  required
                />
                <p
                  className={`mt-1 text-xs ${hasTooManyCharacters ? "text-red-600" : "text-slate-500"}`}
                >
                  {noteCharacterCount}/50 characters
                </p>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className={`${supportButtonClasses} w-full sm:w-auto`}
              >
                {isGenerating ? "Generating..." : "Submit and download flyer"}
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
  );
}

export default App;
