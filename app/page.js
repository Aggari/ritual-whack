"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ─── COMMUNITY HANDLES (truncated mock — paste full list from match game) ───
const ALL_HANDLES = [
  { handle: "_focapa", ext: "jpg" }, { handle: "0x_HalfMoonKid", ext: "jpg" },
  { handle: "0xBANDAL", ext: "jpg" }, { handle: "0xhigash1", ext: "jpg" },
  { handle: "0xKreko", ext: "jpg" }, { handle: "0xOsaragi", ext: "jpg" },
  { handle: "0xspeedx", ext: "jpg" }, { handle: "0xusamaa", ext: "jpg" },
  { handle: "4betterlife__", ext: "jpg" }, { handle: "1000jae00001", ext: "jpg" },
  { handle: "Anh_Beeng386", ext: "jpg" }, { handle: "anirudhchain", ext: "jpg" },
  { handle: "batagor", ext: "jpg" }, { handle: "bramexyz", ext: "jpg" },
  { handle: "bruceBravogo", ext: "jpg" }, { handle: "BunsDev", ext: "jpg" },
  { handle: "calistalarisa", ext: "jpg" }, { handle: "ccrriiy", ext: "jpg" },
  { handle: "Chigo1andonly", ext: "jpg" }, { handle: "Cripson01", ext: "jpg" },
  { handle: "cristypuiu", ext: "jpg" }, { handle: "cryptohypegirl0", ext: "jpg" },
  { handle: "cryptokj77", ext: "jpg" }, { handle: "dappeum", ext: "jpg" },
  { handle: "decka_chan", ext: "jpg" }, { handle: "DipuDas76904823", ext: "jpg" },
  { handle: "Donaclin", ext: "jpg" }, { handle: "elifhilalumucu", ext: "jpg" },
  { handle: "ericgudboy", ext: "jpg" }, { handle: "Fakhirgb", ext: "jpg" },
  { handle: "farmtokyo", ext: "jpg" }, { handle: "girin0505", ext: "jpg" },
  { handle: "gizdusumandnode", ext: "jpg" }, { handle: "glenfiddich_18", ext: "jpg" },
  { handle: "hamiweb3", ext: "jpg" }, { handle: "heeheeheeyaa", ext: "jpg" },
  { handle: "herbcase7", ext: "jpg" }, { handle: "imborie", ext: "jpg" },
  { handle: "innerpeace300", ext: "jpg" }, { handle: "jasm1ne_eth", ext: "jpg" },
  { handle: "jepslife", ext: "jpg" }, { handle: "johhmeow", ext: "jpg" },
  { handle: "johntolxbt", ext: "jpg" }, { handle: "kastew99999", ext: "jpg" },
  { handle: "kikiundo3", ext: "jpg" }, { handle: "lalararara37", ext: "jpg" },
  { handle: "linhlambo", ext: "jpg" }, { handle: "Liora_2278", ext: "jpg" },
  { handle: "Livinginaprayer", ext: "jpg" }, { handle: "lord__luci", ext: "jpg" },
  { handle: "Madrii_dd", ext: "jpg" }, { handle: "MarkoStevan19", ext: "jpg" },
  { handle: "mashpotatop", ext: "jpg" }, { handle: "maslenaFM", ext: "jpg" },
  { handle: "Maxim_Ilyano", ext: "jpg" }, { handle: "meison_mswen", ext: "jpg" },
  { handle: "mifyroxyy", ext: "jpg" }, { handle: "moc_tx89", ext: "jpg" },
  { handle: "MOONSEO_", ext: "jpg" }, { handle: "moooo_iii", ext: "jpg" },
  { handle: "murataydn_34", ext: "jpg" }, { handle: "NanangN27", ext: "jpg" },
  { handle: "Neitenoz26", ext: "jpg" }, { handle: "nikitatechnik", ext: "jpg" },
  { handle: "pangdung_", ext: "jpg" }, { handle: "PixelSect", ext: "jpg" },
  { handle: "PMemoye", ext: "jpg" }, { handle: "Pugovka_Mari", ext: "jpg" },
  { handle: "Rahul_xyz01", ext: "jpg" }, { handle: "raintaro_rt", ext: "jpg" },
  { handle: "rifal19988", ext: "jpg" }, { handle: "ritualcommunity", ext: "jpg" },
  { handle: "rocariedk", ext: "png" }, { handle: "SaintLee04", ext: "jpg" },
  { handle: "seesac_", ext: "jpg" }, { handle: "sengoku_xyz", ext: "jpg" },
  { handle: "silverwave1000", ext: "jpg" }, { handle: "songsong6059", ext: "jpg" },
  { handle: "SOYEONKIM521597", ext: "jpg" }, { handle: "soyoulJ", ext: "jpg" },
  { handle: "starknight50x", ext: "jpg" }, { handle: "sterjke", ext: "jpg" },
  { handle: "superJinee", ext: "jpg" }, { handle: "Syrupynut", ext: "jpg" },
  { handle: "temainweb", ext: "jpg" }, { handle: "tutubearrr", ext: "jpg" },
  { handle: "tutufly_yy", ext: "jpg" }, { handle: "w22py", ext: "jpg" },
  { handle: "wallets12_lee", ext: "jpg" }, { handle: "whuanjg", ext: "jpg" },
  { handle: "Yaneul2ee", ext: "jpg" }, { handle: "yooyoungmin3", ext: "jpg" },
  { handle: "yourinuu", ext: "jpg" }, { handle: "yunbbong", ext: "jpg" },
  { handle: "yusrilatiqur", ext: "jpg" }, { handle: "zeno_Isone", ext: "jpg" },
  { handle: "zzing____", ext: "jpg" },
];

// ─── COMPONENTS (Ritual roles) ──────────────────────────────────
const COMPONENTS = [
  { id: "guardians", name: "GUARDIANS", short: "GRD", color: "#FF7F7F", desc: "Filters adversarial inputs by semantic distance" },
  { id: "tee", name: "TEE", short: "TEE", color: "#FFB86B", desc: "Hardware enclave protecting sensitive data" },
  { id: "symphony", name: "SYMPHONY", short: "SYM", color: "#FFD96A", desc: "EOVMT consensus, handles node failover" },
  { id: "infernet", name: "INFERNET", short: "INF", color: "#FF89B5", desc: "Oracle network for off-chain signals" },
  { id: "scheduled", name: "SCHEDULED TX", short: "SCH", color: "#B5A7FF", desc: "Recurring on-chain execution" },
  { id: "resonance", name: "RESONANCE", short: "RES", color: "#EF9F27", desc: "Surplus-maximizing fee matching" },
];

// ─── THREATS (mapped to which components solve them) ────────────
// Each threat is a scenario; player must hit PFPs labeled with the matching component
const THREATS = [
  { id: "sybil", text: "SYBIL FLOOD", subtitle: "Thousands of fake requests", correct: ["guardians"], hint: "Filter by embedding distance" },
  { id: "leak", text: "SENSITIVE DATA", subtitle: "Confidential input in pipeline", correct: ["tee"], hint: "Run inside hardware enclave" },
  { id: "crash", text: "NODE CRASH", subtitle: "Executing node went down", correct: ["symphony"], hint: "Verifier picks up execution" },
  { id: "signal", text: "OFF-CHAIN SIGNAL", subtitle: "Need real-time external data", correct: ["infernet"], hint: "8,000+ oracle nodes" },
  { id: "recurring", text: "RECURRING TASK", subtitle: "Run every hour, no keepers", correct: ["scheduled"], hint: "Chain-native scheduling" },
  { id: "fee", text: "FEE SPIKE", subtitle: "Costs surged mid-execution", correct: ["resonance"], hint: "Two-sided matching" },
  { id: "injection", text: "PROMPT INJECTION", subtitle: "Adversarial prompt detected", correct: ["guardians"], hint: "Semantic firewall" },
  { id: "private", text: "PRIVATE WORKFLOW", subtitle: "Operator must not see data", correct: ["tee"], hint: "Sealed execution" },
  // Multi-correct (later difficulty)
  { id: "combo1", text: "ATTACK + DELAY", subtitle: "Sybil flood + execution stalled", correct: ["guardians", "symphony"], hint: "Filter + failover" },
  { id: "combo2", text: "PRIVATE + SCHEDULED", subtitle: "Recurring task with confidential data", correct: ["tee", "scheduled"], hint: "Enclave + cron" },
];

// ─── SOUND ──────────────────────────────────────────────────────
const useSound = () => {
  const ctx = useRef(null);
  const musicNodes = useRef([]);
  const musicTimers = useRef([]);
  const getCtx = () => { if (!ctx.current) ctx.current = new (window.AudioContext || window.webkitAudioContext)(); return ctx.current; };
  const play = (f, d, t = "sine", v = 0.04) => {
    try {
      const c = getCtx(); const o = c.createOscillator(); const g = c.createGain();
      o.type = t; o.frequency.value = f;
      g.gain.setValueAtTime(v, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + d);
      o.connect(g); g.connect(c.destination);
      o.start(); o.stop(c.currentTime + d);
    } catch (e) {}
  };

  const startMusic = () => {
    try {
      const c = getCtx();
      stopMusic();
      // Punchy game-y loop (think arcade, faster than chill ambient)
      const bass = [65.41, 65.41, 87.31, 65.41, 73.42, 73.42, 98.00, 73.42];
      const lead = [261.63, 329.63, 392.00, 329.63, 293.66, 349.23, 440.00, 349.23];
      let step = 0;
      const tickRate = 200; // ~150 BPM, energetic

      const loop = () => {
        if (!ctx.current) return;
        const now = ctx.current.currentTime;
        const i = step % 8;

        // Lead — square wave punchy
        const lo = c.createOscillator();
        const lg = c.createGain();
        lo.type = "square";
        lo.frequency.value = lead[i];
        lg.gain.setValueAtTime(0.018, now);
        lg.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        lo.connect(lg); lg.connect(c.destination);
        lo.start(now); lo.stop(now + 0.16);
        musicNodes.current.push(lo, lg);

        // Bass
        const bo = c.createOscillator();
        const bg = c.createGain();
        bo.type = "triangle";
        bo.frequency.value = bass[i];
        bg.gain.setValueAtTime(0.045, now);
        bg.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        bo.connect(bg); bg.connect(c.destination);
        bo.start(now); bo.stop(now + 0.2);
        musicNodes.current.push(bo, bg);

        // Kick on every other beat
        if (i % 2 === 0) {
          const ko = c.createOscillator();
          const kg = c.createGain();
          ko.type = "sine";
          ko.frequency.setValueAtTime(120, now);
          ko.frequency.exponentialRampToValueAtTime(40, now + 0.08);
          kg.gain.setValueAtTime(0.08, now);
          kg.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          ko.connect(kg); kg.connect(c.destination);
          ko.start(now); ko.stop(now + 0.13);
          musicNodes.current.push(ko, kg);
        }

        // Hi-hat
        if (i % 2 === 1) {
          const buffer = c.createBuffer(1, c.sampleRate * 0.03, c.sampleRate);
          const data = buffer.getChannelData(0);
          for (let j = 0; j < data.length; j++) data[j] = (Math.random() * 2 - 1) * 0.5;
          const noise = c.createBufferSource();
          noise.buffer = buffer;
          const filter = c.createBiquadFilter();
          filter.type = "highpass";
          filter.frequency.value = 8000;
          const ng = c.createGain();
          ng.gain.setValueAtTime(0.012, now);
          ng.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
          noise.connect(filter); filter.connect(ng); ng.connect(c.destination);
          noise.start(now); noise.stop(now + 0.03);
          musicNodes.current.push(noise, ng);
        }

        step++;
        const t = setTimeout(loop, tickRate);
        musicTimers.current.push(t);
      };
      loop();
    } catch (e) {}
  };

  const stopMusic = () => {
    musicTimers.current.forEach(t => clearTimeout(t));
    musicTimers.current = [];
    musicNodes.current.forEach(n => { try { n.stop && n.stop(); n.disconnect && n.disconnect(); } catch (e) {} });
    musicNodes.current = [];
  };

  return {
    hit: () => { play(880, 0.08, "sine", 0.05); setTimeout(() => play(1320, 0.1, "sine", 0.04), 30); },
    miss: () => { play(220, 0.15, "square", 0.05); },
    combo: (c) => {
      [523, 659, 784].forEach((f, i) => setTimeout(() => play(f + c * 50, 0.08, "sine", 0.04), i * 30));
    },
    threat: () => { play(440, 0.1, "sawtooth", 0.04); setTimeout(() => play(330, 0.12, "sawtooth", 0.04), 80); },
    tick: () => play(800, 0.03, "sine", 0.02),
    start: () => { play(440, 0.1); setTimeout(() => play(554, 0.1), 100); setTimeout(() => play(659, 0.15), 200); },
    end: () => { play(600, 0.15); setTimeout(() => play(500, 0.15), 120); setTimeout(() => play(400, 0.25), 240); },
    startMusic, stopMusic,
  };
};

// ─── HELPERS ────────────────────────────────────────────────────
const randHandle = () => ALL_HANDLES[Math.floor(Math.random() * ALL_HANDLES.length)];
const randComp = (pool = COMPONENTS) => pool[Math.floor(Math.random() * pool.length)];

// ─── MAIN ───────────────────────────────────────────────────────
const GRID_COLS = 4;
const GRID_ROWS = 3;
const TOTAL_HOLES = GRID_COLS * GRID_ROWS;
const GAME_TIME = 60;

export default function Page() {
  const [screen, setScreen] = useState("menu");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [highestCombo, setHighestCombo] = useState(0);
  const [timer, setTimer] = useState(GAME_TIME);
  const [threat, setThreat] = useState(THREATS[0]);
  const [moles, setMoles] = useState([]); // {idx, handle, comp, expiresAt}
  const [floats, setFloats] = useState([]); // {id, idx, text, color}
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [hitCount, setHitCount] = useState(0);
  const [missCount, setMissCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const sound = useSound();
  const moleIdRef = useRef(0);

  // Difficulty curve based on time elapsed
  const getDifficulty = (t) => {
    const elapsed = GAME_TIME - t;
    if (elapsed < 10) return { spawnInterval: 1200, moleLifetime: 2000, threatChange: 6000, allowMulti: false, poolSize: 3 };
    if (elapsed < 25) return { spawnInterval: 950, moleLifetime: 1700, threatChange: 5000, allowMulti: false, poolSize: 4 };
    if (elapsed < 40) return { spawnInterval: 750, moleLifetime: 1400, threatChange: 4000, allowMulti: true, poolSize: 5 };
    return { spawnInterval: 550, moleLifetime: 1100, threatChange: 3000, allowMulti: true, poolSize: 6 };
  };

  const startGame = () => {
    setScore(0); setCombo(0); setHighestCombo(0); setTimer(GAME_TIME);
    setMoles([]); setFloats([]); setHitCount(0); setMissCount(0);
    setThreat(pickThreat(false)); setShowHint(false);
    setScreen("game"); sound.start();
    if (musicEnabled) sound.startMusic();
  };

  const pickThreat = (allowMulti) => {
    const pool = THREATS.filter(t => allowMulti || t.correct.length === 1);
    return pool[Math.floor(Math.random() * pool.length)];
  };

  // Stop music on screen change
  useEffect(() => {
    if (screen !== "game") sound.stopMusic();
    else if (musicEnabled) sound.startMusic();
  }, [screen, musicEnabled]);

  // Timer
  useEffect(() => {
    if (screen !== "game" || timer <= 0) return;
    const id = setInterval(() => {
      setTimer(t => {
        if (t <= 6) sound.tick();
        if (t <= 1) { sound.end(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [screen, timer]);

  // End game
  useEffect(() => {
    if (screen === "game" && timer === 0) setTimeout(() => setScreen("end"), 600);
  }, [timer, screen]);

  // Threat rotation
  useEffect(() => {
    if (screen !== "game" || timer === 0) return;
    const diff = getDifficulty(timer);
    const id = setInterval(() => {
      const next = pickThreat(diff.allowMulti);
      setThreat(next);
      sound.threat();
      setShowHint(true);
      setTimeout(() => setShowHint(false), 1200);
    }, diff.threatChange);
    return () => clearInterval(id);
  }, [screen, timer]);

  // Mole spawning
  useEffect(() => {
    if (screen !== "game" || timer === 0) return;
    const diff = getDifficulty(timer);
    const id = setInterval(() => {
      setMoles(prev => {
        if (prev.length >= 5) return prev; // cap concurrent moles
        const occupied = new Set(prev.map(m => m.idx));
        const free = [];
        for (let i = 0; i < TOTAL_HOLES; i++) if (!occupied.has(i)) free.push(i);
        if (free.length === 0) return prev;
        const idx = free[Math.floor(Math.random() * free.length)];

        // Decide which component this mole shows
        // Mix of correct + distractor components
        const compPool = COMPONENTS.slice(0, diff.poolSize);
        const correctSet = new Set(threat.correct);
        // 40% chance to show correct, 60% distractor
        const isCorrect = Math.random() < 0.4;
        let comp;
        if (isCorrect) {
          comp = COMPONENTS.find(c => correctSet.has(c.id));
        } else {
          const distractors = compPool.filter(c => !correctSet.has(c.id));
          comp = distractors[Math.floor(Math.random() * distractors.length)] || compPool[0];
        }

        const newMole = {
          uid: ++moleIdRef.current,
          idx,
          handle: randHandle(),
          comp,
          expiresAt: Date.now() + diff.moleLifetime,
        };
        return [...prev, newMole];
      });
    }, getDifficulty(timer).spawnInterval);
    return () => clearInterval(id);
  }, [screen, timer, threat]);

  // Mole expiry
  useEffect(() => {
    if (screen !== "game") return;
    const id = setInterval(() => {
      setMoles(prev => prev.filter(m => m.expiresAt > Date.now()));
    }, 100);
    return () => clearInterval(id);
  }, [screen]);

  // Add float
  const addFloat = (idx, text, color) => {
    const id = Math.random().toString(36);
    setFloats(prev => [...prev, { id, idx, text, color }]);
    setTimeout(() => setFloats(prev => prev.filter(f => f.id !== id)), 800);
  };

  // Click handler
  const hitMole = (mole) => {
    if (screen !== "game" || timer === 0) return;
    const isCorrect = threat.correct.includes(mole.comp.id);
    setMoles(prev => prev.filter(m => m.uid !== mole.uid));

    if (isCorrect) {
      const newCombo = combo + 1;
      const points = 100 + newCombo * 20;
      setScore(s => s + points);
      setCombo(newCombo);
      setHighestCombo(h => Math.max(h, newCombo));
      setHitCount(h => h + 1);
      addFloat(mole.idx, `+${points}`, "#5DCAA5");
      if (newCombo >= 3) sound.combo(newCombo); else sound.hit();
      if (newCombo === 5 || newCombo === 10 || newCombo === 15) {
        addFloat(mole.idx, `×${newCombo} COMBO!`, "#FFD96A");
      }
    } else {
      setCombo(0);
      setMissCount(m => m + 1);
      setScore(s => Math.max(0, s - 30));
      addFloat(mole.idx, `${mole.comp.name} ≠ ${threat.text}`, "#ff453a");
      sound.miss();
    }
  };

  const accuracy = hitCount + missCount > 0 ? Math.round((hitCount / (hitCount + missCount)) * 100) : 100;

  // ─── MENU ─────────────────────────────────────────────────────
  if (screen === "menu") return (
    <div style={S.wrap}>
      <div style={S.gridBg} />
      <div style={S.glowOrb} />
      <div style={S.mc}>
        <div style={S.logoDiamond}>◆</div>
        <h1 style={S.title}>RITUAL</h1>
        <h2 style={S.sub}>WHACK</h2>
        <p style={S.tag}>Threats incoming. Hit only the right defenders.</p>

        <button onClick={startGame} style={{ ...S.pb, marginTop: 36 }}>START →</button>

        <div style={S.rb}>
          <p style={S.rh}>HOW TO PLAY</p>
          <p style={S.rt}>
            A threat appears at the top — sybil flood, prompt injection, node crash, etc. Community PFPs pop up labeled with Ritual components. <strong style={{ color: "#5DCAA5" }}>Hit only the PFPs labeled with the component that solves the threat.</strong> Wrong hit = combo broken + score deducted. Threats rotate every few seconds. 60s.
          </p>
        </div>

        <div style={S.compsGrid}>
          {COMPONENTS.map(c => (
            <div key={c.id} style={{ ...S.compChip, borderColor: `${c.color}40`, color: c.color }}>
              <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 0.5 }}>{c.short}</span>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginTop: 2, fontWeight: 400 }}>{c.name}</span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 24, letterSpacing: 1.5 }}>
          created by <a href="https://twitter.com/Livinginaprayer" target="_blank" rel="noopener noreferrer" style={{ color: "#5DCAA5", textDecoration: "none", fontWeight: 600 }}>@Livinginaprayer</a>
        </p>
      </div>
      <style>{anims}</style>
    </div>
  );

  // ─── END ──────────────────────────────────────────────────────
  if (screen === "end") {
    const grade = score >= 4000 ? "S" : score >= 2500 ? "A" : score >= 1200 ? "B" : "C";
    const label = score >= 4000 ? "Chain Defender" : score >= 2500 ? "Threat Filter" : score >= 1200 ? "Defender" : "Trainee";
    return (
      <div style={S.wrap}>
        <div style={S.gridBg} /><div style={S.glowOrb} />
        <div style={{ ...S.mc, maxWidth: 520 }}>
          <div style={{ fontSize: 56, marginBottom: 8 }}>🛡</div>
          <h1 style={{ ...S.title, fontSize: 36 }}>TIME'S UP</h1>
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 64, fontWeight: 800, color: "#5DCAA5", fontVariantNumeric: "tabular-nums" }}>{score}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 3, marginTop: 4 }}>SCORE</div>
          </div>
          <div style={S.endGrid}>
            <div style={S.endCell}><span style={S.endLabel}>Hits</span><span style={S.endVal}>{hitCount}</span></div>
            <div style={S.endCell}><span style={S.endLabel}>Accuracy</span><span style={S.endVal}>{accuracy}%</span></div>
            <div style={S.endCell}><span style={S.endLabel}>Best Combo</span><span style={S.endVal}>×{highestCombo}</span></div>
            <div style={S.endCell}><span style={S.endLabel}>Grade</span><span style={{ ...S.endVal, color: "#ffd60a" }}>{grade}</span></div>
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 8 }}>{label}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 20, flexDirection: "column" }}>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I scored ${score} on Ritual Whack 🛡\n\nHits: ${hitCount} (${accuracy}%)\nBest combo: ×${highestCombo}\nGrade: ${grade} — ${label}\n\nCan you defend the chain?\n\n@ritualfnd @dunken9718 @joshsimenhoff @0xMadScientist @Jez_Cryptoz`)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={S.shareBtn}
            >
              Share on X →
            </a>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={startGame} style={{ ...S.pb, flex: 1 }}>PLAY AGAIN</button>
              <button onClick={() => setScreen("menu")} style={{ ...S.pb, flex: 1, background: "rgba(255,255,255,0.03)", boxShadow: "none", color: "rgba(255,255,255,0.35)" }}>MENU</button>
            </div>
          </div>
        </div>
        <style>{anims}</style>
      </div>
    );
  }

  // ─── GAME ─────────────────────────────────────────────────────
  return (
    <div style={S.gw}>
      {/* HUD */}
      <div style={S.hud}>
        <div style={S.hl}>
          <div style={{ ...S.hudTimer, color: timer <= 10 ? "#ff453a" : "#5DCAA5", animation: timer <= 5 ? "pulse 0.5s ease-in-out infinite" : "none" }}>
            {timer}s
          </div>
        </div>
        <div style={S.hr}>
          <button
            onClick={() => setMusicEnabled(m => !m)}
            style={{ background: "rgba(255,255,255,0.04)", color: musicEnabled ? "#5DCAA5" : "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 10px", fontSize: 14, cursor: "pointer", lineHeight: 1 }}
          >
            {musicEnabled ? "♪" : "♪̸"}
          </button>
          {combo >= 2 && <span style={S.comboBadge}>×{combo} COMBO</span>}
          <div style={S.scoreDisplay}>
            <span style={S.scoreLabel}>SCORE</span>
            <span style={S.scoreVal}>{score}</span>
          </div>
        </div>
      </div>

      {/* Threat banner */}
      <div style={{ ...S.threatBanner, animation: showHint ? "threatPulse 1.2s ease" : "none" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={S.threatLabel}>INCOMING THREAT</span>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={S.threatText}>{threat.text}</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>·</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{threat.subtitle}</span>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            {threat.correct.map(cid => {
              const comp = COMPONENTS.find(c => c.id === cid);
              return (
                <span key={cid} style={{ ...S.targetChip, borderColor: comp.color, color: comp.color }}>
                  HIT: {comp.short}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid of holes */}
      <div style={S.boardWrap}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`, gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`, gap: 18, width: "min(640px, 92vw)", aspectRatio: `${GRID_COLS} / ${GRID_ROWS}` }}>
          {Array.from({ length: TOTAL_HOLES }).map((_, idx) => {
            const mole = moles.find(m => m.idx === idx);
            return (
              <div key={idx} style={S.hole}>
                {mole && <Mole mole={mole} onHit={() => hitMole(mole)} threat={threat} />}
                {floats.filter(f => f.idx === idx).map(f => (
                  <div key={f.id} style={{ ...S.float, color: f.color }}>{f.text}</div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <style>{anims}</style>
    </div>
  );
}

// ─── MOLE COMPONENT ─────────────────────────────────────────────
function Mole({ mole, onHit }) {
  const [popped, setPopped] = useState(false);
  useEffect(() => {
    setPopped(true);
    const t = setTimeout(() => setPopped(false), Math.max(0, mole.expiresAt - Date.now() - 200));
    return () => clearTimeout(t);
  }, [mole]);

  const ext = ALL_HANDLES.find(h => h.handle === mole.handle.handle)?.ext || "jpg";
  const imgUrl = `/pfps/@${mole.handle.handle}.${ext}`;

  return (
    <div onClick={onHit} style={{
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      background: `${mole.comp.color}22 url(${imgUrl}) center/cover no-repeat`,
      border: `3px solid ${mole.comp.color}`,
      cursor: "pointer",
      position: "relative",
      transform: popped ? "translateY(0) scale(1)" : "translateY(80%) scale(0.6)",
      opacity: popped ? 1 : 0,
      transition: "all 0.18s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: `0 0 16px ${mole.comp.color}60, inset 0 -8px 16px rgba(0,0,0,0.3)`,
    }}>
      <div style={{
        position: "absolute",
        bottom: -8,
        left: "50%",
        transform: "translateX(-50%)",
        background: mole.comp.color,
        color: "#000",
        padding: "3px 10px",
        borderRadius: 6,
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: 1,
        whiteSpace: "nowrap",
        boxShadow: `0 2px 8px rgba(0,0,0,0.4)`,
      }}>
        {mole.comp.short}
      </div>
    </div>
  );
}

// ─── STYLES ─────────────────────────────────────────────────────
const anims = `
@keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.1);opacity:0.7}}
@keyframes pop{0%{transform:scale(0.5)}50%{transform:scale(1.3)}100%{transform:scale(1)}}
@keyframes floatUp{0%{transform:translate(-50%,0) scale(0.8);opacity:0}20%{transform:translate(-50%,-40%) scale(1.2);opacity:1}100%{transform:translate(-50%,-150%) scale(1);opacity:0}}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes threatPulse{0%{transform:scale(1)}40%{transform:scale(1.05);background:rgba(94,228,188,0.08)}100%{transform:scale(1)}}
`;

const S = {
  wrap: { minHeight: "100vh", background: "#050505", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'SF Pro Display','Helvetica Neue',-apple-system,sans-serif", color: "#fff", padding: 24, position: "relative", overflow: "hidden" },
  gridBg: { position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(94,228,188,0.02) 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" },
  glowOrb: { position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(94,228,188,.06) 0%,transparent 60%)", top: "15%", left: "55%", transform: "translate(-50%,-50%)", pointerEvents: "none" },
  mc: { maxWidth: 460, width: "100%", textAlign: "center", position: "relative", zIndex: 1 },
  logoDiamond: { fontSize: 28, color: "#5ee4bc", marginBottom: 16, animation: "bob 3s ease-in-out infinite" },
  title: { fontSize: 48, fontWeight: 800, letterSpacing: 16, margin: 0, color: "#5ee4bc" },
  sub: { fontSize: 13, fontWeight: 300, letterSpacing: 12, color: "rgba(255,255,255,.2)", margin: "4px 0 0" },
  tag: { fontSize: 12, color: "rgba(255,255,255,.15)", marginTop: 20, letterSpacing: 1 },
  pb: { background: "rgba(94,228,188,.08)", color: "#5ee4bc", border: "1px solid rgba(94,228,188,.18)", borderRadius: 10, padding: "13px 36px", fontSize: 13, fontWeight: 700, cursor: "pointer", letterSpacing: 3, display: "inline-flex", alignItems: "center", justifyContent: "center", transition: "all .2s" },
  rb: { marginTop: 32, padding: "16px 20px", background: "rgba(255,255,255,.01)", borderRadius: 14, border: "1px solid rgba(255,255,255,.03)", textAlign: "left" },
  rh: { fontSize: 8, letterSpacing: 3, color: "rgba(255,255,255,.15)", marginBottom: 8, marginTop: 0, textTransform: "uppercase" },
  rt: { fontSize: 12, color: "rgba(255,255,255,.4)", lineHeight: 1.8, margin: 0 },
  compsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginTop: 16 },
  compChip: { padding: "8px 6px", borderRadius: 8, border: "1px solid", background: "rgba(255,255,255,0.02)", display: "flex", flexDirection: "column", alignItems: "center" },
  shareBtn: { display: "block", textAlign: "center", padding: "12px 20px", borderRadius: 10, background: "rgba(29,155,240,0.1)", border: "1px solid rgba(29,155,240,0.2)", color: "#1d9bf0", fontSize: 12, fontWeight: 700, letterSpacing: 1, textDecoration: "none" },
  endGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 18, textAlign: "left" },
  endCell: { background: "rgba(255,255,255,.02)", borderRadius: 12, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 2, border: "1px solid rgba(255,255,255,.04)" },
  endLabel: { fontSize: 8, color: "rgba(255,255,255,.3)", letterSpacing: 2, textTransform: "uppercase" },
  endVal: { fontSize: 22, fontWeight: 800, color: "#fff" },

  gw: { minHeight: "100vh", background: "#050505", fontFamily: "'SF Pro Display','Helvetica Neue',-apple-system,sans-serif", color: "#fff", display: "flex", flexDirection: "column", overflow: "hidden" },
  hud: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,.03)", background: "rgba(5,5,5,.8)", backdropFilter: "blur(16px)", flexShrink: 0, zIndex: 5 },
  hl: { display: "flex", alignItems: "center", gap: 12 },
  hr: { display: "flex", alignItems: "center", gap: 12 },
  hudTimer: { fontSize: 24, fontWeight: 800, letterSpacing: 1, fontVariantNumeric: "tabular-nums" },
  comboBadge: { fontSize: 12, fontWeight: 800, color: "#FFD96A", background: "rgba(255,217,106,0.1)", border: "1px solid rgba(255,217,106,0.3)", borderRadius: 10, padding: "6px 14px", letterSpacing: 1.5, animation: "pop 0.3s ease" },
  scoreDisplay: { display: "flex", flexDirection: "column", alignItems: "flex-end" },
  scoreLabel: { fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: 3 },
  scoreVal: { fontSize: 22, fontWeight: 800, color: "#fff", fontVariantNumeric: "tabular-nums" },

  threatBanner: { padding: "16px 24px", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "center" },
  threatLabel: { fontSize: 9, letterSpacing: 3, color: "rgba(255,69,58,0.8)", fontWeight: 800 },
  threatText: { fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: 1 },
  targetChip: { fontSize: 10, fontWeight: 800, letterSpacing: 1.5, padding: "4px 10px", borderRadius: 6, border: "1px solid", background: "rgba(0,0,0,0.4)" },

  boardWrap: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  hole: { width: "100%", aspectRatio: "1", background: "radial-gradient(circle at 50% 60%, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 60%, transparent 80%)", borderRadius: "50%", position: "relative", overflow: "visible" },
  float: { position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", fontSize: 14, fontWeight: 800, textShadow: "0 0 8px rgba(0,0,0,0.9)", pointerEvents: "none", animation: "floatUp 0.8s ease-out forwards", whiteSpace: "nowrap", zIndex: 10 },
};
