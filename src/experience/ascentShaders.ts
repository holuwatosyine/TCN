/* Kingshill Ascent — GLSL for the persistent world.
   Gold is the only light source. Everything else is blue-black atmosphere.
   Passes: sky -> terrain (lit, contoured, fogged) -> dust -> finish (vignette + grain). */

export const UNIFORM_NAMES = [
  "uResolution", "uLantern", "uLanternPower", "uTransitionOrigin", "uTime", "uWorldTime",
  "uRoute", "uProgramme", "uTransition", "uVelocity", "uIntro", "uPixel",
  "uCam", "uCamZ", "uTrails", "uTerrace", "uSummit", "uBeacon", "uTap", "uDim", "uContour", "uFlat",
];

const COMMON = /* glsl */ `
precision highp float;
uniform vec2 uResolution;
uniform vec2 uLantern;
uniform vec2 uTransitionOrigin;
uniform float uLanternPower;
uniform float uTime;
uniform float uWorldTime;
uniform float uRoute;
uniform float uProgramme;
uniform float uTransition;
uniform float uVelocity;
uniform float uIntro;
uniform float uPixel;
uniform vec3 uCam;      // x: camera height, y: look-target y offset, z: look-target distance ahead
uniform float uCamZ;
uniform float uTrails;
uniform float uTerrace;
uniform float uSummit;
uniform float uBeacon;
uniform vec3 uTap;      // xy: tap position (uv), z: seconds since tap
uniform float uDim;
uniform float uContour;
uniform float uFlat;

float hash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}
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

float fbm3(vec2 p) {
  float v = 0.0;
  float a = 0.56;
  mat2 r = mat2(0.81, -0.59, 0.59, 0.81);
  for (int i = 0; i < 3; i++) {
    v += noise(p) * a;
    p = r * p * 2.02 + vec2(4.7, 9.2);
    a *= 0.48;
  }
  return v;
}

float terrainHeight(vec2 p) {
  float seed = uRoute * 9.73;
  vec2 q = vec2(p.x * 0.13 + seed, p.y * 0.105 + seed * 0.31);
  vec2 w = vec2(fbm(q * 0.9 + 3.1), fbm(q * 0.9 + 8.7)) - 0.5;
  q += w * 1.15;
  float broad = fbm(q * 0.72);
  float ridged = 1.0 - abs(2.0 * fbm(q * 1.35 + 5.0) - 1.0);
  float h = (broad - 0.5) * 5.6 + ridged * ridged * 1.25 - 0.55;
  h += (fbm(q * 2.4 + 11.0) - 0.5) * 0.95;
  h += sin(p.x * 0.21 + p.y * 0.11 + seed) * 0.32;
  h += sin((uProgramme + 1.0) * 1.17 + p.x * 0.12 + p.y * 0.08) * 0.18;
  h *= uFlat;
  if (uTerrace > 0.001) {
    float k = 1.1;
    float hs = h * k;
    float fl = floor(hs);
    float st = fl + smoothstep(0.28, 0.72, hs - fl);
    h = mix(h, st / k, uTerrace);
  }
  return h;
}

struct Cam { vec3 pos; vec3 fwd; vec3 right; vec3 up; float fov; };
Cam getCam() {
  float routeCam = sin(uRoute * 9.73 * 0.31) * 0.75;
  float sway = sin(uTime * 0.11) * 0.14;
  Cam c;
  c.pos = vec3(routeCam + sway, uCam.x, uCamZ);
  vec3 target = vec3(routeCam * 0.25, uCam.x + uCam.y, uCamZ + uCam.z);
  c.fwd = normalize(target - c.pos);
  c.right = normalize(cross(c.fwd, vec3(0.0, 1.0, 0.0)));
  c.up = cross(c.right, c.fwd);
  c.fov = 1.55;
  return c;
}
vec4 project(vec3 view, Cam c) {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  float n = 0.1;
  float f = 140.0;
  float zc = ((f + n) / (f - n)) * view.z - (2.0 * f * n) / (f - n);
  return vec4(view.x * c.fov / aspect, view.y * c.fov, zc, view.z);
}

vec3 skyColor(vec3 d, float dawn) {
  float e = d.y;
  vec3 zen = mix(vec3(0.010, 0.026, 0.048), vec3(0.10, 0.20, 0.30), dawn * 0.7);
  vec3 mid = mix(vec3(0.026, 0.070, 0.115), vec3(0.28, 0.44, 0.56), dawn * 0.75);
  float k = smoothstep(-0.05, 0.75, e);
  vec3 col = mix(mid, zen, pow(k, 0.7));
  float az = d.x / max(d.z, 0.25);
  float side = 0.40 + 0.60 * exp(-pow((az - 0.28) * 1.25, 2.0));
  float wide = exp(-max(e, 0.0) * 5.0);
  float tight = exp(-abs(e) * 26.0);
  vec3 haze = mix(vec3(0.10, 0.22, 0.33), vec3(0.55, 0.68, 0.75), dawn);
  vec3 warm = mix(vec3(0.66, 0.50, 0.30), vec3(0.95, 0.80, 0.58), dawn);
  col += haze * wide * 0.30 * side;
  col += mix(haze, warm, 0.50) * tight * (1.00 + 0.30 * dawn) * side;
  return col;
}

float lanternPool(vec2 uv) {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 q = (uv - uLantern) * vec2(aspect * 0.78, 1.55);
  float d = length(q);
  return pow(1.0 - smoothstep(0.0, 0.56, d), 1.35) * uLanternPower;
}
float transitionRing(vec2 uv) {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  float r = length((uv - uTransitionOrigin) * vec2(aspect, 1.0));
  float width = 0.028 + uVelocity * 0.012;
  return (1.0 - smoothstep(0.0, width, abs(r - uTransition * 1.3))) * (1.0 - uTransition);
}

float sonar(vec2 uv) {
  if (uBeacon < 0.001) return 0.0;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  float r = length((uv - uLantern) * vec2(aspect, 1.0));
  float ph = fract(uTime * 0.14);
  float a = 0.0;
  for (int i = 0; i < 3; i++) {
    float rr = fract(ph + float(i) / 3.0);
    a += (1.0 - smoothstep(0.0, 0.012 + rr * 0.03, abs(r - rr * 1.0))) * (1.0 - rr) * (1.0 - rr);
  }
  return a * uBeacon;
}

float tapRing(vec2 uv) {
  float age = uTap.z;
  if (age > 2.6) return 0.0;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  float r = length((uv - uTap.xy) * vec2(aspect, 1.0));
  float rad = (1.0 - exp(-age * 2.4)) * 0.46;
  float ring = 1.0 - smoothstep(0.0, 0.016 + age * 0.014, abs(r - rad));
  return ring * exp(-age * 1.7);
}
`;

export const skyVertex = `#version 300 es
precision highp float;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.999, 1.0);
}`;

export const skyFragment = `#version 300 es
${COMMON}
out vec4 outColor;
void main() {
  vec2 uv = gl_FragCoord.xy / max(uResolution, vec2(1.0));
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  Cam c = getCam();
  vec2 ndc = uv * 2.0 - 1.0;
  vec3 dir = normalize(c.fwd + c.right * (ndc.x * aspect / c.fov) + c.up * (ndc.y / c.fov));
  float dawn = smoothstep(0.42, 1.0, uWorldTime);
  vec3 gold = vec3(0.788, 0.663, 0.365);
  vec3 col = skyColor(dir, dawn);
  float azS = dir.x / max(dir.z, 0.25);
  float sun = exp(-(pow((azS - 0.05) * 1.6, 2.0) + pow(dir.y * 7.0, 2.0)));
  col += vec3(1.0, 0.74, 0.42) * sun * 0.62 * uSummit;
  col += gold * lanternPool(uv) * 0.03;
  col += gold * transitionRing(uv) * 0.30;
  col += gold * (sonar(uv) * 0.22 + tapRing(uv) * 0.30);
  outColor = vec4(col, 1.0);
}`;

export const terrainVertex = `#version 300 es
${COMMON}
in vec2 aGrid;
out float vHeight;
out float vDepth;
out vec3 vWorld;
out vec3 vNormal;
out vec3 vCam;

float surface(float x, float z, float d, float camY) {
  float h = terrainHeight(vec2(x, z));
  return mix(min(h, camY - 1.1), h, smoothstep(0.0, 8.0, d));
}

void main() {
  Cam c = getCam();
  float d = mix(-2.5, 82.0, pow(aGrid.y, 1.35));
  float z = c.pos.z + d;
  float xHalf = 4.0 + max(d, 0.0) * 1.85;
  float x = c.pos.x + aGrid.x * xHalf;
  float h = surface(x, z, d, c.pos.y);
  float e = 0.35;
  float hx = surface(x + e, z, d, c.pos.y);
  float hz = surface(x, z + e, d, c.pos.y);
  vec3 n = normalize(vec3(h - hx, e, h - hz));

  vec3 world = vec3(x, h, z);
  vec3 rel = world - c.pos;
  vec3 view = vec3(dot(rel, c.right), dot(rel, c.up), dot(rel, c.fwd));
  gl_Position = project(view, c);

  vHeight = h;
  vDepth = view.z;
  vWorld = world;
  vNormal = n;
  vCam = c.pos;
}`;

export const terrainFragment = `#version 300 es
${COMMON}
in float vHeight;
in float vDepth;
in vec3 vWorld;
in vec3 vNormal;
in vec3 vCam;
out vec4 outColor;

float trailX(float fi, float z) {
  float spread = clamp(uResolution.x / max(uResolution.y, 1.0), 0.5, 1.0);
  return ((fi - 1.5) * 2.3 + sin(z * 0.22 + fi * 2.1) * 1.2 + sin(z * 0.071 + fi * 1.3) * 0.95) * spread;
}

void main() {
  vec2 uv = gl_FragCoord.xy / max(uResolution, vec2(1.0));
  float dawn = smoothstep(0.42, 1.0, uWorldTime);
  vec3 gold = vec3(0.788, 0.663, 0.365);
  vec3 goldHot = vec3(1.0, 0.80, 0.45);

  vec3 N = normalize(vNormal);
  vec3 V = normalize(vCam - vWorld);
  vec3 L = normalize(vec3(0.28, 0.20, 1.0));
  float ndl = dot(N, L) * 0.5 + 0.5;
  float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.0);

  vec3 shadow = mix(vec3(0.006, 0.016, 0.030), vec3(0.012, 0.030, 0.052), dawn);
  vec3 lit = mix(vec3(0.030, 0.072, 0.112), vec3(0.20, 0.30, 0.38), dawn);
  vec3 base = mix(shadow, lit, smoothstep(0.15, 0.95, ndl));
  base += mix(vec3(0.16, 0.28, 0.40), vec3(0.50, 0.62, 0.68), dawn) * fres * 0.30;

  float interval = mix(6.2, 7.4, dawn) * uContour;
  vec2 wp = vWorld.xz * 0.55 + uRoute;
  float wob = (fbm3(wp + vec2(3.7, 1.9)) - 0.5) * 0.46 + (noise(vWorld.xz * 2.1) - 0.5) * 0.08;
  float hh = (vHeight + wob) * interval + uProgramme * 0.037;
  float g = hh - 0.5;
  float w = fwidth(g);
  float dm = abs(g - floor(g + 0.5));
  float line = 1.0 - smoothstep(0.0, max(w * 1.25, 0.012), dm);
  float f4 = g * 0.25;
  float dM = abs(f4 - floor(f4 + 0.5));
  float major = 1.0 - smoothstep(0.0, max(fwidth(f4) * 1.4, 0.012), dM);
  float aliasFade = 1.0 - smoothstep(0.35, 0.95, w);
  float distFade = 1.0 - smoothstep(14.0, 44.0, vDepth);
  float lineVis = line * aliasFade * (0.35 + 0.65 * distFade);
  float majorVis = major * aliasFade * (0.35 + 0.65 * distFade);

  float tap = tapRing(uv);
  float sn = sonar(uv);
  float pool = clamp(lanternPool(uv) + tap * 0.45 + sn * 0.8, 0.0, 1.5);
  float ring = transitionRing(uv) + tap * 0.9 + sn * 1.7;

  vec3 lineCol = mix(vec3(0.16, 0.31, 0.41), vec3(0.42, 0.56, 0.62), dawn) * (0.55 + majorVis * 0.7 + uTrails * 0.5);
  float goldAmt = clamp(pool * 1.25 + ring * 0.7, 0.0, 1.0);
  lineCol = mix(lineCol, mix(gold, goldHot, pool * pool), goldAmt);
  float strength = lineVis * (0.26 + majorVis * 0.28 + pool * 1.50 + ring * 0.6 + uTrails * 0.34);
  vec3 color = mix(base, lineCol, clamp(strength * uIntro, 0.0, 1.0));

  float glowLine = 1.0 - smoothstep(0.0, w * 7.0 + 0.10, dm);
  color += gold * glowLine * aliasFade * pool * 0.16 * uIntro;
  color += gold * pool * (0.09 + 0.50 * fres + 0.16 * ndl);

  vec3 trailAdd = vec3(0.0);
  if (uTrails > 0.001) {
    float tr = 0.0;
    float nd = 0.0;
    vec2 rel = vec2(vWorld.x - vCam.x, vWorld.z - vCam.z - 8.0);
    vec2 q = vec2(rel.x * 0.86 - rel.y * 0.51, rel.x * 0.51 + vWorld.z * 0.86);
    float px = fwidth(q.x) + fwidth(q.y) * 0.5;
    for (int i = 0; i < 4; i++) {
      float fi = float(i);
      float dx = abs(q.x - trailX(fi, q.y));
      float sel = 1.0 - clamp(abs(uProgramme - fi), 0.0, 1.0);
      float core = 1.0 - smoothstep(0.0, px * (1.5 + sel * 1.5) + 0.02, dx);
      float glow = exp(-dx * dx / (0.018 + sel * 0.07)) * (0.05 + sel * 0.26);
      float dash = mix(smoothstep(0.35, 0.55, fract(q.y * 0.8 + fi * 0.37)), 1.0, sel);
      float pulse = 0.8 + 0.2 * sin(q.y * 2.0 - uTime * 2.2) * sel;
      tr += (core * dash * (0.4 + sel * 1.0) + glow) * pulse;
      float nz = floor(q.y / 3.4 + 0.5) * 3.4;
      float nr = length(vec2(q.x - trailX(fi, nz), q.y - nz));
      nd += (1.0 - smoothstep(0.0, 0.11 + sel * 0.08 + px, nr)) * (0.55 + sel)
          + (1.0 - smoothstep(0.0, 0.02 + px, abs(nr - 0.28))) * 0.6 * sel;
    }
    tr = clamp(tr, 0.0, 1.7) * uTrails;
    nd = clamp(nd, 0.0, 1.6) * uTrails;
    trailAdd = goldHot * tr * 1.0 + gold * nd * 0.9;
  }

  float mistN = noise(vWorld.xz * 0.20 + vec2(uTime * 0.015, uRoute * 2.7)) * 0.65 + noise(vWorld.xz * 0.53 - uTime * 0.01) * 0.35;
  float valley = 1.0 - smoothstep(-1.8, 0.9, vHeight);
  float mist = valley * smoothstep(0.30, 0.85, mistN) * 0.62;
  vec3 rayDir = normalize(vWorld - vCam);
  vec3 fogDir = normalize(vec3(rayDir.x, 0.035, rayDir.z));
  vec3 fogCol = skyColor(fogDir, dawn);
  vec3 mistCol = fogCol * 0.55 + vec3(0.02, 0.04, 0.06);
  color = mix(color, mistCol, mist * (0.35 + 0.65 * smoothstep(4.0, 26.0, vDepth)));
  float fogAmt = (1.0 - exp(-pow(vDepth * 0.040, 1.55))) * (1.0 - uTrails * 0.75);
  color = mix(color, fogCol, fogAmt);
  color += gold * pool * (mist * 0.10 + fogAmt * 0.04);
  color += trailAdd;

  outColor = vec4(color, 1.0);
}`;

export const dustVertex = `#version 300 es
${COMMON}
out float vA;
void main() {
  Cam c = getCam();
  float id = float(gl_VertexID);
  float r1 = hash11(id + 1.0);
  float r2 = hash11(id * 1.7 + 11.0);
  float r3 = hash11(id * 2.3 + 29.0);
  float r4 = hash11(id * 3.1 + 5.0);
  float d = 3.0 + pow(r2, 1.25) * 34.0;
  float z = c.pos.z + d;
  float x = c.pos.x + (r1 * 2.0 - 1.0) * (1.5 + d * 1.1) + sin(uTime * 0.18 + id) * 0.25;
  float life = fract(r3 + uTime * (0.018 + 0.03 * r4) * (1.0 + uSummit * 1.6));
  float h = terrainHeight(vec2(x, z));
  float y = h + 0.06 + life * (0.9 + 0.8 * r4);
  vec3 rel = vec3(x, y, z) - c.pos;
  vec3 view = vec3(dot(rel, c.right), dot(rel, c.up), dot(rel, c.fwd));
  gl_Position = project(view, c);
  vec2 uv = gl_Position.xy / max(gl_Position.w, 0.001) * 0.5 + 0.5;
  float pool = lanternPool(uv);
  float env = sin(life * 3.14159265);
  float tw = 0.65 + 0.35 * sin(uTime * (1.2 + r4 * 2.0) + id * 7.0);
  vA = env * tw * (0.12 + 0.88 * pool + 0.55 * uSummit) * (1.0 - smoothstep(20.0, 38.0, view.z) * 0.8) * uIntro;
  gl_PointSize = clamp((1.4 + 2.6 * r4) * uPixel * (10.0 / max(view.z, 4.0)), 1.0, 9.0 * uPixel);
}`;

export const dustFragment = `#version 300 es
precision highp float;
in float vA;
out vec4 outColor;
void main() {
  vec2 p = gl_PointCoord * 2.0 - 1.0;
  float a = exp(-dot(p, p) * 3.2) * vA;
  if (a < 0.003) discard;
  outColor = vec4(1.0, 0.80, 0.46, a);
}`;

export const finishVertex = skyVertex;

export const finishFragment = `#version 300 es
${COMMON}
out vec4 outColor;
void main() {
  vec2 uv = gl_FragCoord.xy / max(uResolution, vec2(1.0));
  vec2 c = uv - 0.5;
  float top = smoothstep(0.78, 1.0, uv.y) * 0.4;
  float vig = clamp(smoothstep(0.35, 0.95, length(c * vec2(1.0, 0.9))) * 0.42 + uDim * 0.30 + top, 0.0, 0.88);
  float g = fract(sin(dot(gl_FragCoord.xy + fract(uTime) * 137.0, vec2(12.9898, 78.233))) * 43758.5453);
  float ga = abs(g - 0.5) * 0.05;
  vec3 gc = vec3(step(0.5, g));
  float a = 1.0 - (1.0 - ga) * (1.0 - vig);
  outColor = vec4(gc * ga * (1.0 - vig), a);
}`;
