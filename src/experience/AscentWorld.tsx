import { useEffect, useRef, useState } from "react";
import { experienceState } from "@/experience/state";
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

const routeWorldTime = (pathname: string) => {
  if (pathname === "/") return experienceState.scroll.progress;
  if (pathname.startsWith("/about")) return 0.48;
  if (pathname.startsWith("/training")) return 0.18;
  if (pathname.startsWith("/faculty")) return 0.64;
  if (pathname.startsWith("/resources")) return 0.78;
  if (pathname.startsWith("/gallery")) return 0.32;
  if (pathname.startsWith("/contact")) return 0.58;
  return 0.42;
};

const skyVertex = `#version 300 es
precision highp float;
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p * 0.5;
  gl_Position = vec4(p * 2.0 - 1.0, 0.999, 1.0);
}`;

const skyFragment = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform vec2 uTransitionOrigin;
uniform float uTime;
uniform float uWorldTime;
uniform float uRoute;
uniform float uTransition;
uniform float uVelocity;
uniform float uIntro;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
             mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = r * p * 2.03 + 7.3;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / max(uResolution, vec2(1.0));
  float t = clamp(uWorldTime, 0.0, 1.0);
  vec3 ink = vec3(0.027, 0.075, 0.122);
  vec3 deep = vec3(0.018, 0.044, 0.074);
  vec3 predawn = vec3(0.075, 0.145, 0.215);
  vec3 dawn = vec3(0.285, 0.465, 0.590);
  vec3 gold = vec3(0.788, 0.663, 0.365);

  float vertical = smoothstep(0.0, 1.0, uv.y);
  vec3 night = mix(deep, ink, vertical * 0.92);
  vec3 morning = mix(vec3(0.075, 0.118, 0.165), dawn, vertical * 0.62);
  vec3 color = mix(night, morning, smoothstep(0.38, 1.0, t) * 0.72);

  float horizonY = mix(0.30, 0.38, smoothstep(0.0, 1.0, t));
  float horizon = exp(-abs(uv.y - horizonY) * 30.0);
  color += mix(vec3(0.08, 0.16, 0.23), vec3(0.34, 0.48, 0.58), t) * horizon * (0.12 + 0.34 * t);

  float mistBand = smoothstep(0.54, 0.16, uv.y) * smoothstep(0.03, 0.27, uv.y);
  float mist = fbm(vec2(uv.x * 4.2, uv.y * 8.0) + uRoute * 3.7);
  color = mix(color, mix(predawn, vec3(0.52, 0.61, 0.65), t), mistBand * smoothstep(0.48, 0.84, mist) * 0.12);

  float radius = length((uv - uTransitionOrigin) * vec2(uResolution.x / max(uResolution.y, 1.0), 1.0));
  float ringRadius = uTransition * 1.28;
  float ring = 1.0 - smoothstep(0.0, 0.018 + uVelocity * 0.012, abs(radius - ringRadius));
  color += gold * ring * (1.0 - uTransition) * 0.35;

  float introLine = 1.0 - smoothstep(0.0, 0.003, abs(uv.y - horizonY));
  outColor = vec4(color, 1.0);
}`;

const terrainVertex = `#version 300 es
precision highp float;
in vec2 aGrid;
out float vHeight;
out float vDepth;
out vec3 vWorld;
out vec2 vGrid;
uniform vec2 uResolution;
uniform float uTime;
uniform float uWorldTime;
uniform float uRoute;
uniform float uProgramme;
uniform float uIntro;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
             mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.56;
  mat2 r = mat2(0.81, -0.59, 0.59, 0.81);
  for (int i = 0; i < 5; i++) {
    v += noise(p) * a;
    p = r * p * 2.02 + vec2(4.7, 9.2);
    a *= 0.48;
  }
  return v;
}

void main() {
  float routeSeed = uRoute * 9.73;
  float x = aGrid.x * 12.5;
  float z = mix(2.0, 34.0, aGrid.y);
  vec2 terrainUv = vec2(x * 0.13 + routeSeed, z * 0.105 + routeSeed * 0.31);
  float broad = fbm(terrainUv * 0.72);
  float detail = fbm(terrainUv * 1.73 + 8.2);
  float ridge = sin(x * 0.29 + z * 0.16 + routeSeed) * 0.34 + sin(z * 0.39 - x * 0.10) * 0.19;
  float programmeBias = sin((uProgramme + 1.0) * 1.17 + x * 0.12 + z * 0.08) * 0.18;
  float h = (broad - 0.48) * 4.9 + (detail - 0.5) * 0.95 + ridge + programmeBias;
  h += exp(-pow(x * 0.16 - sin(z * 0.08 + routeSeed), 2.0)) * 0.72;

  float scroll = clamp(uWorldTime, 0.0, 1.0);
  float routeCam = sin(routeSeed * 0.31) * 0.75;
  vec3 camera = vec3(routeCam + sin(scroll * 1.9) * 0.22, 4.15 + scroll * 2.4, -5.7 + scroll * 4.8);
  vec3 target = vec3(routeCam * 0.25, 0.35 + scroll * 0.85, 10.0 + scroll * 5.5);
  vec3 forward = normalize(target - camera);
  vec3 right = normalize(cross(forward, vec3(0.0, 1.0, 0.0)));
  vec3 up = cross(right, forward);

  vec3 world = vec3(x, h, z);
  vec3 rel = world - camera;
  vec3 view = vec3(dot(rel, right), dot(rel, up), dot(rel, forward));
  float aspect = uResolution.x / max(1.0, uResolution.y);
  float fov = mix(1.52, 1.64, smoothstep(0.0, 1.0, scroll));
  float nearP = 0.1;
  float farP = 70.0;
  float zClip = ((farP + nearP) / (farP - nearP)) * view.z - ((2.0 * farP * nearP) / (farP - nearP));
  gl_Position = vec4(view.x * fov / aspect, view.y * fov, zClip, max(view.z, 0.001));

  vHeight = h;
  vDepth = view.z;
  vWorld = world;
  vGrid = aGrid;
}`;

const terrainFragment = `#version 300 es
precision highp float;
in float vHeight;
in float vDepth;
in vec3 vWorld;
in vec2 vGrid;
out vec4 outColor;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform vec2 uTransitionOrigin;
uniform float uTime;
uniform float uWorldTime;
uniform float uTransition;
uniform float uVelocity;
uniform float uRoute;
uniform float uProgramme;
uniform float uPointerActive;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
             mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0)), f.x), f.y);
}

void main() {
  vec2 screenUv = gl_FragCoord.xy / max(uResolution, vec2(1.0));
  vec2 lantern = uPointer;
  if (uPointerActive < 0.5) lantern = vec2(0.5, 0.42);

  float interval = mix(2.35, 3.05, smoothstep(0.0, 1.0, uWorldTime));
  float phase = abs(fract(vHeight * interval + uProgramme * 0.037) - 0.5);
  float aa = max(fwidth(vHeight * interval) * 1.35, 0.008);
  float contour = 1.0 - smoothstep(0.0, aa, phase);

  float minorPhase = abs(fract(vHeight * interval * 0.25) - 0.5);
  float major = 1.0 - smoothstep(0.0, max(fwidth(vHeight * interval * 0.25) * 1.5, 0.009), minorPhase);

  float aspect = uResolution.x / max(uResolution.y, 1.0);
  float lanternDistance = length((screenUv - lantern) * vec2(aspect, 1.0));
  float lanternPool = smoothstep(0.46, 0.008, lanternDistance);
  lanternPool = pow(lanternPool, 1.18);

  float transitionRadius = uTransition * 1.25;
  float transitionDistance = length((screenUv - uTransitionOrigin) * vec2(aspect, 1.0));
  float transitionRing = (1.0 - smoothstep(0.0, 0.028, abs(transitionDistance - transitionRadius))) * (1.0 - uTransition);

  vec3 ink = vec3(0.018, 0.046, 0.074);
  vec3 navy = vec3(0.027, 0.075, 0.122);
  vec3 blueLine = vec3(0.18, 0.30, 0.39);
  vec3 dawnLine = vec3(0.36, 0.50, 0.57);
  vec3 gold = vec3(0.788, 0.663, 0.365);

  float dawn = smoothstep(0.42, 1.0, uWorldTime);
  vec3 base = mix(ink, navy, 0.44 + dawn * 0.24);
  float slopeShade = clamp(0.54 + dFdx(vHeight) * -1.7 + dFdy(vHeight) * 1.1, 0.14, 1.0);
  base *= mix(0.54, 0.94, slopeShade);

  vec3 lineColor = mix(blueLine, dawnLine, dawn) * (0.22 + major * 0.15);
  float goldAmount = clamp(lanternPool * 1.18 + transitionRing * 0.72 + major * lanternPool * 0.42, 0.0, 1.0);
  lineColor = mix(lineColor, gold, goldAmount);
  float lineStrength = contour * (0.16 + major * 0.14 + lanternPool * 1.45 + transitionRing * 0.5);
  vec3 color = mix(base, lineColor, clamp(lineStrength, 0.0, 1.0));
  color += gold * lanternPool * 0.065;

  float valley = smoothstep(0.35, -1.25, vHeight);
  float mistNoise = noise(vWorld.xz * 0.15 + uRoute * 2.7);
  float mist = valley * smoothstep(0.42, 0.78, mistNoise) * (0.08 + dawn * 0.08);
  vec3 fogColor = mix(vec3(0.07, 0.12, 0.16), vec3(0.42, 0.52, 0.56), dawn);
  color = mix(color, fogColor, mist);

  float distanceFog = smoothstep(19.0, 36.0, vDepth);
  color = mix(color, mix(navy, fogColor, dawn * 0.65), distanceFog * 0.58);

  float edgeGold = contour * lanternPool * (0.12 + uVelocity * 0.22);
  color += gold * edgeGold;

  outColor = vec4(color, 1.0);
}`;

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

const createProgram = (
  gl: WebGL2RenderingContext,
  vertex: string,
  fragment: string,
  uniformNames: string[],
): ProgramBundle => {
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
  uniformNames.forEach((name) => { uniforms[name] = gl.getUniformLocation(program, name); });
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
  const routeRef = useRef(routeIndex(pathname));
  const transitionStartRef = useRef(typeof performance === "undefined" ? 0 : performance.now());
  const transitionOriginRef = useRef({ x: 0.5, y: 0.5 });
  const [introDone, setIntroDone] = useState(false);
  const [introCount, setIntroCount] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const started = performance.now();
    let raf = 0;
    const duration = reduced ? 160 : 1180;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / duration);
      setIntroCount(Math.round(progress * 100));
      if (progress < 1) raf = requestAnimationFrame(tick);
      else window.setTimeout(() => setIntroDone(true), reduced ? 0 : 180);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    pathnameRef.current = pathname;
    routeRef.current = routeIndex(pathname);
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
      alpha: true,
      antialias: false,
      depth: true,
      stencil: false,
      powerPreference: "high-performance",
      desynchronized: true,
    });
    if (!gl) {
      document.documentElement.dataset.khWorld = "unsupported";
      return;
    }

    gl.clearColor(0.018, 0.044, 0.074, 1);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const worldStarted = performance.now();
    let destroyed = false;
    let raf = 0;
    let resizePending = true;
    let renderScale = experienceState.renderScale;
    let programme = 0;
    let programmeTarget = 0;
    let transition = 1;
    let intro = 0;
    let frameAccumulator = 0;
    let frameSamples = 0;
    let lastFrame = performance.now();
    let lastQualityCheck = lastFrame;

    let sky: ProgramBundle;
    let terrain: ProgramBundle;
    let terrainData: ReturnType<typeof createTerrain>;

    try {
      sky = createProgram(gl, skyVertex, skyFragment, [
        "uResolution", "uPointer", "uTransitionOrigin", "uTime", "uWorldTime", "uRoute", "uTransition", "uVelocity", "uIntro",
      ]);
      terrain = createProgram(gl, terrainVertex, terrainFragment, [
        "uResolution", "uPointer", "uTransitionOrigin", "uTime", "uWorldTime", "uRoute", "uProgramme", "uTransition", "uVelocity", "uIntro", "uPointerActive",
      ]);
      const columns = experienceState.quality === "high" ? 168 : experienceState.quality === "medium" ? 138 : 112;
      const rows = experienceState.quality === "high" ? 112 : experienceState.quality === "medium" ? 92 : 74;
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

    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("kingshill:programme-change", onProgramme as EventListener);
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);
    root.dataset.khWorld = "ready";
    experienceState.markReady("world");

    const setCommon = (bundle: ProgramBundle, elapsed: number, worldTime: number) => {
      const uniforms = bundle.uniforms;
      const pointerX = experienceState.pointer.smoothNdcX * 0.5 + 0.5;
      const pointerY = experienceState.pointer.smoothNdcY * 0.5 + 0.5;
      gl.uniform2f(uniforms.uResolution, canvas.width, canvas.height);
      gl.uniform2f(uniforms.uPointer, pointerX, pointerY);
      gl.uniform2f(uniforms.uTransitionOrigin, transitionOriginRef.current.x, transitionOriginRef.current.y);
      gl.uniform1f(uniforms.uTime, elapsed);
      gl.uniform1f(uniforms.uWorldTime, worldTime);
      gl.uniform1f(uniforms.uRoute, routeRef.current);
      gl.uniform1f(uniforms.uTransition, transition);
      gl.uniform1f(uniforms.uVelocity, Math.min(1, Math.abs(experienceState.scroll.velocity) / 120));
      gl.uniform1f(uniforms.uIntro, intro);
    };

    const draw = (now: number) => {
      raf = 0;
      if (destroyed || document.hidden) return;
      if (resizePending) resize();

      const deltaMs = Math.min(50, Math.max(1, now - lastFrame));
      lastFrame = now;
      frameAccumulator += deltaMs;
      frameSamples += 1;
      const elapsed = now * 0.001;
      const routeTransitionAge = Math.min(1, (now - transitionStartRef.current) / (reduced ? 120 : 920));
      transition = reduced ? 1 : routeTransitionAge;
      const introTarget = Math.min(1, (now - worldStarted) / 1100);
      intro += (introTarget - intro) * (reduced ? 1 : 0.07);
      programme += (programmeTarget - programme) * 0.065;

      const currentPathname = pathnameRef.current;
      const worldTime = currentPathname === "/" ? Math.min(1, experienceState.scroll.progress * 1.12) : routeWorldTime(currentPathname);

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0.018, 0.044, 0.074, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.disable(gl.DEPTH_TEST);
      gl.useProgram(sky.program);
      setCommon(sky, elapsed, worldTime);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      gl.clearDepth(1);
      gl.clear(gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.useProgram(terrain.program);
      setCommon(terrain, elapsed, worldTime);
      gl.uniform1f(terrain.uniforms.uProgramme, programme);
      gl.uniform1f(terrain.uniforms.uPointerActive, experienceState.pointer.active ? 1 : 0);
      gl.bindVertexArray(terrainData.vao);
      gl.drawElements(gl.TRIANGLES, terrainData.indexCount, gl.UNSIGNED_INT, 0);
      gl.bindVertexArray(null);

      if (now - lastQualityCheck > 2200 && frameSamples > 20 && !reduced) {
        const average = frameAccumulator / frameSamples;
        const previous = renderScale;
        if (average > 23.5) renderScale = Math.max(0.68, renderScale - 0.08);
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
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("kingshill:programme-change", onProgramme as EventListener);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      gl.deleteBuffer(terrainData.vertexBuffer);
      gl.deleteBuffer(terrainData.indexBuffer);
      gl.deleteVertexArray(terrainData.vao);
      gl.deleteProgram(sky.program);
      gl.deleteProgram(terrain.program);
      delete root.dataset.khWorld;
    };
  }, []);

  return (
    <div className="kh-ascent-world" aria-hidden="true">
      <canvas ref={canvasRef} className="kh-ascent-world__canvas" />
      {!introDone && (
        <div className="kh-ascent-loader">
          <div className="kh-ascent-loader__line"><span style={{ width: `${introCount}%` }} /></div>
          <div className="kh-ascent-loader__meta"><span>Kingshill / Ascent</span><strong>{String(introCount).padStart(3, "0")}</strong></div>
        </div>
      )}
    </div>
  );
};

export default AscentWorld;
