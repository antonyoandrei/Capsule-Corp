const cloudinary = "https://res.cloudinary.com/du94mex28/image/upload"

const sources = {
  gokuNimbus: "v1789125287/4k/assets/dragon_ball_kid_goku_16_dragon_box_by_superjmanplay2_d4u3e2i_sjfhlj",
  collectionGoku: "v1789125282/4k/assets/ChatGPT_Image_Sep_10_2026_12_18_26_PM_3_zrriyf",
  collectionKingKai: "v1789125278/4k/assets/ChatGPT_Image_Sep_10_2026_12_18_25_PM_2_mddn7x",
  collectionVegeta: "v1789125282/4k/assets/ChatGPT_Image_Sep_10_2026_12_18_26_PM_4_mbdnsm",
  dragonBallCast: "v1789125292/4k/assets/gsvy5vmjgtn8vzslzgxp_avcq3n",
  shenron: "v1789125284/4k/assets/ddvnc9y-db38a164-061a-47b3-b66f-4b6d0093a0ef_yd9vj7",
  gohan: "v1789130168/4k/assets/Fk9plyuagAMR6Vw_efkuss_snqtnk",
  trunks: "v1789125290/4k/assets/FpJQBlNacAAG2ZU_ycplda",
  wantedGoku: "v1789125291/4k/assets/GpwWL30aYAAP8S8_enp3if",
  nimbusJourney: "v1789125335/4k/assets/zb6e94aiijfnqnv6ukcc_tbyfm4",
}

// Match the original alpha-only trims before resizing, so the CSS framing stays unchanged.
const crops: Partial<Record<keyof typeof sources, string>> = {
  trunks: "c_crop,g_north_west,x_1279,y_313,w_1546,h_3470/",
}

export const artwork = (name: keyof typeof sources, width: number): string =>
  `${cloudinary}/${crops[name] ?? ""}f_auto,q_auto,c_limit,w_${width}/${sources[name]}`

export const capsuleCorpLogo = `${cloudinary}/v1789125279/4k/assets/capsule-corp-seeklogo_tcwhkt.svg`
