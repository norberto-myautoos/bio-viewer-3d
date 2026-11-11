# BioViewer 3D

A lightweight, modular protein viewer in the browser. TypeScript + Vite + Three.js.

## Features
- Load structures from the RCSB PDB (4-character ID, e.g. `1UBQ`), the AlphaFold DB (UniProt ID, e.g. `P69905`) or a local `.pdb` file.
- Every atom is drawn with one `THREE.InstancedMesh` (a single draw call).
- Color by confidence, element, amino-acid class or chain. Recoloring updates instance colors only; no geometry is rebuilt.
- Confidence coloring is context-aware: **pLDDT** for AlphaFold files, **B-factor** (thermal motion) for experimental structures.
- Ribbon (cartoon) with helices, sheets with arrowheads and coils, built from C-alpha splines oriented by carbonyl oxygens. Secondary structure comes from HELIX/SHEET records when present; otherwise it is estimated from C-alpha geometry (approximate, not full DSSP).
- Backbone trace of C-alpha atoms, split per chain and at chain breaks. Water and alternate conformations are ignored.
- Live FPS counter (measured, not hard-coded).
- Info card with name, gene, organism and function (RCSB, AlphaFold DB, UniProt) plus a summary computed from the loaded file.
- UI in Spanish, English, Portuguese and French; the UniProt function text is machine-translated (MyMemory) with an English fallback.

## Run
```bash
npm install
npm run dev     # http://localhost:5173
npm run build
```

## Structure
```
src/core/SceneManager.ts          scene, camera, controls, render loop
src/parser/PdbParser.ts           PDB text -> atoms
src/renderer/MoleculeRenderer.ts  instanced atoms, colors, backbone
src/main.ts                       UI wiring and data loading
src/i18n.ts                       UI translations
```

## Roadmap
- Real cartoon (helix/sheet) from DSSP secondary structure
- mmCIF support, residue picking, PAE plot
- Structure-of-arrays data layout and benchmarks on 100k+ atom complexes

## Limitations
This is a viewer. It does not run docking, molecular dynamics or any prediction.

## Data sources and attribution
- AlphaFold Protein Structure Database (EMBL-EBI / Google DeepMind), data under CC BY 4.0. Please cite Jumper et al., Nature (2021) and Fleming et al., J Mol Biol (2025).
- UniProt and RCSB PDB for names, genes, organisms, functions and experimental structures. Check each provider's terms before commercial use.
- Machine translation of function texts via MyMemory (free service with daily limits).

