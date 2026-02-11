import { useEffect, useMemo, useRef, useState } from "react";

function encode(data) {
  return Object.keys(data)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
    .join("&");
}

export default function App() {
  // ✅ customize
  const theirName = "Robin";
  const dateDetails =
    "Looks like you clicked yes! now we have to figure out the details...";

  const areaRef = useRef(null);
  const yesRef = useRef(null);
  const noRef = useRef(null);

  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [open, setOpen] = useState(false);

  // ✅ Netlify Forms POST (triggers Netlify email notifications)
  async function sendYesEmail() {
    const payload = {
      "form-name": "valentine-yes",
      name: theirName,
      timestamp: new Date().toISOString(),
      page: typeof window !== "undefined" ? window.location.href : "",
    };

    await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode(payload),
    });
  }

  const sparkles = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        left: Math.round(Math.random() * 100),
        top: Math.round(Math.random() * 100),
        size: 5 + Math.round(Math.random() * 10),
        opacity: 0.08 + Math.random() * 0.14,
        delay: Math.round(Math.random() * 2000),
        duration: 3200 + Math.round(Math.random() * 2600),
      })),
    []
  );

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function safeMoveNo() {
    const area = areaRef.current?.getBoundingClientRect();
    const noBtn = noRef.current?.getBoundingClientRect();
    const yesBtn = yesRef.current?.getBoundingClientRect();
    if (!area || !noBtn) return;

    const pad = 10;

    const maxX = Math.max(pad, area.width - noBtn.width - pad);
    const maxY = Math.max(pad, area.height - noBtn.height - pad);

    const safeRadius = 90;

    let x = 0;
    let y = 0;
    let tries = 0;

    while (tries < 20) {
      x = Math.floor(Math.random() * maxX);
      y = Math.floor(Math.random() * maxY);

      if (yesBtn) {
        const yesCenter = {
          x: (yesBtn.left + yesBtn.right) / 2,
          y: (yesBtn.top + yesBtn.bottom) / 2,
        };
        const candidateCenter = {
          x: area.left + x + noBtn.width / 2,
          y: area.top + y + noBtn.height / 2,
        };
        const dx = candidateCenter.x - yesCenter.x;
        const dy = candidateCenter.y - yesCenter.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > safeRadius) break;
      } else {
        break;
      }

      tries += 1;
    }

    setNoPos({
      x: clamp(x, pad, maxX),
      y: clamp(y, pad, maxY),
    });
  }

  useEffect(() => {
    const t = setTimeout(() => setNoPos({ x: 190, y: 12 }), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onResize = () => safeMoveNo();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-[#FFFDF7] via-[#FFF7F0] to-[#F3E6DA] text-[#2B1B1F]">
      {/* ✅ Hidden Netlify form (Netlify detects this at build time) */}
      <form name="valentine-yes" method="POST" data-netlify="true" hidden>
        <input type="hidden" name="form-name" value="valentine-yes" />
        <input type="text" name="name" />
        <input type="text" name="timestamp" />
        <input type="text" name="page" />
      </form>

      {/* subtle floating specks */}
      <div className="pointer-events-none fixed inset-0">
        {sparkles.map((s) => (
          <span
            key={s.id}
            className="absolute rounded-full bg-white blur-[0.2px]"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
              animation: `floaty ${s.duration}ms ease-in-out ${s.delay}ms infinite`,
            }}
          />
        ))}
      </div>

      <main className="relative mx-auto flex min-h-screen w-full max-w-[420px] items-center justify-center px-4 py-6">
        <div className="w-full rounded-3xl border border-[#EAD9CF] bg-[#FFF7F0]/88 p-5 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col items-center text-center">
            <div className="mb-2 text-4xl">🤍</div>

            <h1 className="text-balance text-[28px] font-extrabold tracking-tight">
              Hey{" "}
              <span className="bg-gradient-to-r from-[#B86A7A] to-[#A85A6B] bg-clip-text text-transparent">
                {theirName}
              </span>
            </h1>

            <p className="mt-3 max-w-[320px] text-pretty text-[15px] leading-relaxed text-[#6B4C55]">
              I have a very important question for you…
              <br />
              <span className="font-semibold text-[#2B1B1F]">
                Will you be my Valentine?
              </span>
            </p>

            <div
              ref={areaRef}
              className="relative mt-6 h-[120px] w-full max-w-[340px]"
            >
              <div className="flex h-full items-center justify-center">
                {/* ✅ smaller on mobile, slightly bigger on larger screens */}
                <button
                  ref={yesRef}
                  onClick={async () => {
                    try {
                      await sendYesEmail(); // ✅ triggers Netlify email notification
                    } catch (e) {
                      console.error("Netlify form submit failed:", e);
                    } finally {
                      setOpen(true);
                    }
                  }}
                  className="min-w-[120px] rounded-2xl bg-[#B86A7A] px-4 py-3 text-[14px] font-extrabold text-white shadow-lg shadow-black/10 transition active:scale-[0.98]
                             sm:min-w-[150px] sm:px-6 sm:py-3 sm:text-[15px]"
                >
                  Yes 😎
                </button>

                <button
                  ref={noRef}
                  onPointerEnter={safeMoveNo}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    safeMoveNo();
                  }}
                  className="absolute min-w-[110px] rounded-2xl bg-[#F3E6DA] px-4 py-3 text-[14px] font-extrabold text-[#2B1B1F] shadow-lg shadow-black/10 ring-1 ring-[#EAD9CF] transition active:scale-[0.98]
                             sm:min-w-[135px] sm:px-6 sm:py-3 sm:text-[15px]"
                  style={{ left: noPos.x, top: noPos.y }}
                >
                  No 🙃
                </button>
              </div>
            </div>

            <p className="mt-4 text-[11px] text-[#6B4C55]">
              Serious Question. Silly Website.
            </p>
          </div>
        </div>

        {open && (
          <div
            className="fixed inset-0 z-50 grid place-items-end bg-black/40"
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            {/* ✅ mobile bottom sheet, centered on larger screens */}
            <div className="w-full rounded-t-3xl bg-[#FFF7F0] p-5 shadow-2xl sm:max-w-md sm:place-self-center sm:rounded-3xl sm:p-7">
              <div className="text-center">
                <div className="text-5xl">😎</div>
                <h2 className="mt-3 text-xl font-extrabold text-[#2B1B1F] sm:text-2xl">
                  AWESOME! It’s a date
                </h2>
              </div>

              <div className="mt-4 flex justify-center">
                <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-br from-white/90 to-[#FFF7F0] px-5 py-4 shadow-md">
                  <div className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-[#FFF7F0]" />

                  <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-[#8A4B5C]">
                    <span className="inline-block h-2 w-2 rounded-full bg-[#B86A7A]/70" />
                    <span>Valentine update</span>
                    <span className="inline-block h-2 w-2 rounded-full bg-[#B86A7A]/70" />
                  </div>

                  <p className="mt-3 text-center text-[13px] leading-relaxed text-[#6B4C55]">
                    {dateDetails}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="mt-4 w-full rounded-2xl bg-[#B86A7A] px-5 py-3 text-[14px] font-extrabold text-white transition active:scale-[0.99]"
              >
                Close
              </button>

              <p className="mt-3 text-center text-[11px] text-[#6B4C55]">
                Keep the link private so random people don’t spam “Yes”.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
