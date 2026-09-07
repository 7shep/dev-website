"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

// Local geometry keeps this personal collection independent of remote model hosts.
function makeObjects() {
  const silver = new THREE.MeshStandardMaterial({
    color: 0x888888,
    metalness: 0.95,
    roughness: 0.24,
  });
  const rubber = new THREE.MeshStandardMaterial({
    color: 0x262626,
    metalness: 0.35,
    roughness: 0.4,
  });
  const grain = new Uint8Array(128 * 128 * 4);
  let seed = 7;
  for (let i = 0; i < grain.length; i += 4) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    grain[i] = grain[i + 1] = grain[i + 2] = seed % 256;
    grain[i + 3] = 255;
  }
  const texture = new THREE.DataTexture(grain, 128, 128);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 5);
  texture.needsUpdate = true;
  const leather = new THREE.MeshStandardMaterial({
    color: 0xb5b5b2,
    roughness: 0.65,
    metalness: 0.12,
    bumpMap: texture,
    bumpScale: 0.025,
  });
  const thread = new THREE.MeshStandardMaterial({
    color: 0x545450,
    roughness: 0.8,
  });
  const ball = new THREE.Group();
  const stitches: THREE.BufferGeometry[] = [];
  ball.add(new THREE.Mesh(new THREE.SphereGeometry(1.12, 64, 48), leather));
  for (const side of [-1, 1]) {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 96; i++) {
      const t = (i / 96) * Math.PI * 2;
      const x = side * (0.52 + 0.22 * Math.cos(2 * t));
      const r = Math.sqrt(1.125 ** 2 - x ** 2);
      points.push(new THREE.Vector3(x, r * Math.cos(t), r * Math.sin(t)));
    }
    const curve = new THREE.CatmullRomCurve3(points, true);
    ball.add(
      new THREE.Mesh(
        new THREE.TubeGeometry(curve, 128, 0.009, 4, true),
        thread,
      ),
    );
    for (let i = 0; i < 48; i++) {
      const p = curve.getPoint(i / 48);
      const tangent = curve.getTangent(i / 48).multiplyScalar(0.029);
      const across = new THREE.Vector3(0.045, 0, 0);
      const a = p
        .clone()
        .add(across)
        .add(tangent)
        .normalize()
        .multiplyScalar(1.132);
      const b = p
        .clone()
        .sub(across)
        .sub(tangent)
        .normalize()
        .multiplyScalar(1.132);
      stitches.push(
          new THREE.TubeGeometry(
            new THREE.LineCurve3(a, b),
            1,
            0.011,
            4,
            false,
          ),
      );
    }
  }
  const mergedStitches = mergeGeometries(stitches);
  ball.add(new THREE.Mesh(mergedStitches, thread));
  stitches.forEach(geometry => geometry.dispose());
  ball.rotation.set(0.3, 0.35, -0.45);
  const dumbbell = new THREE.Group();
  const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.11, 1.8, 24),
    silver,
  );
  handle.rotation.z = Math.PI / 2;
  dumbbell.add(handle);
  for (const side of [-1, 1])
    for (let plate = 0; plate < 3; plate++) {
      const disc = new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.59 - plate * 0.07,
          0.59 - plate * 0.07,
          0.18,
          48,
        ),
        plate === 1 ? silver : rubber,
      );
      disc.rotation.z = Math.PI / 2;
      disc.position.x = side * (0.65 + plate * 0.19);
      dumbbell.add(disc);
    }
  dumbbell.rotation.set(0.45, 0.35, -0.55);
  const record = new THREE.Group();
  const vinyl = new THREE.Mesh(
    new THREE.CylinderGeometry(1.15, 1.15, 0.055, 96),
    rubber,
  );
  vinyl.rotation.x = Math.PI / 2;
  record.add(vinyl);
  for (let i = 0; i < 28; i++) {
    const groove = new THREE.Mesh(
      new THREE.TorusGeometry(0.44 + i * 0.024, 0.0025, 3, 96),
      silver,
    );
    groove.position.z = 0.03;
    record.add(groove);
  }
  const label = new THREE.Mesh(
    new THREE.CylinderGeometry(0.34, 0.34, 0.062, 48),
    silver,
  );
  label.rotation.x = Math.PI / 2;
  record.add(label);
  const hole = new THREE.Mesh(new THREE.CircleGeometry(0.046, 24), rubber);
  hole.position.z = 0.034;
  record.add(hole);
  record.rotation.set(-0.2, -0.42, 0.2);
  const football = new THREE.Group();
  const shape = new THREE.Mesh(new THREE.SphereGeometry(0.83, 64, 40), rubber);
  shape.scale.set(1, 1.6, 1);
  football.add(shape);
  for (let i = -3; i <= 3; i++) {
    const lace = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.022, 0.23, 4, 8),
      leather,
    );
    lace.rotation.z = Math.PI / 2;
    lace.position.set(
      0,
      i * 0.12,
      0.83 * Math.sqrt(1 - ((i * 0.12) / 1.33) ** 2),
    );
    football.add(lace);
  }
  const seam = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.018, 0.9, 4, 8),
    leather,
  );
  seam.position.z = 0.82;
  football.add(seam);
  football.rotation.set(0.1, -0.2, -0.65);
  return [ball, dumbbell, record, football];
}

export default function PersonalObjects({
  paused,
}: {
  paused: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const pause = useRef(paused);
  useEffect(() => {
    pause.current = paused;
  }, [paused]);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      element.dataset.fallback = "true";
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    element.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    camera.position.set(0, 0, 9);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, 0.04, 0.1, 100, { size: 64 });
    scene.environment = environment.texture;
    room.dispose();
    pmrem.dispose();
    scene.add(new THREE.AmbientLight(0xffffff, 0.45));
    const key = new THREE.DirectionalLight(0xffffff, 2.5);
    key.position.set(-3, 5, 5);
    scene.add(key);
    const objects = makeObjects();
    const group = new THREE.Group();
    objects.forEach((object) => group.add(object));
    scene.add(group);
    const pointer = new THREE.Vector2();
    let active = true;
    let contextLost = false;
    let frame = 0;
    let time = 0;
    let previous = 0;
    let lastSelection = -1;
    let lastStill = false;
    let lastWidth = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    function resize() {
      const width = element!.clientWidth;
      const height = element!.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / Math.max(height, 1);
      camera.position.z = width < 550 ? 8 : 7.3;
      camera.updateProjectionMatrix();
      lastSelection = -1;
    }
    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(element);
    function move(event: PointerEvent) {
      const rect = element!.getBoundingClientRect();
      pointer.set(
        (event.clientX - rect.left) / rect.width - 0.5,
        (event.clientY - rect.top) / rect.height - 0.5,
      );
    }
    function resetPointer() {
      pointer.set(0, 0);
    }
    function draw(now: number) {
      frame = requestAnimationFrame(draw);
      const dt = Math.min((now - previous) / 1000, 0.05);
      previous = now;
      if (!active || document.hidden || contextLost) return;
      const still = pause.current || reduced.matches;
      if (!still) time += dt;
      const selected = Math.floor(time / 6) % objects.length;
      if (
        still &&
        lastStill &&
        lastSelection === selected &&
        lastWidth === element!.clientWidth
      )
        return;
      // Fade through transparent at each change, preserving a single visible model.
      const phase = time % 6;
      renderer.domElement.style.opacity = reduced.matches
        ? "1"
        : String(Math.min(1, phase / 0.45, (6 - phase) / 0.45));
      objects.forEach((object, index) => {
        object.visible = index === selected;
        if (object.visible && !pause.current)
          object.position.y = reduced.matches ? 0 : Math.sin(time * 0.65) * 0.085;
      });
      if (!pause.current) {
      group.rotation.y = reduced.matches
        ? 0
        : THREE.MathUtils.damp(
            group.rotation.y,
            pointer.x * 0.5 + Math.sin(time * 0.3) * 0.13,
            4,
            dt,
          );
      group.rotation.x = reduced.matches
        ? 0
        : THREE.MathUtils.damp(group.rotation.x, pointer.y * 0.18, 4, dt);
      }
      renderer.render(scene, camera);
      element!.dataset.object = ["baseball", "dumbbell", "vinyl", "football"][selected];
      lastSelection = selected;
      lastStill = still;
      lastWidth = element!.clientWidth;
    }
    const visibleObserver = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
    });
    visibleObserver.observe(element);
    function onContextLost(event: Event) {
      event.preventDefault();
      contextLost = true;
      element!.dataset.fallback = "true";
    }
    function onContextRestored() {
      contextLost = false;
      lastSelection = -1;
      delete element!.dataset.fallback;
    }
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);
    renderer.domElement.addEventListener(
      "webglcontextrestored",
      onContextRestored,
    );
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", resetPointer);
    resize();
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      sizeObserver.disconnect();
      visibleObserver.disconnect();
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", resetPointer);
      renderer.domElement.removeEventListener(
        "webglcontextlost",
        onContextLost,
      );
      renderer.domElement.removeEventListener(
        "webglcontextrestored",
        onContextRestored,
      );
      const materials = new Set<THREE.Material>();
      scene.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          node.geometry.dispose();
          (Array.isArray(node.material)
            ? node.material
            : [node.material]
          ).forEach((material) => materials.add(material));
        }
      });
      materials.forEach((material) => {
        if (material instanceof THREE.MeshStandardMaterial)
          material.bumpMap?.dispose();
        material.dispose();
      });
      environment.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);
  return (
    <div className="personal-objects" ref={host} aria-hidden="true">
      <div className="object-fallback" />
    </div>
  );
}
