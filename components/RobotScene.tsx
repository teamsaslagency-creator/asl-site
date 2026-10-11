'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

type Props = { replay: number; motion: boolean; onReady: () => void; onError: () => void };
type Rig = { root: THREE.Group; head: THREE.Object3D; eyes: THREE.Object3D; arms: THREE.Object3D[]; anchors: THREE.Object3D[]; lights: THREE.MeshBasicMaterial[] };

async function loadReferenceRobot(): Promise<Rig> {
  const response = await fetch('/robot/asl-robot.glb', { method: 'HEAD' });
  if (!response.ok) throw new Error('The matching robot model has not been supplied.');
  const gltf = await new GLTFLoader().loadAsync('/robot/asl-robot.glb');
  function required(name: string) {
    const node = gltf.scene.getObjectByName(name);
    if (!node) throw new Error(`Robot model needs the ${name} pivot.`);
    return node;
  }
  return {
    root: gltf.scene,
    head: required('Head'), eyes: required('Eyes'),
    arms: [required('LeftArm'), required('RightArm')],
    anchors: ['LeftWristAnchor', 'LeftShoulderAnchor', 'RightWristAnchor', 'RightShoulderAnchor'].map(required),
    lights: [],
  };
}

function makeRobot(): Rig {
  const root = new THREE.Group();
  const pearl = new THREE.MeshPhysicalMaterial({ color: '#e7ecf0', metalness: .34, roughness: .26, clearcoat: 1, clearcoatRoughness: .17 });
  const titanium = new THREE.MeshStandardMaterial({ color: '#72808e', metalness: .93, roughness: .24 });
  const dark = new THREE.MeshStandardMaterial({ color: '#101a24', metalness: .76, roughness: .25 });
  const glass = new THREE.MeshPhysicalMaterial({ color: '#030b12', metalness: .20, roughness: .16, clearcoat: .75, clearcoatRoughness: .13, envMapIntensity: .35 });
  const blue = new THREE.MeshBasicMaterial({ color: '#8bd7ff', transparent: true });
  const blueDim = new THREE.MeshBasicMaterial({ color: '#2c86be', transparent: true });
  const lights = [blue, blueDim];

  function mesh(parent: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, position: number[] = [0,0,0], scale: number[] = [1,1,1]) {
    const item = new THREE.Mesh(geo, mat);
    item.position.set(position[0],position[1],position[2]);
    item.scale.set(scale[0],scale[1],scale[2]);
    parent.add(item);
    return item;
  }
  const sphere = (parent: THREE.Object3D, mat: THREE.Material, p: number[], s: number[]) => mesh(parent,new THREE.SphereGeometry(1,40,28),mat,p,s);
  const box = (parent: THREE.Object3D, mat: THREE.Material, p: number[], s: number[], radius=.06) => mesh(parent,new RoundedBoxGeometry(s[0],s[1],s[2],3,radius),mat,p);
  function rod(parent: THREE.Object3D, a: THREE.Vector3, b: THREE.Vector3, radius: number, material: THREE.Material, endRadius=radius) {
    const direction = b.clone().sub(a);
    const item=mesh(parent,new THREE.CylinderGeometry(endRadius,radius,direction.length(),24,1),material);
    item.position.copy(a).add(b).multiplyScalar(.5);
    item.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),direction.normalize());
    return item;
  }
  function ring(parent: THREE.Object3D, radius: number, tube: number, material: THREE.Material, p: number[], rotation: number[]=[0,0,0]) {
    const item=mesh(parent,new THREE.TorusGeometry(radius,tube,12,64),material,p);
    item.rotation.set(rotation[0],rotation[1],rotation[2]);
    return item;
  }

  // An articulated original model; the head and eyes have separate pivots.
  sphere(root,dark,[0,.55,0],[.43,.72,.30]);
  const chestProfile = [new THREE.Vector2(.28,-.35),new THREE.Vector2(.37,-.22),new THREE.Vector2(.51,.05),new THREE.Vector2(.67,.50),new THREE.Vector2(.76,.93),new THREE.Vector2(.69,1.18),new THREE.Vector2(.39,1.35),new THREE.Vector2(.30,1.32)];
  const chest=mesh(root,new THREE.LatheGeometry(chestProfile,64),pearl,[0,.35,0],[1,1,.63]);
  chest.rotation.y=.025;
  // Dark seam runs through the ceramic chest, ending in a small blue light.
  box(root,dark,[0,.83,.461],[.046,.80,.018],.008);
  box(root,blue,[0,.84,.478],[.012,.46,.012],.004);
  const collar=mesh(root,new THREE.TorusGeometry(.31,.055,12,64),titanium,[0,1.70,0]);
  collar.rotation.x=Math.PI/2;
  rod(root,new THREE.Vector3(0,1.70,0),new THREE.Vector3(0,2.02,0),.16,dark);
  for(let n=0;n<4;n++) {
    const neckRing=ring(root,.166,.016,titanium,[0,1.76+n*.06,0]);
    neckRing.rotation.x=Math.PI/2;
  }
  rod(root,new THREE.Vector3(-.12,1.68,.14),new THREE.Vector3(-.12,2.04,.14),.025,titanium);
  rod(root,new THREE.Vector3(.12,1.68,.14),new THREE.Vector3(.12,2.04,.14),.025,titanium);

  const logoCanvas=document.createElement('canvas');
  logoCanvas.width=256;logoCanvas.height=96;
  const logoContext=logoCanvas.getContext('2d')!;
  logoContext.fillStyle='#374957';logoContext.font='500 54px sans-serif';logoContext.textAlign='center';logoContext.fillText('ASL',128,64);
  const logoTexture=new THREE.CanvasTexture(logoCanvas);logoTexture.colorSpace=THREE.SRGBColorSpace;
  const logo=mesh(root,new THREE.PlaneGeometry(.30,.113),new THREE.MeshBasicMaterial({map:logoTexture,transparent:true,depthWrite:false}),[.31,1.21,.444]);
  logo.rotation.y=.28;

  for(let n=0;n<3;n++) {
    const rib=ring(root,.32+n*.025,.055,titanium,[0,-.05-n*.20,0],[Math.PI/2,0,0]);
    rib.scale.z=.74;
    box(root,dark,[0,-.08-n*.20,.29],[.28,.12,.12]);
    sphere(root,pearl,[(n%2 ? -.12:.12),-.10-n*.20,.33],[.27,.09,.10]);
  }
  sphere(root,dark,[0,-.68,0],[.40,.20,.30]);
  sphere(root,pearl,[0,-.91,.03],[.56,.36,.32]);
  for(const side of [-1,1]) {
    sphere(root,titanium,[side*.50,-.96,-.04],[.13,.22,.22]);
    sphere(root,pearl,[side*.28,-1.30,-.03],[.25,.33,.26]);
  }

  const head=new THREE.Group();head.name='Head';head.position.y=2.01;root.add(head);
  sphere(head,pearl,[0,.54,0],[.66,.78,.55]);
  sphere(head,titanium,[0,.53,.23],[.593,.703,.355]);
  sphere(head,glass,[0,.54,.285],[.571,.680,.337]);
  // Ear mechanisms sit behind the face silhouette.
  for(const side of [-1,1]) {
    const ear=mesh(head,new THREE.CylinderGeometry(.255,.255,.13,48),titanium,[side*.645,.55,-.02]);
    ear.rotation.z=Math.PI/2;
    const cap=mesh(head,new THREE.CylinderGeometry(.223,.223,.145,48),dark,[side*.66,.55,-.02]);
    cap.rotation.z=Math.PI/2;
    ring(head,.190,.012,blue,[side*.745,.55,-.02],[0,Math.PI/2,0]);
    ring(head,.225,.013,pearl,[side*.745,.55,-.02],[0,Math.PI/2,0]);
  }
  const eyes=new THREE.Group();eyes.name='Eyes';eyes.position.set(0,.54,.606);head.add(eyes);
  for(const side of [-1,1]) {
    const eye=ring(eyes,.065,.012,blue,[side*.20,0,0]);
    eye.name=side===-1?'LeftEye':'RightEye';
    ring(eyes,.088,.008,blueDim,[side*.20,0,-.006]);
    sphere(eyes,blue,[side*.20,0,.009],[.017,.017,.008]);
  }
  const smileCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(-.12,-.096,.45),new THREE.Vector3(0,-.117,.48),new THREE.Vector3(.12,-.096,.45)]);
  mesh(head,new THREE.TubeGeometry(smileCurve,24,.009,8,false),blue);
  // Small shell seams and fasteners keep the model grounded in industrial design.
  for(const side of [-1,1]) {
    sphere(head,titanium,[side*.45,1.04,.27],[.018,.018,.008]);
    sphere(head,titanium,[side*.36,-.03,.31],[.014,.014,.008]);
  }
  const arms: THREE.Group[]=[];
  const anchors: THREE.Object3D[]=[];
  for(const side of [-1,1]) {
    const shoulder=new THREE.Group();shoulder.name=side===-1?'LeftArm':'RightArm';shoulder.position.set(side*.78,1.38,0);root.add(shoulder);arms.push(shoulder);
    sphere(shoulder,dark,[0,0,0],[.25,.28,.27]);
    sphere(shoulder,pearl,[side*.025,.075,-.02],[.27,.31,.25]);
    const joint=mesh(shoulder,new THREE.CylinderGeometry(.177,.177,.10,40),titanium,[side*.21,0,0]);joint.rotation.z=Math.PI/2;
    ring(shoulder,.14,.014,blue,[side*.269,0,0],[0,Math.PI/2,0]);
    const elbow=new THREE.Vector3(side*.43,-.82,.03);
    const wrist=new THREE.Vector3(side*1.06,-.74,.26);
    rod(shoulder,new THREE.Vector3(side*.08,-.16,0),elbow,.16,titanium,.19);
    const upper=sphere(shoulder,pearl,[side*.23,-.40,.01],[.18,.39,.19]);upper.rotation.z=side*.42;
    sphere(shoulder,dark,elbow.toArray(),[.18,.18,.18]);
    const elbowCap=mesh(shoulder,new THREE.CylinderGeometry(.128,.128,.29,32),titanium,elbow.toArray());elbowCap.rotation.x=Math.PI/2;
    ring(shoulder,.09,.012,dark,[elbow.x,elbow.y,.183]);
    rod(shoulder,elbow,wrist,.125,dark,.105);
    const forearm=sphere(shoulder,pearl,elbow.clone().lerp(wrist,.53).toArray(),[.15,.34,.16]);
    forearm.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),wrist.clone().sub(elbow).normalize());
    rod(shoulder,elbow.clone().add(new THREE.Vector3(0,.08,.07)),wrist.clone().add(new THREE.Vector3(0,.08,.07)),.024,titanium);
    sphere(shoulder,titanium,wrist.toArray(),[.11,.11,.11]);

    const hand=new THREE.Group();hand.position.copy(wrist).add(new THREE.Vector3(side*.14,.015,.08));hand.rotation.set(-.40,.10*side,-1.03*side);shoulder.add(hand);
    box(hand,titanium,[0,.03,0],[.33,.30,.105],.055);
    box(hand,pearl,[0,.045,.065],[.29,.26,.065],.045);
    for(let i=0;i<4;i++) {
      const finger=new THREE.Group();finger.position.set((i-1.5)*.081,.17,.015);finger.rotation.z=(1.5-i)*.12;hand.add(finger);
      const length=[.23,.29,.28,.21][i];
      sphere(finger,dark,[0,.02,0],[.043,.047,.043]);
      rod(finger,new THREE.Vector3(0,.025,0),new THREE.Vector3(0,length*.53,.015),.032,pearl);
      sphere(finger,titanium,[0,length*.53,.015],[.034,.037,.034]);
      rod(finger,new THREE.Vector3(0,length*.56,.016),new THREE.Vector3(0,length,.055),.027,pearl,.021);
      sphere(finger,pearl,[0,length,.055],[.022,.028,.024]);
    }
    const thumb=new THREE.Group();thumb.position.set(-side*.17,-.01,0);thumb.rotation.z=side*.9;hand.add(thumb);
    sphere(thumb,titanium,[0,0,0],[.055,.05,.05]);
    rod(thumb,new THREE.Vector3(0,0,0),new THREE.Vector3(0,.13,.03),.040,pearl);
    sphere(thumb,dark,[0,.13,.03],[.036,.036,.036]);
    rod(thumb,new THREE.Vector3(0,.14,.03),new THREE.Vector3(0,.23,.08),.032,pearl,.025);
    const wristAnchor=new THREE.Object3D();wristAnchor.position.copy(wrist);shoulder.add(wristAnchor);anchors.push(wristAnchor);
    const shoulderAnchor=new THREE.Object3D();shoulderAnchor.position.set(side*.06,.23,-.05);shoulder.add(shoulderAnchor);anchors.push(shoulderAnchor);
  }
  return {root,head,eyes,arms,anchors,lights};
}

export default function RobotScene({ replay, motion, onReady, onError }: Props) {
  const mount=useRef<HTMLDivElement>(null);
  const controls=useRef({replay,motion,onReady,onError});
  controls.current={replay,motion,onReady,onError};

  useEffect(() => {
    let stopped = false;
    let release = () => {};
    const initialize = async () => {
    // The simplified model is only available as an explicit interaction test.
    // Never silently substitute its appearance for the approved robot.
    const experimental = new URLSearchParams(window.location.search).get('interaction-test') === '1';
    const rig = experimental ? makeRobot() : await loadReferenceRobot();
    if (stopped) return;
    const container=mount.current!;
    let renderer: THREE.WebGLRenderer;
    try { renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'}); }
    catch { controls.current.onError();return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.75));
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.2;
    renderer.setClearColor(0x080b10,0);
    renderer.domElement.setAttribute('aria-label','Interactive ASL robot. Its eyes and head follow your pointer.');
    renderer.domElement.setAttribute('role','img');
    container.appendChild(renderer.domElement);
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(33,1,.1,100);
    camera.position.set(0,1.05,8.7);camera.lookAt(0,1.0,0);
    const environment=new RoomEnvironment();
    const pmrem=new THREE.PMREMGenerator(renderer);
    const environmentTarget=pmrem.fromScene(environment,.04);
    scene.environment=environmentTarget.texture;
    scene.environmentIntensity=.95;
    environment.dispose();pmrem.dispose();
    scene.add(new THREE.HemisphereLight('#e2f1ff','#25394e',2.1));
    const key=new THREE.DirectionalLight('#eff6ff',3.7);key.position.set(-3,5,5);scene.add(key);
    const rim=new THREE.DirectionalLight('#49aaff',4);rim.position.set(4,1,-3);scene.add(rim);
    const fill=new THREE.DirectionalLight('#ffffff',1.3);fill.position.set(2,3,4);scene.add(fill);
    scene.add(rig.root);
    const eyeOrigin = rig.eyes.position.clone();
    const headOrigin = rig.head.rotation.clone();
    const armOrigins = rig.arms.map(arm => arm.rotation.z);
    const stringsMaterial=new THREE.LineBasicMaterial({color:'#79cfff',transparent:true,opacity:.70});
    const strings=rig.anchors.map(() => {
      const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(6),3));
      const line=new THREE.Line(geometry,stringsMaterial);line.frustumCulled=false;scene.add(line);return line;
    });
    const pointer=new THREE.Vector2();
    let start=performance.now(),last=start,replaySeen=controls.current.replay;
    let frame=0,visible=true,destroyed=false;
    const worldAnchor=new THREE.Vector3();
    const projector=new THREE.Vector3();

    const resize=() => {
      const width=container.clientWidth,height=container.clientHeight;
      if(!width||!height)return;
      renderer.setSize(width,height,false);camera.aspect=width/height;
      // Keep palms inside narrow/mobile canvases without cropping the silhouette.
      camera.position.z=camera.aspect<1 ? 8.7/Math.max(camera.aspect,.68):8.7;
      camera.updateProjectionMatrix();
      requestFrame();
    };
    const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(container);resize();
    const move=(event:PointerEvent) => {
      // Track across the whole page; normalize around the head's projected location.
      rig.head.getWorldPosition(projector);projector.y+=.54;projector.project(camera);
      const rect=container.getBoundingClientRect();
      const headX=rect.left+(projector.x+1)*rect.width/2;
      const headY=rect.top+(1-projector.y)*rect.height/2;
      pointer.set(THREE.MathUtils.clamp((event.clientX-headX)/Math.max(rect.width*.7,260),-1,1),THREE.MathUtils.clamp((event.clientY-headY)/Math.max(rect.height*.6,240),-1,1));
      requestFrame();
    };
    const resetPointer=() => {pointer.set(0,0);requestFrame();};
    const onVisibility=() => {last=performance.now();if(!document.hidden)requestFrame();};
    window.addEventListener('pointermove',move,{passive:true});
    document.documentElement.addEventListener('pointerleave',resetPointer);
    window.addEventListener('blur',resetPointer);
    document.addEventListener('visibilitychange',onVisibility);
    const intersection=new IntersectionObserver(entries => {visible=entries[0].isIntersecting;last=performance.now();if(visible)requestFrame();},{threshold:0});intersection.observe(container);

    function requestFrame() {if(!frame&&!destroyed)frame=requestAnimationFrame(animate);}
    function animate(now:number) {
      frame=0;
      if(destroyed||document.hidden||!visible)return;
      const dt=Math.min((now-last)/1000,.05);last=now;
      if(replaySeen!==controls.current.replay){replaySeen=controls.current.replay;start=now;}
      const active=controls.current.motion;
      const t=active?(now-start)/1000:5;
      const descent=THREE.MathUtils.smootherstep(t,.18,2.3);
      const release=THREE.MathUtils.smootherstep(t,2.55,3.45);
      const open=THREE.MathUtils.smootherstep(t,1.15,2.55);
      rig.root.position.y=(1-descent)*6+(active?Math.sin(t*1.1)*.014:0);
      rig.root.rotation.z=active?Math.sin(t*3.8)*.038*(1-THREE.MathUtils.smoothstep(t,2,4)):0;
      rig.root.rotation.y=THREE.MathUtils.damp(rig.root.rotation.y,active&&t>2.5?pointer.x*.045:0,2.4,dt);
      const tracking=active&&t>2.5;
      rig.head.rotation.y=THREE.MathUtils.damp(rig.head.rotation.y,headOrigin.y+(tracking?pointer.x*.48:0),5.2,dt);
      rig.head.rotation.x=THREE.MathUtils.damp(rig.head.rotation.x,headOrigin.x+(tracking?pointer.y*.25:0),5.2,dt);
      rig.head.rotation.z=THREE.MathUtils.damp(rig.head.rotation.z,headOrigin.z+(tracking?-pointer.x*.035:0),4,dt);
      rig.eyes.position.x=THREE.MathUtils.damp(rig.eyes.position.x,eyeOrigin.x+(tracking?pointer.x*.028:0),11,dt);
      rig.eyes.position.y=THREE.MathUtils.damp(rig.eyes.position.y,eyeOrigin.y-(tracking?pointer.y*.019:0),11,dt);
      const blink=active&&t>4&&Math.sin(t*.7)>.996?.18:1;
      rig.eyes.scale.y=THREE.MathUtils.damp(rig.eyes.scale.y,blink,23,dt);
      rig.arms.forEach((arm,i)=>{arm.rotation.z=armOrigins[i]+(i===0?1:-1)*(.26*(1-open)+(active?Math.sin(t*1.15+i*.4)*.008:0));});
      rig.lights.forEach(material=>material.opacity=THREE.MathUtils.smoothstep(t,1.8,2.7));
      rig.root.updateMatrixWorld(true);
      stringsMaterial.opacity=.65*(1-release);
      strings.forEach((line,i)=>{
        line.visible=active&&release<1;
        rig.anchors[i].getWorldPosition(worldAnchor);
        const positions=line.geometry.getAttribute('position');
        const bottomY=THREE.MathUtils.lerp(worldAnchor.y,7,release);
        positions.setXYZ(0,worldAnchor.x,bottomY,worldAnchor.z);
        positions.setXYZ(1,worldAnchor.x,9,worldAnchor.z-.04);
        positions.needsUpdate=true;
      });
      // DOM telemetry makes real interaction verifiable without exposing scene internals.
      container.dataset.ready='true';
      container.dataset.phase=t<2.3?'entering':t<3.45?'releasing':'tracking';
      container.dataset.headYaw=rig.head.rotation.y.toFixed(3);
      container.dataset.headPitch=rig.head.rotation.x.toFixed(3);
      renderer.render(scene,camera);
      if(active || Math.abs(rig.head.rotation.y-headOrigin.y)+Math.abs(rig.head.rotation.x-headOrigin.x)>.001)requestFrame();
    }
    let previousMotion=controls.current.motion;
    // Wake a paused scene only when a control changes, avoiding an idle render loop.
    const wake=setInterval(()=>{
      if(previousMotion!==controls.current.motion){previousMotion=controls.current.motion;resetPointer();if(previousMotion)start=performance.now()-4500;}
      if(replaySeen!==controls.current.replay)requestFrame();
    },100);
    const contextLost=(event:Event)=>{event.preventDefault();controls.current.onError();};
    renderer.domElement.addEventListener('webglcontextlost',contextLost);
    requestFrame();controls.current.onReady();
    release = () => {
      destroyed=true;cancelAnimationFrame(frame);clearInterval(wake);
      resizeObserver.disconnect();intersection.disconnect();
      window.removeEventListener('pointermove',move);document.documentElement.removeEventListener('pointerleave',resetPointer);
      window.removeEventListener('blur',resetPointer);document.removeEventListener('visibilitychange',onVisibility);
      renderer.domElement.removeEventListener('webglcontextlost',contextLost);
      scene.traverse(object=>{
        if(object instanceof THREE.Mesh||object instanceof THREE.Line){object.geometry.dispose();const materials=Array.isArray(object.material)?object.material:[object.material];materials.forEach(material=>{if('map' in material && material.map instanceof THREE.Texture)material.map.dispose();material.dispose();});}
      });
      environmentTarget.dispose();renderer.dispose();renderer.domElement.remove();
    };
    };
    void initialize().catch(() => { if (!stopped) controls.current.onError(); });
    return () => { stopped = true; release(); };
  }, []);
  return <div className="robot-canvas" ref={mount} />;
}
