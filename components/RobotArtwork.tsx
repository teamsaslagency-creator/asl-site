'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { buildRobotHead } from '@/lib/robot-head';

type Props = { replay: number; motion: boolean; onReady: () => void; onError: () => void };

/** Geometrically reconstructed 3D head over the approved body artwork.
 * The head has depth and rotates about a neck pivot; the body remains 2D.
 */

export default function RobotArtwork({ replay, motion, onReady, onError }: Props) {
  const root=useRef<HTMLDivElement>(null);
  const state=useRef({replay,motion,onReady,onError});state.current={replay,motion,onReady,onError};

  useEffect(() => {
    const host=root.current!;
    let stopped=false,release=()=>{};
    const initialize=async () => {
      const texture=await new THREE.TextureLoader().loadAsync('/robot-cutout.webp');
      if(stopped){texture.dispose();return;}
      texture.colorSpace=THREE.SRGBColorSpace;
      let renderer: THREE.WebGLRenderer;
      try {renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});}
      catch {texture.dispose();state.current.onError();return;}
      renderer.setPixelRatio(Math.min(window.devicePixelRatio,window.matchMedia('(max-width: 767px)').matches ? 1.25 : 1.75));
      renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
      renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
      renderer.domElement.setAttribute('role','img');
      renderer.domElement.setAttribute('aria-label','ASL robot. The reconstructed 3D head turns toward your cursor, while both hands stay open.');
      host.appendChild(renderer.domElement);
      const scene=new THREE.Scene();
      const camera=new THREE.OrthographicCamera(-768,768,512,-512,1,5000);
      camera.position.set(0,0,2000);camera.lookAt(0,0,0);
      const environment=new RoomEnvironment();const pmrem=new THREE.PMREMGenerator(renderer);
      const environmentTarget=pmrem.fromScene(environment,.03);scene.environment=environmentTarget.texture;
      environment.dispose();pmrem.dispose();
      scene.add(new THREE.HemisphereLight('#e9e8ee','#49323e',1.8));
      const key=new THREE.DirectionalLight('#fff2ef',2.7);key.position.set(-400,600,800);scene.add(key);
      const rim=new THREE.DirectionalLight('#bd748d',1.8);rim.position.set(500,300,-600);scene.add(rim);

      const robot=new THREE.Group();robot.name='ASL';scene.add(robot);
      const bodyMaterial=new THREE.MeshBasicMaterial({map:texture,transparent:true,alphaTest:.03,toneMapped:false});
      bodyMaterial.onBeforeCompile=shader=>{
        shader.fragmentShader=shader.fragmentShader.replace('#include <alphatest_fragment>',`
          if (vMapUv.y > ${1-345/1024}) discard;
          diffuseColor.a *= smoothstep(0.0, 0.13, vMapUv.y);
          #include <alphatest_fragment>
        `);
      };
      const body=new THREE.Mesh(new THREE.PlaneGeometry(1536,1024),bodyMaterial);body.position.z=-155;robot.add(body);
      const {head,eyes,eyeOrigins}=buildRobotHead();robot.add(head);
      const stringMaterial=new THREE.LineBasicMaterial({color:'#e6bcc9',transparent:true,opacity:.55});
      const anchors=[new THREE.Vector3(484-768,512-414,-150),new THREE.Vector3(1050-768,512-414,-150),new THREE.Vector3(272-768,512-716,-150),new THREE.Vector3(1264-768,512-716,-150)];
      const strings=anchors.map(anchor=>{
        const geometry=new THREE.BufferGeometry().setFromPoints([anchor,anchor.clone().setY(2500)]);
        const line=new THREE.Line(geometry,stringMaterial);line.frustumCulled=false;scene.add(line);return line;
      });

      let frame=0,inView=true,start=performance.now(),previous=start;
      let seenReplay=state.current.replay,previousMotion=state.current.motion;
      let targetYaw=0,targetPitch=0,eyeX=0,eyeY=0;
      const headScreen=new THREE.Vector3();
      const smooth=(value:number)=>{const x=THREE.MathUtils.clamp(value,0,1);return x*x*x*(x*(x*6-15)+10);};
      function wake(){if(!frame&&!stopped)frame=requestAnimationFrame(render);}
      function resize(){
        const width=host.clientWidth,height=host.clientHeight;if(!width||!height)return;
        renderer.setSize(width,height,false);
        const aspect=width/height;
        const viewWidth=aspect>=1.5?1024*aspect:1536;
        const viewHeight=aspect>=1.5?1024:1536/aspect;
        camera.left=-viewWidth/2;camera.right=viewWidth/2;camera.top=viewHeight/2;camera.bottom=-viewHeight/2;
        camera.updateProjectionMatrix();wake();
      }
      function move(event:PointerEvent){
        // Gaze is derived from the actual head center, not a fixed page midpoint.
        robot.updateMatrixWorld(true);
        headScreen.set(-4,156,0);head.localToWorld(headScreen);headScreen.project(camera);
        const rect=host.getBoundingClientRect();
        const headX=rect.left+(headScreen.x+1)*rect.width/2;
        const headY=rect.top+(1-headScreen.y)*rect.height/2;
        targetYaw=THREE.MathUtils.clamp(Math.atan2(event.clientX-headX,Math.max(210,rect.width*.43)),-.61,.61);
        targetPitch=THREE.MathUtils.clamp(Math.atan2(event.clientY-headY,Math.max(220,rect.height*.42)),-.32,.32);
        wake();
      }
      function reset(){targetYaw=0;targetPitch=0;wake();}
      function visibility(){previous=performance.now();if(!document.hidden)wake();}
      function render(now:number){
        frame=0;if(stopped||!inView||document.hidden)return;
        if(seenReplay!==state.current.replay){seenReplay=state.current.replay;start=now;}
        const dt=Math.min(.05,(now-previous)/1000);previous=now;
        const active=state.current.motion;
        const t=active?(now-start)/1000:5;
        const entrance=smooth((t-.12)/2.25),detach=smooth((t-2.4)/.85);
        robot.position.y=(1-entrance)*1650;
        const yaw=active&&t>2.25?targetYaw:0,pitch=active&&t>2.25?targetPitch:0;
        head.rotation.y=THREE.MathUtils.damp(head.rotation.y,yaw,7,dt);
        head.rotation.x=THREE.MathUtils.damp(head.rotation.x,pitch,7,dt);
        // No idle head oscillation: the last cursor target is held until it changes.
        eyeX=THREE.MathUtils.damp(eyeX,yaw*7,15,dt);eyeY=THREE.MathUtils.damp(eyeY,-pitch*7,15,dt);
        eyes.children.forEach((eye,index)=>eye.position.copy(eyeOrigins[index]).add(new THREE.Vector3(eyeX,eyeY,0)));
        stringMaterial.opacity=.55*(1-detach);
        strings.forEach((line,index)=>{
          line.visible=active&&detach<1;
          const a=anchors[index];const positions=line.geometry.getAttribute('position');
          positions.setXYZ(0,a.x,THREE.MathUtils.lerp(a.y+robot.position.y,2500,detach),a.z);
          positions.setXYZ(1,a.x,2500,a.z);positions.needsUpdate=true;
        });
        robot.updateMatrixWorld(true);
        renderer.render(scene,camera);
        host.dataset.ready='true';host.dataset.renderer='webgl';
        host.dataset.phase=t<2.4?'entering':t<3.25?'releasing':'tracking';
        host.dataset.headYaw=THREE.MathUtils.radToDeg(head.rotation.y).toFixed(3);
        host.dataset.headPitch=THREE.MathUtils.radToDeg(head.rotation.x).toFixed(3);
        host.dataset.targetYaw=THREE.MathUtils.radToDeg(yaw).toFixed(3);
        host.dataset.targetPitch=THREE.MathUtils.radToDeg(pitch).toFixed(3);
        const moving=Math.abs(head.rotation.y-yaw)+Math.abs(head.rotation.x-pitch)>.0001 || Math.abs(eyeX-yaw*7)+Math.abs(eyeY+pitch*7)>.001;
        if(t<3.3 || moving)wake();
      }
      const sizeObserver=new ResizeObserver(resize);sizeObserver.observe(host);resize();
      const intersection=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;previous=performance.now();if(inView)wake();});intersection.observe(host);
      window.addEventListener('pointermove',move,{passive:true});
      document.addEventListener('visibilitychange',visibility);
      const controlWake=setInterval(()=>{
        if(previousMotion!==state.current.motion){previousMotion=state.current.motion;if(previousMotion)start=performance.now()-4500;reset();}
        if(seenReplay!==state.current.replay)wake();
      },100);
      const lost=(event:Event)=>{event.preventDefault();state.current.onError();};renderer.domElement.addEventListener('webglcontextlost',lost);
      wake();state.current.onReady();
      release=()=>{
        cancelAnimationFrame(frame);clearInterval(controlWake);sizeObserver.disconnect();intersection.disconnect();
        window.removeEventListener('pointermove',move);document.removeEventListener('visibilitychange',visibility);
        renderer.domElement.removeEventListener('webglcontextlost',lost);
        scene.traverse(object=>{if(object instanceof THREE.Mesh||object instanceof THREE.Line){object.geometry.dispose();const materials=Array.isArray(object.material)?object.material:[object.material];materials.forEach(material=>material.dispose());}});
        texture.dispose();environmentTarget.dispose();renderer.dispose();renderer.domElement.remove();
      };
    };
    void initialize().catch(()=>{if(!stopped)state.current.onError();});
    return ()=>{stopped=true;release();};
  },[]);

  return <div ref={root} className="robot-artwork" />;
}
