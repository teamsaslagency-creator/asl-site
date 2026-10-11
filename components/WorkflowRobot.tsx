'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { buildRobotHead } from '@/lib/robot-head';

/** Independent workflow scene; the hero's renderer and pointer tracking are unchanged. */
export default function WorkflowRobot({ motion, reaction }: { motion: boolean; reaction: number }) {
  const host = useRef<HTMLDivElement>(null);
  const controls = useRef({ motion, reaction });
  controls.current = { motion, reaction };
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const root = host.current!;
    let disposed = false;
    let cleanup = () => {};
    const compact = window.matchMedia('(max-width:1024px)').matches;
    async function initialize() {
      const texture = await new THREE.TextureLoader().loadAsync('/asl-robot-workflow-body-v2.webp');
      if (disposed) { texture.dispose(); return; }
      texture.colorSpace = THREE.SRGBColorSpace;
      let renderer: THREE.WebGLRenderer;
      try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); }
      catch { texture.dispose(); return; }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, compact ? 1.25 : 1.5));
      renderer.setClearColor(0, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      root.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-627, 627, 627, -627, 1, 4000);
      camera.position.z = 2000;
      const environment = new RoomEnvironment();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const environmentTarget = pmrem.fromScene(environment, .04);
      scene.environment = environmentTarget.texture;
      environment.dispose(); pmrem.dispose();
      scene.add(new THREE.HemisphereLight('#fff1ed', '#48202e', 2));
      const key = new THREE.DirectionalLight('#fff3ea', 3);
      key.position.set(-500, 600, 800); scene.add(key);
      const rim = new THREE.DirectionalLight('#c82e58', 2.5);
      rim.position.set(600, 250, -300); scene.add(rim);
      const body = new THREE.Mesh(new THREE.PlaneGeometry(1254, 1254), new THREE.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: .02, toneMapped: false }));
      body.position.z = -160; scene.add(body);
      const { head } = buildRobotHead();
      head.position.set(18, 167, 0);
      head.scale.setScalar(1.35);
      head.rotation.set(.48, -.28, -.06);
      const visor = head.getObjectByName('GlassVisor') as THREE.Mesh<THREE.SphereGeometry, THREE.MeshPhysicalMaterial>;
      // Recess the face into its own fitted ceramic surround. The shared hero
      // head builder remains untouched; this shape is specific to a bowed pose.
      const faceGeometry = new THREE.SphereGeometry(1, 64, 48);
      const vertices = faceGeometry.getAttribute('position');
      for (let index = 0; index < vertices.count; index++) {
        const y = vertices.getY(index);
        const taper = 1 - .17 * THREE.MathUtils.smoothstep(-y, 0, 1);
        vertices.setX(index, vertices.getX(index) * taper);
      }
      faceGeometry.computeVertexNormals();
      visor.geometry.dispose();
      visor.geometry = faceGeometry;
      visor.scale.set(126, 129, 49);
      visor.position.set(0, 169, 78);
      visor.material.color.set('#020307');
      visor.material.metalness = .8;
      visor.material.roughness = .18;
      visor.material.clearcoat = .25;
      visor.material.clearcoatRoughness = .06;
      visor.material.envMapIntensity = .65;
      const surround = new THREE.Mesh(faceGeometry.clone(), new THREE.MeshPhysicalMaterial({ color: '#dce0e5', metalness: .4, roughness: .23, clearcoat: .5 }));
      surround.name = 'WorkflowVisorSurround';
      surround.scale.set(132, 135, 50);
      surround.position.set(0, 169, 73);
      head.add(surround);
      // Seat the eye rings on the revised glass surface instead of letting
      // them float above it, and omit the former separate chin light strip.
      head.children.forEach(object => {
        if (!(object instanceof THREE.Mesh)) return;
        if (object.geometry instanceof THREE.TorusGeometry && Math.abs(object.position.x) === 53) {
          object.position.y += 5; object.position.z -= 5;
        }
        if (object.geometry instanceof THREE.TubeGeometry) object.visible = false;
      });
      const eyes = head.getObjectByName('Eyes');
      eyes?.children.forEach(eye => { eye.position.y += 5; eye.position.z -= 5; });
      scene.add(head);

      const globe = new THREE.Group();
      globe.position.set(-35, -218, 95); scene.add(globe);
      const iconTextures: THREE.Texture[] = [];
      function makeIcon(kind: number) {
        const canvas = document.createElement('canvas'); canvas.width = canvas.height = 128;
        const ctx = canvas.getContext('2d')!;
        const glow = ctx.createRadialGradient(64, 64, 25, 64, 64, 62);
        glow.addColorStop(0, '#55102400'); glow.addColorStop(.7, '#28101c00'); glow.addColorStop(.8, '#e989a960'); glow.addColorStop(1, '#aa305600');
        ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(64, 64, 62, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#ffd4e2'; ctx.lineWidth = 3; ctx.lineCap = 'round';
        if (kind === 0) {
          ctx.strokeRect(44, 35, 40, 57);
          for (let y = 46; y < 83; y += 9) { ctx.beginPath(); ctx.moveTo(51, y); ctx.lineTo(77, y); ctx.stroke(); }
        } else if (kind === 1) {
          ctx.strokeRect(43, 43, 42, 42);
          for (const value of [52, 64, 76]) {
            ctx.beginPath(); ctx.moveTo(value, 35); ctx.lineTo(value, 43); ctx.moveTo(value, 85); ctx.lineTo(value, 93); ctx.moveTo(35, value); ctx.lineTo(43, value); ctx.moveTo(85, value); ctx.lineTo(93, value); ctx.stroke();
          }
        } else {
          const points = [[64, 39], [40, 80], [89, 80]];
          ctx.beginPath(); ctx.moveTo(64, 39); ctx.lineTo(40, 80); ctx.lineTo(89, 80); ctx.closePath(); ctx.stroke();
          points.forEach(([x, y]) => { ctx.fillStyle = '#ffd4e2'; ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill(); });
        }
        const map = new THREE.CanvasTexture(canvas); map.colorSpace = THREE.SRGBColorSpace; iconTextures.push(map); return map;
      }
      const orbits = [0, 1, 2].map(index => {
        const group = new THREE.Group();
        group.rotation.set([.95, 1.15, .72][index], [.15, -.35, .3][index], [-.2, .45, -.5][index]);
        globe.add(group);
        const radius = [235, 215, 200][index];
        const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 2.1, 8, 128), new THREE.MeshBasicMaterial({ color: '#f7a0bb', transparent: true, opacity: .85, toneMapped: false }));
        group.add(ring);
        const halo = new THREE.Mesh(new THREE.TorusGeometry(radius, 5, 8, 128), new THREE.MeshBasicMaterial({ color: '#c63560', transparent: true, opacity: .18, depthWrite: false, toneMapped: false })); group.add(halo);
        const node = new THREE.Group();
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(38, 32, 24), new THREE.MeshPhysicalMaterial({ color: '#4e0921', metalness: .5, roughness: .18, clearcoat: 1, emissive: '#5d0822', emissiveIntensity: .3 }));
        node.add(sphere);
        const icon = new THREE.Sprite(new THREE.SpriteMaterial({ map: makeIcon(index), transparent: true, depthWrite: false, toneMapped: false }));
        icon.scale.set(93, 93, 1); icon.position.z = 43; node.add(icon); globe.add(node);
        return { group, node, radius, phase: index * 2.1, speed: [.46, -.34, .39][index], tilt: group.rotation.z };
      });

      let frame = 0, visible = true, last = performance.now(), clock = 0;
      let seenReaction = controls.current.reaction, lookingUntil = -1;
      let previousMotion = controls.current.motion;
      function wake() { if (!frame && !disposed) frame = requestAnimationFrame(render); }
      function resize() { renderer.setSize(root.clientWidth, root.clientHeight, false); wake(); }
      function render(now: number) {
        frame = 0;
        if (disposed || !visible || document.hidden) return;
        const dt = Math.max(0, Math.min(.05, (now - last) / 1000)); last = now;
        const active = controls.current.motion;
        if (controls.current.reaction !== seenReaction) {
          seenReaction = controls.current.reaction;
          lookingUntil = active ? clock + .95 : -1;
        }
        if (active) clock += dt;
        const looking = active && clock < lookingUntil;
        const targetPitch = looking ? 0 : .48;
        const targetYaw = looking ? 0 : -.28;
        if (active) {
          head.rotation.x = THREE.MathUtils.damp(head.rotation.x, targetPitch, looking ? 7 : 4, dt);
        head.rotation.y = THREE.MathUtils.damp(head.rotation.y, targetYaw, looking ? 7 : 4, dt);
        head.rotation.z = THREE.MathUtils.damp(head.rotation.z, looking ? 0 : -.06, 5, dt);
        }
        orbits.forEach(orbit => {
          const phase = orbit.phase + clock * orbit.speed;
          orbit.group.rotation.z = orbit.tilt + clock * orbit.speed * .12;
          orbit.node.position.set(Math.cos(phase) * orbit.radius, Math.sin(phase) * orbit.radius, 0).applyQuaternion(orbit.group.quaternion);
        });
        renderer.render(scene, camera);
        root.dataset.headPitch = THREE.MathUtils.radToDeg(head.rotation.x).toFixed(2);
        root.dataset.reaction = looking ? 'looking-up' : 'looking-down';
        root.dataset.orbitPhase = clock.toFixed(3);
        if (active) wake();
      }
      const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; last = performance.now(); if (visible) wake(); }); observer.observe(root);
      const size = new ResizeObserver(resize); size.observe(root); resize();
      const controlsTimer = setInterval(() => {
        if (previousMotion !== controls.current.motion || seenReaction !== controls.current.reaction) {
          previousMotion = controls.current.motion; last = performance.now(); wake();
        }
      }, 60);
      const visibility = () => { last = performance.now(); if (!document.hidden) wake(); };
      document.addEventListener('visibilitychange', visibility);
      const contextLost = (event: Event) => { event.preventDefault(); setReady(false); };
      renderer.domElement.addEventListener('webglcontextlost', contextLost);
      setReady(true); wake();
      cleanup = () => {
        cancelAnimationFrame(frame); clearInterval(controlsTimer); observer.disconnect(); size.disconnect();
        document.removeEventListener('visibilitychange', visibility);
        renderer.domElement.removeEventListener('webglcontextlost', contextLost);
        scene.traverse(object => { if (object instanceof THREE.Mesh || object instanceof THREE.Sprite) { if (object instanceof THREE.Mesh) object.geometry.dispose(); const materials = Array.isArray(object.material) ? object.material : [object.material]; materials.forEach(material => material.dispose()); } });
        iconTextures.forEach(map => map.dispose()); texture.dispose(); environmentTarget.dispose(); renderer.dispose(); renderer.domElement.remove();
      };
    }
    const start = () => { void initialize().catch(() => { if (!disposed) setReady(false); }); };
    let proximity: IntersectionObserver | undefined;
    if (compact) {
      proximity = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) { proximity?.disconnect(); start(); }
      }, { rootMargin: '350px' });
      proximity.observe(root);
    } else start();
    return () => { disposed = true; proximity?.disconnect(); cleanup(); };
  }, []);

  return <div className="workflow-character" data-ready={ready} aria-hidden="true"><img className="workflow-character-fallback" src="/asl-robot-workflow-v1.webp" width="1254" height="1254" alt="" loading="lazy"/><div ref={host} className="workflow-character-canvas"/></div>;
}
