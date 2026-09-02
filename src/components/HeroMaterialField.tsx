import { useEffect, useRef } from "react";
import { experienceState } from "@/experience/state";

const vertex = "attribute vec2 position; varying vec2 uv; void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}";
const fragment = "precision highp float; varying vec2 uv; uniform vec2 pointer; uniform float time; float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);} float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);} void main(){vec2 p=uv-.5;float d=length(p);float flow=noise(uv*4.+vec2(time*.08,-time*.05));float wave=sin(uv.x*11.-time*.32+sin(uv.y*8.+time*.2))*0.5+0.5;float orbit=sin(d*26.-time*.45+flow*3.)*.5+.5;float light=smoothstep(.82,.18,d)*(.25+wave*.22+orbit*.12);float pointerGlow=smoothstep(.42,0.,distance(uv,pointer))*.28;vec3 navy=vec3(.018,.055,.095);vec3 blue=vec3(.06,.23,.38);vec3 cobalt=vec3(.16,.43,.66);vec3 color=mix(navy,blue,smoothstep(.18,.85,light+pointerGlow));color=mix(color,cobalt,smoothstep(.64,1.,wave*.45+light));float grid=(smoothstep(.48,.5,abs(fract(uv.x*18.)-.5))+smoothstep(.48,.5,abs(fract(uv.y*18.)-.5)))*.035;color+=grid;float alpha=smoothstep(.54,.43,d)*.94;gl_FragColor=vec4(color,alpha);} ";

const compile = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); return null; }
  return shader;
};

const HeroMaterialField = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: true, powerPreference: "low-power" });
    if (!gl) return;
    const vs = compile(gl, gl.VERTEX_SHADER, vertex);
    const fs = compile(gl, gl.FRAGMENT_SHADER, fragment);
    if (!vs || !fs) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    const pointer = gl.getUniformLocation(program, "pointer");
    const time = gl.getUniformLocation(program, "time");
    gl.useProgram(program); gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    let visible = false; let raf = 0; let lastDraw = 0; const started = performance.now();
    const resize = () => { const dpr = Math.min(window.devicePixelRatio || 1, 1.25); canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr)); canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr)); gl.viewport(0, 0, canvas.width, canvas.height); };
    const draw = (now: number) => {
      if (!visible || document.hidden) { raf = 0; return; }
      if (now - lastDraw < 33) { raf = requestAnimationFrame(draw); return; }
      lastDraw = now;
      const rect = canvas.getBoundingClientRect();
      gl.uniform2f(pointer, (experienceState.pointer.clientX - rect.left) / Math.max(1, rect.width), 1 - (experienceState.pointer.clientY - rect.top) / Math.max(1, rect.height));
      gl.uniform1f(time, (now - started) / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(draw);
    };
    const onVisibility = () => { if (!document.hidden && visible && !raf) raf = requestAnimationFrame(draw); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(draw); }, { threshold: .01 });
    const resizeObserver = new ResizeObserver(resize);
    observer.observe(canvas); resizeObserver.observe(canvas); document.addEventListener("visibilitychange", onVisibility); resize();
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); observer.disconnect(); resizeObserver.disconnect(); document.removeEventListener("visibilitychange", onVisibility); if (buffer) gl.deleteBuffer(buffer); gl.deleteShader(vs); gl.deleteShader(fs); gl.deleteProgram(program); };
  }, []);

  return <canvas ref={canvasRef} className="kh-hero-material-field" aria-hidden="true" />;
};

export default HeroMaterialField;
