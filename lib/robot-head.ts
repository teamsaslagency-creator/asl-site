import * as THREE from 'three';

export function buildRobotHead() {
  const head = new THREE.Group();
  head.name = 'Head';
  head.position.set(0, 167, 0); // Reference neck pivot at image coordinate (768,345).

  const pearl = new THREE.MeshPhysicalMaterial({ color: '#e1e5e9', metalness: .28, roughness: .25, clearcoat: .8 });
  const metal = new THREE.MeshStandardMaterial({ color: '#6f7884', metalness: .94, roughness: .24 });
  const graphite = new THREE.MeshStandardMaterial({ color: '#101a23', metalness: .65, roughness: .27 });
  const blue = new THREE.MeshBasicMaterial({ color: '#87d9ff', toneMapped: false });
  const softBlue = new THREE.MeshBasicMaterial({ color: '#39a9e8', transparent:true, opacity:.32, toneMapped:false });
  const glass = new THREE.MeshPhysicalMaterial({ color:'#01070c', metalness:.12, roughness:.14, clearcoat:.7, clearcoatRoughness:.13, envMapIntensity:.25 });
  const shell = new THREE.Mesh(new THREE.SphereGeometry(1,64,48),pearl);
  shell.scale.set(149,157,114);shell.position.set(0,156,0);head.add(shell);
  const visor=new THREE.Mesh(new THREE.SphereGeometry(1,64,48),glass);
  visor.name='GlassVisor';visor.scale.set(126,138,57);visor.position.set(0,156,77);head.add(visor);
  // Physical side assemblies keep the face, frame and hardware coherent at yaw.
  for(const side of [-1,1]) {
    const ear=new THREE.Group();ear.position.set(side*148,160,-5);head.add(ear);
    const disc=new THREE.Mesh(new THREE.CylinderGeometry(41,41,15,48),metal);disc.rotation.z=Math.PI/2;ear.add(disc);
    const inset=new THREE.Mesh(new THREE.CylinderGeometry(33,33,17,48),graphite);inset.rotation.z=Math.PI/2;ear.add(inset);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(29,1.8,12,64),blue);ring.rotation.y=Math.PI/2;ring.position.x=side*9;ear.add(ring);
    const trim=new THREE.Mesh(new THREE.TorusGeometry(38,2.7,12,64),pearl);trim.rotation.y=Math.PI/2;trim.position.x=side*9;ear.add(trim);
  }
  const rearSeam=new THREE.Mesh(new THREE.TorusGeometry(1,.011,8,64),metal);
  rearSeam.scale.set(147,154,98);rearSeam.position.set(0,156,-48);head.add(rearSeam);
  const chin=new THREE.CatmullRomCurve3([new THREE.Vector3(-42,14,46),new THREE.Vector3(0,9,51),new THREE.Vector3(42,14,46)]);
  head.add(new THREE.Mesh(new THREE.TubeGeometry(chin,24,1.6,8,false),blue));

  const eyes=new THREE.Group();eyes.name='Eyes';head.add(eyes);
  const eyeOrigins: THREE.Vector3[]=[];
  for (const x of [-53,53]) {
    const dy=-32;
    const depth=77+57*Math.sqrt(1-(x/126)**2-(dy/138)**2);
    const origin=new THREE.Vector3(x,156+dy,depth+1.8);
    eyeOrigins.push(origin);
    const orientation=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1),new THREE.Vector3(x/(126*126),dy/(138*138),(depth-77)/(57*57)).normalize());
    const ring=new THREE.Mesh(new THREE.TorusGeometry(12,1.9,12,48),blue);ring.position.copy(origin);ring.quaternion.copy(orientation);head.add(ring);
    const glow=new THREE.Mesh(new THREE.TorusGeometry(15,1.2,8,48),softBlue);glow.position.copy(origin);glow.quaternion.copy(orientation);head.add(glow);
    const pupil=new THREE.Mesh(new THREE.SphereGeometry(2.4,16,12),blue);pupil.position.copy(origin);eyes.add(pupil);
  }
  return {head,eyes,eyeOrigins};
}
