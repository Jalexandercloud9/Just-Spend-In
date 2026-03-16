import { useState, useEffect, useRef } from "react";
const COLORS = {
  coral: "#FF385C", coralDark: "#D93B30",
  dark: "#222222", gray: "#717171", lightGray: "#EBEBEB",
  white: "#FFFFFF", green: "#00A699", greenLight: "#E8F8F7",
  yellow: "#FFB400", blue: "#007A87", bg: "#F7F7F7",
  navy: "#1a1f36",
};
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return isMobile;
};
// ─── Constants ────────────────────────────────────────────────────────────────
const INCOME = 4200, EXPENSES = 3100;
const SAVEABLE = INCOME - EXPENSES;
const SAVINGS_RATE = Math.round((SAVEABLE / INCOME) * 100);
const EMERGENCY_TARGET = EXPENSES * 6;
const EMERGENCY_SAVED = 8200;
const EMERGENCY_MONTHLY = Math.min(Math.round(SAVEABLE * 0.35), EMERGENCY_TARGET - EMERGENCY_SAVED);
const INVESTABLE = SAVEABLE - EMERGENCY_MONTHLY;
const STEP_ORDER = ["overview", "goals", "plan", "invest", "track"];
const STEPS = [
  { id: "overview", label: "Your Money", short: "Money"  },
  { id: "goals",    label: "Your Goals", short: "Goals"  },
  { id: "plan",     label: "Your Plan",  short: "Plan"   },
  { id: "invest",   label: "Invest Now", short: "Invest" },
  { id: "track",    label: "Track",      short: "Track"  },
];
const GOAL_PRESETS = [
  { id: "retirement", label: "Retire comfortably",  defaultTarget: 1000000, defaultYears: 25, color: COLORS.coral  },
  { id: "home",       label: "Buy a home",           defaultTarget: 60000,   defaultYears: 7,  color: "#8B5CF6"     },
  { id: "emergency",  label: "Emergency fund",       defaultTarget: 18600,   defaultYears: 2,  color: COLORS.green  },
  { id: "car",        label: "Buy a car",            defaultTarget: 25000,   defaultYears: 3,  color: COLORS.blue   },
  { id: "education",  label: "Education / degree",   defaultTarget: 40000,   defaultYears: 4,  color: COLORS.yellow },
  { id: "travel",     label: "Dream vacation",       defaultTarget: 8000,    defaultYears: 2,  color: "#EC4899"     },
  { id: "wedding",    label: "Wedding",              defaultTarget: 30000,   defaultYears: 2,  color: "#F43F5E"     },
  { id: "custom",     label: "Something else",       defaultTarget: 10000,   defaultYears: 3,  color: COLORS.gray   },
];
const OTHER_FUNDS = [
  { ticker: "VTSAX", name: "Vanguard Total Stock Market", expenseRatio: 0.04, returns1y: 26.1, returns5y: 15.8, risk: "Moderate", tag: "Best Overall", tagColor: COLORS.green  },
  { ticker: "SWPPX", name: "Schwab S&P 500 Index",        expenseRatio: 0.02, returns1y: 24.8, returns5y: 15.1, risk: "Moderate", tag: "Low Cost",     tagColor: COLORS.yellow },
];
const PORTFOLIO = [
  { ticker: "FZROX", name: "Fidelity ZERO Total Market", value: 14200, gain: 2840, gainPct: 25.0, color: COLORS.coral  },
  { ticker: "VTSAX", name: "Vanguard Total Stock Market", value: 8900,  gain: 1780, gainPct: 24.9, color: COLORS.green  },
  { ticker: "VBTLX", name: "Vanguard Total Bond Market",  value: 3800,  gain: 152,  gainPct: 4.2,  color: COLORS.blue   },
  { ticker: "HYSA",  name: "Marcus HYSA",                 value: 12000, gain: 612,  gainPct: 5.1,  color: COLORS.yellow },
];
const TRANSACTIONS = [
  { date: "Jan 28", desc: "Whole Foods Market", cat: "Food",          amount: -67.42  },
  { date: "Jan 27", desc: "Netflix",            cat: "Entertainment", amount: -15.49  },
  { date: "Jan 26", desc: "Salary Deposit",     cat: "Income",        amount: 4200.00 },
  { date: "Jan 25", desc: "Uber",               cat: "Transport",     amount: -22.10  },
  { date: "Jan 24", desc: "Amazon",             cat: "Shopping",      amount: -89.99  },
];
const CATEGORIES = [
  { name: "Housing",       amount: 1450, color: COLORS.coral,  pct: 42 },
  { name: "Food & Dining", amount: 620,  color: COLORS.green,  pct: 18 },
  { name: "Transport",     amount: 310,  color: COLORS.yellow, pct: 9  },
  { name: "Entertainment", amount: 280,  color: COLORS.blue,   pct: 8  },
  { name: "Shopping",      amount: 390,  color: "#8CE071",     pct: 11 },
  { name: "Other",         amount: 410,  color: "#C13584",     pct: 12 },
];
// ─── Icons ────────────────────────────────────────────────────────────────────
const Ico = ({ size = 20, color, strokeWidth = 1.6, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color || "currentColor"} strokeWidth={strokeWidth}
    strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const IconGrid     = p => <Ico {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></Ico>;
const IconTarget   = p => <Ico {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></Ico>;
const IconBars     = p => <Ico {...p}><line x1="4" y1="20" x2="20" y2="20"/><rect x="4" y="13" width="3.5" height="7" rx="0.5"/><rect x="10.25" y="8" width="3.5" height="12" rx="0.5"/><rect x="16.5" y="4" width="3.5" height="16" rx="0.5"/></Ico>;
const IconTrend    = p => <Ico {...p}><polyline points="3,17 9,11 13,15 21,7"/><polyline points="16,7 21,7 21,12"/></Ico>;
const IconBank     = p => <Ico {...p}><line x1="3" y1="21" x2="21" y2="21"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="5,10 5,21"/><polyline points="19,10 19,21"/><polyline points="9,10 9,21"/><polyline points="15,10 15,21"/><polygon points="12,3 3,10 21,10"/></Ico>;
const IconCheck    = p => <Ico {...p}><polyline points="20,6 9,17 4,12"/></Ico>;
const IconAlert    = p => <Ico {...p}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></Ico>;
const IconUpload   = p => <Ico {...p}><polyline points="16,16 12,12 8,16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39,18.39A5,5,0,0,0,18,9h-1.26A8,8,0,1,0,3,16.3"/></Ico>;
const IconCalendar = p => <Ico {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></Ico>;
const IconArrow    = p => <Ico {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></Ico>;
const IconPencil   = p => <Ico {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></Ico>;
// Goal-specific line icons
const IconRetirement = p => <Ico {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Ico>;
const IconHome       = p => <Ico {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></Ico>;
const IconShield     = p => <Ico {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></Ico>;
const IconCar        = p => <Ico {...p}><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></Ico>;
const IconGradCap    = p => <Ico {...p}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></Ico>;
const IconPlane      = p => <Ico {...p}><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></Ico>;
const IconRings      = p => <Ico {...p}><circle cx="8" cy="12" r="5"/><circle cx="16" cy="12" r="5"/></Ico>;
const IconStar       = p => <Ico {...p}><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></Ico>;
const IconPiggy      = p => <Ico {...p}><path d="M19 11V9a7 7 0 0 0-14 0v2"/><path d="M3 11h18v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7z"/><path d="M12 18v2"/><path d="M8 18v2"/><path d="M16 18v2"/></Ico>;
const IconBuilding   = p => <Ico {...p}><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="7" x2="9" y2="7"/><line x1="15" y1="7" x2="15" y2="7"/><line x1="9" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="15" y2="12"/><line x1="9" y1="17" x2="15" y2="17"/></Ico>;
const GOAL_ICON_MAP = {
  retirement: IconRetirement,
  home:       IconHome,
  emergency:  IconShield,
  car:        IconCar,
  education:  IconGradCap,
  travel:     IconPlane,
  wedding:    IconRings,
  custom:     IconStar,
  saving:     IconPiggy,
  savings:    IconPiggy,
  investment: IconTrend,
  investing:  IconTrend,
  business:   IconBuilding,
};
const GoalIcon = ({ id, size = 24, color }) => {
  const Cmp = GOAL_ICON_MAP[id] || IconStar;
  return <Cmp size={size} color={color} />;
};
const NAV_ICONS = { overview: IconGrid, goals: IconTarget, plan: IconBars, invest: IconTrend, track: IconBank };
// ─── Primitives ───────────────────────────────────────────────────────────────
const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick}
    style={{ background: COLORS.white, borderRadius: 16, padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)", cursor: onClick ? "pointer" : "default", transition: "box-shadow 0.2s, transform 0.18s", ...style }}
    onMouseEnter={e => { if (onClick) { e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}}
    onMouseLeave={e => { if (onClick) { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}}>
    {children}
  </div>
);
const Bar = ({ value, max, color = COLORS.coral, height = 7 }) => (
  <div style={{ background: COLORS.lightGray, borderRadius: 99, height, overflow: "hidden" }}>
    <div style={{ width: `${Math.min(100, (value / max) * 100)}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.8s ease" }} />
  </div>
);
const Pill = ({ children, color = COLORS.coral }) => (
  <span style={{ background: color + "18", color, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 99, letterSpacing: 0.4, whiteSpace: "nowrap", textTransform: "uppercase" }}>{children}</span>
);
const StepLabel = ({ num, label }) => (
  <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.coral, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 6px" }}>
    Step {num} of 5 — {label}
  </p>
);
// ─── Step 1: Overview ─────────────────────────────────────────────────────────
const StepOverview = ({ onNext, isMobile }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <div style={{ background: `linear-gradient(140deg, ${COLORS.navy} 0%, #2d3561 100%)`, borderRadius: 20, padding: isMobile ? "28px 20px" : "36px 32px", color: "white", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: -40, top: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
      <div style={{ position: "relative" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, opacity: 0.5, margin: "0 0 10px", textTransform: "uppercase" }}>Good morning, Alex</p>
        <h1 style={{ fontSize: isMobile ? 26 : 32, fontWeight: 800, fontFamily: "'DM Serif Display', serif", margin: "0 0 8px", lineHeight: 1.2 }}>
          You have <span style={{ color: "#8CE071" }}>${SAVEABLE.toLocaleString()}/mo</span> ready to grow
        </h1>
        <p style={{ fontSize: 13, opacity: 0.65, margin: "0 0 28px", maxWidth: 420, lineHeight: 1.6 }}>
          After expenses, you're saving {SAVINGS_RATE}% of your income. Let's set your goals and build a plan around them.
        </p>
        <button onClick={onNext} style={{ background: COLORS.coral, color: "white", border: "none", borderRadius: 12, padding: "13px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
          Set my goals <IconArrow size={16} color="white" />
        </button>
      </div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
      {[
        { label: "Monthly income",      value: `$${INCOME.toLocaleString()}`,   color: COLORS.dark  },
        { label: "Monthly expenses",    value: `$${EXPENSES.toLocaleString()}`, color: COLORS.dark  },
        { label: "Available to invest", value: `$${SAVEABLE.toLocaleString()}`, color: COLORS.coral },
      ].map(s => (
        <Card key={s.label} style={{ padding: "16px" }}>
          <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: s.color, fontFamily: "'DM Serif Display', serif", lineHeight: 1.1 }}>{s.value}</div>
          <div style={{ fontSize: 11, color: COLORS.gray, marginTop: 3 }}>{s.label}</div>
        </Card>
      ))}
    </div>
    <Card style={{ background: "#FFFBF0", border: `1px solid ${COLORS.yellow}40` }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ marginTop: 1 }}><IconAlert size={17} color={COLORS.yellow} /></div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 700, color: COLORS.dark }}>Building your safety net in parallel</p>
          <p style={{ margin: "0 0 10px", fontSize: 12, color: COLORS.gray, lineHeight: 1.5 }}>
            Emergency fund is ${EMERGENCY_SAVED.toLocaleString()} of ${EMERGENCY_TARGET.toLocaleString()}. Reserving <strong style={{ color: COLORS.dark }}>${EMERGENCY_MONTHLY}/mo</strong> to close this gap while you invest.
          </p>
          <Bar value={EMERGENCY_SAVED} max={EMERGENCY_TARGET} color={COLORS.yellow} height={6} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
            <span style={{ fontSize: 11, color: COLORS.gray }}>${EMERGENCY_SAVED.toLocaleString()} saved</span>
            <span style={{ fontSize: 11, color: COLORS.gray }}>${EMERGENCY_TARGET.toLocaleString()} goal</span>
          </div>
        </div>
      </div>
    </Card>
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: COLORS.dark }}>Where your money goes</h3>
        <span style={{ fontSize: 12, color: COLORS.gray }}>January</span>
      </div>
      {CATEGORIES.map(c => (
        <div key={c.name} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.color }} />
              <span style={{ fontSize: 12, color: COLORS.dark }}>{c.name}</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.dark }}>${c.amount} <span style={{ fontWeight: 400, color: COLORS.gray }}>({c.pct}%)</span></span>
          </div>
          <Bar value={c.pct} max={100} color={c.color} height={5} />
        </div>
      ))}
    </Card>
    <Card>
      <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: COLORS.dark }}>Recent transactions</h3>
      {TRANSACTIONS.map((t, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: i < TRANSACTIONS.length - 1 ? `1px solid ${COLORS.lightGray}` : "none" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.dark, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.desc}</div>
            <div style={{ fontSize: 11, color: COLORS.gray }}>{t.date} · {t.cat}</div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: t.amount > 0 ? COLORS.green : COLORS.dark, flexShrink: 0, marginLeft: 12 }}>
            {t.amount > 0 ? "+" : ""}${Math.abs(t.amount).toFixed(2)}
          </div>
        </div>
      ))}
    </Card>
  </div>
);
// ─── Formatting helpers ───────────────────────────────────────────────────────
const GOAL_COLORS = [COLORS.coral, "#8B5CF6", COLORS.green, COLORS.blue, COLORS.yellow, "#EC4899", "#F43F5E", COLORS.gray];
const formatComma = (raw) => {
  const digits = String(raw).replace(/[^0-9]/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("en-US");
};
const parseComma = (str) => Number(String(str).replace(/,/g, "")) || 0;
const inputStyle = {
  width: "100%", border: `1px solid ${COLORS.lightGray}`, borderRadius: 10,
  padding: "10px 12px", fontSize: 14, outline: "none",
  boxSizing: "border-box", fontFamily: "inherit", color: COLORS.dark, background: COLORS.white,
};
const MoneyInput = ({ value, onChange, placeholder, style = {} }) => (
  <input
    type="text"
    inputMode="numeric"
    value={value ? formatComma(String(value)) : ""}
    placeholder={placeholder || "0"}
    onChange={e => onChange(parseComma(e.target.value))}
    style={{ ...inputStyle, ...style }}
  />
);
// ─── Investment vehicles ──────────────────────────────────────────────────────
const VEHICLES = [
  {
    ticker: "FZROX", name: "Fidelity ZERO Total Market", shortName: "Total Market Index",
    type: "Index Fund", color: COLORS.coral,
    annualReturn: 0.10,
    returns1y: 25.9, returns5y: 15.6, expenseRatio: "0.00%", risk: "Moderate",
    horizonLabel: "Best for 10+ year goals",
    why: "Zero expense ratio. ~10% historical annual return. Market risk is smoothed over a long horizon.",
    minYears: 10,
  },
  {
    ticker: "VBTLX", name: "Vanguard Total Bond Market", shortName: "Bond Market Fund",
    type: "Bond Fund", color: COLORS.yellow,
    annualReturn: 0.045,
    returns1y: 4.2, returns5y: 1.9, expenseRatio: "0.05%", risk: "Low",
    horizonLabel: "Best for 3–9 year goals",
    why: "~4.5% annual return with low volatility. Right for goals 3–9 years away.",
    minYears: 3,
  },
  {
    ticker: "HYSA", name: "Marcus High-Yield Savings", shortName: "High-Yield Savings",
    type: "Savings Account", color: COLORS.green,
    annualReturn: 0.051,
    returns1y: 5.1, returns5y: 4.2, expenseRatio: "0%", risk: "None",
    horizonLabel: "Best for under 3 year goals",
    why: "5.1% APY, FDIC-insured. Fully liquid. Right for goals under 3 years away.",
    minYears: 0,
  },
];
const vehicleForYears = (years) => {
  if (years >= 10) return VEHICLES[0];
  if (years >= 3)  return VEHICLES[1];
  return VEHICLES[2];
};
// ─── Core financial math ──────────────────────────────────────────────────────
const fvAnnuity = (pmt, annualRate, months) => {
  if (annualRate === 0 || months === 0) return pmt * months;
  const r = annualRate / 12;
  return pmt * ((Math.pow(1 + r, months) - 1) / r);
};
const fvLump = (pv, annualRate, months) => {
  if (annualRate === 0 || months === 0) return pv;
  const r = annualRate / 12;
  return pv * Math.pow(1 + r, months);
};
const monthlyNeeded = (target, saved, annualRate, months) => {
  if (months <= 0) return Infinity;
  const remaining = target - fvLump(saved, annualRate, months);
  if (remaining <= 0) return 0;
  if (annualRate === 0) return remaining / months;
  const r = annualRate / 12;
  const factor = (Math.pow(1 + r, months) - 1) / r;
  return remaining / factor;
};
const monthsToTarget = (target, pmt, saved, annualRate) => {
  if (pmt <= 0) return Infinity;
  const maxMonths = 600;
  const check = (m) => fvLump(saved, annualRate, m) + fvAnnuity(pmt, annualRate, m);
  if (check(maxMonths) < target) return Infinity;
  let lo = 1, hi = maxMonths;
  for (let i = 0; i < 50; i++) {
    const mid = Math.floor((lo + hi) / 2);
    if (check(mid) >= target) hi = mid;
    else lo = mid + 1;
  }
  return hi;
};
const MAX_YEARS = 50;
// ─── Plan engine ─────────────────────────────────────────────────────────────
const buildPlan = (goals) => {
  const budget = INVESTABLE;
  const currentYear = new Date().getFullYear();
  const enriched = goals.map(g => {
    const vehicle  = vehicleForYears(g.years);
    const rate     = vehicle.annualReturn;
    const months   = g.years * 12;
    const saved    = g.saved || 0;
    const pmt      = monthlyNeeded(g.target, saved, rate, months);
    const pmtCapped = Math.ceil(pmt);
    return {
      ...g,
      vehicle, rate, months,
      saved,
      monthlyNeeded:    Math.ceil(pmt),
      feasible:         pmt !== Infinity && pmt <= budget,
      targetYear:       currentYear + g.years,
      savedGrowsTo:     Math.round(fvLump(saved, rate, months)),
      totalContributions: pmtCapped * months,
      projectedValue:   Math.round(fvLump(saved, rate, months) + fvAnnuity(pmtCapped, rate, months)),
    };
  });
  const sorted = [...enriched].sort((a, b) => {
    if (a.years !== b.years) return a.years - b.years;
    return a.monthlyNeeded - b.monthlyNeeded;
  });
  const plan     = [];
  let budgetLeft = budget;
  let deferOffset = 0;
  sorted.forEach((g, idx) => {
    if (g.monthlyNeeded <= budgetLeft) {
      plan.push({
        ...g,
        status:    "active",
        allocated: g.monthlyNeeded,
        startIn:   0,
      });
      budgetLeft -= g.monthlyNeeded;
    } else {
      const activeGoals = plan.filter(p => p.status === "active");
      const completingSoon = activeGoals
        .filter(p => p.years < g.years)
        .sort((a, b) => a.years - b.years);
      let freedAt       = null;
      let budgetAfterFree = budgetLeft;
      for (const completing of completingSoon) {
        budgetAfterFree += completing.allocated;
        if (budgetAfterFree >= g.monthlyNeeded) {
          freedAt = completing;
          break;
        }
      }
      if (freedAt) {
        const startDelayYears = freedAt.years;
        const remainingYears  = Math.max(1, g.years - startDelayYears);
        const newVehicle      = vehicleForYears(remainingYears);
        const newRate         = newVehicle.annualReturn;
        const newMonths       = remainingYears * 12;
        const savedThen       = Math.round(fvLump(g.saved || 0, newRate, startDelayYears * 12));
        const newPmt          = monthlyNeeded(g.target, savedThen, newRate, newMonths);
        plan.push({
          ...g,
          status:        "deferred",
          allocated:     Math.ceil(newPmt),
          startIn:       startDelayYears,
          startYear:     currentYear + startDelayYears,
          newYears:      remainingYears,
          newVehicle,
          freedByGoal:   freedAt.label,
          deferReason:   `Budget is tight now. Once your "${freedAt.label}" goal completes in ${freedAt.years} yr${freedAt.years !== 1 ? "s" : ""}, $${formatComma(Math.round(freedAt.allocated))}/mo frees up. Start this then with ${remainingYears} years still to go — you'll still reach your target.`,
        });
      } else {
        let feasibleYears = g.years;
        for (let y = g.years + 1; y <= MAX_YEARS; y++) {
          const v  = vehicleForYears(y);
          const pmt = monthlyNeeded(g.target, g.saved || 0, v.annualReturn, y * 12);
          if (pmt <= budgetLeft && pmt !== Infinity) {
            feasibleYears = y;
            break;
          }
        }
        const newVehicle = vehicleForYears(feasibleYears);
        const newPmt     = monthlyNeeded(g.target, g.saved || 0, newVehicle.annualReturn, feasibleYears * 12);
        const feasible   = newPmt !== Infinity && newPmt <= budgetLeft;
        plan.push({
          ...g,
          status:        feasible ? "adjusted" : "infeasible",
          allocated:     feasible ? Math.ceil(newPmt) : 0,
          suggestedYears: feasibleYears,
          newVehicle:    newVehicle,
          deferReason:   feasible
            ? `Your original ${g.years}-year timeline needs $${formatComma(g.monthlyNeeded)}/mo, which exceeds what's left in your budget. Extending to ${feasibleYears} years brings it down to $${formatComma(Math.ceil(newPmt))}/mo — achievable with compound growth from ${newVehicle.ticker}.`
            : `Even at ${MAX_YEARS} years, this goal needs more than what's left in your budget. Consider reducing the target amount or adding more income.`,
        });
        if (feasible) budgetLeft -= Math.ceil(newPmt);
      }
    }
  });
  return { plan, budgetUsed: budget - budgetLeft, budgetLeft };
};
// ─── Step 2: Goals ────────────────────────────────────────────────────────────
const StepGoals = ({ goals, setGoals, onNext, isMobile }) => {
  const [selected, setSelected]   = useState(new Set());
  const [goalData, setGoalData]   = useState({});
  const togglePreset = (p) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(p.id)) {
        next.delete(p.id);
        setGoalData(d => { const n = { ...d }; delete n[p.id]; return n; });
      } else {
        next.add(p.id);
        if (!goalData[p.id]) {
          setGoalData(d => ({ ...d, [p.id]: { target: p.defaultTarget, years: p.defaultYears, saved: 0 } }));
        }
      }
      return next;
    });
  };
  const setField = (id, field, val) =>
    setGoalData(d => ({ ...d, [id]: { ...(d[id] || {}), [field]: val } }));
  const canContinue = selected.size > 0 &&
    [...selected].every(id => {
      const d = goalData[id];
      return d?.target > 0 && d?.years > 0;
    });
  const handleNext = () => {
    const built = [...selected].map(id => {
      const preset  = GOAL_PRESETS.find(p => p.id === id);
      const d       = goalData[id];
      const vehicle = vehicleForYears(d.years);
      const pmt     = monthlyNeeded(d.target, d.saved || 0, vehicle.annualReturn, d.years * 12);
      return {
        id, label: preset.label, color: preset.color,
        target:  d.target,
        years:   d.years,
        saved:   d.saved || 0,
        monthly: Math.ceil(pmt),
      };
    });
    setGoals(built);
    onNext();
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <StepLabel num={2} label="Your Goals" />
        <h2 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, fontFamily: "'DM Serif Display', serif", margin: "0 0 6px", color: COLORS.dark }}>
          What are you saving for?
        </h2>
        <p style={{ fontSize: 13, color: COLORS.gray, margin: 0, lineHeight: 1.6 }}>
          Select your goals, enter a target amount and timeline. Monthly contributions are calculated using real investment returns — not just division.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 10 }}>
        {GOAL_PRESETS.map(p => {
          const active = selected.has(p.id);
          return (
            <button key={p.id} onClick={() => togglePreset(p)}
              style={{ background: active ? p.color + "12" : COLORS.white, border: `2px solid ${active ? p.color : COLORS.lightGray}`, borderRadius: 14, padding: "14px 12px", cursor: "pointer", textAlign: "left", transition: "all 0.15s", position: "relative", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              {active && (
                <div style={{ position: "absolute", top: 8, right: 8, width: 18, height: 18, borderRadius: "50%", background: p.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <IconCheck size={11} color="white" strokeWidth={2.5} />
                </div>
              )}
              <div style={{ width: 36, height: 36, borderRadius: 10, background: active ? p.color + "20" : COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                <GoalIcon id={p.id} size={18} color={active ? p.color : COLORS.gray} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: active ? p.color : COLORS.dark, lineHeight: 1.3 }}>{p.label}</div>
            </button>
          );
        })}
      </div>
      {selected.size > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.gray, textTransform: "uppercase", letterSpacing: 0.8, margin: 0 }}>
            Set your targets
          </p>
          {[...selected].map(id => {
            const preset   = GOAL_PRESETS.find(p => p.id === id);
            const d        = goalData[id] || {};
            const filled   = d.target > 0 && d.years > 0;
            const vehicle  = filled ? vehicleForYears(d.years) : null;
            const pmt      = filled ? monthlyNeeded(d.target, d.saved || 0, vehicle.annualReturn, d.years * 12) : null;
            const monthly  = filled ? Math.ceil(pmt) : null;
            const impossibly = filled && (pmt === Infinity || pmt > INVESTABLE * 2);
            const projectedVal = filled && monthly !== null
              ? Math.round(fvLump(d.saved || 0, vehicle.annualReturn, d.years * 12) + fvAnnuity(monthly, vehicle.annualReturn, d.years * 12))
              : null;
            const totalContrib = filled && monthly !== null ? monthly * d.years * 12 : null;
            const interestEarned = projectedVal && totalContrib ? Math.round(projectedVal - totalContrib - (d.saved || 0)) : null;
            return (
              <Card key={id} style={{ border: filled ? `1.5px solid ${preset.color}35` : `1px solid ${COLORS.lightGray}`, padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 11, background: preset.color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <GoalIcon id={id} size={19} color={preset.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.dark }}>{preset.label}</div>
                    {filled && vehicle && (
                      <div style={{ fontSize: 11, color: COLORS.gray, marginTop: 1 }}>
                        via {vehicle.ticker} · {(vehicle.annualReturn * 100).toFixed(1)}% avg annual return
                      </div>
                    )}
                    {!filled && (
                      <div style={{ fontSize: 12, color: COLORS.gray, marginTop: 1 }}>Enter amount and timeline below</div>
                    )}
                  </div>
                  <button onClick={() => togglePreset(preset)}
                    style={{ background: "none", border: `1px solid ${COLORS.lightGray}`, borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: COLORS.gray, flexShrink: 0, fontSize: 14 }}>✕</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.gray, display: "block", marginBottom: 5 }}>
                      How much do you need?
                    </label>
                    <MoneyInput
                      value={d.target || ""}
                      onChange={v => setField(id, "target", v)}
                      placeholder={`e.g. ${formatComma(preset.defaultTarget)}`}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.gray, display: "block", marginBottom: 5 }}>
                      In how many years?
                    </label>
                    <input
                      type="number" min="1" max="50"
                      value={d.years || ""}
                      placeholder={`e.g. ${preset.defaultYears}`}
                      onChange={e => setField(id, "years", Math.min(50, Number(e.target.value) || ""))}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.gray, display: "block", marginBottom: 5 }}>
                      Already saved? <span style={{ fontWeight: 400, opacity: 0.7 }}>(optional)</span>
                    </label>
                    <MoneyInput
                      value={d.saved || ""}
                      onChange={v => setField(id, "saved", v)}
                      placeholder="e.g. 5,000"
                    />
                  </div>
                </div>
                {filled && monthly !== null && !impossibly && (
                  <div style={{ marginTop: 12, background: preset.color + "08", borderRadius: 12, padding: "14px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.dark }}>Monthly contribution needed</span>
                      <span style={{ fontSize: 18, fontWeight: 800, color: preset.color, fontFamily: "'DM Serif Display', serif" }}>
                        ${formatComma(monthly)}/mo
                      </span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                      <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: 8, padding: "8px 10px" }}>
                        <div style={{ fontSize: 10, color: COLORS.gray, marginBottom: 2 }}>You contribute</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.dark }}>${formatComma(totalContrib)}</div>
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: 8, padding: "8px 10px" }}>
                        <div style={{ fontSize: 10, color: COLORS.gray, marginBottom: 2 }}>Market earns you</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.green }}>+${formatComma(interestEarned)}</div>
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: 8, padding: "8px 10px" }}>
                        <div style={{ fontSize: 10, color: COLORS.gray, marginBottom: 2 }}>Total by {new Date().getFullYear() + d.years}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: preset.color }}>${formatComma(projectedVal)}</div>
                      </div>
                    </div>
                    {d.saved > 0 && (
                      <div style={{ marginTop: 8, fontSize: 11, color: COLORS.green }}>
                        ✓ Your ${formatComma(d.saved)} head start grows to ~${formatComma(Math.round(fvLump(d.saved, vehicle.annualReturn, d.years * 12)))} by target date
                      </div>
                    )}
                  </div>
                )}
                {filled && impossibly && (
                  <div style={{ marginTop: 12, background: "#FFF1F1", borderRadius: 10, padding: "12px 14px", border: `1px solid ${COLORS.coral}30` }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.coral, marginBottom: 4 }}>⚠ Timeline may be too aggressive</div>
                    <div style={{ fontSize: 12, color: COLORS.gray, lineHeight: 1.5 }}>
                      This goal needs more than your entire investable budget at this timeline. Try increasing the years or reducing the target. The plan step will help you sequence it.
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
      <button onClick={handleNext} disabled={!canContinue}
        style={{ background: canContinue ? COLORS.coral : COLORS.lightGray, color: canContinue ? "white" : COLORS.gray, border: "none", borderRadius: 12, padding: "14px 24px", fontSize: 14, fontWeight: 700, cursor: canContinue ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}>
        {selected.size === 0
          ? "Select at least one goal to continue"
          : !canContinue
            ? "Fill in amount and timeline for each goal"
            : "See my investment plan →"}
      </button>
    </div>
  );
};
// ─── Step 3: Plan ─────────────────────────────────────────────────────────────
const StepPlan = ({ onNext, isMobile, goals, setGoals }) => {
  const { plan, budgetUsed, budgetLeft } = buildPlan(goals);
  const [adjustAccepted, setAdjustAccepted] = useState({});
  const pendingAdjustments = plan.filter(p =>
    (p.status === "adjusted" || p.status === "deferred") && !adjustAccepted[p.id]
  );
  const allReviewed = pendingAdjustments.length === 0;
  const handleAccept = (id) => setAdjustAccepted(prev => ({ ...prev, [id]: true }));
  const handleReject = (id) => {
    setAdjustAccepted(prev => ({ ...prev, [id]: "rejected" }));
  };
  const handleNext = () => {
    const finalGoals = plan
      .filter(p => p.status !== "infeasible")
      .map(p => ({
        ...p,
        years:   p.status === "adjusted" ? p.suggestedYears : p.years,
        vehicle: p.status === "adjusted" ? p.newVehicle : p.vehicle,
        monthly: p.allocated,
      }));
    setGoals(finalGoals);
    onNext();
  };
  const activeGoals = plan.filter(p => p.status === "active" || (p.status === "adjusted" && adjustAccepted[p.id]));
  const byVehicle = VEHICLES
    .map(v => ({
      ...v,
      assignedGoals: activeGoals.filter(g => {
        const effectiveVehicle = g.status === "adjusted" ? g.newVehicle : g.vehicle;
        return effectiveVehicle.ticker === v.ticker;
      }),
    }))
    .filter(v => v.assignedGoals.length > 0);
  const totalActive = activeGoals.reduce((s, g) => s + g.allocated, 0);
  const currentYear = new Date().getFullYear();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <StepLabel num={3} label="Your Plan" />
        <h2 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, fontFamily: "'DM Serif Display', serif", margin: "0 0 6px", color: COLORS.dark }}>
          Your investment strategy
        </h2>
        <p style={{ fontSize: 13, color: COLORS.gray, margin: 0, lineHeight: 1.6 }}>
          Monthly contributions are calculated using real compound returns — not just dividing your target by months. Review any adjustments below.
        </p>
      </div>
      {pendingAdjustments.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <IconAlert size={16} color={COLORS.yellow} />
            <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.dark, margin: 0 }}>
              {pendingAdjustments.length} recommendation{pendingAdjustments.length > 1 ? "s" : ""} to review before your plan is ready
            </p>
          </div>
          {plan.filter(p => (p.status === "adjusted" || p.status === "deferred" || p.status === "infeasible") && !adjustAccepted[p.id]).map(p => {
            const preset = GOAL_PRESETS.find(pr => pr.id === p.id);
            const isDeferred  = p.status === "deferred";
            const isAdjusted  = p.status === "adjusted";
            const isInfeasible = p.status === "infeasible";
            const accentColor = isDeferred ? COLORS.blue : isInfeasible ? COLORS.coral : COLORS.yellow;
            return (
              <Card key={p.id} style={{ border: `1.5px solid ${accentColor}50`, background: accentColor === COLORS.coral ? "#FFF1F1" : "#FFFCF0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 11, background: preset.color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <GoalIcon id={p.id} size={18} color={preset.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.dark }}>{p.label}</div>
                    <div style={{ fontSize: 12, color: COLORS.gray, marginTop: 1 }}>
                      ${formatComma(p.target)} goal · {p.years} yr timeline you set
                    </div>
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 99,
                    background: accentColor + "18", color: accentColor,
                    textTransform: "uppercase", letterSpacing: 0.5, flexShrink: 0,
                  }}>
                    {isDeferred ? "Start later" : isInfeasible ? "Needs attention" : "Timeline adjusted"}
                  </span>
                </div>
                <div style={{ background: accentColor + "12", borderRadius: 10, padding: "12px 14px", marginBottom: isInfeasible ? 0 : 14 }}>
                  <p style={{ margin: 0, fontSize: 12, color: COLORS.dark, lineHeight: 1.6 }}>{p.deferReason}</p>
                </div>
                {!isInfeasible && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                    <div style={{ background: COLORS.bg, borderRadius: 10, padding: "12px 14px" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.gray, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Your original plan</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.dark, marginBottom: 2 }}>
                        ${formatComma(p.monthlyNeeded)}/mo
                      </div>
                      <div style={{ fontSize: 11, color: COLORS.gray }}>
                        {p.years} yrs · via {p.vehicle?.ticker || "—"}<br />
                        Done by {currentYear + p.years}
                      </div>
                      {p.monthlyNeeded > INVESTABLE && (
                        <div style={{ marginTop: 6, fontSize: 11, color: COLORS.coral, fontWeight: 600 }}>
                          ✗ Exceeds budget
                        </div>
                      )}
                    </div>
                    <div style={{ background: COLORS.green + "10", borderRadius: 10, padding: "12px 14px", border: `1px solid ${COLORS.green}30` }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.green, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Our recommendation</div>
                      {isDeferred ? (
                        <>
                          <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.dark, marginBottom: 2 }}>
                            Start in {p.startIn} yr{p.startIn !== 1 ? "s" : ""} · ${formatComma(p.allocated)}/mo
                          </div>
                          <div style={{ fontSize: 11, color: COLORS.gray }}>
                            {p.newYears} yrs remaining · via {p.newVehicle?.ticker || "—"}<br />
                            Done by {p.startYear + (p.newYears || 0)}
                          </div>
                        </>
                      ) : (
                        <>
                          <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.dark, marginBottom: 2 }}>
                            ${formatComma(p.allocated)}/mo
                          </div>
                          <div style={{ fontSize: 11, color: COLORS.gray }}>
                            {p.suggestedYears} yrs · via {p.newVehicle?.ticker || "—"}<br />
                            Done by {currentYear + (p.suggestedYears || 0)}
                          </div>
                        </>
                      )}
                      <div style={{ marginTop: 6, fontSize: 11, color: COLORS.green, fontWeight: 600 }}>
                        ✓ Fits your budget
                      </div>
                    </div>
                  </div>
                )}
                {!isInfeasible && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => handleAccept(p.id)}
                      style={{ flex: 1, background: COLORS.green, color: "white", border: "none", borderRadius: 10, padding: "11px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                      ✓ Accept recommendation
                    </button>
                    <button onClick={() => handleReject(p.id)}
                      style={{ flex: 1, background: COLORS.bg, color: COLORS.dark, border: `1px solid ${COLORS.lightGray}`, borderRadius: 10, padding: "11px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      Keep original
                    </button>
                  </div>
                )}
                {isInfeasible && (
                  <div style={{ marginTop: 14 }}>
                    <button onClick={() => handleReject(p.id)}
                      style={{ background: COLORS.bg, color: COLORS.gray, border: `1px solid ${COLORS.lightGray}`, borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      I understand — skip this goal for now
                    </button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
      {Object.keys(adjustAccepted).length > 0 && pendingAdjustments.length === 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <IconCheck size={16} color={COLORS.green} />
          <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.green, margin: 0 }}>All recommendations reviewed ✓</p>
        </div>
      )}
      {allReviewed && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Card style={{ background: totalActive <= INVESTABLE ? COLORS.greenLight : "#FFF1F1", border: `1px solid ${totalActive <= INVESTABLE ? COLORS.green + "40" : COLORS.coral + "50"}` }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              {totalActive <= INVESTABLE
                ? <IconCheck size={17} color={COLORS.green} />
                : <IconAlert size={17} color={COLORS.coral} />}
              <div style={{ flex: 1 }}>
                <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 700, color: COLORS.dark }}>
                  {totalActive <= INVESTABLE ? `Monthly budget is balanced ✓` : "Monthly total exceeds budget"}
                </p>
                <p style={{ margin: "0 0 10px", fontSize: 12, color: COLORS.gray, lineHeight: 1.5 }}>
                  Active goals use <strong style={{ color: COLORS.dark }}>${formatComma(totalActive)}/mo</strong> of your{" "}
                  <strong style={{ color: COLORS.dark }}>${formatComma(INVESTABLE)}/mo</strong> investable budget.
                  {budgetLeft > 0 && <span style={{ color: COLORS.green }}> ${formatComma(budgetLeft)} unallocated — goes to the highest-return vehicle.</span>}
                </p>
                <Bar value={Math.min(totalActive, INVESTABLE)} max={INVESTABLE} color={totalActive <= INVESTABLE ? COLORS.green : COLORS.coral} height={7} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                  <span style={{ fontSize: 11, color: COLORS.gray }}>Goals: ${formatComma(totalActive)}/mo</span>
                  <span style={{ fontSize: 11, color: COLORS.gray }}>Budget: ${formatComma(INVESTABLE)}/mo</span>
                </div>
              </div>
            </div>
          </Card>
          <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.gray, textTransform: "uppercase", letterSpacing: 0.8, margin: "4px 0 -2px" }}>
            Step 1 — Reserve first (auto)
          </p>
          <Card style={{ border: `1.5px solid ${COLORS.yellow}45` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: COLORS.yellow + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <IconShield size={20} color={COLORS.yellow} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.dark }}>Emergency Fund → Marcus HYSA</div>
                    <div style={{ fontSize: 12, color: COLORS.gray, marginTop: 2 }}>Reserved before any goal investing · {Math.ceil((EMERGENCY_TARGET - EMERGENCY_SAVED) / EMERGENCY_MONTHLY)} months to complete</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.yellow, fontFamily: "'DM Serif Display', serif" }}>${formatComma(EMERGENCY_MONTHLY)}/mo</div>
                  </div>
                </div>
                <div style={{ marginTop: 10 }}>
                  <Bar value={EMERGENCY_SAVED} max={EMERGENCY_TARGET} color={COLORS.yellow} height={5} />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                    <span style={{ fontSize: 10, color: COLORS.gray }}>${formatComma(EMERGENCY_SAVED)} saved</span>
                    <span style={{ fontSize: 10, color: COLORS.gray }}>${formatComma(EMERGENCY_TARGET)} target</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.gray, textTransform: "uppercase", letterSpacing: 0.8, margin: "4px 0 -2px" }}>
            Step 2 — Invest ${formatComma(INVESTABLE)}/mo across your goals
          </p>
          {byVehicle.map(v => (
            <Card key={v.ticker} style={{ border: `1.5px solid ${v.color}35` }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: v.color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: v.color }}>{v.ticker.slice(0, 4)}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.dark }}>{v.ticker} — {v.shortName}</div>
                      <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                        <Pill color={v.color}>{v.horizonLabel}</Pill>
                        <span style={{ fontSize: 11, color: COLORS.gray }}>{(v.annualReturn * 100).toFixed(1)}% avg return</span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: v.color, fontFamily: "'DM Serif Display', serif" }}>
                        ${formatComma(v.assignedGoals.reduce((s, g) => s + g.allocated, 0))}/mo
                      </div>
                    </div>
                  </div>
                  <p style={{ margin: "8px 0 0", fontSize: 12, color: COLORS.gray, lineHeight: 1.5 }}>{v.why}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 20, paddingBottom: 14, borderBottom: `1px solid ${COLORS.lightGray}`, flexWrap: "wrap" }}>
                <div><div style={{ fontSize: 10, color: COLORS.gray }}>1yr return</div><div style={{ fontSize: 13, fontWeight: 700, color: COLORS.dark }}>{v.returns1y}%</div></div>
                <div><div style={{ fontSize: 10, color: COLORS.gray }}>5yr return</div><div style={{ fontSize: 13, fontWeight: 700, color: COLORS.dark }}>{v.returns5y}%</div></div>
                <div><div style={{ fontSize: 10, color: COLORS.gray }}>Expense ratio</div><div style={{ fontSize: 13, fontWeight: 700, color: v.expenseRatio === "0.00%" ? COLORS.green : COLORS.dark }}>{v.expenseRatio}</div></div>
                <div><div style={{ fontSize: 10, color: COLORS.gray }}>Risk</div><div style={{ fontSize: 13, fontWeight: 700, color: COLORS.dark }}>{v.risk}</div></div>
              </div>
              <div style={{ marginTop: 12 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: COLORS.gray, textTransform: "uppercase", letterSpacing: 0.6, margin: "0 0 8px" }}>
                  Funding {v.assignedGoals.length} goal{v.assignedGoals.length > 1 ? "s" : ""}
                </p>
                {v.assignedGoals.map((g, gi) => {
                  const effectiveYears = g.status === "adjusted" ? g.suggestedYears : g.years;
                  const intEarned = Math.max(0, Math.round(
                    fvLump(g.saved || 0, v.annualReturn, effectiveYears * 12) +
                    fvAnnuity(g.allocated, v.annualReturn, effectiveYears * 12) -
                    g.allocated * effectiveYears * 12 - (g.saved || 0)
                  ));
                  return (
                    <div key={g.id} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "12px 14px", borderRadius: 12,
                      background: g.color + "0c",
                      marginBottom: gi < v.assignedGoals.length - 1 ? 8 : 0,
                    }}>
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: g.color + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <GoalIcon id={g.id} size={16} color={g.color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.dark }}>{g.label}</div>
                        <div style={{ fontSize: 11, color: COLORS.gray }}>
                          ${formatComma(g.target)} goal · {effectiveYears} yrs · done {currentYear + effectiveYears}
                        </div>
                        {intEarned > 0 && (
                          <div style={{ fontSize: 11, color: COLORS.green, marginTop: 1 }}>
                            Market earns +${formatComma(intEarned)} on top of contributions
                          </div>
                        )}
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: g.color }}>${formatComma(g.allocated)}/mo</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
          {plan.filter(p => p.status === "deferred").length > 0 && (
            <>
              <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.gray, textTransform: "uppercase", letterSpacing: 0.8, margin: "4px 0 -2px" }}>
                Step 3 — Start these later (budget frees up)
              </p>
              {plan.filter(p => p.status === "deferred").map(p => {
                const preset = GOAL_PRESETS.find(pr => pr.id === p.id);
                return (
                  <Card key={p.id} style={{ border: `1.5px solid ${COLORS.blue}30`, background: COLORS.blue + "05" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 11, background: preset.color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <GoalIcon id={p.id} size={18} color={preset.color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.dark }}>{p.label}</div>
                        <div style={{ fontSize: 12, color: COLORS.gray, marginTop: 1 }}>
                          Start in {p.startIn} yr{p.startIn !== 1 ? "s" : ""} ({p.startYear}) · ${formatComma(p.allocated)}/mo for {p.newYears} yrs · via {p.newVehicle?.ticker}
                        </div>
                        <div style={{ fontSize: 11, color: COLORS.blue, marginTop: 2 }}>
                          Budget frees up once "{p.freedByGoal}" completes
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.blue }}>From {p.startYear}</div>
                        <div style={{ fontSize: 10, color: COLORS.gray }}>${formatComma(p.allocated)}/mo</div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </>
          )}
          <Card style={{ background: COLORS.navy, border: "none" }}>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, margin: "0 0 14px" }}>Monthly breakdown</p>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : `repeat(${1 + byVehicle.length}, 1fr)`, gap: 14 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.yellow, fontFamily: "'DM Serif Display', serif" }}>${formatComma(EMERGENCY_MONTHLY)}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>Emergency fund</div>
              </div>
              {byVehicle.map(v => (
                <div key={v.ticker}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: v.color, fontFamily: "'DM Serif Display', serif" }}>
                    ${formatComma(v.assignedGoals.reduce((s, g) => s + g.allocated, 0))}
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>Into {v.ticker}</div>
                </div>
              ))}
            </div>
          </Card>
          <button onClick={handleNext} style={{ background: COLORS.coral, color: "white", border: "none", borderRadius: 12, padding: "14px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            Set up these investments <IconArrow size={16} color="white" />
          </button>
        </div>
      )}
      {!allReviewed && (
        <p style={{ textAlign: "center", fontSize: 12, color: COLORS.gray, margin: "4px 0 0" }}>
          Review the {pendingAdjustments.length} recommendation{pendingAdjustments.length > 1 ? "s" : ""} above to continue
        </p>
      )}
    </div>
  );
};
// ─── Step 4: Invest ───────────────────────────────────────────────────────────
const StepInvest = ({ onNext, isMobile, goals }) => {
  const goalVehicles = goals.map(g => {
    const effectiveYears = g.years || 10;
    const resolvedVehicle = (g.vehicle && VEHICLES.find(v => v.ticker === g.vehicle.ticker)) || vehicleForYears(effectiveYears);
    const resolvedMonthly = g.monthly || g.allocated || Math.ceil(monthlyNeeded(g.target, g.saved || 0, resolvedVehicle.annualReturn, effectiveYears * 12));
    return { ...g, vehicle: resolvedVehicle, monthly: resolvedMonthly };
  });
  const usedTickers = new Set(goalVehicles.map(g => g.vehicle.ticker));
  const recommended = VEHICLES.filter(v => usedTickers.has(v.ticker)).map(v => ({
    ...v,
    assignedGoals: goalVehicles.filter(g => g.vehicle.ticker === v.ticker),
    totalMonthly:  goalVehicles.filter(g => g.vehicle.ticker === v.ticker).reduce((s, g) => s + g.monthly, 0),
    isRecommended: true,
  }));
  const [selected, setSelected] = useState(new Set(recommended.map(v => v.ticker)));
  const toggle = ticker => setSelected(s => { const n = new Set(s); n.has(ticker) ? n.delete(ticker) : n.add(ticker); return n; });
  const altFunds = OTHER_FUNDS.map(f => ({ ...f, isRecommended: false, why: "Alternative — similar market exposure.", color: f.tagColor }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingBottom: selected.size > 0 ? 80 : 0 }}>
      <div>
        <StepLabel num={4} label="Invest Now" />
        <h2 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, fontFamily: "'DM Serif Display', serif", margin: "0 0 6px", color: COLORS.dark }}>Confirm your investments</h2>
        <p style={{ fontSize: 13, color: COLORS.gray, margin: 0, lineHeight: 1.6 }}>These are pre-selected based on your goals and timelines. Deselect or swap if you prefer something different.</p>
      </div>
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.gray, textTransform: "uppercase", letterSpacing: 0.8, margin: "0 0 10px" }}>Recommended for your goals</p>
        {recommended.map(v => {
          const sel = selected.has(v.ticker);
          return (
            <Card key={v.ticker} style={{ marginBottom: 10, border: `2px solid ${sel ? v.color : COLORS.lightGray}` }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <button onClick={() => toggle(v.ticker)}
                  style={{ width: 24, height: 24, borderRadius: 7, border: `2px solid ${sel ? v.color : COLORS.lightGray}`, background: sel ? v.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, marginTop: 2, transition: "all 0.15s" }}>
                  {sel && <IconCheck size={13} color="white" strokeWidth={2.5} />}
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                    <div>
                      <div style={{ display: "flex", gap: 7, alignItems: "center", flexWrap: "wrap" }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: COLORS.dark }}>{v.ticker}</span>
                        <Pill color={v.color}>{v.horizonLabel}</Pill>
                      </div>
                      <div style={{ fontSize: 11, color: COLORS.gray, marginTop: 2 }}>{v.name} · {v.type}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: v.color, fontFamily: "'DM Serif Display', serif" }}>${formatComma(v.totalMonthly)}/mo</div>
                      <div style={{ fontSize: 10, color: COLORS.gray }}>total</div>
                    </div>
                  </div>
                  <p style={{ margin: "6px 0 10px", fontSize: 12, color: COLORS.gray, lineHeight: 1.5 }}>{v.why}</p>
                  <div style={{ background: COLORS.bg, borderRadius: 10, padding: "10px 12px" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: COLORS.gray, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 8px" }}>Funding</p>
                    {v.assignedGoals.map((g, gi) => (
                      <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: gi < v.assignedGoals.length - 1 ? 6 : 0 }}>
                        <div style={{ width: 24, height: 24, borderRadius: 7, background: g.color + "20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <GoalIcon id={g.id} size={12} color={g.color} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: 12, color: COLORS.dark }}>{g.label}</span>
                          <div style={{ fontSize: 10, color: COLORS.gray }}>{g.years} yr · done {new Date().getFullYear() + (g.years || 0)}</div>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: g.color }}>${formatComma(g.monthly)}/mo</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 12 }}>
                    <div><div style={{ fontSize: 10, color: COLORS.gray }}>1yr return</div><div style={{ fontSize: 13, fontWeight: 700, color: COLORS.green }}>+{v.returns1y}%</div></div>
                    <div><div style={{ fontSize: 10, color: COLORS.gray }}>5yr return</div><div style={{ fontSize: 13, fontWeight: 700, color: COLORS.dark }}>{v.returns5y}%</div></div>
                    <div><div style={{ fontSize: 10, color: COLORS.gray }}>Expense ratio</div><div style={{ fontSize: 13, fontWeight: 700, color: v.expenseRatio === "0.00%" ? COLORS.green : COLORS.dark }}>{v.expenseRatio}</div></div>
                    <div><div style={{ fontSize: 10, color: COLORS.gray }}>Risk</div><div style={{ fontSize: 13, fontWeight: 700, color: COLORS.dark }}>{v.risk}</div></div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.gray, textTransform: "uppercase", letterSpacing: 0.8, margin: "0 0 10px" }}>Alternative options</p>
        {altFunds.map(f => {
          const sel = selected.has(f.ticker);
          return (
            <Card key={f.ticker} style={{ marginBottom: 10, border: `2px solid ${sel ? f.color : "transparent"}`, background: COLORS.bg, padding: "14px 16px" }} onClick={() => toggle(f.ticker)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 3 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.dark }}>{f.ticker}</span>
                    <Pill color={f.tagColor}>{f.tag}</Pill>
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.gray }}>{f.name} · {f.expenseRatio}% ER · +{f.returns1y}% 1yr</div>
                </div>
                <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${sel ? f.color : COLORS.lightGray}`, background: sel ? f.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {sel && <IconCheck size={12} color="white" strokeWidth={2.5} />}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      {selected.size > 0 && (
        <div style={{ position: "fixed", bottom: isMobile ? 68 : 20, left: isMobile ? 0 : "auto", right: isMobile ? 0 : 36, zIndex: 100, padding: isMobile ? "0 16px" : 0 }}>
          <div style={{ background: COLORS.navy, borderRadius: 14, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }}>
            <div>
              <div style={{ color: "white", fontSize: 14, fontWeight: 700 }}>{selected.size} investment{selected.size > 1 ? "s" : ""} selected</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>Tap to add to your portfolio</div>
            </div>
            <button onClick={onNext} style={{ background: COLORS.coral, color: "white", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
              Add to portfolio <IconArrow size={14} color="white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
// ─── Step 5: Track ────────────────────────────────────────────────────────────
const StepTrack = ({ isMobile, goals }) => {
  const [alloc, setAlloc] = useState({ FZROX: 50, VTSAX: 30, VBTLX: 20 });
  const total      = Object.values(alloc).reduce((s, v) => s + v, 0);
  const totalValue = PORTFOLIO.reduce((s, p) => s + p.value, 0);
  const totalGain  = PORTFOLIO.reduce((s, p) => s + p.gain,  0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <StepLabel num={5} label="Track & Rebalance" />
        <h2 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, fontFamily: "'DM Serif Display', serif", margin: "0 0 6px", color: COLORS.dark }}>Your portfolio is growing</h2>
        <p style={{ fontSize: 13, color: COLORS.gray, margin: 0, lineHeight: 1.6 }}>Track your holdings, monitor goal progress, and rebalance when needed.</p>
      </div>
      <div style={{ background: `linear-gradient(140deg, ${COLORS.navy} 0%, #2d3561 100%)`, borderRadius: 20, padding: isMobile ? "22px 18px" : "28px 26px", color: "white" }}>
        <p style={{ fontSize: 11, opacity: 0.45, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 0.8 }}>Total portfolio value</p>
        <div style={{ fontSize: isMobile ? 32 : 42, fontWeight: 800, fontFamily: "'DM Serif Display', serif", margin: "0 0 4px" }}>${totalValue.toLocaleString()}</div>
        <div style={{ fontSize: 13, color: "#8CE071", margin: "0 0 22px" }}>↑ +${totalGain.toLocaleString()} all-time (+{((totalGain / (totalValue - totalGain)) * 100).toFixed(1)}%)</div>
        <div style={{ display: "flex", height: 8, borderRadius: 99, overflow: "hidden", gap: 2, marginBottom: 10 }}>
          {PORTFOLIO.map(p => <div key={p.ticker} style={{ flex: p.value, background: p.color }} />)}
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {PORTFOLIO.map(p => (
            <div key={p.ticker} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }} />
              <span style={{ fontSize: 11, opacity: 0.6 }}>{p.ticker}</span>
            </div>
          ))}
        </div>
      </div>
      {goals.length > 0 && (
        <Card>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 14px", color: COLORS.dark }}>Goal progress</h3>
          {goals.map((g, i) => {
            const gVehicle = (g.vehicle && VEHICLES.find(v => v.ticker === g.vehicle.ticker)) || vehicleForYears(g.years || 10);
            const monthly = g.monthly || g.allocated || Math.ceil(monthlyNeeded(g.target, g.saved || 0, gVehicle.annualReturn, (g.years || 10) * 12));
            const demoMonths = 8;
            const simSaved = Math.round(fvAnnuity(monthly, gVehicle.annualReturn, demoMonths) + fvLump(g.saved || 0, gVehicle.annualReturn, demoMonths));
            const pct = Math.min(100, Math.round((simSaved / g.target) * 100));
            const vehicle = (g.vehicle && VEHICLES.find(v => v.ticker === g.vehicle.ticker)) || vehicleForYears(g.years || 10);
            return (
              <div key={g.id} style={{ marginBottom: i < goals.length - 1 ? 16 : 0, paddingBottom: i < goals.length - 1 ? 16 : 0, borderBottom: i < goals.length - 1 ? `1px solid ${COLORS.lightGray}` : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: g.color + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <GoalIcon id={g.id} size={17} color={g.color} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.dark }}>{g.label}</div>
                      <div style={{ fontSize: 11, color: COLORS.gray }}>
                        ${formatComma(monthly)}/mo via {vehicle.ticker} · target ${formatComma(g.target)} · done {new Date().getFullYear() + Number(g.years)}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: g.color }}>{pct}%</div>
                    <div style={{ fontSize: 10, color: COLORS.gray }}>${formatComma(simSaved)} saved</div>
                  </div>
                </div>
                <Bar value={simSaved} max={g.target} color={g.color} height={6} />
              </div>
            );
          })}
        </Card>
      )}
      <Card>
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 14px", color: COLORS.dark }}>Holdings</h3>
        {PORTFOLIO.map((p, i) => (
          <div key={p.ticker} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < PORTFOLIO.length - 1 ? `1px solid ${COLORS.lightGray}` : "none" }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: p.color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: p.color }}>{p.ticker.slice(0, 3)}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.dark, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
              <div style={{ fontSize: 11, color: COLORS.gray }}>{p.ticker}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.dark }}>${p.value.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: COLORS.green }}>+${p.gain.toLocaleString()} ({p.gainPct}%)</div>
            </div>
          </div>
        ))}
      </Card>
      <Card>
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 4px", color: COLORS.dark }}>Rebalance allocation</h3>
        <p style={{ fontSize: 12, color: COLORS.gray, margin: "0 0 16px" }}>Adjust your monthly contribution split. Must total 100%.</p>
        {Object.entries(alloc).map(([k, v]) => (
          <div key={k} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.dark }}>{k}</span>
              <input type="number" value={v} onChange={e => setAlloc(a => ({ ...a, [k]: parseInt(e.target.value) || 0 }))}
                style={{ width: 56, border: `1px solid ${COLORS.lightGray}`, borderRadius: 8, padding: "4px 8px", fontSize: 13, fontWeight: 700, textAlign: "right", outline: "none" }} />
            </div>
            <Bar value={v} max={100} color={COLORS.coral} height={6} />
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: `1px solid ${COLORS.lightGray}` }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>Total: <span style={{ color: total === 100 ? COLORS.green : COLORS.coral }}>{total}%</span></span>
          <button style={{ background: total === 100 ? COLORS.green : COLORS.lightGray, color: total === 100 ? "white" : COLORS.gray, border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: total === 100 ? "pointer" : "default" }}>
            {total === 100 ? "Apply ✓" : `Adjust (${total}%)`}
          </button>
        </div>
      </Card>
      <Card style={{ background: "#FFFBF0", border: `1px solid ${COLORS.yellow}40` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <IconCalendar size={16} color={COLORS.yellow} />
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: COLORS.dark }}>When to take action</h3>
        </div>
        {[
          { freq: "Monthly",   task: "Review spending vs budget · auto-invest surplus",     urgent: true  },
          { freq: "Quarterly", task: "Rebalance portfolio to target allocations",           urgent: false },
          { freq: "Annually",  task: "Review fund performance, expense ratios, and goals", urgent: false },
        ].map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: i < 2 ? 12 : 0, paddingBottom: i < 2 ? 12 : 0, borderBottom: i < 2 ? `1px solid ${COLORS.lightGray}` : "none" }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: m.urgent ? COLORS.coral : COLORS.gray, background: m.urgent ? COLORS.coral + "12" : COLORS.lightGray, padding: "3px 8px", borderRadius: 99, whiteSpace: "nowrap", marginTop: 1 }}>{m.freq}</span>
            <span style={{ fontSize: 12, color: COLORS.gray, lineHeight: 1.5 }}>{m.task}</span>
          </div>
        ))}
      </Card>
    </div>
  );
};
// ─── Upload Modal ─────────────────────────────────────────────────────────────
const UploadModal = ({ onClose, isMobile }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <style>{`@keyframes su{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div onClick={e => e.stopPropagation()} style={{ background: COLORS.white, borderRadius: isMobile ? "20px 20px 0 0" : 22, padding: "28px 24px", width: isMobile ? "100%" : 440, maxWidth: "100%", boxSizing: "border-box", animation: "su 0.22s ease" }}>
        {done ? (
          <div style={{ textAlign: "center", padding: "28px 0" }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, fontFamily: "'DM Serif Display', serif", margin: "0 0 8px" }}>Statement Imported!</h3>
            <p style={{ fontSize: 13, color: COLORS.gray, margin: "0 0 24px" }}>23 transactions imported · Analysis updated.</p>
            <button onClick={onClose} style={{ background: COLORS.coral, color: "white", border: "none", borderRadius: 12, padding: "13px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer", width: "100%" }}>Done</button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 800, margin: "0 0 3px", fontFamily: "'DM Serif Display', serif" }}>Upload Statement</h3>
                <p style={{ fontSize: 12, color: COLORS.gray, margin: 0 }}>PDF, CSV, OFX, QFX, XLSX</p>
              </div>
              <button onClick={onClose} style={{ background: COLORS.bg, border: "none", borderRadius: 99, width: 34, height: 34, cursor: "pointer", color: COLORS.gray, fontSize: 18 }}>✕</button>
            </div>
            <label onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); setFile(e.dataTransfer.files[0]); }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: `2px dashed ${file ? COLORS.green : COLORS.lightGray}`, borderRadius: 14, padding: "32px 20px", cursor: "pointer", background: file ? COLORS.green + "08" : COLORS.bg, marginBottom: 18 }}>
              <input type="file" accept=".pdf,.csv,.ofx,.qfx,.xlsx" style={{ display: "none" }} onChange={e => setFile(e.target.files[0])} />
              <IconUpload size={32} color={file ? COLORS.green : COLORS.gray} />
              <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.dark, marginTop: 10 }}>{file ? file.name : (isMobile ? "Tap to upload" : "Drop file here")}</div>
              <div style={{ fontSize: 12, color: COLORS.gray, marginTop: 4 }}>or <span style={{ color: COLORS.coral, fontWeight: 600 }}>browse files</span></div>
            </label>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { if (!file) return; setUploading(true); setTimeout(() => { setUploading(false); setDone(true); }, 2000); }} disabled={!file || uploading}
                style={{ flex: 1, background: file ? COLORS.coral : COLORS.lightGray, color: file ? "white" : COLORS.gray, border: "none", borderRadius: 12, padding: "13px", fontSize: 14, fontWeight: 700, cursor: file ? "pointer" : "default" }}>
                {uploading ? "Parsing…" : "Upload & Analyze"}
              </button>
              <button onClick={onClose} style={{ background: "none", border: `1px solid ${COLORS.lightGray}`, borderRadius: 12, padding: "13px 16px", fontSize: 14, color: COLORS.gray, cursor: "pointer" }}>Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
// ─── App Shell ────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState("overview");
  const [goals, setGoals] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const isMobile = useIsMobile();
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);
  const goNext = () => {
    const i = STEP_ORDER.indexOf(step);
    if (i < STEP_ORDER.length - 1) setStep(STEP_ORDER[i + 1]);
  };
  const stepViews = {
    overview: <StepOverview onNext={goNext} isMobile={isMobile} />,
    goals:    <StepGoals goals={goals} setGoals={setGoals} onNext={goNext} isMobile={isMobile} />,
    plan:     <StepPlan   goals={goals} setGoals={setGoals} onNext={goNext} isMobile={isMobile} />,
    invest:   <StepInvest goals={goals} onNext={goNext} isMobile={isMobile} />,
    track:    <StepTrack  goals={goals} isMobile={isMobile} />,
  };
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: COLORS.bg, minHeight: "100vh", display: "flex", flexDirection: isMobile ? "column" : "row" }}>
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} isMobile={isMobile} />}
      {!isMobile && (
        <div style={{ width: 230, background: COLORS.white, borderRight: `1px solid ${COLORS.lightGray}`, padding: "28px 0", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", boxSizing: "border-box", flexShrink: 0 }}>
          <div style={{ padding: "0 20px 28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, background: COLORS.coral, borderRadius: 9 }} />
              <span style={{ fontSize: 16, fontWeight: 800, color: COLORS.dark, fontFamily: "'DM Serif Display', serif" }}>Just-Spend-In</span>
            </div>
          </div>
          <nav style={{ flex: 1, padding: "0 12px" }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: COLORS.gray, textTransform: "uppercase", letterSpacing: 1, padding: "0 8px", margin: "0 0 8px" }}>Your Journey</p>
            {STEPS.map((s, i) => {
              const NavIcon = NAV_ICONS[s.id];
              const active  = step === s.id;
              const done    = STEP_ORDER.indexOf(step) > i;
              return (
                <button key={s.id} onClick={() => setStep(s.id)}
                  style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "11px 12px", marginBottom: 2, borderRadius: 12, border: "none", background: active ? COLORS.coral + "12" : "transparent", color: active ? COLORS.coral : done ? COLORS.green : COLORS.gray, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: active ? 700 : 500, cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                  {done
                    ? <div style={{ width: 18, height: 18, borderRadius: "50%", background: COLORS.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><IconCheck size={11} color="white" strokeWidth={2.5} /></div>
                    : <NavIcon size={18} color={active ? COLORS.coral : COLORS.gray} />
                  }
                  <span>{s.label}</span>
                  {active && <div style={{ marginLeft: "auto", width: 4, height: 4, borderRadius: "50%", background: COLORS.coral }} />}
                </button>
              );
            })}
          </nav>
          <div style={{ padding: "0 12px 12px" }}>
            <button onClick={() => setShowUpload(true)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "11px 12px", borderRadius: 12, border: `1px dashed ${COLORS.lightGray}`, background: "transparent", color: COLORS.gray, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, cursor: "pointer" }}>
              <IconUpload size={16} color={COLORS.gray} />Upload Statement
            </button>
          </div>
          <div style={{ padding: "14px 20px", borderTop: `1px solid ${COLORS.lightGray}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #FF385C, #FFB400)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>A</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.dark }}>Alex Chen</div>
                <div style={{ fontSize: 11, color: COLORS.gray }}>Premium Plan</div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isMobile && (
        <div style={{ background: COLORS.white, borderBottom: `1px solid ${COLORS.lightGray}`, padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 26, height: 26, background: COLORS.coral, borderRadius: 7 }} />
            <span style={{ fontSize: 15, fontWeight: 800, color: COLORS.dark, fontFamily: "'DM Serif Display', serif" }}>Just-Spend-In</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => setShowUpload(true)} style={{ background: COLORS.bg, border: `1px solid ${COLORS.lightGray}`, borderRadius: 8, padding: "7px", display: "flex", cursor: "pointer" }}><IconUpload size={17} color={COLORS.dark} /></button>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, #FF385C, #FFB400)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 12 }}>A</div>
          </div>
        </div>
      )}
      <div style={{ flex: 1, padding: isMobile ? "16px 16px 90px" : "32px 40px", maxWidth: isMobile ? "100%" : 820, overflowY: isMobile ? "unset" : "auto", boxSizing: "border-box" }}>
        {!isMobile && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
            <p style={{ fontSize: 11, color: COLORS.gray, margin: 0 }}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowUpload(true)} style={{ background: COLORS.white, border: `1px solid ${COLORS.lightGray}`, borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600, color: COLORS.dark, cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}><IconUpload size={14} color={COLORS.dark} />Upload Statement</button>
              <button style={{ background: COLORS.coral, border: "none", borderRadius: 10, padding: "8px 18px", fontSize: 13, fontWeight: 700, color: "white", cursor: "pointer" }}>+ Deposit</button>
            </div>
          </div>
        )}
        {isMobile && (
          <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
            {STEPS.map((s, i) => {
              const active = step === s.id;
              const done   = STEP_ORDER.indexOf(step) > i;
              return <button key={s.id} onClick={() => setStep(s.id)} style={{ flex: 1, height: 4, borderRadius: 99, background: done ? COLORS.green : active ? COLORS.coral : COLORS.lightGray, border: "none", cursor: "pointer", padding: 0, transition: "background 0.3s" }} />;
            })}
          </div>
        )}
        {stepViews[step]}
      </div>
      {isMobile && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: COLORS.white, borderTop: `1px solid ${COLORS.lightGray}`, display: "flex", zIndex: 50, paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
          {STEPS.map((s, i) => {
            const NavIcon = NAV_ICONS[s.id];
            const active  = step === s.id;
            const done    = STEP_ORDER.indexOf(step) > i;
            return (
              <button key={s.id} onClick={() => setStep(s.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px 2px 8px", border: "none", background: "transparent", color: active ? COLORS.coral : done ? COLORS.green : COLORS.gray, cursor: "pointer", gap: 4, fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "color 0.15s" }}>
                {done
                  ? <div style={{ width: 22, height: 22, borderRadius: "50%", background: COLORS.green, display: "flex", alignItems: "center", justifyContent: "center" }}><IconCheck size={12} color="white" strokeWidth={2.5} /></div>
                  : <NavIcon size={22} color={active ? COLORS.coral : COLORS.gray} />
                }
                <span style={{ fontSize: 9, fontWeight: active ? 700 : 500 }}>{s.short}</span>
                {active && <div style={{ width: 4, height: 4, borderRadius: "50%", background: COLORS.coral }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
