import { experienceState } from "@/experience/state";

type ClothHandle = { dispose: () => void; refresh: () => void };

const SEGMENTS = 64;
const NODES = SEGMENTS + 1;
const BLEED = 38;
const FIXED_DELTA = 1 / 120;

const vertexShader = `#version 300 es
precision highp float;
layout(location=0) in vec2 aGrid;
layout(location=1) in vec4 aData;
layout(location=2) in vec2 aOffset;
uniform vec2 uRes;
uniform vec2 uOut;
uniform float uBleed;
uniform float uFocal;
out vec2 vUv;
out vec3 vNormal;
out vec2 vLocal;
void main(){
  vUv=aGrid;
  float z=aData.x;
  vec2 nxy=aData.yz;
  vNormal=vec3(nxy,sqrt(max(1.0-dot(nxy,nxy),.04)));
  vLocal=aGrid*uRes;
  vec2 px=vLocal+aOffset+vec2(uBleed);
  vec2 ndc=(px/uOut)*2.0-1.0;
  ndc.y=-ndc.y;
  float w=(uFocal-z)/uFocal;
  gl_Position=vec4(ndc,-z/uFocal,w);
}`;

const fragmentShader = `#version 300 es
precision highp float;
in vec2 vUv;
in vec3 vNormal;
in vec2 vLocal;
out vec4 outColor;
uniform sampler2D uContent;
uniform vec2 uRes;
uniform float uRadius;
float fabricDist(vec2 p,vec2 size,float radius){
  vec2 half_=size*.5;
  float r=min(radius,min(half_.x,half_.y));
  vec2 q=abs(p-half_)-(half_-vec2(r));
  return length(max(q,vec2(0.0)))+min(max(q.x,q.y),0.0)-r;
}
void main(){
  vec4 tex=texture(uContent,clamp(vUv,vec2(.001),vec2(.999)));
  vec3 n=normalize(vNormal);
  vec3 lightDir=normalize(vec3(-.3,.42,.86));
  float subtleLight=.975+.025*dot(n,lightDir);
  float spec=pow(max(dot(n,normalize(lightDir+vec3(0,0,1))),0.0),34.0)*.025;
  float d=fabricDist(vLocal,uRes,uRadius);
  float alpha=clamp(.5-d,0.0,1.0);
  outColor=vec4(clamp(tex.rgb*subtleLight+spec,0.0,1.0),tex.a*alpha);
}`;

const compile = (gl: WebGL2RenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Unable to create Kage cloth shader.");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) || "Kage cloth shader compilation failed.");
  return shader;
};

export const createKageCloth = (
  output: HTMLCanvasElement,
  wrapper: HTMLElement,
  plate: () => HTMLCanvasElement | null,
): ClothHandle | null => {
  output.style.inset = `${-BLEED}px`;
  output.style.width = `calc(100% + ${BLEED * 2}px)`;
  output.style.height = `calc(100% + ${BLEED * 2}px)`;
  const gl = output.getContext("webgl2", { alpha: true, depth: false, stencil: false, antialias: true, premultipliedAlpha: true });
  if (!gl) return null;

  const vertex = compile(gl, gl.VERTEX_SHADER, vertexShader);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentShader);
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || "Kage cloth program link failed.");
  const uniforms: Record<string, WebGLUniformLocation | null> = {};
  const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;
  for (let index = 0; index < uniformCount; index += 1) {
    const info = gl.getActiveUniform(program, index);
    if (info) uniforms[info.name] = gl.getUniformLocation(program, info.name);
  }

  const gridVertices = new Float32Array(NODES * NODES * 2);
  for (let y = 0; y < NODES; y += 1) for (let x = 0; x < NODES; x += 1) {
    const offset = (y * NODES + x) * 2;
    gridVertices[offset] = x / SEGMENTS;
    gridVertices[offset + 1] = y / SEGMENTS;
  }
  const indices = new Uint32Array(SEGMENTS * SEGMENTS * 6);
  let indexOffset = 0;
  for (let y = 0; y < SEGMENTS; y += 1) for (let x = 0; x < SEGMENTS; x += 1) {
    const a = y * NODES + x;
    const b = a + 1;
    const c = a + NODES;
    const d = c + 1;
    indices.set([a, c, b, b, c, d], indexOffset);
    indexOffset += 6;
  }

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const gridBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, gridBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, gridVertices, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const dataBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, NODES * NODES * 16, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);
  const offsetBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, offsetBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, NODES * NODES * 8, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(2);
  gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0);
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  gl.bindVertexArray(null);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));

  let current = new Float32Array(NODES * NODES);
  let previous = new Float32Array(NODES * NODES);
  let next = new Float32Array(NODES * NODES);
  const vertexData = new Float32Array(NODES * NODES * 4);
  const offsets = new Float32Array(NODES * NODES * 2);
  const zField = new Float32Array(NODES * NODES);
  const rowForce = new Float32Array(NODES);
  const columnForce = new Float32Array(NODES);
  const hang = new Float32Array(NODES);
  for (let axis = 0; axis < NODES; axis += 1) hang[axis] = Math.pow(axis / SEGMENTS, 1.3);
  const pointer = { x: -100000, y: -100000, inside: false };
  const touch = { x: -100000, y: -100000, vx: 0, vy: 0, strength: 0 };
  let simulationTime = 7.2;
  let gust = 0.5;
  let debt = 0;
  let frameHandle = 0;
  let running = false;
  let inView = false;
  let dead = false;

  const upload = () => {
    const source = plate();
    if (!source?.width) return;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
  };
  const syncSize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.65 * experienceState.renderScale);
    output.width = Math.max(1, Math.round(output.clientWidth * dpr));
    output.height = Math.max(1, Math.round(output.clientHeight * dpr));
  };

  const stepSimulation = (delta: number) => {
    simulationTime += delta * 0.5;
    const waveA = (Math.PI * 2) / (SEGMENTS / 1.5);
    const waveB = (Math.PI * 2) / (SEGMENTS / 3.8);
    const cross = (Math.PI * 2) / (SEGMENTS / 2.2);
    const drift = 1.8 * Math.sin(0.23 * simulationTime);
    for (let axis = 0; axis < NODES; axis += 1) {
      rowForce[axis] = Math.sin(waveA * axis - 30 * waveA * simulationTime + drift) + 0.45 * Math.sin(waveB * axis + 30 * waveB * simulationTime * 0.8 + 3);
      columnForce[axis] = (0.7 + 0.3 * Math.sin(cross * axis - 1.7 * simulationTime)) * hang[axis];
    }
    const decay = Math.exp(-Math.min(Math.max(1, 0.05), 8) * delta);
    for (let y = 0; y < NODES; y += 1) {
      const up = Math.max(y - 1, 0) * NODES;
      const down = Math.min(y + 1, SEGMENTS) * NODES;
      const row = y * NODES;
      for (let x = 0; x < NODES; x += 1) {
        const index = row + x;
        const height = current[index];
        const laplacian = current[row + Math.max(x - 1, 0)] + current[row + Math.min(x + 1, SEGMENTS)] + current[up + x] + current[down + x] - 4 * height;
        const force = 5 * 2.15 * gust * rowForce[x] * columnForce[y];
        const candidate = 2 * height - previous[index] + delta * delta * (900 * laplacian - 0.55 * height + force);
        next[index] = Math.max(-3.5, Math.min(3.5, height + (candidate - height) * decay));
      }
    }
    for (let x = 0; x < NODES; x += 1) next[x] = 0;
    const spent = previous;
    previous = current;
    current = next;
    next = spent;
  };

  const imprint = (delta: number, width: number, height: number) => {
    if (touch.strength < 0.01) return;
    const cellWidth = width / SEGMENTS;
    const cellHeight = height / SEGMENTS;
    const radiusX = 125 / cellWidth;
    const radiusY = 125 / cellHeight;
    const gridX = touch.x / cellWidth;
    const gridY = touch.y / cellHeight;
    const x0 = Math.max(Math.ceil(gridX - 2.5 * radiusX), 0);
    const x1 = Math.min(Math.floor(gridX + 2.5 * radiusX), SEGMENTS);
    const y0 = Math.max(Math.ceil(gridY - 2.5 * radiusY), 0);
    const y1 = Math.min(Math.floor(gridY + 2.5 * radiusY), SEGMENTS);
    const rate = Math.min(delta * 4, 1);
    for (let y = y0; y <= y1; y += 1) for (let x = x0; x <= x1; x += 1) {
      const dx = (x - gridX) / radiusX;
      const dy = (y - gridY) / radiusY;
      const gaussian = Math.exp(-(dx * dx + dy * dy));
      if (gaussian < 0.02) continue;
      const index = y * NODES + x;
      const goal = 1.6 * gaussian * touch.strength;
      current[index] += (goal - current[index]) * rate * gaussian;
      previous[index] += (goal - previous[index]) * rate * gaussian;
    }
  };

  const compose = (width: number, height: number) => {
    const cellWidth = width / SEGMENTS;
    const cellHeight = height / SEGMENTS;
    for (let y = 0; y < NODES; y += 1) for (let x = 0; x < NODES; x += 1) {
      const index = y * NODES + x;
      zField[index] = 23 * Math.tanh(current[index]) + 27 * hang[y] * (0.3 + 0.7 * gust);
    }
    for (let y = 0; y < NODES; y += 1) {
      const up = Math.max(y - 1, 0) * NODES;
      const down = Math.min(y + 1, SEGMENTS) * NODES;
      const row = y * NODES;
      for (let x = 0; x < NODES; x += 1) {
        const index = row + x;
        const left = row + Math.max(x - 1, 0);
        const right = row + Math.min(x + 1, SEGMENTS);
        const dzdx = (zField[right] - zField[left]) / (2 * cellWidth);
        const dzdy = (zField[down + x] - zField[up + x]) / (2 * cellHeight);
        const inverse = 1 / Math.hypot(dzdx, dzdy, 1);
        const target = index * 4;
        vertexData[target] = zField[index];
        vertexData[target + 1] = -dzdx * inverse;
        vertexData[target + 2] = -dzdy * inverse;
        vertexData[target + 3] = 1;
        const offset = index * 2;
        offsets[offset] = Math.sin(y / SEGMENTS * Math.PI) * zField[index] * -0.035;
        offsets[offset + 1] = -Math.abs(zField[index]) * y / SEGMENTS * 0.025;
      }
    }
  };

  const draw = () => {
    const width = Math.max(wrapper.clientWidth, 1);
    const height = Math.max(wrapper.clientHeight, 1);
    gl.viewport(0, 0, output.width, output.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertexData);
    gl.bindBuffer(gl.ARRAY_BUFFER, offsetBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, offsets);
    gl.useProgram(program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(uniforms.uContent, 0);
    gl.uniform2f(uniforms.uRes, width, height);
    gl.uniform2f(uniforms.uOut, output.clientWidth, output.clientHeight);
    gl.uniform1f(uniforms.uBleed, BLEED);
    gl.uniform1f(uniforms.uFocal, 1200);
    gl.uniform1f(uniforms.uRadius, 8);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_INT, 0);
    gl.bindVertexArray(null);
  };

  let last = performance.now();
  const frame = (now: number) => {
    frameHandle = 0;
    if (dead || !inView) { running = false; return; }
    const delta = Math.min((now - last) / 1000, 1 / 20);
    last = now;
    const targetGust = Math.max(0.2, 0.55 + 0.25 * Math.sin(simulationTime * 0.31) + 0.16 * Math.sin(simulationTime * 0.83));
    gust += (targetGust - gust) * Math.min(delta * 2, 1);
    touch.strength += ((pointer.inside ? 1 : 0) - touch.strength) * Math.min(delta * (pointer.inside ? 8 : 2.5), 1);
    const omega = 14;
    touch.vx += ((pointer.x - touch.x) * omega * omega - 2 * omega * touch.vx) * delta;
    touch.vy += ((pointer.y - touch.y) * omega * omega - 2 * omega * touch.vy) * delta;
    touch.x += touch.vx * delta;
    touch.y += touch.vy * delta;
    const width = Math.max(wrapper.clientWidth, 1);
    const height = Math.max(wrapper.clientHeight, 1);
    imprint(delta, width, height);
    debt = Math.min(debt + delta, FIXED_DELTA * 5);
    while (debt >= FIXED_DELTA) { stepSimulation(FIXED_DELTA); debt -= FIXED_DELTA; }
    compose(width, height);
    draw();
    frameHandle = requestAnimationFrame(frame);
  };
  const start = () => {
    if (dead || running || !inView) return;
    running = true;
    last = performance.now();
    frameHandle = requestAnimationFrame(frame);
  };
  const onPointerMove = (event: PointerEvent) => {
    const rect = wrapper.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (touch.strength < 0.01) { touch.x = x; touch.y = y; touch.vx = 0; touch.vy = 0; }
    pointer.x = x;
    pointer.y = y;
    pointer.inside = true;
    start();
  };
  const onPointerLeave = () => { pointer.inside = false; };
  wrapper.addEventListener("pointermove", onPointerMove, { passive: true });
  wrapper.addEventListener("pointerleave", onPointerLeave, { passive: true });
  const resizeObserver = new ResizeObserver(() => { syncSize(); window.requestAnimationFrame(syncSize); upload(); start(); });
  resizeObserver.observe(output);
  const onRenderScale = () => { syncSize(); upload(); start(); };
  window.addEventListener("kingshill:render-scale", onRenderScale);
  const intersectionObserver = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; if (inView) start(); });
  intersectionObserver.observe(output);
  syncSize();
  window.requestAnimationFrame(syncSize);
  window.setTimeout(syncSize, 0);
  upload();
  compose(Math.max(wrapper.clientWidth, 1), Math.max(wrapper.clientHeight, 1));
  draw();

  return {
    refresh: () => { syncSize(); upload(); start(); },
    dispose: () => {
      dead = true;
      cancelAnimationFrame(frameHandle);
      wrapper.removeEventListener("pointermove", onPointerMove);
      wrapper.removeEventListener("pointerleave", onPointerLeave);
      resizeObserver.disconnect();
      window.removeEventListener("kingshill:render-scale", onRenderScale);
      intersectionObserver.disconnect();
      gl.deleteTexture(texture);
      gl.deleteBuffer(gridBuffer);
      gl.deleteBuffer(dataBuffer);
      gl.deleteBuffer(offsetBuffer);
      gl.deleteBuffer(indexBuffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    },
  };
};
