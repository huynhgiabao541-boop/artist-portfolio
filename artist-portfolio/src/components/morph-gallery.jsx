import * as React from "react";

export const wrapIndex = (i, n, loop) => {
    if (n <= 0) return 0;
    return loop ? ((i % n) + n) % n : Math.min(Math.max(i, 0), n - 1);
};

export const easeInOutQuint = (t) => {
    const x = Math.min(Math.max(t, 0), 1);
    return x < 0.5 ? 16 * x ** 5 : 1 - (-2 * x + 2) ** 5 / 2;
};

export const coverScale = (canvasAspect, imgAspect) =>
    canvasAspect > imgAspect
        ? [1, imgAspect / canvasAspect]
        : [canvasAspect / imgAspect, 1];

const VERT = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform sampler2D u_from;
uniform sampler2D u_to;
uniform float u_progress;
uniform vec2 u_resolution;
uniform float u_fromAspect;
uniform float u_toAspect;
uniform float u_scale;
uniform float u_direction;
uniform float u_edge;
uniform float u_drift;

varying vec2 v_uv;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,
    0.366025403784439,
   -0.577350269189626,
    0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(
    permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0)
  );
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x  = 2.0 * fract(p * C.www) - 1.0;
  vec3 h  = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 v) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * snoise(v);
    v *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

vec2 mirror(vec2 uv) {
  return 1.0 - abs(1.0 - mod(uv, 2.0));
}

vec2 coverUV(vec2 uv, float imgAspect) {
  float canvasAspect = u_resolution.x / u_resolution.y;
  vec2 scale = (canvasAspect > imgAspect)
    ? vec2(1.0, imgAspect / canvasAspect)
    : vec2(canvasAspect / imgAspect, 1.0);
  return mirror((uv - 0.5) * scale + 0.5);
}

void main() {
  float adjusted = u_progress * (1.0 + 2.0 * u_edge) - u_edge;

  float noise = fbm(v_uv * u_scale + vec2(0.0, u_progress * u_direction)) * 0.5 + 0.5;
  noise = smoothstep(
    0.0,
    2.0,
    length(texture2D(u_to, coverUV(v_uv, u_toAspect)).rgb) + noise
  );

  float mixFactor = 1.0 - smoothstep(adjusted - u_edge, adjusted + u_edge, noise);

  vec2 fromUV = coverUV(
    v_uv + vec2(0.0, noise * u_progress * u_drift * u_direction),
    u_fromAspect
  );
  vec2 toUV = coverUV(
    v_uv + vec2(0.0, noise * (1.0 - u_progress) * -0.5 * u_drift * u_direction),
    u_toAspect
  );

  gl_FragColor = mix(texture2D(u_from, fromUV), texture2D(u_to, toUV), mixFactor);
}
`;

const compile = (gl, type, src) => {
    const shader = gl.createShader(type);
    if (!shader) throw new Error("could not create shader");
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error("shader compile failed: " + log);
    }
    return shader;
};

const link = (gl, vertSrc, fragSrc) => {
    const vert = compile(gl, gl.VERTEX_SHADER, vertSrc);
    const frag = compile(gl, gl.FRAGMENT_SHADER, fragSrc);
    const program = gl.createProgram();
    if (!program) throw new Error("could not create program");
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    gl.deleteShader(vert);
    gl.deleteShader(frag);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const log = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        throw new Error("program link failed: " + log);
    }
    return program;
};

const loadImage = (src) =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.decoding = "async";
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("could not load " + src));
        img.src = src;
    });

export default function MorphGallery({
    items = [],
    height = "100%",
    duration = 1500,
    noiseScale = 3.5,
    edge = 0.15,
    drift = 0.5,
    loop = true,
    autoplay = 0,
    arrows = true,
    thumbnails = true,
    index,
    defaultIndex = 0,
    onIndexChange,
    className = "",
    // Tích hợp bộ lọc danh mục & tìm kiếm trực tiếp trong gallery
    categories = [],
    selectedCategory = "all",
    onSelectCategory,
    searchTerm = "",
    onSearchChange,
    searchPlaceholder = "TÌM TÁC PHẨM...",
}) {
    const canvasRef = React.useRef(null);
    const [uncontrolled, setUncontrolled] = React.useState(() =>
        wrapIndex(defaultIndex, items.length, loop)
    );
    const active = index === undefined ? uncontrolled : wrapIndex(index, items.length, loop);

    const [failed, setFailed] = React.useState(false);
    const [ready, setReady] = React.useState(false);
    const [generation, setGeneration] = React.useState(0);
    const [reduced, setReduced] = React.useState(false);
    const [paused, setPaused] = React.useState(false);

    React.useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const sync = () => setReduced(mq.matches);
        sync();
        mq.addEventListener("change", sync);
        return () => mq.removeEventListener("change", sync);
    }, []);

    const go = React.useCallback(
        (next) => {
            const wrapped = wrapIndex(next, items.length, loop);
            if (index === undefined) setUncontrolled(wrapped);
            onIndexChange?.(wrapped);
        },
        [index, items.length, loop, onIndexChange]
    );

    const tuning = React.useRef({ duration, noiseScale, edge, drift, reduced });
    tuning.current = { duration, noiseScale, edge, drift, reduced };

    const triggerDrawRef = React.useRef(null);
    const request = React.useRef(null);
    const previous = React.useRef(active);
    React.useEffect(() => {
        if (previous.current === active) return;
        request.current = { from: previous.current, to: active };
        previous.current = active;
        if (triggerDrawRef.current) {
            triggerDrawRef.current();
        }
    }, [active]);

    const sources = items.map((i) => i.src).join("\n");

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || items.length === 0) return;

        const gl =
            canvas.getContext("webgl", { alpha: false, antialias: false }) ??
            canvas.getContext("experimental-webgl");
        if (!gl) {
            setFailed(true);
            return;
        }

        let program = null;
        let buffer = null;
        const textures = items.map(() => null);
        const aspects = items.map(() => 1);
        let raf = 0;
        let disposed = false;

        let from = active;
        let to = active;
        let progress = 1;
        let startedAt = 0;
        let direction = 1;

        const onLost = (e) => {
            e.preventDefault();
            cancelAnimationFrame(raf);
        };
        const onRestored = () => setGeneration((g) => g + 1);
        canvas.addEventListener("webglcontextlost", onLost);
        canvas.addEventListener("webglcontextrestored", onRestored);

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const w = Math.round(canvas.clientWidth * dpr);
            const h = Math.round(canvas.clientHeight * dpr);
            if (w === 0 || h === 0 || (canvas.width === w && canvas.height === h)) return;
            canvas.width = w;
            canvas.height = h;
            gl.viewport(0, 0, w, h);
            requestDraw();
        };
        const observer = new ResizeObserver(resize);
        observer.observe(canvas);

        let uniforms = {};

        const pick = (i) => textures[i] ?? textures.find((t) => t) ?? null;

        const draw = () => {
            if (disposed) return;
            const t = tuning.current;

            const pending = request.current;
            if (pending) {
                request.current = null;
                if (pending.from !== pending.to) {
                    from = pending.from;
                    to = pending.to;
                    progress = 0;
                    startedAt = performance.now();
                    const n = items.length;
                    const forward = loop
                        ? ((pending.to - pending.from + n) % n) * 2 <= n
                        : pending.to > pending.from;
                    direction = forward ? 1 : -1;
                }
            }

            if (progress < 1) {
                const span = t.reduced ? 0 : Math.max(t.duration, 1);
                const elapsed = performance.now() - startedAt;
                progress = span === 0 ? 1 : easeInOutQuint(Math.min(elapsed / span, 1));
            }

            const fromTex = pick(from);
            const toTex = pick(to);
            if (!fromTex || !toTex) return;

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, fromTex);
            gl.uniform1i(uniforms.from, 0);
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, toTex);
            gl.uniform1i(uniforms.to, 1);

            gl.uniform1f(uniforms.progress, progress);
            gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
            gl.uniform1f(uniforms.fromAspect, aspects[from] ?? 1);
            gl.uniform1f(uniforms.toAspect, aspects[to] ?? 1);
            gl.uniform1f(uniforms.scale, t.noiseScale);
            gl.uniform1f(uniforms.direction, direction);
            gl.uniform1f(uniforms.edge, Math.max(t.edge, 0.001));
            gl.uniform1f(uniforms.drift, t.drift);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        };

        let isLooping = false;
        const requestDraw = () => {
            if (!isLooping && !disposed) {
                isLooping = true;
                raf = requestAnimationFrame(frame);
            }
        };
        triggerDrawRef.current = requestDraw;

        const frame = () => {
            if (disposed) return;
            draw();
            if (progress < 1 || request.current) {
                raf = requestAnimationFrame(frame);
            } else {
                isLooping = false;
            }
        };

        const start = async () => {
            try {
                program = link(gl, VERT, FRAG);
                gl.useProgram(program);

                buffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                gl.bufferData(
                    gl.ARRAY_BUFFER,
                    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
                    gl.STATIC_DRAW
                );
                const loc = gl.getAttribLocation(program, "a_position");
                gl.enableVertexAttribArray(loc);
                gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

                for (const name of [
                    "from",
                    "to",
                    "progress",
                    "resolution",
                    "fromAspect",
                    "toAspect",
                    "scale",
                    "direction",
                    "edge",
                    "drift",
                ]) {
                    uniforms[name] = gl.getUniformLocation(program, "u_" + name);
                }

                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

                let running = false;
                let refused = 0;
                await Promise.all(
                    items.map((item, i) =>
                        loadImage(item.src).then(
                            (img) => {
                                if (disposed) return;
                                const tex = gl.createTexture();
                                gl.bindTexture(gl.TEXTURE_2D, tex);
                                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
                                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                                textures[i] = tex;
                                aspects[i] = img.naturalWidth / Math.max(img.naturalHeight, 1);
                                if (!running) {
                                    running = true;
                                    resize();
                                    setReady(true);
                                    requestDraw();
                                }
                            },
                            () => {
                                refused += 1;
                                if (refused === items.length && !disposed) setFailed(true);
                            }
                        )
                    )
                );
            } catch {
                if (!disposed) setFailed(true);
            }
        };
        void start();

        return () => {
            disposed = true;
            triggerDrawRef.current = null;
            cancelAnimationFrame(raf);
            observer.disconnect();
            canvas.removeEventListener("webglcontextlost", onLost);
            canvas.removeEventListener("webglcontextrestored", onRestored);
            for (const tex of textures) if (tex) gl.deleteTexture(tex);
            if (buffer) gl.deleteBuffer(buffer);
            if (program) gl.deleteProgram(program);
            textures.fill(null);
        };
        // `active` is read once to seed the first frame; changes arrive through
        // `request` instead, which is why it is deliberately not a dependency.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sources, generation, items.length, loop]);

    React.useEffect(() => {
        if (!autoplay || reduced || paused || items.length < 2) return;
        const id = window.setInterval(() => go(active + 1), Math.max(autoplay, 600));
        return () => window.clearInterval(id);
    }, [autoplay, reduced, paused, active, go, items.length]);

    React.useEffect(() => {
        const sync = () => setPaused(document.hidden);
        document.addEventListener("visibilitychange", sync);
        return () => document.removeEventListener("visibilitychange", sync);
    }, []);

    const swipe = React.useRef(null);
    const onPointerDown = (e) => {
        swipe.current = e.clientX;
    };
    const onPointerUp = (e) => {
        const startX = swipe.current;
        swipe.current = null;
        if (startX === null) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 48) go(active + (dx < 0 ? 1 : -1));
    };
    const onKeyDown = (e) => {
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            go(active - 1);
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            go(active + 1);
        }
    };

    const atStart = !loop && active === 0;
    const atEnd = !loop && active === items.length - 1;
    const current = items[active];

    const [isMobile, setIsMobile] = React.useState(false);
    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const arrowBaseStyle = {
        position: "absolute",
        top: "50%",
        zIndex: 10,
        display: "flex",
        height: 44,
        width: 44,
        transform: "translateY(-50%)",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "9999px",
        border: "1px solid rgba(255,255,255,0.25)",
        backgroundColor: "rgba(0,0,0,0.45)",
        color: "#ffffff",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        cursor: "pointer",
        transition: "background-color 0.2s ease, opacity 0.2s ease",
    };

    return (
        <section
            className={className}
            style={{
                position: "relative",
                width: "100%",
                height,
                overflow: "hidden",
                backgroundColor: "#0a0a0a",
            }}
            aria-roledescription="carousel"
            aria-label="Image gallery"
            tabIndex={0}
            onKeyDown={onKeyDown}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
        >
            {failed ? (
                items.map((item, i) => (
                    <img
                        key={item.src + i}
                        src={item.src}
                        alt={item.alt ?? ""}
                        style={{
                            position: "absolute",
                            inset: 0,
                            display: "block",
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            maxWidth: "none",
                            opacity: i === active ? 1 : 0,
                            transition: "opacity 700ms ease",
                        }}
                        aria-hidden={i !== active}
                    />
                ))
            ) : (
                <canvas
                    ref={canvasRef}
                    style={{
                        position: "absolute",
                        inset: 0,
                        display: "block",
                        width: "100%",
                        height: "100%",
                        opacity: ready ? 1 : 0,
                        transition: "opacity 400ms ease",
                    }}
                    aria-hidden="true"
                />
            )}

            {/* Gradient trên và dưới để chữ luôn hiển thị tương phản rõ nét */}
            <div
                style={{
                    pointerEvents: "none",
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    zIndex: 5,
                    height: 140,
                    background: "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)",
                }}
                aria-hidden="true"
            />
            <div
                style={{
                    pointerEvents: "none",
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 5,
                    height: 180,
                    background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.75))",
                }}
                aria-hidden="true"
            />

            {/* BỘ LỌC DANH MỤC & TÌM KIẾM TÍCH HỢP BÊN TRONG GALLERY */}
            {(categories.length > 0 || onSearchChange) && (
                <div
                    style={{
                        position: "absolute",
                        top: isMobile ? 14 : 26,
                        left: isMobile ? 12 : 36,
                        right: isMobile ? 12 : 36,
                        zIndex: 14,
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "10px",
                        pointerEvents: "auto",
                    }}
                >
                    {/* Các nút danh mục */}
                    {categories.length > 0 && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                overflowX: "auto",
                                maxWidth: "100%",
                                padding: "4px",
                                background: "rgba(17, 17, 17, 0.72)",
                                backdropFilter: "blur(16px)",
                                WebkitBackdropFilter: "blur(16px)",
                                border: "1px solid rgba(255, 255, 255, 0.15)",
                                borderRadius: "999px",
                                scrollbarWidth: "none",
                            }}
                        >
                            {categories.map((cat) => {
                                const isActive = selectedCategory === cat.key;
                                return (
                                    <button
                                        key={cat.key}
                                        type="button"
                                        onClick={() => onSelectCategory && onSelectCategory(cat.key)}
                                        style={{
                                            background: isActive ? "#ffffff" : "transparent",
                                            color: isActive ? "#111111" : "rgba(255, 255, 255, 0.75)",
                                            border: "none",
                                            borderRadius: "999px",
                                            padding: isMobile ? "6px 12px" : "7px 16px",
                                            fontSize: isMobile ? "10px" : "11px",
                                            fontFamily: "var(--font-label, sans-serif)",
                                            fontWeight: "600",
                                            letterSpacing: "0.06em",
                                            cursor: "pointer",
                                            whiteSpace: "nowrap",
                                            transition: "all 0.2s ease",
                                        }}
                                    >
                                        {cat.label}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Ô tìm kiếm tác phẩm */}
                    {onSearchChange && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: isMobile ? "6px 12px" : "7px 16px",
                                background: "rgba(17, 17, 17, 0.72)",
                                backdropFilter: "blur(16px)",
                                WebkitBackdropFilter: "blur(16px)",
                                border: "1px solid rgba(255, 255, 255, 0.15)",
                                borderRadius: "999px",
                                width: isMobile ? "100%" : "220px",
                            }}
                        >
                            <i className="fas fa-search" style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }}></i>
                            <input
                                type="text"
                                placeholder={searchPlaceholder}
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    outline: "none",
                                    color: "#ffffff",
                                    fontSize: "11px",
                                    fontFamily: "var(--font-label, sans-serif)",
                                    letterSpacing: "0.04em",
                                    width: "100%",
                                }}
                            />
                        </div>
                    )}
                </div>
            )}

            {arrows && items.length > 1 && (
                <>
                    <button
                        type="button"
                        style={{ ...arrowBaseStyle, left: 20, opacity: atStart ? 0.25 : 1 }}
                        onClick={() => go(active - 1)}
                        disabled={atStart}
                        aria-label="Previous image"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        style={{ ...arrowBaseStyle, right: 20, opacity: atEnd ? 0.25 : 1 }}
                        onClick={() => go(active + 1)}
                        disabled={atEnd}
                        aria-label="Next image"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </>
            )}

            {/* BẢNG THÔNG TIN TÁC PHẨM NỔI (GLASSMORPHISM INFO CARD) */}
            {current && (current.title || current.material) && (
                <div
                    style={{
                        position: "absolute",
                        left: isMobile ? 16 : 40,
                        bottom: isMobile
                            ? (thumbnails && items.length > 1 ? 84 : 20)
                            : (thumbnails && items.length > 1 ? 90 : 36),
                        zIndex: 12,
                        maxWidth: isMobile ? "calc(100% - 32px)" : "480px",
                        backgroundColor: "rgba(13, 13, 13, 0.76)",
                        backdropFilter: "blur(18px)",
                        WebkitBackdropFilter: "blur(18px)",
                        border: "1px solid rgba(255, 255, 255, 0.16)",
                        borderRadius: "22px",
                        padding: isMobile ? "1rem 1.2rem" : "1.35rem 1.65rem",
                        color: "#ffffff",
                        boxShadow: "0 18px 40px rgba(0, 0, 0, 0.6)",
                        pointerEvents: "auto",
                        transition: "opacity 0.3s ease, transform 0.3s ease",
                    }}
                >
                    {current.category && (
                        <span
                            style={{
                                display: "inline-block",
                                fontFamily: "var(--font-mono, monospace)",
                                fontSize: "10px",
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                color: "#92EEFF",
                                backgroundColor: "rgba(146, 238, 255, 0.14)",
                                padding: "3px 10px",
                                borderRadius: "999px",
                                marginBottom: "0.55rem",
                            }}
                        >
                            {current.category}
                        </span>
                    )}

                    <h3
                        style={{
                            margin: "0 0 0.4rem",
                            fontFamily: "var(--font-heading, Georgia, serif)",
                            fontSize: isMobile ? "1.35rem" : "1.85rem",
                            fontWeight: 600,
                            lineHeight: 1.15,
                            color: "#ffffff",
                        }}
                    >
                        {current.title}
                    </h3>

                    {current.description && (
                        <p
                            style={{
                                margin: "0 0 0.8rem",
                                fontSize: isMobile ? "12px" : "13.5px",
                                color: "rgba(255, 255, 255, 0.82)",
                                lineHeight: 1.5,
                                display: "-webkit-box",
                                WebkitLineClamp: isMobile ? 2 : 3,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                            }}
                        >
                            {current.description}
                        </p>
                    )}

                    {(current.material || current.size) && (
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "6px 16px",
                                fontSize: "11px",
                                color: "rgba(255, 255, 255, 0.68)",
                                fontFamily: "var(--font-mono, monospace)",
                                borderTop: "1px solid rgba(255, 255, 255, 0.12)",
                                paddingTop: "0.6rem",
                            }}
                        >
                            {current.material && (
                                <span>
                                    <strong style={{ color: "rgba(255, 255, 255, 0.95)" }}>CHẤT LIỆU:</strong> {current.material}
                                </span>
                            )}
                            {current.size && (
                                <span>
                                    <strong style={{ color: "rgba(255, 255, 255, 0.95)" }}>KÍCH THƯỚC:</strong> {current.size}
                                </span>
                            )}
                        </div>
                    )}

                    {current.displayUrl && (
                        <div style={{ marginTop: "0.65rem" }}>
                            <a
                                href={current.displayUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    color: "#ffffff",
                                    fontSize: "11px",
                                    fontFamily: "var(--font-mono, monospace)",
                                    letterSpacing: "0.06em",
                                    textDecoration: "underline",
                                }}
                            >
                                <span>XEM ẢNH GỐC HD</span>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                    <polyline points="15 3 21 3 21 9" />
                                    <line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                            </a>
                        </div>
                    )}
                </div>
            )}

            {thumbnails && items.length > 1 && (
                <ul
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 20,
                        zIndex: 10,
                        margin: "0 auto",
                        display: "flex",
                        width: "max-content",
                        maxWidth: "calc(100% - 2rem)",
                        gap: 8,
                        listStyle: "none",
                        overflowX: "auto",
                        padding: "0 0 6px 0",
                    }}
                >
                    {items.map((item, i) => (
                        <li key={item.src + i} style={{ flexShrink: 0, listStyle: "none" }}>
                            <button
                                type="button"
                                onClick={() => go(i)}
                                aria-current={i === active}
                                aria-label={item.alt ? "Show " + item.alt : "Show image " + (i + 1)}
                                style={{
                                    display: "block",
                                    cursor: "pointer",
                                    overflow: "hidden",
                                    borderRadius: 6,
                                    border: i === active ? "2px solid #ffffff" : "2px solid transparent",
                                    background: "transparent",
                                    padding: 0,
                                    opacity: i === active ? 1 : 0.55,
                                    transition: "opacity 200ms ease, border-color 200ms ease",
                                }}
                            >
                                <img
                                    src={item.thumb ?? item.src}
                                    alt=""
                                    width={80}
                                    height={50}
                                    loading="lazy"
                                    decoding="async"
                                    style={{
                                        display: "block",
                                        objectFit: "cover",
                                        maxWidth: "none",
                                        width: 80,
                                        height: 50,
                                    }}
                                />
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <span
                style={{
                    position: "absolute",
                    width: 1,
                    height: 1,
                    overflow: "hidden",
                    clip: "rect(0, 0, 0, 0)",
                    whiteSpace: "nowrap",
                }}
                aria-live="polite"
            >
                {current ? current.alt ?? "Image " + (active + 1) : ""}
                {" — "}
                {active + 1} of {items.length}
            </span>
        </section>
    );
}
