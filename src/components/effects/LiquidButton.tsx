import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { experienceState } from "@/experience/state";

type LiquidButtonProps = {
  children: ReactNode;
  to: string;
  className?: string;
  ariaLabel?: string;
  reveal?: boolean;
};

const vertex = "attribute vec2 p; varying vec2 v; void main(){ v=p*.5+.5; gl_Position=vec4(p,0.,1.); }";
const fragment = "precision highp float; varying vec2 v; uniform vec2 pointer; uniform float time; uniform float energy; uniform float pressed; float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);} float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);} void main(){vec2 uv=v; float d=distance(uv,pointer); float ripple=sin(d*40.-time*5.2)*exp(-d*8.)*(.07+energy*.15); float flow=noise(vec2(uv.x*4.-time*.16,uv.y*5.+time*.11)); float edge=smoothstep(.03,.11,uv.y)*smoothstep(.03,.11,1.-uv.y); vec3 navy=vec3(.025,.08,.13), blue=vec3(.06,.24,.4), cobalt=vec3(.16,.43,.66), bone=vec3(.9,.92,.83); float field=smoothstep(.12,.9,uv.x+flow*.28+ripple); vec3 color=mix(navy,blue,field); color=mix(color,cobalt,smoothstep(.48,.92,field)); color=mix(color,bone,smoothstep(.78,1.,flow+ripple*1.8)*.3); color=mix(color,navy,pressed*.18); gl_FragColor=vec4(color,edge); }";

const compile = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); return null; }
  return shader;
};

export const LiquidButton = ({ children, to, className = "", ariaLabel, reveal = false }: LiquidButtonProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: false, powerPreference: "low-power" });
    if (!gl) return;
    const vs = compile(gl, gl.VERTEX_SHADER, vertex);
    const fs = compile(gl, gl.FRAGMENT_SHADER, fragment);
    if (!vs || !fs) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { gl.deleteProgram(program); gl.deleteShader(vs); gl.deleteShader(fs); return; }
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "p");
    const pointer = gl.getUniformLocation(program, "pointer");
    const time = gl.getUniformLocation(program, "time");
    const energy = gl.getUniformLocation(program, "energy");
    const pressed = gl.getUniformLocation(program, "pressed");
    gl.useProgram(program); gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    let visible = false; let raf = 0; let lastDraw = 0;
    const resize = () => { const dpr = Math.min(window.devicePixelRatio || 1, 1.35); canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr)); canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr)); gl.viewport(0, 0, canvas.width, canvas.height); };
    const start = performance.now();
    const draw = (now: number) => {
      if (!visible || document.hidden) { raf = 0; return; }
      const moving = experienceState.pointer.pressed || experienceState.pointer.smoothSpeed > .015;
      if (!moving && now - lastDraw < 166) { raf = requestAnimationFrame(draw); return; }
      lastDraw = now;
      const rect = canvas.getBoundingClientRect();
      gl.uniform2f(pointer, (experienceState.pointer.clientX - rect.left) / Math.max(1, rect.width), 1 - (experienceState.pointer.clientY - rect.top) / Math.max(1, rect.height));
      gl.uniform1f(time, (now - start) / 1000); gl.uniform1f(energy, experienceState.pointer.smoothSpeed); gl.uniform1f(pressed, experienceState.pointer.pressed ? 1 : 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(draw);
    };
    const onVisibility = () => { if (!document.hidden && visible && !raf) raf = requestAnimationFrame(draw); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(draw); }, { threshold: .01 });
    const resizeObserver = new ResizeObserver(resize);
    observer.observe(canvas); resizeObserver.observe(canvas); document.addEventListener("visibilitychange", onVisibility); resize();
    return () => { cancelAnimationFrame(raf); observer.disconnect(); resizeObserver.disconnect(); document.removeEventListener("visibilitychange", onVisibility); if (buffer) gl.deleteBuffer(buffer); gl.deleteShader(vs); gl.deleteShader(fs); gl.deleteProgram(program); };
  }, []);

  return <Link to={to} aria-label={ariaLabel} className={"kh-liquid-button " + className} data-cursor="liquid" data-home-reveal={reveal ? "" : undefined}><canvas ref={canvasRef} aria-hidden="true" /><span className="kh-liquid-button__label">{children}</span></Link>;
};

export default LiquidButton;
