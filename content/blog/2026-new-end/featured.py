import numpy as np
import matplotlib.pyplot as plt
from matplotlib.lines import Line2D
from matplotlib.patches import FancyArrowPatch

SEED = 7
N = 500
X_LIM, Y_LIM = 1.0, 0.62       # visible window: x in [-1, 1], y in [-0.62, 0.62]
X_EXT = 1.05                   # data extend slightly beyond the frame

C_REAL = "#1B3A6B"             # realized path and present point
C_PAST = "#A9AFB7"             # unrealized past possibilities
C_FUT = "#7F8790"              # future possibilities
C_PAST_BG = "#EEF1F5"
C_TEXT = "#333333"

plt.rcParams.update({
    "font.family": "sans-serif",
    "font.sans-serif": ["Arial", "Helvetica", "Liberation Sans", "DejaVu Sans"],
    "font.size": 8,
    "svg.fonttype": "none",
    "pdf.fonttype": 42,
})

rng = np.random.default_rng(SEED)


def smoothstep(t):
    t = np.clip(t, 0.0, 1.0)
    return t**3 * (t * (6.0 * t - 15.0) + 10.0)


def noise(x, amp, n=4):
    f = rng.uniform(0.4, 1.6, n)
    phi = rng.uniform(0.0, 2.0 * np.pi, n)
    a = rng.normal(0.0, 1.0, n) / np.sqrt(n)
    return amp * np.sum(a[:, None] * np.sin(2.0 * np.pi * f[:, None] * x + phi[:, None]), axis=0)


def outside(sign):
    """A y value just beyond the top (sign>0) or bottom (sign<0) edge."""
    return sign * (Y_LIM + rng.uniform(0.08, 0.35))


fig, ax = plt.subplots(figsize=(7.2, 4.05), dpi=300)
past_kw = dict(color=C_PAST, lw=0.55, solid_capstyle="round", zorder=2)
fut_kw = dict(color=C_FUT, lw=0.55, solid_capstyle="round", zorder=2)

# Realized past: smooth path from the left edge to the present point (0, 0)
xp = np.linspace(-X_EXT, 0.0, N)
g = noise(np.append(xp, 0.0), amp=0.20)
y_real = g[:-1] - g[-1]


def y_b(x):
    return np.interp(x, xp, y_real)


# Past, diverging: branches leave the realized path and exit the frame,
# some splitting again on the way out
for _ in range(24):
    L = rng.uniform(0.45, 0.85)
    x0 = rng.uniform(-1.0, -0.05 - 0.45)
    L = min(L, -0.03 - x0)                      # stay inside the past
    x = np.linspace(x0, x0 + L, 120)
    s = smoothstep((x - x0) / L)
    y = (1 - s) * y_b(x) + s * outside(rng.choice([-1, 1])) + s * noise(x, 0.03)
    ax.plot(x, y, alpha=rng.uniform(0.45, 0.8), **past_kw)
    for _ in range(rng.integers(0, 3)):
        i = rng.integers(10, 80)
        L2 = rng.uniform(0.3, 0.55)
        if x[i] + 0.25 > -0.03:
            continue
        L2 = min(L2, -0.03 - x[i])
        x2 = np.linspace(x[i], x[i] + L2, 80)
        s2 = smoothstep((x2 - x[i]) / L2)
        y2 = (1 - s2) * np.interp(x2, x, y) + s2 * outside(rng.choice([-1, 1]))
        ax.plot(x2, y2, alpha=rng.uniform(0.35, 0.7), **past_kw)

# Past, converging into the present point (funnel); density grows towards x = 0
for _ in range(34):
    if rng.random() < 0.35:
        xs, y0 = -X_EXT, rng.uniform(-0.9, 0.9) * Y_LIM
    else:
        xs, y0 = rng.uniform(-1.0, -0.12), outside(rng.choice([-1, 1]))
    x = np.linspace(xs, 0.0, 200)
    u = x / xs                                  # 1 at start, 0 at present
    y = y0 * u**rng.uniform(1.3, 2.6) + noise(x, 0.06) * u * (1 - u)
    ax.plot(x, y, alpha=rng.uniform(0.4, 0.8), **past_kw)

# Past, converging onto the realized path before the present
for _ in range(10):
    xm = rng.uniform(-0.75, -0.08)
    xs = max(-X_EXT, xm - rng.uniform(0.25, 0.6))
    y0 = rng.uniform(-0.9, 0.9) * Y_LIM if xs == -X_EXT else outside(rng.choice([-1, 1]))
    x = np.linspace(xs, xm, 120)
    s = smoothstep((x - xs) / (xm - xs))
    y = (1 - s) * (y0 + noise(x, 0.04)) + s * y_b(x)
    ax.plot(x, y, alpha=rng.uniform(0.4, 0.75), **past_kw)

# Future: fan of possibilities diverging from the present point
xf = np.linspace(0.0, X_EXT, N)
fan = []
for _ in range(28):
    y = rng.normal(0.0, 0.42) * xf + rng.normal(0.0, 0.25) * xf**2 + noise(xf, 0.08) * xf
    fan.append(y)
    ax.plot(xf, y, alpha=rng.uniform(0.45, 0.85), **fut_kw)
    if rng.random() < 0.4:                      # occasional forward split
        xb = rng.uniform(0.25, 0.7)
        L = rng.uniform(0.25, 0.5)
        s = smoothstep((xf - xb) / L)
        m = xf >= xb
        ax.plot(xf[m], (y + s * rng.choice([-1, 1]) * rng.uniform(0.15, 0.4))[m],
                alpha=rng.uniform(0.4, 0.75), **fut_kw)

# Future: paths entering from outside the frame and joining the fan
for _ in range(12):
    yt = fan[rng.integers(len(fan))]
    xe = rng.uniform(0.1, 0.55)
    xm = min(xe + rng.uniform(0.4, 0.7), 1.0)
    x = np.linspace(xe, xm, 150)
    yf = np.interp(x, xf, yt)
    sgn = 1.0 if yf[-1] >= 0 else -1.0       # enter from the side the target heads to
    off = sgn * (Y_LIM + rng.uniform(0.05, 0.2)) - yf[0]
    y = yf + off * (1 - smoothstep((x - xe) / (xm - xe)))
    ax.plot(x, y, alpha=rng.uniform(0.45, 0.85), **fut_kw)

# Realized path and present point
ax.plot(xp, y_real, color=C_REAL, lw=1.8, solid_capstyle="round", zorder=4)
ax.scatter([0.0], [0.0], s=26, color=C_REAL, edgecolor="white", linewidth=0.8, zorder=5)

# Past/future division
ax.axvspan(-X_LIM, 0.0, color=C_PAST_BG, lw=0, zorder=0)
ax.axvline(0.0, color=C_TEXT, lw=0.6, ls=(0, (3, 2.5)), zorder=1)
ax.text(-0.97, Y_LIM - 0.05, "Past", ha="left", va="top", fontsize=9, fontweight="bold", color=C_TEXT)
ax.text(0.97, Y_LIM - 0.05, "Future", ha="right", va="top", fontsize=9, fontweight="bold", color=C_TEXT)
ax.text(0.015, Y_LIM - 0.05, "Present", ha="left", va="top", fontsize=8, color=C_TEXT)

# Time axis
ax.add_patch(FancyArrowPatch((-X_LIM, -Y_LIM - 0.06), (X_LIM, -Y_LIM - 0.06),
                             arrowstyle="-|>", mutation_scale=8, lw=0.7,
                             color=C_TEXT, clip_on=False))
ax.text(X_LIM, -Y_LIM - 0.1, "Time", ha="right", va="top", fontsize=8, color=C_TEXT)

handles = [
    Line2D([], [], color=C_REAL, lw=1.8, label="Realized path"),
    Line2D([], [], color=C_PAST, lw=1.0, label="Unrealized possibilities"),
    Line2D([], [], color=C_FUT, lw=1.0, label="Open possibilities"),
]
fig.legend(handles=handles, loc="lower left", bbox_to_anchor=(0.02, 0.01), ncol=3,
           frameon=False, fontsize=7, handlelength=1.8, columnspacing=1.5, borderaxespad=0)

ax.set_xlim(-X_LIM, X_LIM)
ax.set_ylim(-Y_LIM, Y_LIM)
ax.axis("off")
fig.subplots_adjust(left=0.02, right=0.98, top=0.98, bottom=0.16)

fig.savefig("featured.jpg", dpi=300, pil_kwargs={"quality": 95})