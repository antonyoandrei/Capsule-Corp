// Run: node --experimental-strip-types src/services/artwork.check.mjs
import assert from "node:assert/strict"
import { artwork, capsuleCorpLogo } from "./artwork.ts"

assert.match(artwork("gohan", 480), /\/upload\/f_auto,q_auto,c_limit,w_480\/v1789130168\/4k\/assets\/Fk9plyuagAMR6Vw_efkuss_snqtnk$/)
assert.match(artwork("trunks", 900), /\/c_crop,g_north_west,x_1279,y_313,w_1546,h_3470\/f_auto,q_auto,c_limit,w_900\//)
assert(!artwork("wantedGoku", 900).includes("c_crop"))
assert(!artwork("shenron", 500).includes("c_crop"))
assert.match(artwork("nimbusJourney", 1998), /\/f_auto,q_auto,c_limit,w_1998\/v1789125335\//)
assert(capsuleCorpLogo.endsWith(".svg"))
console.log("Artwork crop order, full canvases and SVG format verified.")
