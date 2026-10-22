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
SHADE = "#f6f0ee"

MIN, HOUR, DAY, YEAR = 60.0, 3600.0, 86400.0, 365.25 * 86400.0
T_REACTION = 0.25            # typical human reaction time to a visual stimulus (s)
X_LONG, X_SHORT = 1e10, 1e-4  # axis limits (s), reversed: long timescales on the left

# (time [s], label, colour, label height (>0 above, <0 below), label anchor)
events = [
    (12.5 * YEAR, "UN talks on autonomous\nweapons, 2014 to 2026: ~12 yr", HUMAN,    0.62, "center"),
    (30 * MIN,    "Missile flight: ~30 min,\nthe window Petrov had",        HUMAN,    0.62, "center"),
    (36 * MIN,    "2010 flash crash,\ndrop and rebound: ~36 min",          HUMAN,   -0.62, "center"),
    (0.02,        "An AI agent writes\none word: ~20 ms",                  MACHINE,  0.62, "left"),
    (1 / 30,      "A drone camera frame\nat 30 fps: 33 ms",                MACHINE, -0.62, "left"),
]
LABEL_SHIFT = {"center": 1.0, "left": 1.8}  # keeps left-anchored labels clear of the reaction line

# Who decides at each timescale: (from [s], to [s], label, fill, text colour)
bands = [
    (DAY,        X_LONG,     "INSTITUTIONS", "#e3e9f0", HUMAN),
    (T_REACTION, DAY,        "PEOPLE",       "#cfdcea", HUMAN),
    (X_SHORT,    T_REACTION, "MACHINES",     "#f0d8d4", MACHINE),
]
BAND_Y0, BAND_Y1 = -1.24, -1.08

fig, ax = plt.subplots(figsize=(7.2, 3.1), dpi=300)
ax.set_xscale("log")
ax.set_xlim(X_LONG, X_SHORT)
ax.set_ylim(-1.28, 1.15)

# Region faster than human reaction
ax.axvspan(X_SHORT, T_REACTION, color=SHADE, zorder=0, lw=0)
ax.axvline(T_REACTION, color=GREY, lw=0.7, ls=(0, (3, 2)), zorder=1)
ax.text(T_REACTION * 1.3, -0.03, "Human reaction: ~0.25 s", rotation=90,
        color=GREY, fontsize=6.5, ha="right", va="top")

# Timeline
ax.axhline(0, color="black", lw=0.8, zorder=2)
for t, label, colour, y, ha in events:
    ax.plot([t, t], [0, 0.82 * y], color=colour, lw=0.7, zorder=2)
    ax.plot(t, 0, "o", ms=5, color=colour, mec="white", mew=0.8, zorder=3)
    ax.text(t * LABEL_SHIFT[ha], y, label, color=colour, fontsize=7.5, ha=ha,
            va="bottom" if y > 0 else "top", linespacing=1.25)

# Gap between human negotiation and machine decisions
y_gap = 0.98
ax.annotate("", xy=(0.02, y_gap), xytext=(12.5 * YEAR, y_gap),
            arrowprops=dict(arrowstyle="<->", color=GREY, lw=0.6, shrinkA=0, shrinkB=0))
ax.text(1e4, y_gap + 0.04, "~10 orders of magnitude", color=GREY,
        fontsize=7, ha="center", va="bottom")

# Bands: who decides
for x0, x1, label, fill, colour in bands:
    ax.fill_between([x0, x1], BAND_Y0, BAND_Y1, color=fill, lw=0, zorder=1)
    x_mid = (x0 * x1) ** 0.5  # geometric mean = visual centre on a log axis
    ax.text(x_mid, (BAND_Y0 + BAND_Y1) / 2, label, color=colour, fontsize=6.5,
            ha="center", va="center", fontweight="bold")
# ax.text(X_LONG / 1.4, BAND_Y1 + 0.03, "Who decides", color=GREY, fontsize=7,
#         style="italic", ha="left", va="bottom")

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
top.set_xticks([10 * YEAR, YEAR, DAY, HOUR, MIN, 1, 1e-3])
top.set_xticklabels(["10 yr", "1 yr", "1 day", "1 h", "1 min", "1 s", "1 ms"],
                    fontsize=7, color=GREY)
top.tick_params(length=2, width=0.5, color=GREY)
top.xaxis.set_minor_locator(plt.NullLocator())
top.spines["top"].set_visible(False)

fig.text(0.99, 0.01, "Indicative orders of magnitude", fontsize=6.5,
         color=GREY, ha="right", va="bottom", style="italic")

fig.tight_layout()
fig.savefig("decision_times.png", dpi=300, facecolor="white")
