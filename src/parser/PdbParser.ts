export interface Atom {
  x: number; y: number; z: number;
  element: string; name: string; resName: string;
  resSeq: number; chain: string; bFactor: number; isHet: boolean;
}

export class PdbParser {
  /** Lee el primer modelo; ignora agua y conformaciones alternas distintas de A. */
  static parse(text: string): Atom[] {
    const atoms: Atom[] = [];
    for (const line of text.split(/\r?\n/)) {
      if (line.startsWith('ENDMDL')) break;
      const isAtom = line.startsWith('ATOM');
      const isHet = line.startsWith('HETATM');
      if (!isAtom && !isHet) continue;

      const resName = line.substring(17, 20).trim();
      if (resName === 'HOH' || resName === 'WAT') continue;
      const alt = line.charAt(16);
      if (alt !== ' ' && alt !== '' && alt !== 'A') continue;

      const x = parseFloat(line.substring(30, 38));
      const y = parseFloat(line.substring(38, 46));
      const z = parseFloat(line.substring(46, 54));
      if (Number.isNaN(x) || Number.isNaN(y) || Number.isNaN(z)) continue;

      const name = line.substring(12, 16).trim();
      let element = line.substring(76, 78).trim();
      if (!element) element = name.replace(/[^A-Za-z]/g, '').charAt(0);

      atoms.push({
        x, y, z, name, resName, isHet,
        element: element.toUpperCase() || 'C',
        resSeq: parseInt(line.substring(22, 26), 10) || 0,
        chain: line.charAt(21).trim() || 'A',
        bFactor: parseFloat(line.substring(60, 66)) || 0,
      });
    }
    return atoms;
  }
}
