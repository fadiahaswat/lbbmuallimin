import fs from 'fs';
const raw = fs.readFileSync('LOGO TONTI MU\'ALLIMIN.svg', 'utf8');
const lines = raw.split(/\r?\n/);

const CX = 4572, CY = 8127.99;

function getAngles(pathLine) {
  const d = pathLine.match(/d="([^"]+)"/)[1];
  // extract all numbers
  const nums = d.match(/[-+]?[0-9]*\.?[0-9]+/g).map(Number);
  // group by pairs (approximate)
  let curX = 0, curY = 0;
  const angles = [];
  
  // A simple regex to walk SVG path tokens
  const tokens = d.match(/([a-df-z]|[-+]?[0-9]*\.?[0-9]+)/gi);
  let cmd = '';
  let i = 0;
  while (i < tokens.length) {
    const tok = tokens[i];
    if (/^[a-df-z]$/i.test(tok)) {
      cmd = tok;
      i++;
    } else {
      const xVal = parseFloat(tokens[i++]);
      const yVal = parseFloat(tokens[i++]);
      if (cmd === 'M') { curX = xVal; curY = yVal; }
      else if (cmd === 'm') { curX += xVal; curY += yVal; }
      else if (cmd === 'L') { curX = xVal; curY = yVal; }
      else if (cmd === 'l') { curX += xVal; curY += yVal; }
      else if (cmd === 'C') { curX = parseFloat(tokens[i + 2]); curY = parseFloat(tokens[i + 3]); i += 4; }
      else if (cmd === 'c') { curX += parseFloat(tokens[i + 2]); curY += parseFloat(tokens[i + 3]); i += 4; }
      else if (cmd === 'z' || cmd === 'Z') { continue; }

      // angle in radians relative to (CX, CY)
      let ang = Math.atan2(curY - CY, curX - CX); // [-PI, PI]
      angles.push(ang);
    }
  }
  return angles;
}

const carakaAngles = getAngles(lines[55]);
const tontiAngles = getAngles(lines[69]);

const toDeg = r => (r * 180 / Math.PI).toFixed(1);

console.log('CARAKA min angle:', toDeg(Math.min(...carakaAngles)), 'deg, max angle:', toDeg(Math.max(...carakaAngles)), 'deg');
console.log('TONTI min angle:', toDeg(Math.min(...tontiAngles)), 'deg, max angle:', toDeg(Math.max(...tontiAngles)), 'deg');
