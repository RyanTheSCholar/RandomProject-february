import { useEffect, useMemo, useRef, useState } from "react";

export default function App() {
  // ✅ customize
  const theirName = "Beautiful";
  const dateDetails =
    "Looks like you clicked yes! Now we have to move in together.";

  const areaRef = useRef(null);
  const yesRef = useRef(null);
  const noRef = useRef(null);

  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [open, setOpen] = useState(false);

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

      <main className="relative mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-8 sm:p-6">
        <div className="w-full rounded-3xl border border-[#EAD9CF] bg-[#FFF7F0]/85 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
          <div className="flex flex-col items-center text-center">
            <div className="mb-2 text-4xl sm:mb-3 sm:text-4xl">🤍</div>

            <h1 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
              Hey{" "}
              <span className="bg-gradient-to-r from-[#B86A7A] to-[#A85A6B] bg-clip-text text-transparent">
                {theirName}
              </span>
            </h1>

            <p className="mt-3 max-w-md text-pretty text-base leading-relaxed text-[#6B4C55] sm:text-lg">
              I have a very important question for you…
              <br />
              <span className="font-semibold text-[#2B1B1F]">
                Will you be my Valentine?
              </span>
            </p>

            <div
              ref={areaRef}
              className="relative mt-7 h-[150px] w-full max-w-md sm:h-[130px]"
            >
              <div className="flex h-full items-center justify-center">
                <button
                  ref={yesRef}
                  onClick={() => setOpen(true)}
                  className="min-w-[160px] rounded-2xl bg-[#B86A7A] px-7 py-4 text-base font-bold text-white shadow-lg shadow-black/10 transition active:scale-[0.98] sm:px-6 sm:py-3"
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
                  className="absolute min-w-[140px] rounded-2xl bg-[#F3E6DA] px-6 py-4 text-base font-bold text-[#2B1B1F] shadow-lg shadow-black/10 ring-1 ring-[#EAD9CF] transition active:scale-[0.98] sm:px-6 sm:py-3"
                  style={{ left: noPos.x, top: noPos.y }}
                >
                  No 🙃
                </button>
              </div>
            </div>

            <p className="mt-4 text-xs text-[#6B4C55]">
              Serious Question. Silly Website.
            </p>
          </div>
        </div>

        {open && (
          <div
            className="fixed inset-0 z-50 grid place-items-end bg-black/40 p-0 sm:place-items-center sm:p-6"
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <div className="w-full rounded-t-3xl bg-[#FFF7F0] p-6 shadow-2xl sm:max-w-md sm:rounded-3xl sm:p-7">
              <div className="text-center">
                <div className="text-5xl">😎</div>
                <h2 className="mt-3 text-2xl font-extrabold text-[#2B1B1F]">
                  AWESOME! It’s a date
                </h2>
              </div>

              <div className="mt-4 rounded-2xl bg-[#FFFDF7] p-4 text-left ring-1 ring-[#EAD9CF]">
                <div className="mt-1 text-sm leading-relaxed text-[#6B4C55] text-center">
                  {dateDetails}
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="mt-5 w-full rounded-2xl bg-[#B86A7A] px-5 py-3 font-bold text-white transition active:scale-[0.99]"
              >
                Close
              </button>

              <p className="mt-3 text-center text-xs text-[#6B4C55]">
                Keep the link private so random people don’t spam “Yes”.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
