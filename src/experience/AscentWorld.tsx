import { useEffect, useRef, useState } from "react";
import { experienceState } from "@/experience/state";
import {
  UNIFORM_NAMES,
  dustFragment,
  dustVertex,
  finishFragment,
  finishVertex,
  skyFragment,
  skyVertex,
  terrainFragment,
  terrainVertex,
} from "@/experience/ascentShaders";
import "@/experience/AscentWorld.css";

type AscentWorldProps = {
  pathname: string;
};

type ProgramBundle = {
  program: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation | null>;
};

const routeIndex = (pathname: string) => {
  if (pathname === "/") return 0;
  if (pathname.startsWith("/about")) return 1;
  if (pathname.startsWith("/training")) return 2;
  if (pathname.startsWith("/faculty")) return 3;
  if (pathname.startsWith("/resources")) return 4;
  if (pathname.startsWith("/gallery")) return 5;
  if (pathname.startsWith("/contact")) return 6;
  return 7;
};

type Look = {
  camY: number; pitch: number; ahead: number; time: number; trails: number; terrace: number;
  summit: number; beacon: number; dim: number; contour: number; flat: number;
  lx: number; ly: number; lp: number;
};

const L = (o: Partial<Look>): Look => ({
  camY: 1.75, pitch: 1.55, ahead: 20, time: 0, trails: 0, terrace: 0, summit: 0, beacon: 0,
  dim: 0, contour: 1, flat: 1, lx: 0.5, ly: 0.17, lp: 0.95, ...o,
});

// Home: the page is a climb. Each section is a stage of the same hillside.
const HOME_STAGES: Record<string, Look> = {
  night: L({}),
  discovery: L({ camY: 2.6, pitch: 1.0, ahead: 18, time: 0.22, ly: 0.3 }),
  routes: L({ camY: 10.5, pitch: -9.6, ahead: 7.5, time: 0.1, trails: 1, flat: 0.72, lx: 0.66, ly: 0.5, lp: 0.3 }),
  dawn: L({ camY: 2.4, pitch: 1.4, ahead: 20, time: 0.9, lx: 0.5, ly: 0.36, lp: 0.7 }),
  summit: L({ camY: 1.9, pitch: 1.5, ahead: 20, time: 1, summit: 1, lx: 0.5, ly: 0.36, lp: 0.6 }),
};

// Inner routes: same world, different vantage point and hour.
const ROUTE_LOOKS: Record<string, Look> = {
  about: L({ camY: 1.3, pitch: 1.2, ahead: 22, time: 0.46, dim: 0.05, lx: 0.62, ly: 0.2 }),
  training: L({ camY: 5.4, pitch: -2.6, ahead: 13, time: 0.2, terrace: 1, lx: 0.6, ly: 0.3 }),
  faculty: L({ camY: 1.9, pitch: 1.9, ahead: 20, time: 0.62, dim: 0.22, lp: 0.7, ly: 0.22 }),
  resources: L({ camY: 7.6, pitch: -5.6, ahead: 10, time: 0.64, dim: 0.12, contour: 1.45, lx: 0.5, ly: 0.32, lp: 0.8 }),
  gallery: L({ camY: 1.5, pitch: 1.3, ahead: 22, time: 0.3, dim: 0.34, lp: 0.8, ly: 0.2 }),
  contact: L({ camY: 3.4, pitch: 0.4, ahead: 19, time: 0.55, beacon: 1, lx: 0.5, ly: 0.36, lp: 1.1 }),
  other: L({}),
};

const routeKey = (pathname: string) => {
  const key = pathname.replace(/^\//, "").split("/")[0];
  return key in ROUTE_LOOKS ? key : "other";
};

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const mixLook = (a: Look, b: Look, t: number): Look => {
  const out = { ...a };
  (Object.keys(a) as (keyof Look)[]).forEach((k) => { out[k] = a[k] + (b[k] - a[k]) * t; });
  return out;
};

const pickLook = (pathname: string, elements: HTMLElement[]): Look => {
  const home = pathname === "/";
  const stageLook = (name: string | undefined) => {
    if (name === "summit") return HOME_STAGES.summit;
    if (home) return HOME_STAGES[name ?? "night"] ?? HOME_STAGES.night;
    return ROUTE_LOOKS[routeKey(pathname)];
  };
  if (!elements.length) return stageLook(undefined);
  const anchor = window.innerHeight * 0.55;
  let current = 0;
  const rects = elements.map((el) => el.getBoundingClientRect());
  for (let i = 0; i < rects.length; i += 1) if (rects[i].top <= anchor) current = i;
  const rect = rects[current];
  const frac = Math.min(1, Math.max(0, (anchor - rect.top) / Math.max(rect.height, 1)));
  const next = elements[current + 1];
  const here = stageLook(elements[current].dataset.worldStage);
  if (!next) return here;
  return mixLook(here, stageLook(next.dataset.worldStage), smooth(0.6, 1, frac));
};

const createShader = (gl: WebGL2RenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Unable to allocate WebGL shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) || "Unknown shader compilation failure";
    gl.deleteShader(shader);
    throw new Error(log);
  }
  return shader;
};

const createProgram = (gl: WebGL2RenderingContext, vertex: string, fragment: string): ProgramBundle => {
  const vs = createShader(gl, gl.VERTEX_SHADER, vertex);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fragment);
  const program = gl.createProgram();
  if (!program) throw new Error("Unable to allocate WebGL program");
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) || "Unknown WebGL link failure";
    gl.deleteProgram(program);
    throw new Error(log);
  }
  const uniforms: Record<string, WebGLUniformLocation | null> = {};
  UNIFORM_NAMES.forEach((name) => { uniforms[name] = gl.getUniformLocation(program, name); });
  return { program, uniforms };
};

const createTerrain = (gl: WebGL2RenderingContext, columns: number, rows: number) => {
  const vertices = new Float32Array((columns + 1) * (rows + 1) * 2);
  let pointer = 0;
  for (let y = 0; y <= rows; y += 1) {
    for (let x = 0; x <= columns; x += 1) {
      vertices[pointer++] = (x / columns) * 2 - 1;
      vertices[pointer++] = y / rows;
    }
  }

  const indices = new Uint32Array(columns * rows * 6);
  let index = 0;
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      const a = y * (columns + 1) + x;
      const b = a + 1;
      const c = a + columns + 1;
      const d = c + 1;
      indices[index++] = a;
      indices[index++] = c;
      indices[index++] = b;
      indices[index++] = b;
      indices[index++] = c;
      indices[index++] = d;
    }
  }

  const vao = gl.createVertexArray();
  const vertexBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();
  if (!vao || !vertexBuffer || !indexBuffer) throw new Error("Unable to allocate terrain buffers");
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  gl.bindVertexArray(null);

  return { vao, vertexBuffer, indexBuffer, indexCount: indices.length };
};

const AscentWorld = ({ pathname }: AscentWorldProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pathnameRef = useRef(pathname);
  const routeTargetRef = useRef(routeIndex(pathname));
  const transitionStartRef = useRef(typeof performance === "undefined" ? 0 : performance.now());
  const transitionOriginRef = useRef({ x: 0.5, y: 0.5 });
  const firstFrameRef = useRef(false);
  const [introDone, setIntroDone] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [introCount, setIntroCount] = useState(0);

  // Loader: the count only reaches 100 once fonts are decoded and the world has drawn a frame.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const started = performance.now();
    const minimum = reduced ? 160 : 1100;
    let fontsReady = false;
    let raf = 0;
    let closing = 0;
    let shown = 0;
    document.fonts?.ready.then(() => { fontsReady = true; }).catch(() => { fontsReady = true; });
    if (!document.fonts) fontsReady = true;
    const tick = (now: number) => {
      const ready = fontsReady && firstFrameRef.current;
      const timed = Math.min(1, (now - started) / minimum);
      const ceiling = ready ? 1 : 0.94;
      shown += (Math.min(timed, ceiling) - shown) * 0.22;
      const value = Math.min(100, Math.round(shown * 100 + (ready && timed >= 1 ? 1 : 0)));
      setIntroCount(value);
      if (ready && timed >= 1 && value >= 99) {
        setIntroCount(100);
        setLeaving(true);
        document.documentElement.dataset.khIntro = "done";
        window.dispatchEvent(new CustomEvent("kingshill:intro-start"));
        closing = window.setTimeout(() => setIntroDone(true), reduced ? 0 : 1000);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.clearTimeout(closing); };
  }, []);

  useEffect(() => {
    pathnameRef.current = pathname;
    routeTargetRef.current = routeIndex(pathname);
    transitionStartRef.current = performance.now();
    transitionOriginRef.current = {
      x: experienceState.pointer.ndcX * 0.5 + 0.5,
      y: experienceState.pointer.ndcY * 0.5 + 0.5,
    };
  }, [pathname]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: true,
      stencil: false,
      powerPreference: "high-performance",
      desynchronized: true,
    });
    if (!gl) {
      root.dataset.khWorld = "unsupported";
      return;
    }

    const worldStarted = performance.now();
    let destroyed = false;
    let raf = 0;
    let resizePending = true;
    let renderScale = experienceState.renderScale;
    let programme = 0;
    let programmeTarget = 0;
    let route = routeTargetRef.current;
    let transition = 1;
    let intro = 0;
    let lanternX = 0.50;
    let lanternY = 0.17;
    let lanternPower = 0.72;
    let tapX = 0.5;
    let tapY = 0.5;
    let tapTime = -1e9;
    let lastHeld = -1e9;
    let wasPressed = false;
    let stageEls: HTMLElement[] = [];
    let stageRefresh = 0;
    const look: Look = { ...HOME_STAGES.night };
    let frameAccumulator = 0;
    let frameSamples = 0;
    let lastFrame = performance.now();
    let lastQualityCheck = lastFrame;

    let sky: ProgramBundle;
    let terrain: ProgramBundle;
    let dust: ProgramBundle;
    let finish: ProgramBundle;
    let terrainData: ReturnType<typeof createTerrain>;
    const dustCount = experienceState.quality === "high" ? 1500 : experienceState.quality === "medium" ? 1000 : 640;

    try {
      sky = createProgram(gl, skyVertex, skyFragment);
      terrain = createProgram(gl, terrainVertex, terrainFragment);
      dust = createProgram(gl, dustVertex, dustFragment);
      finish = createProgram(gl, finishVertex, finishFragment);
      const columns = experienceState.quality === "high" ? 168 : experienceState.quality === "medium" ? 138 : 112;
      const rows = experienceState.quality === "high" ? 132 : experienceState.quality === "medium" ? 108 : 84;
      terrainData = createTerrain(gl, columns, rows);
      const gridLocation = gl.getAttribLocation(terrain.program, "aGrid");
      gl.bindVertexArray(terrainData.vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, terrainData.vertexBuffer);
      gl.enableVertexAttribArray(gridLocation);
      gl.vertexAttribPointer(gridLocation, 2, gl.FLOAT, false, 0, 0);
      gl.bindVertexArray(null);
    } catch (error) {
      console.error("Kingshill Ascent world failed to initialise", error);
      root.dataset.khWorld = "error";
      return;
    }

    const resize = () => {
      const dprCap = window.innerWidth <= 720 ? 1.5 : 1.75;
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap) * renderScale;
      const width = Math.max(1, Math.round(window.innerWidth * dpr));
      const height = Math.max(1, Math.round(window.innerHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      resizePending = false;
      experienceState.setRenderScale(renderScale);
    };

    const onResize = () => { resizePending = true; };
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        lastFrame = performance.now();
        raf = requestAnimationFrame(draw);
      }
    };
    const onProgramme = (event: Event) => {
      const custom = event as CustomEvent<{ index?: number }>;
      programmeTarget = Math.max(0, Math.min(3, custom.detail?.index ?? 0));
    };
    const onContextLost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(raf);
      root.dataset.khWorld = "lost";
    };
    const onContextRestored = () => { window.location.reload(); };

    const onTap = (event: PointerEvent) => {
      tapX = event.clientX / Math.max(1, window.innerWidth);
      tapY = 1 - event.clientY / Math.max(1, window.innerHeight);
      tapTime = performance.now();
    };
    window.addEventListener("pointerdown", onTap, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("kingshill:programme-change", onProgramme as EventListener);
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);
    root.dataset.khWorld = "ready";
    experienceState.markReady("world");

    const setCommon = (bundle: ProgramBundle, elapsed: number, worldTime: number) => {
      const u = bundle.uniforms;
      gl.uniform2f(u.uResolution, canvas.width, canvas.height);
      gl.uniform2f(u.uLantern, lanternX, lanternY);
      gl.uniform2f(u.uTransitionOrigin, transitionOriginRef.current.x, transitionOriginRef.current.y);
      gl.uniform1f(u.uLanternPower, lanternPower);
      gl.uniform1f(u.uTime, elapsed);
      gl.uniform1f(u.uWorldTime, worldTime);
      gl.uniform1f(u.uRoute, route);
      gl.uniform1f(u.uProgramme, programme);
      gl.uniform1f(u.uTransition, transition);
      gl.uniform1f(u.uVelocity, Math.min(1, Math.abs(experienceState.scroll.velocity) / 120));
      gl.uniform1f(u.uIntro, intro);
      gl.uniform1f(u.uPixel, canvas.height / Math.max(1, window.innerHeight));
      gl.uniform3f(u.uCam, look.camY, look.pitch, look.ahead);
      gl.uniform1f(u.uCamZ, -7 + experienceState.scroll.current * 0.0035);
      gl.uniform1f(u.uTrails, look.trails);
      gl.uniform1f(u.uTerrace, look.terrace);
      gl.uniform1f(u.uSummit, look.summit);
      gl.uniform1f(u.uBeacon, look.beacon);
      gl.uniform3f(u.uTap, tapX, tapY, Math.max(0, (performance.now() - tapTime) / 1000));
      gl.uniform1f(u.uDim, look.dim);
      gl.uniform1f(u.uContour, look.contour);
      gl.uniform1f(u.uFlat, look.flat);
    };

    const draw = (now: number) => {
      raf = 0;
      if (destroyed || document.hidden) return;
      if (resizePending) resize();

      const deltaMs = Math.min(50, Math.max(1, now - lastFrame));
      lastFrame = now;
      frameAccumulator += deltaMs;
      frameSamples += 1;
      const elapsed = reduced ? 0 : now * 0.001;
      const routeTransitionAge = Math.min(1, (now - transitionStartRef.current) / (reduced ? 120 : 920));
      transition = reduced ? 1 : routeTransitionAge;
      const introTarget = Math.min(1, (now - worldStarted) / 1400);
      intro += (introTarget - intro) * (reduced ? 1 : 0.06);
      programme += (programmeTarget - programme) * 0.065;

      // The landscape morphs between routes instead of cutting.
      route += (routeTargetRef.current - route) * (reduced ? 1 : 0.045);
      if (Math.abs(routeTargetRef.current - route) < 0.001) route = routeTargetRef.current;

      // Stage: the hillside changes vantage point and hour as you climb the page.
      stageRefresh -= 1;
      if (stageRefresh <= 0) {
        stageEls = Array.from(document.querySelectorAll<HTMLElement>("[data-world-stage]"));
        stageRefresh = 45;
      }
      const target = pickLook(pathnameRef.current, stageEls);
      const k = reduced ? 1 : 1 - Math.exp(-deltaMs * 0.0034);
      (Object.keys(target) as (keyof Look)[]).forEach((key) => { look[key] += (target[key] - look[key]) * k; });

      // Lantern: follows a finger or cursor, rests where the stage wants it, and drifts while idle.
      const pressed = experienceState.pointer.pressed;
      if (pressed) lastHeld = now;
      if (wasPressed && !pressed) lastHeld = now;
      wasPressed = pressed;
      const coarse = experienceState.pointer.coarse;
      const following = experienceState.pointer.active && (coarse ? pressed || now - lastHeld < 1400 : true);
      const idleX = look.lx + Math.sin(elapsed * 0.13) * 0.06;
      const idleY = look.ly + Math.cos(elapsed * 0.11) * 0.035;
      const targetX = following ? experienceState.pointer.smoothNdcX * 0.5 + 0.5 : idleX;
      const targetY = following ? experienceState.pointer.smoothNdcY * 0.5 + 0.5 : idleY;
      lanternX += (targetX - lanternX) * 0.08;
      lanternY += (targetY - lanternY) * 0.08;
      lanternPower += ((following ? Math.max(1, look.lp) : look.lp) - lanternPower) * 0.05;

      const worldTime = look.time;

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.depthMask(true);
      gl.clearColor(0.018, 0.044, 0.074, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // 1. Sky
      gl.disable(gl.BLEND);
      gl.disable(gl.DEPTH_TEST);
      gl.useProgram(sky.program);
      setCommon(sky, elapsed, worldTime);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // 2. Terrain
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.useProgram(terrain.program);
      setCommon(terrain, elapsed, worldTime);
      gl.bindVertexArray(terrainData.vao);
      gl.drawElements(gl.TRIANGLES, terrainData.indexCount, gl.UNSIGNED_INT, 0);
      gl.bindVertexArray(null);

      // 3. Gold dust (additive, depth-tested, no depth write)
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.depthMask(false);
      gl.useProgram(dust.program);
      setCommon(dust, elapsed, worldTime);
      gl.drawArrays(gl.POINTS, 0, dustCount);
      gl.depthMask(true);

      // 4. Finish: vignette + grain
      gl.disable(gl.DEPTH_TEST);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(finish.program);
      setCommon(finish, elapsed, worldTime);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.disable(gl.BLEND);

      firstFrameRef.current = true;

      if (now - lastQualityCheck > 2200 && frameSamples > 20 && !reduced) {
        const average = frameAccumulator / frameSamples;
        const previous = renderScale;
        if (average > 23.5) renderScale = Math.max(0.5, renderScale - 0.08);
        else if (average < 16.9) renderScale = Math.min(1, renderScale + 0.04);
        if (Math.abs(previous - renderScale) > 0.001) {
          experienceState.setRenderScale(renderScale);
          resizePending = true;
        }
        frameAccumulator = 0;
        frameSamples = 0;
        lastQualityCheck = now;
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointerdown", onTap);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("kingshill:programme-change", onProgramme as EventListener);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      gl.deleteBuffer(terrainData.vertexBuffer);
      gl.deleteBuffer(terrainData.indexBuffer);
      gl.deleteVertexArray(terrainData.vao);
      gl.deleteProgram(sky.program);
      gl.deleteProgram(terrain.program);
      gl.deleteProgram(dust.program);
      gl.deleteProgram(finish.program);
      delete root.dataset.khWorld;
    };
  }, []);

  return (
    <div className="kh-ascent-world" aria-hidden="true">
      <canvas ref={canvasRef} className="kh-ascent-world__canvas" />
      {!introDone && (
        <div className={`kh-ascent-loader${leaving ? " is-leaving" : ""}`}>
          <div className="kh-ascent-loader__line"><span style={{ width: `${introCount}%` }} /></div>
          <div className="kh-ascent-loader__meta"><span>Kingshill / Ascent</span><strong>{String(introCount).padStart(3, "0")}</strong></div>
        </div>
      )}
    </div>
  );
};

export default AscentWorld;
