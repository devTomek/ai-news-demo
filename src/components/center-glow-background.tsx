export function CenterGlowBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute bottom-0 left-1/2 top-64 w-[50rem] -translate-x-1/2 bg-[linear-gradient(90deg,transparent_0%,rgba(59,130,246,0.3)_18%,rgba(217,70,239,0.18)_50%,rgba(34,211,238,0.28)_82%,transparent_100%)] blur-3xl dark:bg-[linear-gradient(90deg,transparent_0%,rgba(59,130,246,0.34)_18%,rgba(217,70,239,0.22)_50%,rgba(34,211,238,0.3)_82%,transparent_100%)]" />
      <div className="absolute bottom-0 left-1/2 top-72 w-[60rem] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.58)_0%,rgba(255,255,255,0.22)_28%,rgba(59,130,246,0.16)_54%,transparent_78%)] blur-3xl dark:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.07)_0%,rgba(125,211,252,0.12)_32%,rgba(217,70,239,0.1)_58%,transparent_80%)]" />
    </div>
  );
}
