import { useEffect, useState } from "react";
import CuratedWorld from "@/experience/CuratedWorld";
import "@/pages/SceneLab.css";

type LoadState = { label: string; progress: number; ready: boolean };

const assets = [
  { url: "/experience/models/stone-hand.glb", label: "Stone Hands / Arrival" },
  { url: "/experience/models/kingshill-tree.glb", label: "Living Tree / About" },
];

const preload = async (onProgress: (state: LoadState) => void) => {
  let loaded = 0;
  const total = assets.length;
  for (const asset of assets) {
    onProgress({ label: `Loading ${asset.label}`, progress: Math.round((loaded / total) * 82), ready: false });
    const response = await fetch(asset.url, { cache: "force-cache" });
    if (!response.ok) throw new Error(`Unable to preload ${asset.url}`);
    // Consuming the complete buffer warms the browser cache reliably across mobile Safari, Chromium, and the sandbox preview proxy.
    await response.arrayBuffer();
    loaded += 1;
    onProgress({ label: `Loaded ${asset.label}`, progress: Math.round((loaded / total) * 82), ready: false });
  }
  onProgress({ label: "Warming scene shaders", progress: 94, ready: false });
  await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  onProgress({ label: "Scene ready", progress: 100, ready: true });
};

const SceneLab = () => {
  const [state, setState] = useState<LoadState>({ label: "Preparing the world", progress: 0, ready: false });
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    preload((next) => { if (active) setState(next); }).catch((error) => {
      console.error("TCN scene preload failed", error);
      if (active) setFailed(true);
    });
    return () => { active = false; };
  }, []);

  if (failed) {
    return <main className="kh-scene-lab kh-scene-lab--error"><p>Scene assets could not be loaded. Please refresh the preview.</p></main>;
  }

  return (
    <div className={`kh-scene-lab ${state.ready ? "is-ready" : "is-loading"}`}>
      {!state.ready && (
        <div className="kh-scene-preloader" role="status" aria-live="polite">
          <div className="kh-scene-preloader__top"><span>TCN / NEW SCENES</span><span>{String(state.progress).padStart(2, "0")} %</span></div>
          <div className="kh-scene-preloader__mark" aria-hidden="true"><span>KH</span><i /></div>
          <div className="kh-scene-preloader__bottom"><span>{state.label}</span><div className="kh-scene-preloader__bar"><i style={{ width: `${state.progress}%` }} /></div></div>
        </div>
      )}
      {state.ready && <>
        <CuratedWorld pathname="/" />
        <header className="kh-scene-lab__header">
          <a href="#arrival" className="kh-scene-lab__brand" aria-label="Kingshill new scenes preview"><span>KH</span><strong>Kingshill</strong><small>School of Discovery</small></a>
          <div className="kh-scene-lab__status"><span>New scenes</span><i aria-hidden="true" /></div>
          <a className="kh-scene-lab__contact" href="#living">02 / Living layer <span>↓</span></a>
        </header>
        <main>
          <section id="arrival" className="kh-scene-panel kh-scene-panel--arrival">
            <div className="kh-scene-panel__eyebrow"><span>01</span><span>Nigeria&apos;s first registered coaching academy</span></div>
            <div className="kh-scene-panel__copy"><p>At Kingshill, we unlock potential. We raise builders and reformers.</p><h1>Discover<br />purpose.<br /><em>Discover</em><br />life.</h1></div>
            <div className="kh-scene-panel__meta"><span>Life transformation</span><span>Social development</span><span>Scroll to enter</span></div>
          </section>
          <section id="living" className="kh-scene-panel kh-scene-panel--living">
            <div className="kh-scene-panel__eyebrow"><span>02</span><span>About Kingshill</span></div>
            <div className="kh-scene-panel__copy"><p>We make you see the future and secure it.</p><h2>Potential<br />is a <em>practice.</em></h2><div className="kh-scene-panel__body"><strong>Unlock potential.<br />Raise builders.</strong><p>At Kingshill Coaching Academy, we believe in the power of human potential. Founded as Nigeria&apos;s first registered coaching academy, we have been pioneering excellence in coaching education for over two decades.</p></div></div>
            <div className="kh-scene-panel__meta"><span>25+ years</span><span>1,000+ graduates</span><span>CCC accredited</span></div>
          </section>
        </main>
      </>}
    </div>
  );
};

export default SceneLab;
