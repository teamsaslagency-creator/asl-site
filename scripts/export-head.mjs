import { mkdir, writeFile } from 'node:fs/promises';
import { Group } from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { buildRobotHead } from '../lib/robot-head.ts';

// The exporter reads binary Blobs through FileReader. No canvas or textures are
// needed for this geometry-only head asset.
globalThis.FileReader = class {
  result = null;
  onloadend = null;
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then(result => { this.result = result; this.onloadend?.(); });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then(result => {
      this.result = `data:${blob.type};base64,${Buffer.from(result).toString('base64')}`;
      this.onloadend?.();
    });
  }
};

const { head } = buildRobotHead();
const model = new Group();
model.name = 'ASLHead';
// Export in meters with the neck joint at the scene origin.
model.scale.setScalar(.001);
model.position.y = -.167;
model.add(head);
const glb = await new GLTFExporter().parseAsync(model, { binary: true, onlyVisible: true });
await mkdir(new URL('../public/robot/', import.meta.url), { recursive: true });
await writeFile(new URL('../public/robot/asl-head.glb', import.meta.url), Buffer.from(glb));
console.log(`Exported public/robot/asl-head.glb (${glb.byteLength} bytes).`);
