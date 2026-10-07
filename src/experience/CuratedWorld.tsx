import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { experienceState } from "@/experience/state";
import "@/experience/CuratedWorld.css";

type CuratedWorldProps = { pathname: string };

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const ease = (value: number) => value * value * (3 - 2 * value);

const CuratedWorld = ({ pathname }: CuratedWorldProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 720px)").matches || experienceState.pointer.coarse;
    const root = document.documentElement;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#dfe8e2");
    scene.fog = new THREE.FogExp2("#dfe8e2", mobile ? 0.045 : 0.032);

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 120);
    camera.position.set(0, 2.2, 12);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, alpha: true, powerPreference: "high-performance" });
    } catch (error) {
      console.error("TCN WebGL scene unavailable", error);
      root.dataset.khWorld = "unsupported";
      return () => undefined;
    }
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const world = new THREE.Group();
    const hands = new THREE.Group();
    const tree = new THREE.Group();
    scene.add(world, hands, tree);

    const ambient = new THREE.HemisphereLight("#f7fbf6", "#193c42", 2.3);
    const sun = new THREE.DirectionalLight("#fff7df", 4.5);
    sun.position.set(-7, 10, 6);
    sun.castShadow = true;
    sun.shadow.mapSize.setScalar(mobile ? 512 : 1024);
    sun.shadow.camera.left = -14;
    sun.shadow.camera.right = 14;
    sun.shadow.camera.top = 14;
    sun.shadow.camera.bottom = -14;
    world.add(ambient, sun);

    const fill = new THREE.DirectionalLight("#cfe9dd", 1.5);
    fill.position.set(8, 4, -4);
    world.add(fill);

    const water = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 80, mobile ? 32 : 64, mobile ? 32 : 64),
      new THREE.MeshPhysicalMaterial({ color: "#174c58", roughness: 0.22, metalness: 0.08, clearcoat: 0.45, transparent: true, opacity: 0.88 }),
    );
    water.rotation.x = -Math.PI / 2;
    water.position.y = -1.35;
    water.receiveShadow = true;
    world.add(water);

    const horizon = new THREE.Mesh(
      new THREE.CircleGeometry(18, 64),
      new THREE.MeshBasicMaterial({ color: "#f5f4e9", transparent: true, opacity: 0.82, depthWrite: false }),
    );
    horizon.position.set(0, 3.4, -15);
    world.add(horizon);

    const lightPath = new THREE.Mesh(
      new THREE.PlaneGeometry(2.3, 26),
      new THREE.MeshBasicMaterial({ color: "#d9f0d7", transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    lightPath.rotation.x = -Math.PI / 2;
    lightPath.position.set(0, -1.29, -7);
    world.add(lightPath);

    const loader = new GLTFLoader();
    let handReady = false;
    let treeReady = false;
    let mixer: THREE.AnimationMixer | null = null;
    let handAsset: THREE.Object3D | null = null;
    let treeAsset: THREE.Object3D | null = null;
    let disposed = false;

    const fitAsset = (asset: THREE.Object3D, height: number) => {
      const box = new THREE.Box3().setFromObject(asset);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const factor = height / Math.max(size.y, 0.001);
      asset.scale.setScalar(factor);
      asset.position.sub(center.multiplyScalar(factor));
      const fitted = new THREE.Box3().setFromObject(asset);
      asset.position.y -= fitted.min.y;
    };

    const prepareHands = (asset: THREE.Object3D) => {
      asset.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.material = new THREE.MeshStandardMaterial({ color: "#8f9d92", roughness: 0.82, metalness: 0.02 });
      });
      fitAsset(asset, mobile ? 5.8 : 7.2);
      asset.position.set(0, -1.34, -3.5);
      asset.rotation.y = Math.PI;
      hands.add(asset);
      handAsset = asset;
      handReady = true;
    };

    const prepareTree = (asset: THREE.Object3D, animations: THREE.AnimationClip[]) => {
      asset.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      });
      fitAsset(asset, mobile ? 5.2 : 6.8);
      asset.position.set(0, -1.32, -3.2);
      asset.rotation.y = -0.28;
      tree.add(asset);
      treeAsset = asset;
      mixer = new THREE.AnimationMixer(asset);
      if (animations[0]) mixer.clipAction(animations[0]).play();
      treeReady = true;
    };

    loader.load("/experience/models/stone-hand.glb", (gltf) => { if (!disposed) prepareHands(gltf.scene); }, undefined, (error) => console.error("Stone Hands failed to load", error));
    loader.load("/experience/models/kingshill-tree.glb", (gltf) => { if (!disposed) prepareTree(gltf.scene, gltf.animations); }, undefined, (error) => console.error("Kingshill Tree failed to load", error));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.35 : 1.75);
      const width = Math.max(1, Math.round(window.innerWidth * dpr));
      const height = Math.max(1, Math.round(window.innerHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        renderer.setPixelRatio(dpr);
        renderer.setSize(window.innerWidth, window.innerHeight, false);
      }
      camera.aspect = window.innerWidth / Math.max(1, window.innerHeight);
      camera.updateProjectionMatrix();
    };

    let raf = 0;
    let last = performance.now();
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(render);
    };
    const render = (now: number) => {
      if (disposed) return;
      const delta = Math.min(0.05, (now - last) / 1000);
      last = now;
      const progress = clamp(pathname === "/" ? experienceState.scroll.progress * 1.28 : 0.18);
      const hero = ease(clamp(progress / 0.43));
      const transition = ease(clamp((progress - 0.33) / 0.25));
      const about = ease(clamp((progress - 0.48) / 0.35));
      const pointerX = experienceState.pointer.smoothNdcX;
      const pointerY = experienceState.pointer.smoothNdcY;

      hands.visible = handReady && progress < 0.72;
      tree.visible = treeReady && progress > 0.28;
      if (handAsset) {
        handAsset.position.z = -3.5 + hero * 3.25;
        handAsset.rotation.y = Math.PI + pointerX * 0.055;
        handAsset.rotation.x = pointerY * 0.025;
      }
      if (treeAsset) {
        treeAsset.position.z = -3.2 + about * 1.5;
        treeAsset.rotation.y = -0.28 + pointerX * 0.06;
        treeAsset.rotation.x = pointerY * 0.025;
        treeAsset.scale.setScalar((mobile ? 1 : 1) * (0.76 + about * 0.24));
      }
      if (mixer) mixer.update(reducedMotion ? 0 : delta * (0.18 + about * 0.5));

      camera.position.x += ((pointerX * 0.35) - camera.position.x) * 0.035;
      camera.position.y += ((2.2 + pointerY * 0.18 - hero * 0.38 + about * 0.12) - camera.position.y) * 0.035;
      camera.position.z += ((12 - hero * 3.5 + transition * 1.8) - camera.position.z) * 0.035;
      camera.lookAt(0, 1.15 + about * 0.25, -4 + hero * 1.8);

      const sceneMix = about;
      scene.background?.setRGB(0.87 - sceneMix * 0.02, 0.91 - sceneMix * 0.01, 0.89 - sceneMix * 0.01);
      if (scene.fog instanceof THREE.FogExp2) scene.fog.density = (mobile ? 0.045 : 0.032) + transition * 0.018;
      sun.intensity = 4.5 - about * 1.2;
      fill.intensity = 1.5 + about * 0.8;
      water.material.opacity = 0.88 - about * 0.7;
      lightPath.material.opacity = 0.22 + transition * 0.2;
      root.style.setProperty("--kh-world-progress", String(progress));
      root.style.setProperty("--kh-world-about", String(about));
      root.dataset.khWorld = handReady || treeReady ? "ready" : "loading";
      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    root.dataset.khWorld = "loading";
    raf = requestAnimationFrame(render);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      renderer.dispose();
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(material)) material.forEach((item) => item.dispose());
        else material?.dispose();
      });
    };
  }, [pathname]);

  return <div className="kh-curated-world" aria-hidden="true"><canvas ref={canvasRef} className="kh-curated-world__canvas" /></div>;
};

export default CuratedWorld;
