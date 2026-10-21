"""Decision timescales: machines, humans and treaties on one logarithmic axis.

Indicative orders of magnitude for the blog post "Nobody at the Trigger".
"""

import matplotlib.pyplot as plt
from matplotlib.ticker import LogLocator, NullFormatter

plt.rcParams.update({
    "font.family": "sans-serif",
    "font.sans-serif": ["Arial", "Helvetica", "Liberation Sans", "Inter", "DejaVu Sans"],
    "font.size": 8,
    "axes.linewidth": 0.6,
    "xtick.major.width": 0.6,
    "xtick.minor.width": 0.4,
    "xtick.major.size": 3,
    "xtick.minor.size": 1.5,
    "svg.fonttype": "none",
})

MACHINE = "#b2443a"
HUMAN = "#2c5d8f"
GREY = "#6b6b6b"
SHADE = "#f1ecea"

MIN, HOUR, DAY, YEAR = 60.0, 3600.0, 86400.0, 365.25 * 86400.0
T_REACTION = 0.25  # typical human reaction time to a visual stimulus (s)

# (time [s], label, colour, label height (>0 above, <0 below), label anchor)
events = [
    (1e-5,        "A high-frequency trade\n~10 µs",                        MACHINE,  0.62, "center"),
    (1 / 30,      "One video frame\nat 30 fps: 33 ms",                     MACHINE, -0.62, "right"),
    (30 * MIN,    "Intercontinental\nmissile flight: ~30 min",             HUMAN,    0.62, "center"),
    (36 * MIN,    "2010 flash crash,\ndrop and rebound: ~36 min",          HUMAN,   -0.62, "center"),
    (12.5 * YEAR, "UN talks on autonomous\nweapons, 2014 to 2026: ~12 yr", HUMAN,    0.62, "center"),
]
LABEL_SHIFT = {"center": 1.0, "right": 1.8}  # keeps right-anchored labels clear of the stem

fig, ax = plt.subplots(figsize=(7.2, 2.9), dpi=300)
ax.set_xscale("log")
ax.set_xlim(1e-6, 1e10)
ax.set_ylim(-1.15, 1.15)

# Region faster than human reaction
ax.axvspan(1e-6, T_REACTION, color=SHADE, zorder=0, lw=0)
ax.text(2.2e-6, -1.02, "Faster than a human can react",
        color=MACHINE, fontsize=7.5, style="italic", va="bottom")
ax.axvline(T_REACTION, color=GREY, lw=0.7, ls=(0, (3, 2)), zorder=1)
ax.text(T_REACTION * 1.35, -1.02, "Human reaction\ntime: ~0.25 s",
        color=GREY, fontsize=7, va="bottom", ha="left")

# Timeline
ax.axhline(0, color="black", lw=0.8, zorder=2)
for t, label, colour, y, ha in events:
    ax.plot([t, t], [0, 0.82 * y], color=colour, lw=0.7, zorder=2)
    ax.plot(t, 0, "o", ms=5, color=colour, mec="white", mew=0.8, zorder=3)
    ax.text(t * LABEL_SHIFT[ha], y, label, color=colour, fontsize=7.5, ha=ha,
            va="bottom" if y > 0 else "top", linespacing=1.25)

# Gap between machine decisions and human negotiation
y_gap = 0.98
ax.annotate("", xy=(12.5 * YEAR, y_gap), xytext=(1 / 30, y_gap),
            arrowprops=dict(arrowstyle="<->", color=GREY, lw=0.6, shrinkA=0, shrinkB=0))
ax.text(2e3, y_gap + 0.04, "~10 orders of magnitude", color=GREY,
        fontsize=7, ha="center", va="bottom")

# Bottom axis in seconds
ax.set_xlabel("Time (s)")
ax.xaxis.set_major_locator(LogLocator(base=10, numticks=20))
ax.xaxis.set_minor_locator(LogLocator(base=10, subs=range(2, 10), numticks=200))
ax.xaxis.set_minor_formatter(NullFormatter())
ax.set_yticks([])
for side in ("left", "right", "top"):
    ax.spines[side].set_visible(False)

# Top axis in everyday units
top = ax.secondary_xaxis("top")
top.set_xticks([1e-6, 1e-3, 1, MIN, HOUR, DAY, YEAR, 10 * YEAR])
top.set_xticklabels(["1 µs", "1 ms", "1 s", "1 min", "1 h", "1 day", "1 yr", "10 yr"],
                    fontsize=7, color=GREY)
top.tick_params(length=2, width=0.5, color=GREY)
top.xaxis.set_minor_locator(plt.NullLocator())
top.spines["top"].set_visible(False)

fig.text(0.99, 0.01, "Indicative orders of magnitude", fontsize=6.5,
         color=GREY, ha="right", va="bottom", style="italic")

fig.tight_layout()
fig.savefig("decision_times.png", dpi=300, facecolor="white")
fig.savefig("decision_times.svg", facecolor="white")
