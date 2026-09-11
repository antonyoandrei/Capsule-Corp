"""Run with fonttools and brotli installed: python scripts/subset-fonts.py."""
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

fonts = Path(__file__).resolve().parents[1] / "src" / "fonts"
ranges = [(0, 0x24F), (0x300, 0x36F), (0x1E00, 0x1EFF), (0x2000, 0x206F),
          (0x20A0, 0x20CF), (0x2100, 0x214F), (0x2190, 0x22FF), (0xFEFF, 0xFEFF),
          (0xFFFD, 0xFFFD)]
unicodes = {value for start, end in ranges for value in range(start, end + 1)}
source = fonts / "NotoSans.woff2"
destination = fonts / "NotoSans-latin.woff2"
font = TTFont(source)
original_cmap = font.getBestCmap()
original_metrics = dict(font["hmtx"].metrics)
original_axes = [(axis.axisTag, axis.minValue, axis.defaultValue, axis.maxValue)
                 for axis in font["fvar"].axes]
options = subset.Options()
options.flavor = "woff2"
options.layout_features = ["*"]
subsetter = subset.Subsetter(options=options)
subsetter.populate(unicodes=unicodes)
subsetter.subset(font)
font.save(destination)
result = TTFont(destination)
assert set(result.getBestCmap()) == set(original_cmap) & unicodes
assert [(axis.axisTag, axis.minValue, axis.defaultValue, axis.maxValue)
        for axis in result["fvar"].axes] == original_axes
for codepoint, glyph in result.getBestCmap().items():
    assert result["hmtx"][glyph] == original_metrics[original_cmap[codepoint]]
print(f"{source.name}: {source.stat().st_size:,} bytes -> "
      f"{destination.name}: {destination.stat().st_size:,} bytes; "
      f"{len(result.getBestCmap())} codepoints; axes {original_axes}")
