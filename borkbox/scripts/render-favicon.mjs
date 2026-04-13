import fs from "node:fs";
import { Resvg } from "@resvg/resvg-js";
import pngToIco from "png-to-ico";

const svg = fs.readFileSync(new URL("../favicon.svg", import.meta.url));

function pngBuf(width) {
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: width } });
  return resvg.render().asPng();
}

const root = new URL("../", import.meta.url);
fs.writeFileSync(new URL("apple-touch-icon.png", root), pngBuf(180));

const ico = await pngToIco([pngBuf(16), pngBuf(32)]);
fs.writeFileSync(new URL("favicon.ico", root), ico);
