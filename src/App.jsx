import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search, ShoppingCart, Menu, X, Star, Heart, Package, TrendingUp, User,
  Sparkles, Sun, Moon, ChevronRight, ChevronLeft, Filter, Plus, Trash2,
  Edit2, LogOut, CheckCircle, Clock, Truck, ArrowRight, Send,
  Building2, MapPin, Mail, Phone, BarChart3, Layers, Ruler, Palette,
  Quote, Loader2, ArrowUpRight, Mic, MicOff
} from "lucide-react";
 
/* =========================================================================
   DATA
========================================================================= */
const CATEGORIES = ["Cotton", "Linen", "Silk", "Denim", "Wool", "Synthetic", "Blends"];
const COLORS_LIST = ["Ivory", "Indigo", "Charcoal", "Rust", "Olive", "Blush", "Slate", "Natural"];
 
const SEED_SUPPLIERS = [
  { id: "sup-1", password: "demo1234", email: "hello@kanpurcottonmills.com", company: "Kanpur Cotton Mills", contact: "Rekha Sharma", phone: "+91 98200 11223", location: "Kanpur, India", description: "Third-generation cotton weavers specializing in combed and organic cotton greige and finished fabric, 40+ years exporting to Europe and the US.", rating: 4.8, reviews: 214 },
  { id: "sup-2", password: "demo1234", email: "sales@luccasilkhouse.it", company: "Lucca Silk House", contact: "Marco Bellandi", phone: "+39 0583 55 1190", location: "Lucca, Italy", description: "Heritage silk mill in Tuscany producing mulberry silk charmeuse, dupioni, and jacquard for haute couture and interiors.", rating: 4.9, reviews: 132 },
  { id: "sup-3", password: "demo1234", email: "orders@daedenim.co.kr", company: "Daegu Denim Co.", contact: "Min-jun Park", phone: "+82 53 741 2200", location: "Daegu, South Korea", description: "Innovative denim mill known for selvedge and stretch denim, low-water dyeing process, and rapid small-batch turnaround.", rating: 4.6, reviews: 98 },
  { id: "sup-4", password: "demo1234", email: "contact@yorkshirewoolens.co.uk", company: "Yorkshire Woolens", contact: "Elizabeth Hart", phone: "+44 113 245 6710", location: "Leeds, United Kingdom", description: "Traditional worsted and woolen mill producing suiting, tweed, and flannel using Merino and British fleece.", rating: 4.7, reviews: 76 },
  { id: "sup-5", password: "demo1234", email: "sales@guangzhoutextek.cn", company: "Guangzhou TexTek", contact: "Wei Zhang", phone: "+86 20 3822 1190", location: "Guangzhou, China", description: "High-volume performance and synthetic fabric manufacturer: ripstop, technical knits, recycled polyester blends.", rating: 4.4, reviews: 301 },
];
 
const SEED_PRODUCTS = [
  { id: "p1", name: "Combed Organic Cotton Poplin", supplierId: "sup-1", category: "Cotton", material: "100% Organic Cotton", color: "Ivory", gsm: 120, price: 4.2, moq: 200, stock: 3200, swatch: "#EFE7D6", description: "A crisp, tightly woven poplin milled from GOTS-certified organic combed cotton. Smooth hand-feel, excellent for shirting and light dresses. Pre-shrunk and colorfast.", care: "Machine wash cold, tumble dry low, warm iron if needed." },
  { id: "p2", name: "Heavyweight Canvas Duck", supplierId: "sup-1", category: "Cotton", material: "100% Cotton Canvas", color: "Natural", gsm: 340, price: 6.8, moq: 150, stock: 1450, swatch: "#D8C9A3", description: "Rugged 12oz cotton duck canvas built for bags, workwear, and upholstery. Tight plain weave gives it abrasion resistance and structure.", care: "Spot clean or dry clean recommended; machine wash cold on gentle if needed." },
  { id: "p3", name: "Mulberry Silk Charmeuse", supplierId: "sup-2", category: "Silk", material: "100% Mulberry Silk", color: "Blush", gsm: 19, price: 22.5, moq: 50, stock: 640, swatch: "#EBD3CE", description: "Liquid-drape charmeuse with a lustrous face and matte back, woven from grade 6A mulberry silk. Ideal for eveningwear and linings.", care: "Dry clean only. Store away from direct sunlight." },
  { id: "p4", name: "Silk Dupioni Jacquard", supplierId: "sup-2", category: "Silk", material: "100% Silk Dupioni", color: "Indigo", gsm: 90, price: 28.0, moq: 30, stock: 210, swatch: "#3B4A66", description: "Textured slub silk with a woven jacquard motif, crisp hand and natural sheen. A favorite for bridal and structured eveningwear.", care: "Dry clean only." },
  { id: "p5", name: "Selvedge Raw Denim 14oz", supplierId: "sup-3", category: "Denim", material: "100% Cotton Selvedge", color: "Indigo", gsm: 400, price: 9.4, moq: 100, stock: 980, swatch: "#28374F", description: "Shuttle-loomed selvedge denim, rope-dyed indigo warp with natural weft. Ages beautifully with authentic fading characteristics.", care: "Wash inside-out cold, hang dry. Avoid washing for first 6 months for best fade." },
  { id: "p6", name: "Comfort Stretch Denim 10oz", supplierId: "sup-3", category: "Denim", material: "98% Cotton 2% Elastane", color: "Slate", gsm: 290, price: 5.6, moq: 200, stock: 2100, swatch: "#5C6675", description: "Low-water dyed stretch denim with 20% recovery elastane, engineered for fitted silhouettes without losing structure.", care: "Machine wash cold, tumble dry low." },
  { id: "p7", name: "Merino Flannel Suiting", supplierId: "sup-4", category: "Wool", material: "100% Merino Wool", color: "Charcoal", gsm: 260, price: 18.9, moq: 40, stock: 340, swatch: "#3E3B38", description: "Soft-brushed Merino flannel with a fine twill weave, milled for tailoring. Breathable warmth with a refined drape.", care: "Dry clean only." },
  { id: "p8", name: "Donegal Tweed", supplierId: "sup-4", category: "Wool", material: "80% Wool 20% Nylon", color: "Olive", gsm: 380, price: 15.2, moq: 30, stock: 260, swatch: "#5B5A3E", description: "Fleck-dyed tweed with characteristic colored neps, woven for outerwear and structured jackets. Excellent durability.", care: "Dry clean recommended." },
  { id: "p9", name: "Ripstop Technical Nylon", supplierId: "sup-5", category: "Synthetic", material: "100% Nylon Ripstop", color: "Slate", gsm: 70, price: 3.1, moq: 300, stock: 5200, swatch: "#8B96A3", description: "Grid-reinforced ripstop with a DWR finish, engineered for outerwear, packs, and technical gear. Tear-resistant and lightweight.", care: "Machine wash cold, do not tumble dry — air dry recommended." },
  { id: "p10", name: "Recycled Performance Interlock", supplierId: "sup-5", category: "Synthetic", material: "85% rPET 15% Spandex", color: "Charcoal", gsm: 210, price: 4.9, moq: 250, stock: 3100, swatch: "#33363B", description: "Four-way stretch interlock knit made from recycled ocean-bound plastic, moisture-wicking finish. Built for activewear.", care: "Machine wash cold, tumble dry low, no fabric softener." },
  { id: "p11", name: "European Linen Sheeting", supplierId: "sup-1", category: "Linen", material: "100% European Flax Linen", color: "Natural", gsm: 175, price: 8.7, moq: 100, stock: 890, swatch: "#DCCFAE", description: "Stonewashed flax linen with a relaxed hand and natural texture, sourced from certified European flax. Breathable and durable.", care: "Machine wash cold, line dry, iron warm while slightly damp." },
  { id: "p12", name: "Linen-Cotton Blend Voile", supplierId: "sup-1", category: "Blends", material: "55% Linen 45% Cotton", color: "Blush", gsm: 105, price: 5.9, moq: 150, stock: 1320, swatch: "#E9D7CF", description: "Airy voile blending linen's texture with cotton's softness, semi-sheer for warm-weather garments and layering.", care: "Machine wash cold, tumble dry low." },
  { id: "p13", name: "Wool-Silk Suiting Blend", supplierId: "sup-4", category: "Blends", material: "70% Wool 30% Silk", color: "Rust", gsm: 240, price: 24.5, moq: 25, stock: 150, swatch: "#8C4A34", description: "Fine worsted wool blended with silk for added luster and drape, a premium suiting cloth with subtle sheen.", care: "Dry clean only." },
  { id: "p14", name: "Egyptian Cotton Sateen", supplierId: "sup-1", category: "Cotton", material: "100% Egyptian Cotton", color: "Ivory", gsm: 145, price: 7.3, moq: 100, stock: 1780, swatch: "#F0E9DC", description: "Long-staple Egyptian cotton woven in a sateen weave for a subtle sheen and silky hand. Popular for premium shirting and bedding.", care: "Machine wash cold, tumble dry low, warm iron." },
  { id: "p15", name: "Brushed Cotton Twill", supplierId: "sup-1", category: "Cotton", material: "100% Brushed Cotton", color: "Slate", gsm: 210, price: 5.4, moq: 150, stock: 2050, swatch: "#8E97A2", description: "Napped cotton twill with a soft, warm hand from brushing on both faces. Reliable for workwear and casual trousers.", care: "Machine wash cold, tumble dry low." },
  { id: "p16", name: "Jersey Interlock Cotton", supplierId: "sup-1", category: "Cotton", material: "95% Cotton 5% Elastane", color: "Charcoal", gsm: 180, price: 4.6, moq: 200, stock: 2600, swatch: "#3A3733", description: "Smooth interlock knit with light stretch recovery, milled for t-shirts and loungewear. Doesn't curl at cut edges.", care: "Machine wash cold, tumble dry low." },
  { id: "p17", name: "Silk-Cotton Voile", supplierId: "sup-2", category: "Silk", material: "60% Silk 40% Cotton", color: "Natural", gsm: 65, price: 16.8, moq: 40, stock: 380, swatch: "#E7DFC9", description: "Featherweight voile blending silk's luster with cotton's crispness. Semi-sheer, ideal for layered summer garments.", care: "Hand wash cold or dry clean." },
  { id: "p18", name: "Silk Georgette", supplierId: "sup-2", category: "Silk", material: "100% Silk Georgette", color: "Charcoal", gsm: 45, price: 19.5, moq: 40, stock: 290, swatch: "#413E3C", description: "Crinkled, matte-finish silk with a soft drape and slight opacity. A staple for eveningwear and flowing silhouettes.", care: "Dry clean only." },
  { id: "p19", name: "Stretch Selvedge Denim 11oz", supplierId: "sup-3", category: "Denim", material: "97% Cotton 3% Elastane", color: "Indigo", gsm: 320, price: 7.9, moq: 150, stock: 1400, swatch: "#2E3F5C", description: "Selvedge-loomed denim with just enough stretch for tailored fits while keeping an authentic woven texture.", care: "Wash inside-out cold, hang dry." },
  { id: "p20", name: "Acid Wash Denim", supplierId: "sup-3", category: "Denim", material: "100% Cotton Denim", color: "Slate", gsm: 300, price: 6.5, moq: 120, stock: 860, swatch: "#7C8494", description: "Pre-washed denim with a mottled, high-contrast finish achieved through a low-impact acid wash process.", care: "Machine wash cold, separately, tumble dry low." },
  { id: "p21", name: "Cashmere-Wool Suiting", supplierId: "sup-4", category: "Wool", material: "85% Wool 15% Cashmere", color: "Charcoal", gsm: 280, price: 29.5, moq: 20, stock: 110, swatch: "#37342F", description: "Luxurious worsted suiting cloth softened with cashmere fiber, milled for a refined drape and exceptional handle.", care: "Dry clean only." },
  { id: "p22", name: "Melton Wool Coating", supplierId: "sup-4", category: "Wool", material: "90% Wool 10% Nylon", color: "Rust", gsm: 410, price: 21.4, moq: 20, stock: 95, swatch: "#7A3F2C", description: "Dense, felted melton with a smooth face and excellent wind resistance, built for structured outerwear.", care: "Dry clean only." },
  { id: "p23", name: "Recycled Polyester Taffeta", supplierId: "sup-5", category: "Synthetic", material: "100% Recycled Polyester", color: "Slate", gsm: 55, price: 2.6, moq: 400, stock: 6100, swatch: "#9AA3AD", description: "Crisp, lightweight taffeta with a subtle sheen, woven from recycled PET. Common for linings and packable outerwear.", care: "Machine wash cold, hang dry." },
  { id: "p24", name: "Waterproof Softshell", supplierId: "sup-5", category: "Synthetic", material: "92% Polyester 8% Spandex", color: "Charcoal", gsm: 280, price: 6.9, moq: 200, stock: 1850, swatch: "#2B2E33", description: "Bonded three-layer softshell with a DWR face and fleece backing, engineered for weatherproof outerwear.", care: "Machine wash cold, do not tumble dry." },
  { id: "p25", name: "Linen Canvas", supplierId: "sup-1", category: "Linen", material: "100% Linen", color: "Olive", gsm: 260, price: 11.2, moq: 60, stock: 420, swatch: "#6B6E4E", description: "Heavyweight linen canvas with a substantial hand, suited to structured bags, upholstery, and workwear.", care: "Machine wash cold, line dry." },
  { id: "p26", name: "Bamboo-Cotton Jersey", supplierId: "sup-1", category: "Blends", material: "60% Bamboo Viscose 40% Cotton", color: "Blush", gsm: 165, price: 6.3, moq: 120, stock: 1550, swatch: "#EFDCD6", description: "Soft, breathable jersey blending bamboo viscose's silkiness with cotton's durability. Popular for basics and baby wear.", care: "Machine wash cold, tumble dry low." },
];
 
const TESTIMONIALS = [
  { name: "Priya Anand", role: "Sourcing Lead, Ari & Co.", quote: "We cut our fabric sourcing time from three weeks to four days. The filters alone are worth it.", rating: 5 },
  { name: "Tomás Vidal", role: "Founder, Studio Vidal", quote: "Found a silk supplier we never would have discovered locally. Ordering was refreshingly simple.", rating: 5 },
  { name: "Hana Kobayashi", role: "Production Manager, Loom&Co", quote: "The AI assistant explained GSM and weave differences better than most of our vendors do.", rating: 4 },
];
 
function uid(prefix) { return prefix + "-" + Math.random().toString(36).slice(2, 10); }
function currency(n) { return "$" + Number(n).toFixed(2); }
function initials(str) { return (str || "?").trim()[0]?.toUpperCase() || "?"; }
 
// Wraps every window.storage call so persistence can NEVER crash the app.
// Accessing a method on `window.storage` throws synchronously if the API is
// unavailable — a plain `.catch()` on the result doesn't protect against that,
// since the throw happens before a promise even exists. This does.
async function safeStorage(op, ...args) {
  try {
    if (typeof window === "undefined" || !window.storage || typeof window.storage[op] !== "function") return null;
    return await window.storage[op](...args);
  } catch (e) {
    return null;
  }
}
 
/* =========================================================================
   MAIN APP
========================================================================= */
export default function TextileMarketplace() {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [orders, setOrders] = useState([]);
 
  const [session, setSession] = useState(null);
  const [view, setView] = useState("landing");
  const [dark, setDark] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [toast, setToast] = useState(null);
 
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ category: "", color: "", supplier: "", maxPrice: 30, maxGsm: 420 });
  const [visibleCount, setVisibleCount] = useState(12);
  const [activeProductId, setActiveProductId] = useState(null);
  const [compareIds, setCompareIds] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
 
  const [cart, setCart] = useState([]);
  const [lastOrderId, setLastOrderId] = useState(null);
 
  const [wishlist, setWishlist] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
 
  const [authMode, setAuthMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", company: "", phone: "", location: "", description: "" });
  const [authError, setAuthError] = useState("");
  const [resetSent, setResetSent] = useState(false);
 
  const [editingProduct, setEditingProduct] = useState(null);
  const [invForm, setInvForm] = useState(null);
 
  const [checkoutForm, setCheckoutForm] = useState({ name: "", address: "", city: "", country: "", notes: "" });
  const [buyerTab, setBuyerTab] = useState("orders");
  const [supplierTab, setSupplierTab] = useState("overview");
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
 
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsgs, setChatMsgs] = useState([
    { role: "assistant", text: "Hi, I'm Warp — your textile sourcing assistant. Ask me to recommend a fabric, compare two, explain a weave, or find something for a specific use case. You can also tap the mic and talk to me.", productIds: [] }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
 
  /* ---------------- persistence ---------------- */
  useEffect(() => {
    (async () => {
      try {
        const market = await safeStorage("get", "market-data", true);
        if (market && market.value) {
          const v = JSON.parse(market.value);
          setProducts(v.products || SEED_PRODUCTS);
          setSuppliers(v.suppliers || SEED_SUPPLIERS);
          setBuyers(v.buyers || []);
          setOrders(v.orders || []);
        } else {
          setProducts(SEED_PRODUCTS);
          setSuppliers(SEED_SUPPLIERS);
          await safeStorage("set", "market-data", JSON.stringify({ products: SEED_PRODUCTS, suppliers: SEED_SUPPLIERS, buyers: [], orders: [] }), true);
        }
      } catch (e) { setProducts(SEED_PRODUCTS); setSuppliers(SEED_SUPPLIERS); }
      try {
        const sess = await safeStorage("get", "session", false);
        if (sess && sess.value) setSession(JSON.parse(sess.value));
      } catch (e) {}
      try {
        const extras = await safeStorage("get", "buyer-extras", false);
        if (extras && extras.value) {
          const v = JSON.parse(extras.value);
          setWishlist(v.wishlist || []);
          setRecentlyViewed(v.recentlyViewed || []);
          setCart(v.cart || []);
        }
      } catch (e) {}
      try {
        const pref = await safeStorage("get", "prefs", false);
        if (pref && pref.value) setDark(JSON.parse(pref.value).dark || false);
      } catch (e) {}
      setDataLoaded(true);
    })();
  }, []);
 
  const persistMarket = useCallback((next) => {
    safeStorage("set", "market-data", JSON.stringify(next), true);
  }, []);
  useEffect(() => { if (dataLoaded) persistMarket({ products, suppliers, buyers, orders }); }, [products, suppliers, buyers, orders, dataLoaded, persistMarket]);
  useEffect(() => { if (dataLoaded) safeStorage("set", "buyer-extras", JSON.stringify({ wishlist, recentlyViewed, cart }), false); }, [wishlist, recentlyViewed, cart, dataLoaded]);
  useEffect(() => { if (session) safeStorage("set", "session", JSON.stringify(session), false); }, [session]);
  useEffect(() => { if (dataLoaded) safeStorage("set", "prefs", JSON.stringify({ dark }), false); }, [dark, dataLoaded]);
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 2600); return () => clearTimeout(t); } }, [toast]);
  useEffect(() => { setVisibleCount(12); }, [search, filters]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMsgs, chatOpen]);
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-US";
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setChatInput(transcript);
      setListening(false);
      sendChat(transcript);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
  }, []);
 
  function showToast(msg) { setToast(msg); }
 
  /* ---------------- theme (CSS variables, not Tailwind arbitrary classes) ---------------- */
  const T = dark ? {
    bg: "#0F1319", surface: "#171C25", card: "#171C25", cardHover: "#1D2330",
    border: "#262D3B", text: "#EDE8DC", textMute: "#93998F".replace("#93998F", "#9AA0AE"),
    ink: "#EDE8DC", inkBg: "#EDE8DC", rust: "#DE7A55", rustDeep: "#B5563C",
    gold: "#D9AC55", navBg: "rgba(15,19,25,0.85)", chipBg: "#1D2330", shadow: "0 12px 32px rgba(0,0,0,0.45)"
  } : {
    bg: "#F4EEE0", surface: "#FFFFFF", card: "#FFFFFF", cardHover: "#FBF7EC",
    border: "#E6D9BB", text: "#211B14", textMute: "#78715F",
    ink: "#211B14", inkBg: "#1C2739", rust: "#B5563C", rustDeep: "#96442E",
    gold: "#B8863A", navBg: "rgba(244,238,224,0.85)", chipBg: "#F4EEE0", shadow: "0 12px 32px rgba(90,70,40,0.12)"
  };
 
  /* ---------------- derived ---------------- */
  const supplierById = (id) => suppliers.find((s) => s.id === id);
  const productById = (id) => products.find((p) => p.id === id);
  const filteredProducts = products.filter((p) => {
    if (search && !(p.name.toLowerCase().includes(search.toLowerCase()) || p.material.toLowerCase().includes(search.toLowerCase()))) return false;
    if (filters.category && p.category !== filters.category) return false;
    if (filters.color && p.color !== filters.color) return false;
    if (filters.supplier && p.supplierId !== filters.supplier) return false;
    if (p.price > filters.maxPrice) return false;
    if (p.gsm > filters.maxGsm) return false;
    return true;
  });
  const cartLines = cart.map((c) => ({ ...c, product: productById(c.productId) })).filter((c) => c.product);
  const cartTotal = cartLines.reduce((sum, c) => sum + c.product.price * c.qty, 0);
  const cartCount = cartLines.reduce((sum, c) => sum + c.qty, 0);
  const currentBuyer = session?.type === "buyer" ? buyers.find((b) => b.id === session.id) : null;
  const currentSupplier = session?.type === "supplier" ? suppliers.find((s) => s.id === session.id) : null;
  const supplierProducts = currentSupplier ? products.filter((p) => p.supplierId === currentSupplier.id) : [];
  const supplierOrders = currentSupplier ? orders.filter((o) => o.items.some((it) => productById(it.productId)?.supplierId === currentSupplier.id)) : [];
  const buyerOrders = currentBuyer ? orders.filter((o) => o.buyerId === currentBuyer.id) : [];
 
  /* ---------------- actions ---------------- */
  function goto(v) { setView(v); setNavOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function openProduct(id) {
    setActiveProductId(id);
    setRecentlyViewed((rv) => [id, ...rv.filter((x) => x !== id)].slice(0, 8));
    goto("product");
  }
  function addToCart(productId, qty = 1) {
    const prod = productById(productId);
    if (prod?.inStock === false) { showToast("That fabric is currently out of stock"); return; }
    setCart((c) => {
      const existing = c.find((x) => x.productId === productId);
      if (existing) return c.map((x) => (x.productId === productId ? { ...x, qty: x.qty + qty } : x));
      return [...c, { productId, qty }];
    });
    showToast("Added to cart");
  }
  function updateCartQty(productId, qty) {
    if (qty <= 0) { setCart((c) => c.filter((x) => x.productId !== productId)); return; }
    setCart((c) => c.map((x) => (x.productId === productId ? { ...x, qty } : x)));
  }
  function toggleWishlist(id) {
    setWishlist((w) => {
      const has = w.includes(id);
      showToast(has ? "Removed from wishlist" : "Saved to wishlist");
      return has ? w.filter((x) => x !== id) : [...w, id];
    });
  }
  function toggleCompare(id) {
    setCompareIds((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length >= 3 ? c : [...c, id]));
  }
  function resetAuthForm() { setForm({ name: "", email: "", password: "", company: "", phone: "", location: "", description: "" }); setAuthError(""); setResetSent(false); }
 
  function handleBuyerSignup(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setAuthError("Please fill in all required fields."); return; }
    if (buyers.some((b) => b.email.toLowerCase() === form.email.toLowerCase())) { setAuthError("An account with that email already exists."); return; }
    const newBuyer = { id: uid("buy"), name: form.name, email: form.email, password: form.password };
    setBuyers((b) => [...b, newBuyer]);
    setSession({ type: "buyer", id: newBuyer.id, name: newBuyer.name });
    resetAuthForm(); goto("buyer-onboarding"); showToast(`Welcome, ${newBuyer.name}`);
  }
  function handleBuyerLogin(e) {
    e.preventDefault();
    const b = buyers.find((x) => x.email.toLowerCase() === form.email.toLowerCase() && x.password === form.password);
    if (!b) { setAuthError("Incorrect email or password."); return; }
    setSession({ type: "buyer", id: b.id, name: b.name });
    resetAuthForm(); goto("buyer-dashboard"); showToast(`Welcome back, ${b.name}`);
  }
  function handleSupplierSignup(e) {
    e.preventDefault();
    if (!form.company || !form.email || !form.password || !form.name) { setAuthError("Please fill in all required fields."); return; }
    if (suppliers.some((s) => s.email.toLowerCase() === form.email.toLowerCase())) { setAuthError("An account with that email already exists."); return; }
    const newSupplier = { id: uid("sup"), email: form.email, password: form.password, company: form.company, contact: form.name, phone: form.phone, location: form.location, description: form.description || "New supplier on the marketplace.", rating: 0, reviews: 0 };
    setSuppliers((s) => [...s, newSupplier]);
    setSession({ type: "supplier", id: newSupplier.id, name: newSupplier.company });
    resetAuthForm(); goto("supplier-onboarding"); showToast(`Welcome, ${newSupplier.company}`);
  }
  function handleSupplierLogin(e) {
    e.preventDefault();
    const s = suppliers.find((x) => x.email.toLowerCase() === form.email.toLowerCase() && x.password === form.password);
    if (!s) { setAuthError("Incorrect email or password."); return; }
    setSession({ type: "supplier", id: s.id, name: s.company });
    resetAuthForm(); goto("supplier-dashboard"); showToast(`Welcome back, ${s.company}`);
  }
  function handleForgot(e) { e.preventDefault(); setResetSent(true); }
  function logout() { setSession(null); safeStorage("delete", "session", false); goto("landing"); }
  async function resetDemoData() {
    await safeStorage("delete", "market-data", true);
    await safeStorage("delete", "session", false);
    await safeStorage("delete", "buyer-extras", false);
    setProducts(SEED_PRODUCTS);
    setSuppliers(SEED_SUPPLIERS);
    setBuyers([]);
    setOrders([]);
    setSession(null);
    setCart([]);
    setWishlist([]);
    setRecentlyViewed([]);
    await safeStorage("set", "market-data", JSON.stringify({ products: SEED_PRODUCTS, suppliers: SEED_SUPPLIERS, buyers: [], orders: [] }), true);
    showToast("Demo data reset");
    goto("landing");
  }
 
  function placeOrder(shipping) {
    if (cartLines.length === 0) return;
    const order = {
      id: uid("ord"), buyerId: currentBuyer.id, buyerName: currentBuyer.name,
      items: cartLines.map((c) => ({ productId: c.productId, qty: c.qty, price: c.product.price, name: c.product.name })),
      total: cartTotal, status: "Pending", shipping, createdAt: new Date().toISOString(),
      timeline: [{ status: "Pending", at: new Date().toISOString() }],
    };
    setOrders((o) => [order, ...o]);
    setCart([]);
    setLastOrderId(order.id);
    goto("confirmation");
  }
  function updateOrderStatus(orderId, status) {
    setOrders((os) => os.map((o) => (o.id === orderId ? { ...o, status, timeline: [...o.timeline, { status, at: new Date().toISOString() }] } : o)));
  }
  function startNewProduct() {
    setEditingProduct("new");
    setInvForm({ name: "", category: "Cotton", material: "", color: "Ivory", gsm: 150, price: 5, moq: 50, stock: 500, swatch: "#D8C9A3", description: "", care: "", image: null, inStock: true });
  }
  function startEditProduct(p) { setEditingProduct(p.id); setInvForm({ inStock: true, ...p }); }
  function saveProduct(e) {
    e.preventDefault();
    if (!invForm.name || !invForm.material) return;
    if (editingProduct === "new") {
      const newP = { ...invForm, id: uid("p"), supplierId: currentSupplier.id, gsm: Number(invForm.gsm), price: Number(invForm.price), moq: Number(invForm.moq), stock: Number(invForm.stock) };
      setProducts((ps) => [...ps, newP]);
      showToast("Fabric added");
    } else {
      setProducts((ps) => ps.map((p) => (p.id === editingProduct ? { ...invForm, gsm: Number(invForm.gsm), price: Number(invForm.price), moq: Number(invForm.moq), stock: Number(invForm.stock) } : p)));
      showToast("Fabric updated");
    }
    setEditingProduct(null); setInvForm(null);
  }
  function deleteProduct(id) { setProducts((ps) => ps.filter((p) => p.id !== id)); showToast("Fabric removed"); }
  function toggleStock(p) {
    setProducts((ps) => ps.map((x) => (x.id === p.id ? { ...x, inStock: x.inStock === false, stock: x.inStock === false ? Math.max(x.stock, x.moq) : 0 } : x)));
    showToast(p.inStock === false ? "Marked in stock" : "Marked out of stock");
  }
  function submitReview(productId) {
    if (!currentBuyer || !reviewForm.comment.trim()) return;
    setProducts((ps) => ps.map((p) => (p.id === productId ? { ...p, reviews: [...(p.reviews || []), { buyerName: currentBuyer.name, rating: reviewForm.rating, comment: reviewForm.comment.trim() }] } : p)));
    setReviewForm({ rating: 5, comment: "" });
    showToast("Review posted");
  }
 
 /* ---------------- AI assistant ---------------- */
async function sendChat(customText) {
  const text = (customText ?? chatInput).trim();
 
  if (!text || chatLoading) return;
 
  // Show user's message
  setChatMsgs((m) => [
    ...m,
    {
      role: "user",
      text,
      productIds: [],
    },
  ]);
 
  setChatInput("");
  setChatLoading(true);
 
  try {
const API_URL = "http://localhost:3001";
  const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: text,
      }),
    });
 
    const result = await response.json();
 
    console.log("Backend Response:", result);
 
    if (!response.ok) {
      throw new Error(result.error || "Server Error");
    }
 
    setChatMsgs((m) => [
      ...m,
      {
        role: "assistant",
        text: result.reply,
        productIds: result.recommended_product_ids || [],
      },
    ]);
 
  } catch (e) {
    console.error(e);
 
    setChatMsgs((m) => [
      ...m,
      {
        role: "assistant",
        text: "I'm having trouble connecting right now. Please try again.",
        productIds: [],
      },
    ]);
  } finally {
    setChatLoading(false);
  }
}
  /* =======================================================================
     SHARED PIECES  (called as plain functions — never as <Tag/> — so inputs
     never lose focus and internal hooks are never conditionally invoked)
  ======================================================================= */
 
  function Swatch(color, extra, image) {
    if (image) {
      // Fills whatever box it's placed in (width/height: 100%) so the SAME
      // component works correctly at every size it's used at — 152px cards,
      // 400px product-detail hero, 56px cart thumbnails, etc. — without
      // ever hardcoding a size here. object-fit: cover keeps the photo
      // undistorted no matter its original aspect ratio.
      return (
        <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", borderRadius: 6, ...extra }}>
          <img
            src={image}
            alt=""
            style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
          />
        </div>
      );
    }
    return (
      <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", borderRadius: 6, ...extra }}>
        <div style={{ position: "absolute", inset: 0, background: color }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.14, backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,0.55) 0px, transparent 1px, transparent 3px)" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.10, backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0px, transparent 1px, transparent 3px)" }} />
      </div>
    );
  }
 
  function Stars(rating, size) {
    const s = size || 13;
    return (
      <span style={{ display: "inline-flex", gap: 2, alignItems: "center" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} size={s} style={{ fill: i <= Math.round(rating) ? T.gold : "transparent", color: i <= Math.round(rating) ? T.gold : T.border }} />
        ))}
      </span>
    );
  }
 
  function Logo() {
    return (
      <div className="wf-row" style={{ gap: 8, cursor: "pointer" }} onClick={() => goto("landing")}>
        <div style={{ width: 32, height: 32, borderRadius: 7, background: T.rust, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Layers size={16} color="#fff" />
        </div>
        <span className="wf-display" style={{ fontSize: 20, color: T.text }}>Warp&amp;Weft</span>
      </div>
    );
  }
 
  function Btn(label, onClick, variant, icon, extraStyle, type) {
    const base = { padding: "13px 24px", borderRadius: 999, fontWeight: 600, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", border: "1px solid transparent", transition: "transform .15s ease, box-shadow .15s ease, opacity .15s ease" };
    const styles = {
      primary: { background: T.ink === T.inkBg ? T.inkBg : T.inkBg, color: dark ? "#0F1319" : "#fff", background2: true },
      rust: { background: T.rust, color: "#fff" },
      outline: { background: "transparent", color: T.text, borderColor: T.border },
      ghost: { background: "transparent", color: T.textMute },
      gold: { background: T.gold, color: dark ? "#0F1319" : "#241B0B" },
    };
    const v = styles[variant || "primary"];
    return (
      <button type={type || "button"} onClick={onClick} className="wf-btn"
        style={{ ...base, background: variant === "primary" ? T.inkBg : v.background, color: v.color, borderColor: v.borderColor || "transparent", ...extraStyle }}>
        {icon}{label}
      </button>
    );
  }
 
  function ProductCard(p, compact) {
    const sup = supplierById(p.supplierId);
    const saved = wishlist.includes(p.id);
    const outOfStock = p.inStock === false;
    return (
      <div className="wf-card wf-lift" style={{ background: T.card, borderColor: T.border, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ width: "100%", height: 152, position: "relative", cursor: "pointer" }} onClick={() => openProduct(p.id)}>
          {Swatch(p.swatch, null, p.image)}
          <button onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
            style={{ position: "absolute", top: 10, right: 10, background: "rgba(255,255,255,0.92)", borderRadius: 999, padding: 7, border: "none", cursor: "pointer", display: "flex", boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}>
            <Heart size={14} style={{ fill: saved ? T.rust : "none", color: saved ? T.rust : "#1C2739" }} />
          </button>
          {outOfStock && <span style={{ position: "absolute", bottom: 8, left: 8, fontSize: 10, fontWeight: 700, padding: "4px 9px", borderRadius: 999, background: "#211B14", color: "#fff" }}>Out of stock</span>}
        </div>
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 5, flex: 1 }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: T.rust }}>{p.category}</span>
          <button onClick={() => openProduct(p.id)} style={{ background: "none", border: "none", padding: 0, textAlign: "left", cursor: "pointer", fontWeight: 600, fontSize: 14.5, lineHeight: 1.3, color: T.text }}>{p.name}</button>
          <span style={{ fontSize: 12, color: T.textMute }}>{sup?.company}</span>
          {!compact && <p style={{ fontSize: 12, color: T.textMute, margin: "2px 0 0" }}>{p.material} · {p.gsm} GSM · {p.color}</p>}
          <div className="wf-row" style={{ justifyContent: "space-between", marginTop: 8 }}>
            <span className="wf-mono" style={{ fontWeight: 700, fontSize: 15, color: T.text }}>{currency(p.price)}<span style={{ fontWeight: 400, fontSize: 11, color: T.textMute }}>/m</span></span>
            <button onClick={() => addToCart(p.id)} disabled={outOfStock} className="wf-btn" style={{ fontSize: 12, fontWeight: 700, padding: "7px 14px", borderRadius: 999, background: T.inkBg, color: dark ? "#0F1319" : "#fff", border: "none", cursor: outOfStock ? "not-allowed" : "pointer", opacity: outOfStock ? 0.5 : 1 }}>{outOfStock ? "Sold out" : "Add"}</button>
          </div>
        </div>
      </div>
    );
  }
 
  /* =======================================================================
     NAV / FOOTER / CHAT
  ======================================================================= */
  function NavBar() {
    const linkStyle = { background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500, color: T.textMute };
    return (
      <header style={{ position: "sticky", top: 0, zIndex: 40, borderBottom: `1px solid ${T.border}`, background: T.navBg, backdropFilter: "blur(10px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px", height: 66, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {Logo()}
          <nav className="wf-row wf-hide-mobile" style={{ gap: 28 }}>
            <button style={linkStyle} onClick={() => goto("landing")}>Home</button>
            <button style={linkStyle} onClick={() => goto("marketplace")}>Marketplace</button>
            <button style={linkStyle} onClick={() => setChatOpen(true)}>AI Assistant</button>
            {session?.type === "buyer" && <button style={linkStyle} onClick={() => goto("buyer-dashboard")}>My Account</button>}
            {session?.type === "supplier" && <button style={linkStyle} onClick={() => goto("supplier-dashboard")}>Supplier Dashboard</button>}
          </nav>
          <div className="wf-row" style={{ gap: 10 }}>
            <button onClick={() => setDark((d) => !d)} aria-label="Toggle dark mode"
              style={{ width: 36, height: 36, borderRadius: 999, border: `1px solid ${T.border}`, background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.text }}>
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            {session?.type === "buyer" && (
              <button onClick={() => goto("cart")} aria-label="Cart" style={{ position: "relative", width: 36, height: 36, borderRadius: 999, border: `1px solid ${T.border}`, background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.text }}>
                <ShoppingCart size={15} />
                {cartCount > 0 && <span style={{ position: "absolute", top: -5, right: -5, background: T.rust, color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 999, width: 17, height: 17, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
              </button>
            )}
            <button
              onClick={() => {
                if (!session) { resetAuthForm(); setAuthMode("login"); goto("buyer-login"); return; }
                if (session.type === "buyer") { setBuyerTab("profile"); goto("buyer-dashboard"); }
                else { setSupplierTab("profile"); goto("supplier-dashboard"); }
              }}
              aria-label={session ? "My profile" : "Sign in or create an account"}
              title={session ? "My profile" : "Sign in or create an account"}
              style={{ width: 36, height: 36, borderRadius: 999, border: `1px solid ${T.border}`, background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.text }}>
              <User size={15} />
            </button>
            {!session && <span className="wf-hide-mobile">{Btn("Sign In", () => { resetAuthForm(); setAuthMode("login"); goto("buyer-login"); }, "primary")}</span>}
            {session && (
              <button onClick={logout} className="wf-row wf-hide-mobile" style={{ gap: 6, background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: T.textMute }}>
                <LogOut size={13} /> Log out
              </button>
            )}
            <button className="wf-show-mobile" onClick={() => setNavOpen((n) => !n)} style={{ background: "none", border: "none", cursor: "pointer" }}><Menu size={20} color={T.text} /></button>
          </div>
        </div>
        {navOpen && (
          <div style={{ borderTop: `1px solid ${T.border}`, padding: "14px 20px", display: "flex", flexDirection: "column", gap: 12, background: T.surface }}>
            <button style={{ ...linkStyle, textAlign: "left" }} onClick={() => goto("landing")}>Home</button>
            <button style={{ ...linkStyle, textAlign: "left" }} onClick={() => goto("marketplace")}>Marketplace</button>
            <button style={{ ...linkStyle, textAlign: "left" }} onClick={() => { setChatOpen(true); setNavOpen(false); }}>AI Assistant</button>
            {session ? (
              <>
                <button style={{ ...linkStyle, textAlign: "left" }} onClick={() => goto(session.type === "buyer" ? "buyer-dashboard" : "supplier-dashboard")}>Dashboard</button>
                <button style={{ textAlign: "left", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: T.rust }} onClick={logout}>Log out</button>
              </>
            ) : (
              <button style={{ textAlign: "left", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: T.rust }} onClick={() => { resetAuthForm(); setAuthMode("login"); goto("buyer-login"); }}>Sign In</button>
            )}
          </div>
        )}
      </header>
    );
  }
 
  function Footer() {
    const linkStyle = { background: "none", border: "none", cursor: "pointer", fontSize: 13.5, color: T.textMute, textAlign: "left", padding: 0 };
    return (
      <footer style={{ borderTop: `1px solid ${T.border}`, marginTop: 96 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 36 }}>
          <div>
            {Logo()}
            <p style={{ marginTop: 14, fontSize: 13.5, lineHeight: 1.6, color: T.textMute, maxWidth: 260 }}>The wholesale fabric marketplace connecting mills and makers, one bolt at a time.</p>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: T.text }}>Marketplace</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <button style={linkStyle} onClick={() => goto("marketplace")}>Browse fabrics</button>
              <button style={linkStyle} onClick={() => goto("marketplace")}>Categories</button>
              <button style={linkStyle} onClick={() => setChatOpen(true)}>AI Assistant</button>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: T.text }}>For Suppliers</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <button style={linkStyle} onClick={() => { resetAuthForm(); setAuthMode("signup"); goto("supplier-login"); }}>List your fabrics</button>
              <button style={linkStyle} onClick={() => { resetAuthForm(); setAuthMode("login"); goto("supplier-login"); }}>Supplier login</button>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: T.text }}>Company</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, color: T.textMute, fontSize: 13.5 }}>
              <span>About</span><span>Contact</span><span>Terms</span>
            </div>
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${T.border}`, padding: "18px 20px", textAlign: "center", fontSize: 12, color: T.textMute }}>
          © 2026 Warp&amp;Weft — prototype build for demo purposes. <button onClick={() => { if (window.confirm("Reset all demo data (products, accounts, orders, cart, wishlist)? This can't be undone.")) resetDemoData(); }} style={{ background: "none", border: "none", cursor: "pointer", color: T.rust, textDecoration: "underline", fontSize: 12, padding: 0 }}>Reset demo data</button>
        </div>
      </footer>
    );
  }
 
  function ChatWidget() {
    function toggleMic() {
      if (!recognitionRef.current) { showToast("Voice input isn't supported in this browser — try Chrome or Edge."); return; }
      if (listening) { recognitionRef.current.stop(); setListening(false); return; }
      setListening(true);
      recognitionRef.current.start();
    }
 
    return (
      <>
        {!chatOpen && (
          <button onClick={() => setChatOpen(true)} className="wf-fab" style={{ background: T.rust }} aria-label="Open AI assistant">
            <Sparkles size={22} color="#fff" />
          </button>
        )}
        {chatOpen && (
          <div className="wf-chat" style={{ background: T.card, borderColor: T.border, boxShadow: T.shadow }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px", background: T.inkBg, color: dark ? "#0F1319" : "#fff" }}>
              <div className="wf-row" style={{ gap: 8 }}><Sparkles size={16} /><span style={{ fontWeight: 700, fontSize: 13.5 }}>Warp — AI Textile Assistant</span></div>
              <button onClick={() => setChatOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit" }}><X size={16} /></button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
              {chatMsgs.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "85%" }}>
                    <div style={{ fontSize: 13.5, borderRadius: 16, padding: "10px 14px", lineHeight: 1.45, background: m.role === "user" ? T.rust : T.chipBg, color: m.role === "user" ? "#fff" : T.text, borderBottomRightRadius: m.role === "user" ? 4 : 16, borderBottomLeftRadius: m.role === "user" ? 16 : 4 }}>
                      {m.text}
                    </div>
                    {m.productIds?.length > 0 && (
                      <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                        {m.productIds.map((id) => {
                          const p = productById(id);
                          if (!p) return null;
                          return (
                            <div key={id} className="wf-row" style={{ gap: 8, border: `1px solid ${T.border}`, borderRadius: 12, padding: 8 }}>
                              <div style={{ width: 38, height: 38, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>{Swatch(p.swatch, null, p.image)}</div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <button onClick={() => { setChatOpen(false); openProduct(p.id); }} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "block", fontSize: 12, fontWeight: 700, color: T.text, textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%" }}>{p.name}</button>
                                <span style={{ fontSize: 11, color: T.textMute }}>{currency(p.price)}/m · {p.gsm} GSM</span>
                              </div>
                              <button onClick={() => addToCart(p.id)} style={{ fontSize: 11, fontWeight: 700, padding: "6px 10px", borderRadius: 999, background: T.inkBg, color: dark ? "#0F1319" : "#fff", border: "none", cursor: "pointer", flexShrink: 0 }}>Add</button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {chatLoading && <div className="wf-row" style={{ gap: 7, fontSize: 12, color: T.rust }}><Loader2 size={14} className="wf-spin" /> Thinking...</div>}
              <div ref={chatEndRef} />
            </div>
            <div style={{ padding: "0 12px 8px", display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["Recommend a summer shirting fabric", "Compare cotton vs linen", "Care tips for silk"].map((q) => (
                <button key={q} onClick={() => sendChat(q)} style={{ fontSize: 11, padding: "6px 10px", borderRadius: 999, border: `1px solid ${T.border}`, background: "transparent", color: T.textMute, cursor: "pointer" }}>{q}</button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); sendChat(); }} style={{ display: "flex", alignItems: "center", gap: 8, borderTop: `1px solid ${T.border}`, padding: 12 }}>
              <button type="button" onClick={toggleMic} aria-label="Voice input" style={{ padding: 9, borderRadius: 999, border: `1px solid ${listening ? T.rust : T.border}`, background: listening ? T.rust : "transparent", cursor: "pointer", display: "flex", flexShrink: 0 }}>
                {listening ? <MicOff size={14} color="#fff" /> : <Mic size={14} color={T.text} />}
              </button>
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder={listening ? "Listening..." : "Ask about fabrics..."} style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 13.5, color: T.text }} />
              <button type="submit" disabled={chatLoading} style={{ padding: 9, borderRadius: 999, background: T.rust, border: "none", cursor: "pointer", opacity: chatLoading ? 0.5 : 1, display: "flex" }}><Send size={14} color="#fff" /></button>
            </form>
          </div>
        )}
      </>
    );
  }
 
  /* =======================================================================
     PAGES
  ======================================================================= */
  function LandingPage() {
    return (
      <div>
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "76px 20px 56px", display: "grid", gridTemplateColumns: "1fr", gap: 48 }} className="wf-hero-grid">
          <div className="wf-fade-up">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 11.5, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", padding: "7px 14px", borderRadius: 999, border: `1px solid ${T.rust}`, color: T.rust }}>
              <Sparkles size={12} /> AI-guided sourcing
            </div>
            <h1 className="wf-display" style={{ fontSize: "clamp(38px, 6vw, 64px)", lineHeight: 1.03, marginTop: 22, color: T.text }}>
              Every bolt,<br /><span style={{ color: T.rust, fontStyle: "italic" }}>bookable.</span>
            </h1>
            <p style={{ marginTop: 20, fontSize: 17, lineHeight: 1.6, color: T.textMute, maxWidth: 440 }}>
              Warp&amp;Weft connects buyers directly with vetted mills worldwide. Search, compare, and order wholesale fabric in minutes — with an AI textile expert at your side.
            </p>
            <div className="wf-row" style={{ gap: 12, marginTop: 32, flexWrap: "wrap" }}>
              {Btn("Browse the marketplace", () => goto("marketplace"), "primary", null, { color: dark ? "#0F1319" : "#fff" })}
              {Btn("Ask the AI assistant", () => setChatOpen(true), "outline", <Sparkles size={15} style={{ color: T.rust }} />, { borderColor: T.border })}
            </div>
            <div className="wf-row" style={{ gap: 32, marginTop: 44 }}>
              {[[products.length + "+", "Fabrics listed"], [suppliers.length, "Mills onboard"], ["24/7", "AI assistant"]].map(([n, l]) => (
                <div key={l}><div className="wf-display" style={{ fontSize: 26, color: T.text }}>{n}</div><div style={{ fontSize: 11.5, color: T.textMute }}>{l}</div></div>
              ))}
            </div>
          </div>
          <div className="wf-swatch-stack wf-hide-mobile">
            {products.slice(0, 5).map((p, i) => (
              <div key={p.id} onClick={() => openProduct(p.id)} className="wf-swatch-card"
                style={{ transform: `rotate(${(i - 2) * 8}deg) translateX(${(i - 2) * 64}px)`, zIndex: 10 - Math.abs(i - 2), animationDelay: `${i * 0.08}s` }}>
                {Swatch(p.swatch, null, p.image)}
              </div>
            ))}
          </div>
        </section>
 
        <section style={{ maxWidth: 860, margin: "0 auto", padding: "0 20px 72px" }}>
          <div className="wf-row" style={{ gap: 12, borderRadius: 999, border: `1px solid ${T.border}`, background: T.card, padding: "8px 8px 8px 20px", boxShadow: T.shadow }}>
            <Search size={17} color={T.textMute} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && goto("marketplace")}
              placeholder="Search fabrics — e.g. “stretch denim” or “silk charmeuse”" style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: T.text }} />
            {Btn("Search", () => goto("marketplace"), "rust")}
          </div>
        </section>
 
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px 72px" }}>
          <h2 className="wf-display" style={{ fontSize: 26, marginBottom: 20, color: T.text }}>Shop by category</h2>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6 }}>
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => { setFilters((f) => ({ ...f, category: c })); goto("marketplace"); }} className="wf-chip-hover"
                style={{ flexShrink: 0, padding: "11px 20px", borderRadius: 999, border: `1px solid ${T.border}`, background: "transparent", fontSize: 13.5, fontWeight: 500, color: T.text, cursor: "pointer" }}>{c}</button>
            ))}
          </div>
        </section>
 
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px 72px" }}>
          <div className="wf-row" style={{ justifyContent: "space-between", marginBottom: 20 }}>
            <h2 className="wf-display" style={{ fontSize: 26, color: T.text }}>Featured fabrics</h2>
            <button onClick={() => goto("marketplace")} className="wf-row" style={{ gap: 4, background: "none", border: "none", cursor: "pointer", fontSize: 13.5, fontWeight: 600, color: T.rust }}>View all <ChevronRight size={14} /></button>
          </div>
          <div className="wf-grid-4">{products.slice(0, 8).map((p) => <React.Fragment key={p.id}>{ProductCard(p, true)}</React.Fragment>)}</div>
        </section>
 
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px 72px" }}>
          <h2 className="wf-display" style={{ fontSize: 26, marginBottom: 20, color: T.text }}>Top suppliers</h2>
          <div className="wf-grid-3">
            {suppliers.slice(0, 3).map((s) => (
              <div key={s.id} className="wf-card wf-lift" style={{ background: T.card, borderColor: T.border, padding: 22 }}>
                <div className="wf-row" style={{ gap: 12 }}>
                  <div className="wf-display" style={{ width: 44, height: 44, borderRadius: 999, background: T.inkBg, color: dark ? "#0F1319" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>{initials(s.company)}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14.5, color: T.text }}>{s.company}</div>
                    <div className="wf-row" style={{ gap: 4, fontSize: 12, color: T.textMute }}><MapPin size={11} />{s.location}</div>
                  </div>
                </div>
                <p style={{ fontSize: 13, marginTop: 12, color: T.textMute, lineHeight: 1.5 }}>{s.description.slice(0, 110)}…</p>
                <div className="wf-row" style={{ gap: 8, marginTop: 12 }}>{Stars(s.rating)}<span style={{ fontSize: 12, color: T.textMute }}>{s.rating} ({s.reviews})</span></div>
              </div>
            ))}
          </div>
        </section>
 
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px 72px" }}>
          <div style={{ borderRadius: 28, padding: "clamp(28px,5vw,52px)", background: dark ? "#171C25" : "#1C2739", display: "grid", gridTemplateColumns: "1fr", gap: 32 }} className="wf-ai-grid">
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", padding: "7px 14px", borderRadius: 999, background: "rgba(217,172,85,0.18)", color: "#D9AC55" }}>
                <Sparkles size={12} /> Meet Warp
              </div>
              <h2 className="wf-display" style={{ fontSize: 30, marginTop: 16, color: "#fff" }}>Your AI textile expert, on call</h2>
              <p style={{ marginTop: 12, color: "#C7CCD8", lineHeight: 1.6, maxWidth: 420 }}>Ask for recommendations by use case, compare fabrics side by side, get plain-language explanations of weaves and GSM, and add matches straight to your cart.</p>
              {Btn("Try the assistant", () => setChatOpen(true), "gold", <ArrowRight size={15} />, { marginTop: 22 })}
            </div>
            <div style={{ background: "#0F1524", borderRadius: 18, padding: 18, border: "1px solid #262E3F" }}>
              <div className="wf-row" style={{ gap: 8, marginBottom: 10, alignItems: "flex-start" }}>
                <div style={{ width: 26, height: 26, borderRadius: 999, background: "#B5563C", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Sparkles size={12} color="#fff" /></div>
                <div style={{ background: "#1E2637", color: "#EDE7DA", fontSize: 13, borderRadius: "16px 16px 16px 4px", padding: "10px 14px" }}>I need something breathable for summer shirts, under $6/m.</div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{ fontSize: 13, borderRadius: "16px 16px 4px 16px", padding: "10px 14px", color: "#fff", background: "#B5563C", maxWidth: "88%" }}>Try Combed Organic Cotton Poplin — 120 GSM, $4.20/m, ideal drape for shirting. Want me to add it to your cart?</div>
              </div>
            </div>
          </div>
        </section>
 
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px 96px" }}>
          <h2 className="wf-display" style={{ fontSize: 26, marginBottom: 20, color: T.text }}>What buyers say</h2>
          <div className="wf-grid-3">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="wf-card wf-lift" style={{ background: T.card, borderColor: T.border, padding: 22 }}>
                <Quote size={20} color={T.rust} />
                <p style={{ marginTop: 12, fontSize: 13.5, lineHeight: 1.55, color: T.text }}>{t.quote}</p>
                <div className="wf-row" style={{ justifyContent: "space-between", marginTop: 16 }}>
                  <div><div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{t.name}</div><div style={{ fontSize: 11.5, color: T.textMute }}>{t.role}</div></div>
                  {Stars(t.rating)}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }
 
  function MarketplacePage() {
    const selectStyle = { width: "100%", marginTop: 8, fontSize: 13.5, borderRadius: 10, border: `1px solid ${T.border}`, padding: "9px 12px", background: T.surface, color: T.text };
    const activeFilterCount = [filters.category, filters.color, filters.supplier].filter(Boolean).length + (filters.maxPrice < 30 ? 1 : 0) + (filters.maxGsm < 420 ? 1 : 0);
    const filterPanel = (
      <aside className="wf-card wf-filter-panel" style={{ background: T.card, borderColor: T.border, padding: 20 }}>
        <div className="wf-row" style={{ gap: 8, marginBottom: 16, justifyContent: "space-between" }}>
          <div className="wf-row" style={{ gap: 8 }}><Filter size={14} /><span style={{ fontWeight: 700, fontSize: 13.5, color: T.text }}>Filters</span></div>
          <button onClick={() => setFiltersOpen(false)} aria-label="Close filters" style={{ background: "none", border: "none", cursor: "pointer", color: T.textMute, padding: 4, display: "flex" }}><X size={16} /></button>
        </div>
        <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", color: T.textMute }}>Category</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                <button onClick={() => setFilters((f) => ({ ...f, category: "" }))} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 999, border: `1px solid ${filters.category === "" ? T.inkBg : T.border}`, background: filters.category === "" ? T.inkBg : "transparent", color: filters.category === "" ? (dark ? "#0F1319" : "#fff") : T.text, cursor: "pointer" }}>All</button>
                {CATEGORIES.map((c) => (
                  <button key={c} onClick={() => setFilters((f) => ({ ...f, category: c }))} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 999, border: `1px solid ${filters.category === c ? T.inkBg : T.border}`, background: filters.category === c ? T.inkBg : "transparent", color: filters.category === c ? (dark ? "#0F1319" : "#fff") : T.text, cursor: "pointer" }}>{c}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", color: T.textMute }}>Color</label>
              <select value={filters.color} onChange={(e) => setFilters((f) => ({ ...f, color: e.target.value }))} style={selectStyle}>
                <option value="">All colors</option>{COLORS_LIST.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", color: T.textMute }}>Supplier</label>
              <select value={filters.supplier} onChange={(e) => setFilters((f) => ({ ...f, supplier: e.target.value }))} style={selectStyle}>
                <option value="">All suppliers</option>{suppliers.map((s) => <option key={s.id} value={s.id}>{s.company}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", color: T.textMute }}>Max price: <span className="wf-mono">{currency(filters.maxPrice)}/m</span></label>
              <input type="range" min="2" max="30" value={filters.maxPrice} onChange={(e) => setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }))} style={{ width: "100%", marginTop: 8, accentColor: T.rust }} />
            </div>
            <div style={{ marginBottom: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", color: T.textMute }}>Max GSM: <span className="wf-mono">{filters.maxGsm}</span></label>
              <input type="range" min="15" max="420" value={filters.maxGsm} onChange={(e) => setFilters((f) => ({ ...f, maxGsm: Number(e.target.value) }))} style={{ width: "100%", marginTop: 8, accentColor: T.rust }} />
            </div>
            <button onClick={() => setFilters({ category: "", color: "", supplier: "", maxPrice: 30, maxGsm: 420 })} style={{ fontSize: 12, fontWeight: 600, marginTop: 10, background: "none", border: "none", cursor: "pointer", color: T.textMute, textDecoration: "underline" }}>Reset filters</button>
      </aside>
    );
    return (
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 20px" }}>
        {filtersOpen && (
          <div className="wf-filter-backdrop" onClick={() => setFiltersOpen(false)}>
            <div onClick={(e) => e.stopPropagation()} className="wf-filter-drawer">{filterPanel}</div>
          </div>
        )}
        <div className="wf-market-grid" style={{ gridTemplateColumns: "1fr" }}>
          <div>
            <div className="wf-row" style={{ gap: 12, marginBottom: 18 }}>
              <button onClick={() => setFiltersOpen(true)} className="wf-row" style={{ gap: 7, borderRadius: 999, border: `1px solid ${T.border}`, background: T.card, padding: "10px 16px", cursor: "pointer", color: T.text, fontSize: 13.5, fontWeight: 500 }}>
                <Filter size={15} /> Filters
                {activeFilterCount > 0 && <span style={{ background: T.rust, color: "#fff", fontSize: 10.5, fontWeight: 700, borderRadius: 999, minWidth: 17, height: 17, padding: "0 4px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{activeFilterCount}</span>}
              </button>
              <div className="wf-row" style={{ gap: 8, flex: 1, borderRadius: 999, border: `1px solid ${T.border}`, background: T.card, padding: "10px 16px" }}>
                <Search size={15} color={T.textMute} />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search fabrics..." style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 13.5, color: T.text }} />
              </div>
              {compareIds.length > 0 && Btn(`Compare (${compareIds.length})`, () => setShowCompare(true), "rust")}
            </div>
            <p style={{ fontSize: 13, marginBottom: 16, color: T.textMute }}>{filteredProducts.length} fabrics found</p>
            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0", color: T.textMute }}>No fabrics match those filters. Try widening your search, or ask the AI assistant for suggestions.</div>
            ) : (
              <>
                <div className="wf-grid-3">
                  {filteredProducts.slice(0, visibleCount).map((p) => (
                    <div key={p.id} style={{ position: "relative" }}>
                      {ProductCard(p)}
                      <label style={{ position: "absolute", top: 10, left: 10, display: "flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 700, padding: "5px 9px", borderRadius: 999, background: "rgba(255,255,255,0.92)", boxShadow: "0 2px 6px rgba(0,0,0,0.15)", color: "#1C2739", cursor: "pointer" }}>
                        <input type="checkbox" checked={compareIds.includes(p.id)} onChange={() => toggleCompare(p.id)} style={{ width: 12, height: 12, accentColor: T.rust }} /> Compare
                      </label>
                    </div>
                  ))}
                </div>
                {visibleCount < filteredProducts.length && (
                  <div style={{ textAlign: "center", marginTop: 28 }}>
                    {Btn("Load more fabrics", () => setVisibleCount((v) => v + 12), "outline", null, { borderColor: T.border })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        {showCompare && CompareModal()}
      </div>
    );
  }
 
  function CompareModal() {
    const items = compareIds.map(productById).filter(Boolean);
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => setShowCompare(false)}>
        <div className="wf-card" style={{ background: T.card, borderColor: T.border, maxWidth: 780, width: "100%", maxHeight: "85vh", overflow: "auto", padding: 24 }} onClick={(e) => e.stopPropagation()}>
          <div className="wf-row" style={{ justifyContent: "space-between", marginBottom: 18 }}>
            <h3 className="wf-display" style={{ fontSize: 21, color: T.text }}>Compare fabrics</h3>
            <button onClick={() => setShowCompare(false)} style={{ background: "none", border: "none", cursor: "pointer", color: T.text }}><X size={18} /></button>
          </div>
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: `repeat(${items.length}, minmax(0,1fr))` }}>
            {items.map((p) => (
              <div key={p.id} className="wf-card" style={{ borderColor: T.border, padding: 14 }}>
                <div style={{ width: "100%", height: 96, marginBottom: 12, borderRadius: 8, overflow: "hidden" }}>{Swatch(p.swatch, null, p.image)}</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: T.text }}>{p.name}</div>
                <div style={{ fontSize: 12, marginTop: 10, display: "flex", flexDirection: "column", gap: 5, color: T.textMute }}>
                  <div><b style={{ color: T.text }}>Material:</b> {p.material}</div>
                  <div><b style={{ color: T.text }}>Category:</b> {p.category}</div>
                  <div><b style={{ color: T.text }}>Color:</b> {p.color}</div>
                  <div><b style={{ color: T.text }}>GSM:</b> {p.gsm}</div>
                  <div><b style={{ color: T.text }}>Price:</b> {currency(p.price)}/m</div>
                  <div><b style={{ color: T.text }}>MOQ:</b> {p.moq}m</div>
                  <div><b style={{ color: T.text }}>Supplier:</b> {supplierById(p.supplierId)?.company}</div>
                </div>
                <button onClick={() => addToCart(p.id)} style={{ marginTop: 12, width: "100%", fontSize: 12, fontWeight: 700, padding: "9px 0", borderRadius: 999, background: T.inkBg, color: dark ? "#0F1319" : "#fff", border: "none", cursor: "pointer" }}>Add to cart</button>
              </div>
            ))}
          </div>
          <button onClick={() => setCompareIds([])} style={{ marginTop: 16, fontSize: 12, background: "none", border: "none", cursor: "pointer", color: T.textMute, textDecoration: "underline" }}>Clear comparison</button>
        </div>
      </div>
    );
  }
 
  function ProductPage() {
    const p = productById(activeProductId);
    if (!p) return <div style={{ padding: 60, textAlign: "center" }}>Product not found.</div>;
    const sup = supplierById(p.supplierId);
    const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
    const alsoViewed = products.filter((x) => x.category !== p.category && x.id !== p.id).slice(0, 4);
    const specs = [["Material", p.material, Layers], ["GSM", p.gsm, Ruler], ["Color", p.color, Palette], ["MOQ", p.moq + "m", Package]];
    const outOfStock = p.inStock === false;
    const reviews = p.reviews || [];
    const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
    return (
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 20px" }}>
        <button onClick={() => goto("marketplace")} className="wf-row" style={{ gap: 4, background: "none", border: "none", cursor: "pointer", fontSize: 13.5, marginBottom: 22, color: T.textMute }}><ChevronLeft size={15} /> Back to marketplace</button>
        <div className="wf-product-grid">
          <div style={{ width: "100%", height: 400, borderRadius: 18, overflow: "hidden" }}>{Swatch(p.swatch, null, p.image)}</div>
          <div>
            <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: T.rust }}>{p.category}</span>
            <h1 className="wf-display" style={{ fontSize: 30, margin: "6px 0 8px", color: T.text }}>{p.name}</h1>
            <button onClick={() => showToast(`${sup.company} — ${sup.location}`)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13.5, color: T.textMute, textDecoration: "underline", padding: 0 }}>{sup.company} · {sup.location}</button>
            <div className="wf-row" style={{ gap: 8, marginTop: 8 }}>{Stars(reviews.length ? avgRating : sup.rating)}<span style={{ fontSize: 12, color: T.textMute }}>{reviews.length ? `${avgRating.toFixed(1)} (${reviews.length} product review${reviews.length === 1 ? "" : "s"})` : `${sup.rating || "New"} (${sup.reviews} supplier reviews)`}</span></div>
            <div className="wf-mono" style={{ marginTop: 18, fontSize: 30, fontWeight: 700, color: T.text }}>{currency(p.price)}<span style={{ fontSize: 13, fontWeight: 400, color: T.textMute }}> / meter</span></div>
            {outOfStock && <div style={{ marginTop: 8, display: "inline-block", fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 999, background: dark ? "#2A2118" : "#211B14", color: "#fff" }}>Out of stock</div>}
            <p style={{ marginTop: 14, lineHeight: 1.6, color: T.textMute, fontSize: 14.5 }}>{p.description}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 20 }}>
              {specs.map(([label, value, Icon]) => (
                <div key={label} className="wf-card" style={{ borderColor: T.border, padding: 12 }}>
                  <div className="wf-row" style={{ gap: 5, fontSize: 11.5, color: T.textMute }}><Icon size={12} />{label}</div>
                  <div style={{ fontWeight: 600, fontSize: 13.5, marginTop: 3, color: T.text }}>{value}</div>
                </div>
              ))}
            </div>
            {p.care && <div style={{ marginTop: 16, fontSize: 13.5, color: T.textMute }}><b style={{ color: T.text }}>Care:</b> {p.care}</div>}
            <div className="wf-row" style={{ gap: 10, marginTop: 26 }}>
              <div style={{ flex: 1 }}>{Btn(outOfStock ? "Out of stock" : `Add ${p.moq}m to cart`, () => addToCart(p.id, p.moq), "primary", null, { width: "100%", justifyContent: "center", color: dark ? "#0F1319" : "#fff", opacity: outOfStock ? 0.5 : 1, cursor: outOfStock ? "not-allowed" : "pointer" })}</div>
              <button onClick={() => toggleWishlist(p.id)} style={{ padding: 13, borderRadius: 999, border: `1px solid ${T.border}`, background: "transparent", cursor: "pointer", display: "flex" }}><Heart size={17} style={{ fill: wishlist.includes(p.id) ? T.rust : "none", color: wishlist.includes(p.id) ? T.rust : T.text }} /></button>
              <button onClick={() => { setChatOpen(true); sendChat(`Tell me more about ${p.name} and what it's best used for.`); }} style={{ padding: 13, borderRadius: 999, border: `1px solid ${T.border}`, background: "transparent", cursor: "pointer", display: "flex" }}><Sparkles size={17} color={T.rust} /></button>
            </div>
          </div>
        </div>
 
        <div style={{ marginTop: 56 }}>
          <h3 className="wf-display" style={{ fontSize: 21, marginBottom: 18, color: T.text }}>Reviews</h3>
          {reviews.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              {reviews.map((r, i) => (
                <div key={i} className="wf-card" style={{ borderColor: T.border, padding: 14 }}>
                  <div className="wf-row" style={{ justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 600, fontSize: 13, color: T.text }}>{r.buyerName}</span>
                    {Stars(r.rating, 12)}
                  </div>
                  <p style={{ fontSize: 13, marginTop: 6, color: T.textMute }}>{r.comment}</p>
                </div>
              ))}
            </div>
          ) : <p style={{ fontSize: 13, color: T.textMute, marginBottom: 20 }}>No reviews yet for this fabric.</p>}
          {currentBuyer ? (
            <div className="wf-card" style={{ borderColor: T.border, padding: 16, maxWidth: 460 }}>
              <div className="wf-row" style={{ gap: 4, marginBottom: 10 }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setReviewForm((f) => ({ ...f, rating: n }))} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    <Star size={18} style={{ fill: n <= reviewForm.rating ? T.gold : "transparent", color: n <= reviewForm.rating ? T.gold : T.border }} />
                  </button>
                ))}
              </div>
              <textarea value={reviewForm.comment} onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))} placeholder="Share your experience with this fabric..." style={{ width: "100%", borderRadius: 10, border: `1px solid ${T.border}`, padding: "10px 12px", fontSize: 13, background: T.surface, color: T.text, resize: "vertical" }} rows={2} />
              <button onClick={() => submitReview(p.id)} className="wf-btn" style={{ marginTop: 10, fontSize: 12.5, fontWeight: 700, padding: "9px 18px", borderRadius: 999, background: T.inkBg, color: dark ? "#0F1319" : "#fff", border: "none", cursor: "pointer" }}>Post review</button>
            </div>
          ) : (
            <p style={{ fontSize: 12.5, color: T.textMute }}>
              <button onClick={() => { resetAuthForm(); setAuthMode("login"); goto("buyer-login"); }} style={{ background: "none", border: "none", cursor: "pointer", color: T.rust, fontWeight: 600, padding: 0 }}>Sign in</button> as a buyer to leave a review.
            </p>
          )}
        </div>
 
        {related.length > 0 && (
          <div style={{ marginTop: 56 }}>
            <h3 className="wf-display" style={{ fontSize: 21, marginBottom: 18, color: T.text }}>You may also like</h3>
            <div className="wf-grid-4">{related.map((r) => <React.Fragment key={r.id}>{ProductCard(r, true)}</React.Fragment>)}</div>
          </div>
        )}
        {alsoViewed.length > 0 && (
          <div style={{ marginTop: 56 }}>
            <h3 className="wf-display" style={{ fontSize: 21, marginBottom: 18, color: T.text }}>Customers also viewed</h3>
            <div className="wf-grid-4">{alsoViewed.map((r) => <React.Fragment key={r.id}>{ProductCard(r, true)}</React.Fragment>)}</div>
          </div>
        )}
      </div>
    );
  }
 
  function CartPage() {
    return (
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 20px" }}>
        <h1 className="wf-display" style={{ fontSize: 30, marginBottom: 28, color: T.text }}>Your cart</h1>
        {cartLines.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: T.textMute }}>
            <ShoppingCart size={30} style={{ opacity: 0.5, marginBottom: 10 }} /><br />
            Your cart is empty. <button onClick={() => goto("marketplace")} style={{ background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontWeight: 600, color: T.rust }}>Browse fabrics</button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {cartLines.map((c) => (
                <div key={c.productId} className="wf-card wf-cart-row" style={{ borderColor: T.border, background: T.card, padding: 14 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>{Swatch(c.product.swatch, null, c.product.image)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13.5, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.product.name}</div>
                    <div style={{ fontSize: 12, color: T.textMute }}>{currency(c.product.price)}/m · MOQ {c.product.moq}m</div>
                  </div>
                  <input type="number" min="1" value={c.qty} onChange={(e) => updateCartQty(c.productId, Number(e.target.value))} style={{ width: 70, fontSize: 13, borderRadius: 8, border: `1px solid ${T.border}`, padding: "7px 8px", background: T.surface, color: T.text }} />
                  <div className="wf-mono" style={{ width: 76, textAlign: "right", fontWeight: 700, fontSize: 13.5, color: T.text }}>{currency(c.product.price * c.qty)}</div>
                  <button onClick={() => updateCartQty(c.productId, 0)} style={{ background: "none", border: "none", cursor: "pointer" }}><Trash2 size={15} color={T.rust} /></button>
                </div>
              ))}
            </div>
            <div className="wf-row wf-card" style={{ justifyContent: "space-between", marginTop: 24, borderColor: T.border, background: T.card, padding: 18 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: T.text }}>Total ({cartCount}m)</span>
              <span className="wf-display wf-mono" style={{ fontSize: 24, color: T.text }}>{currency(cartTotal)}</span>
            </div>
            {Btn(session?.type === "buyer" ? "Proceed to checkout" : "Sign in to checkout", () => goto(session?.type === "buyer" ? "checkout" : "buyer-login"), "primary", null, { width: "100%", justifyContent: "center", marginTop: 20, color: dark ? "#0F1319" : "#fff" })}
          </>
        )}
      </div>
    );
  }
 
  function CheckoutPage() {
    const inputStyle = { width: "100%", borderRadius: 10, border: `1px solid ${T.border}`, padding: "12px 14px", fontSize: 13.5, background: T.surface, color: T.text };
    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
        <h1 className="wf-display" style={{ fontSize: 30, marginBottom: 28, color: T.text }}>Checkout</h1>
        <div className="wf-product-grid">
          <form onSubmit={(e) => { e.preventDefault(); placeOrder(checkoutForm); }} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: T.textMute }}>Shipping details</h3>
            <input required placeholder="Full name" value={checkoutForm.name} onChange={(e) => setCheckoutForm((s) => ({ ...s, name: e.target.value }))} style={inputStyle} />
            <input required placeholder="Street address" value={checkoutForm.address} onChange={(e) => setCheckoutForm((s) => ({ ...s, address: e.target.value }))} style={inputStyle} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <input required placeholder="City" value={checkoutForm.city} onChange={(e) => setCheckoutForm((s) => ({ ...s, city: e.target.value }))} style={inputStyle} />
              <input required placeholder="Country" value={checkoutForm.country} onChange={(e) => setCheckoutForm((s) => ({ ...s, country: e.target.value }))} style={inputStyle} />
            </div>
            <textarea placeholder="Order notes (optional)" value={checkoutForm.notes} onChange={(e) => setCheckoutForm((s) => ({ ...s, notes: e.target.value }))} style={{ ...inputStyle, resize: "vertical" }} rows={3} />
            <div className="wf-card" style={{ borderColor: T.border, padding: 14, fontSize: 12.5, color: T.textMute }}>Payment is not processed in this prototype — placing an order confirms it directly with the supplier.</div>
            {Btn(`Place order · ${currency(cartTotal)}`, null, "primary", null, { width: "100%", justifyContent: "center", color: dark ? "#0F1319" : "#fff" }, "submit")}
          </form>
          <div>
            <h3 style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: T.textMute, marginBottom: 14 }}>Order summary</h3>
            <div className="wf-card" style={{ borderColor: T.border, background: T.card, padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
              {cartLines.map((c) => (
                <div key={c.productId} className="wf-row" style={{ justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: T.text }}>{c.product.name} × {c.qty}m</span><span style={{ color: T.textMute }}>{currency(c.product.price * c.qty)}</span>
                </div>
              ))}
              <div className="wf-row" style={{ justifyContent: "space-between", borderTop: `1px solid ${T.border}`, paddingTop: 10, fontWeight: 700, fontSize: 14, color: T.text }}><span>Total</span><span>{currency(cartTotal)}</span></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
 
  function ConfirmationPage() {
    const order = orders.find((o) => o.id === lastOrderId);
    if (!order) return null;
    return (
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "88px 20px", textAlign: "center" }}>
        <div className="wf-pop"><CheckCircle size={50} color={T.rust} style={{ marginBottom: 16 }} /></div>
        <h1 className="wf-display" style={{ fontSize: 28, marginBottom: 8, color: T.text }}>Order confirmed</h1>
        <p style={{ color: T.textMute }}>Order #{order.id.slice(-6).toUpperCase()} has been sent to your supplier(s).</p>
        <div className="wf-card" style={{ borderColor: T.border, background: T.card, padding: 20, marginTop: 28, textAlign: "left", display: "flex", flexDirection: "column", gap: 10 }}>
          {order.items.map((it, i) => <div key={i} className="wf-row" style={{ justifyContent: "space-between", fontSize: 13 }}><span style={{ color: T.text }}>{it.name} × {it.qty}m</span><span style={{ color: T.textMute }}>{currency(it.price * it.qty)}</span></div>)}
          <div className="wf-row" style={{ justifyContent: "space-between", borderTop: `1px solid ${T.border}`, paddingTop: 10, fontWeight: 700, color: T.text }}><span>Total</span><span>{currency(order.total)}</span></div>
        </div>
        <div className="wf-row" style={{ gap: 12, justifyContent: "center", marginTop: 28 }}>
          {Btn("View my orders", () => goto("buyer-dashboard"), "primary", null, { color: dark ? "#0F1319" : "#fff" })}
          {Btn("Keep browsing", () => goto("marketplace"), "outline", null, { borderColor: T.border })}
        </div>
      </div>
    );
  }
 
  const inputCls = () => ({ width: "100%", borderRadius: 10, border: `1px solid ${T.border}`, padding: "12px 14px", fontSize: 13.5, background: T.surface, color: T.text });
 
  function AuthShell(title, subtitle, content) {
    return (
      <div style={{ maxWidth: 420, margin: "0 auto", padding: "64px 20px" }}>
        <h1 className="wf-display" style={{ fontSize: 27, marginBottom: 4, color: T.text }}>{title}</h1>
        <p style={{ fontSize: 13.5, marginBottom: 28, color: T.textMute }}>{subtitle}</p>
        {content}
      </div>
    );
  }
 
  function BuyerAuthPage() {
    if (authMode === "forgot") {
      return AuthShell("Reset password", "We'll send a reset link to your email.", (
        <div>
          {resetSent ? (
            <div className="wf-card" style={{ borderColor: T.border, padding: 14, fontSize: 13, color: T.textMute }}>If an account exists for that email, a reset link has been sent.</div>
          ) : (
            <form onSubmit={handleForgot} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input required type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} style={inputCls()} />
              {Btn("Send reset link", null, "primary", null, { width: "100%", justifyContent: "center", color: dark ? "#0F1319" : "#fff" }, "submit")}
            </form>
          )}
          <button onClick={() => { resetAuthForm(); setAuthMode("login"); }} style={{ marginTop: 18, background: "none", border: "none", cursor: "pointer", fontSize: 13, color: T.textMute }}>← Back to login</button>
        </div>
      ));
    }
    return AuthShell(authMode === "login" ? "Welcome back" : "Create a buyer account", authMode === "login" ? "Sign in to browse and order fabrics." : "Start sourcing fabric from vetted mills.", (
      <div>
        <form onSubmit={authMode === "login" ? handleBuyerLogin : handleBuyerSignup} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {authMode === "signup" && <input required placeholder="Full name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} style={inputCls()} />}
          <input required type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} style={inputCls()} />
          <input required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} style={inputCls()} />
          {authError && <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", background: T.rust, padding: "10px 14px", borderRadius: 10 }}>{authError}</div>}
          {Btn(authMode === "login" ? "Sign in" : "Create account", null, "primary", null, { width: "100%", justifyContent: "center", color: dark ? "#0F1319" : "#fff" }, "submit")}
        </form>
        <div className="wf-row" style={{ justifyContent: "space-between", marginTop: 18, fontSize: 13, flexWrap: "wrap", gap: 8 }}>
          {authMode === "login" ? (
            <>
              <button onClick={() => { resetAuthForm(); setAuthMode("signup"); }} style={{ background: "none", border: "none", cursor: "pointer", color: T.textMute }}>New here? <span style={{ color: T.rust, fontWeight: 600 }}>Sign up</span></button>
              <button onClick={() => { resetAuthForm(); setAuthMode("forgot"); }} style={{ background: "none", border: "none", cursor: "pointer", color: T.textMute }}>Forgot password?</button>
            </>
          ) : (
            <button onClick={() => { resetAuthForm(); setAuthMode("login"); }} style={{ background: "none", border: "none", cursor: "pointer", color: T.textMute }}>Already have an account? <span style={{ color: T.rust, fontWeight: 600 }}>Sign in</span></button>
          )}
        </div>
        <div style={{ marginTop: 26, paddingTop: 18, borderTop: `1px solid ${T.border}`, fontSize: 13, color: T.textMute }}>Are you a fabric supplier? <button onClick={() => { resetAuthForm(); setAuthMode("login"); goto("supplier-login"); }} style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 600, color: T.rust }}>Sign in here</button></div>
        <div style={{ marginTop: 10, fontSize: 12, color: T.textMute }}>Demo tip: sign up fresh, or explore as any buyer you create.</div>
      </div>
    ));
  }
 
  function SupplierAuthPage() {
    return AuthShell(authMode === "login" ? "Supplier sign in" : "List your fabrics", authMode === "login" ? "Manage your inventory and orders." : "Join the marketplace and reach new buyers.", (
      <div>
        <form onSubmit={authMode === "login" ? handleSupplierLogin : handleSupplierSignup} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {authMode === "signup" && (
            <>
              <input required placeholder="Company name" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} style={inputCls()} />
              <input required placeholder="Contact person" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} style={inputCls()} />
              <input placeholder="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} style={inputCls()} />
              <input placeholder="Location (city, country)" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} style={inputCls()} />
              <textarea placeholder="Business description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} style={{ ...inputCls(), resize: "vertical" }} rows={3} />
            </>
          )}
          <input required type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} style={inputCls()} />
          <input required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} style={inputCls()} />
          {authError && <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", background: T.rust, padding: "10px 14px", borderRadius: 10 }}>{authError}</div>}
          {Btn(authMode === "login" ? "Sign in" : "Create supplier account", null, "primary", null, { width: "100%", justifyContent: "center", color: dark ? "#0F1319" : "#fff" }, "submit")}
        </form>
        <button onClick={() => { resetAuthForm(); setAuthMode(authMode === "login" ? "signup" : "login"); }} style={{ marginTop: 18, background: "none", border: "none", cursor: "pointer", fontSize: 13, color: T.textMute }}>
          {authMode === "login" ? <>New supplier? <span style={{ color: T.rust, fontWeight: 600 }}>List your fabrics</span></> : <>Already registered? <span style={{ color: T.rust, fontWeight: 600 }}>Sign in</span></>}
        </button>
        <div style={{ marginTop: 26, paddingTop: 18, borderTop: `1px solid ${T.border}`, fontSize: 13, color: T.textMute }}>Looking to buy fabric? <button onClick={() => { resetAuthForm(); setAuthMode("login"); goto("buyer-login"); }} style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 600, color: T.rust }}>Buyer sign in</button></div>
        <div style={{ marginTop: 10, fontSize: 12, color: T.textMute }}>Demo accounts: any @ address above with password demo1234 (e.g. sales@luccasilkhouse.it).</div>
      </div>
    ));
  }
 
  function BuyerOnboardingPage() {
    const newest = buyers[buyers.length - 1];
    const steps = [
      "Browse thousands of fabrics from vetted mills",
      "Ask the AI assistant to recommend or compare fabrics — by typing or by voice",
      "Save favorites to your wishlist and track orders end-to-end",
    ];
    return (
      <div style={{ maxWidth: 420, margin: "0 auto", padding: "64px 20px", textAlign: "center" }}>
        <h1 className="wf-display" style={{ fontSize: 26, marginBottom: 10, color: T.text }}>Welcome, {newest?.name?.split(" ")[0] || "there"} 👋</h1>
        <p style={{ fontSize: 13.5, color: T.textMute, marginBottom: 24 }}>You're set up as a buyer. Here's what you can do:</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, textAlign: "left", marginBottom: 28 }}>
          {steps.map((t) => <div key={t} className="wf-card" style={{ borderColor: T.border, padding: 14, fontSize: 13.5, color: T.text }}>{t}</div>)}
        </div>
        {Btn("Start browsing fabrics", () => goto("marketplace"), "primary", null, { width: "100%", justifyContent: "center", color: dark ? "#0F1319" : "#fff" })}
      </div>
    );
  }
 
  function SupplierOnboardingPage() {
    const newest = suppliers[suppliers.length - 1];
    const steps = [
      "Add your first fabric with a photo, pricing, and MOQ",
      "Track incoming orders and update their status as you fulfill them",
      "Keep stock counts current — mark items in or out of stock as they move",
    ];
    return (
      <div style={{ maxWidth: 420, margin: "0 auto", padding: "64px 20px", textAlign: "center" }}>
        <h1 className="wf-display" style={{ fontSize: 26, marginBottom: 10, color: T.text }}>Welcome to Warp&amp;Weft, {newest?.company || "there"} 👋</h1>
        <p style={{ fontSize: 13.5, color: T.textMute, marginBottom: 24 }}>Your supplier account is ready. Next steps:</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, textAlign: "left", marginBottom: 28 }}>
          {steps.map((t) => <div key={t} className="wf-card" style={{ borderColor: T.border, padding: 14, fontSize: 13.5, color: T.text }}>{t}</div>)}
        </div>
        {Btn("Go to my dashboard", () => goto("supplier-dashboard"), "primary", null, { width: "100%", justifyContent: "center", color: dark ? "#0F1319" : "#fff" })}
      </div>
    );
  }
 
  function BuyerDashboard() {
    if (!currentBuyer) return null;
    const statusIcon = { Pending: Clock, Confirmed: CheckCircle, Shipped: Truck, Delivered: CheckCircle };
    const tabs = ["orders", "wishlist", "recent", "profile"];
    return (
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 20px" }}>
        <h1 className="wf-display" style={{ fontSize: 28, marginBottom: 2, color: T.text }}>Hi, {currentBuyer.name.split(" ")[0]}</h1>
        <p style={{ fontSize: 13.5, marginBottom: 26, color: T.textMute }}>{currentBuyer.email}</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 28, overflowX: "auto" }}>
          {tabs.map((t) => (
            <button key={t} onClick={() => setBuyerTab(t)} style={{ padding: "9px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600, textTransform: "capitalize", border: `1px solid ${buyerTab === t ? T.inkBg : T.border}`, background: buyerTab === t ? T.inkBg : "transparent", color: buyerTab === t ? (dark ? "#0F1319" : "#fff") : T.textMute, cursor: "pointer", flexShrink: 0 }}>{t}</button>
          ))}
        </div>
 
        {buyerTab === "orders" && (buyerOrders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: T.textMute }}>No orders yet. <button onClick={() => goto("marketplace")} style={{ background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontWeight: 600, color: T.rust }}>Start browsing</button></div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {buyerOrders.map((o) => {
              const Icon = statusIcon[o.status] || Clock;
              const stages = ["Pending", "Confirmed", "Shipped", "Delivered"];
              const idx = stages.indexOf(o.status);
              return (
                <div key={o.id} className="wf-card" style={{ borderColor: T.border, background: T.card, padding: 18 }}>
                  <div className="wf-row" style={{ justifyContent: "space-between", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13.5, color: T.text }}>Order #{o.id.slice(-6).toUpperCase()}</div>
                      <div style={{ fontSize: 11.5, color: T.textMute }}>{new Date(o.createdAt).toLocaleDateString()}</div>
                    </div>
                    <span className="wf-row" style={{ gap: 5, fontSize: 11.5, fontWeight: 700, padding: "5px 12px", borderRadius: 999, background: "rgba(181,86,60,0.12)", color: T.rust }}><Icon size={12} />{o.status}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 12 }}>
                    {o.items.map((it, i) => <div key={i} className="wf-row" style={{ justifyContent: "space-between", fontSize: 12.5, color: T.textMute }}><span>{it.name} × {it.qty}m</span><span>{currency(it.price * it.qty)}</span></div>)}
                  </div>
                  <div className="wf-row" style={{ gap: 0 }}>
                    {stages.map((s, i) => (
                      <React.Fragment key={s}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                          <div style={{ width: 9, height: 9, borderRadius: 999, background: idx >= i ? T.rust : T.border }} />
                          <span style={{ fontSize: 9.5, color: idx >= i ? T.text : T.textMute }}>{s}</span>
                        </div>
                        {i < stages.length - 1 && <div style={{ flex: 1, height: 2, background: idx > i ? T.rust : T.border, marginBottom: 14 }} />}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="wf-row" style={{ justifyContent: "space-between", borderTop: `1px solid ${T.border}`, marginTop: 14, paddingTop: 10, fontWeight: 700, fontSize: 13, color: T.text }}><span>Total</span><span>{currency(o.total)}</span></div>
                </div>
              );
            })}
          </div>
        ))}
 
        {buyerTab === "wishlist" && (wishlist.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: T.textMute }}>Your wishlist is empty — tap the heart on any fabric to save it here.</div>
        ) : (
          <div className="wf-grid-4">{wishlist.map((id) => productById(id)).filter(Boolean).map((p) => <React.Fragment key={p.id}>{ProductCard(p, true)}</React.Fragment>)}</div>
        ))}
 
        {buyerTab === "recent" && (recentlyViewed.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: T.textMute }}>You haven't viewed any fabrics yet.</div>
        ) : (
          <div className="wf-grid-4">{recentlyViewed.map((id) => productById(id)).filter(Boolean).map((p) => <React.Fragment key={p.id}>{ProductCard(p, true)}</React.Fragment>)}</div>
        ))}
 
        {buyerTab === "profile" && (
          <div className="wf-card" style={{ maxWidth: 420, borderColor: T.border, background: T.card, padding: 22 }}>
            <div className="wf-row" style={{ gap: 14, marginBottom: 18 }}>
              <div className="wf-display" style={{ width: 52, height: 52, borderRadius: 999, background: T.inkBg, color: dark ? "#0F1319" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19 }}>{initials(currentBuyer.name)}</div>
              <div><div style={{ fontWeight: 700, fontSize: 14.5, color: T.text }}>{currentBuyer.name}</div><div style={{ fontSize: 13, color: T.textMute }}>{currentBuyer.email}</div></div>
            </div>
            <div style={{ fontSize: 13, display: "flex", flexDirection: "column", gap: 8, color: T.textMute }}>
              <div>{buyerOrders.length} orders placed</div>
              <div>{wishlist.length} items wishlisted</div>
            </div>
          </div>
        )}
 
        {buyerTab === "orders" && buyerOrders.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <h3 className="wf-display" style={{ fontSize: 20, marginBottom: 18, color: T.text }}>Recommended for you</h3>
            <div className="wf-grid-4">{products.slice(0, 4).map((p) => <React.Fragment key={p.id}>{ProductCard(p, true)}</React.Fragment>)}</div>
          </div>
        )}
      </div>
    );
  }
 
  function SupplierDashboard() {
    if (!currentSupplier) return null;
    const tabs = ["overview", "inventory", "orders", "profile"];
    const totalRevenue = supplierOrders.reduce((sum, o) => sum + o.items.filter((it) => productById(it.productId)?.supplierId === currentSupplier.id).reduce((s, it) => s + it.price * it.qty, 0), 0);
    const lowStock = supplierProducts.filter((p) => p.stock < p.moq * 3);
    const invInputStyle = { borderRadius: 10, border: `1px solid ${T.border}`, padding: "11px 13px", fontSize: 13, background: T.surface, color: T.text };
 
    return (
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 20px" }}>
        <h1 className="wf-display" style={{ fontSize: 28, marginBottom: 2, color: T.text }}>{currentSupplier.company}</h1>
        <p style={{ fontSize: 13.5, marginBottom: 26, color: T.textMute }}>{currentSupplier.location}</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 28, overflowX: "auto" }}>
          {tabs.map((t) => (
            <button key={t} onClick={() => setSupplierTab(t)} style={{ padding: "9px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600, textTransform: "capitalize", border: `1px solid ${supplierTab === t ? T.inkBg : T.border}`, background: supplierTab === t ? T.inkBg : "transparent", color: supplierTab === t ? (dark ? "#0F1319" : "#fff") : T.textMute, cursor: "pointer", flexShrink: 0 }}>{t}</button>
          ))}
        </div>
 
        {supplierTab === "overview" && (
          <div>
            <div className="wf-grid-4" style={{ marginBottom: 24 }}>
              {[["Active fabrics", supplierProducts.length, Layers], ["Total orders", supplierOrders.length, Package], ["Revenue", currency(totalRevenue), TrendingUp], ["Rating", currentSupplier.rating || "—", Star]].map(([label, value, Icon]) => (
                <div key={label} className="wf-card" style={{ borderColor: T.border, background: T.card, padding: 18 }}>
                  <Icon size={15} color={T.rust} />
                  <div className="wf-display wf-mono" style={{ fontSize: 19, marginTop: 8, color: T.text }}>{value}</div>
                  <div style={{ fontSize: 11.5, color: T.textMute }}>{label}</div>
                </div>
              ))}
            </div>
            <div className="wf-card" style={{ borderColor: T.border, background: T.card, padding: 18, marginBottom: 24 }}>
              <div className="wf-row" style={{ gap: 8, marginBottom: 16 }}><BarChart3 size={14} color={T.rust} /><span style={{ fontWeight: 700, fontSize: 13.5, color: T.text }}>Inventory by category</span></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {CATEGORIES.filter((c) => supplierProducts.some((p) => p.category === c)).map((c) => {
                  const count = supplierProducts.filter((p) => p.category === c).length;
                  const pct = Math.round((count / supplierProducts.length) * 100);
                  return (
                    <div key={c}>
                      <div className="wf-row" style={{ justifyContent: "space-between", fontSize: 12, marginBottom: 5, color: T.textMute }}><span>{c}</span><span>{count}</span></div>
                      <div style={{ height: 7, borderRadius: 999, background: T.chipBg }}><div style={{ height: 7, borderRadius: 999, width: `${pct}%`, background: T.rust, transition: "width .4s ease" }} /></div>
                    </div>
                  );
                })}
              </div>
            </div>
            {lowStock.length > 0 && (
              <div className="wf-card" style={{ borderColor: T.border, background: T.card, padding: 18 }}>
                <span style={{ fontWeight: 700, fontSize: 13.5, color: T.text }}>Low stock alerts</span>
                <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                  {lowStock.map((p) => <div key={p.id} className="wf-row" style={{ justifyContent: "space-between", fontSize: 13, color: T.textMute }}><span>{p.name}</span><span style={{ color: T.rust, fontWeight: 600 }}>{p.stock}m left</span></div>)}
                </div>
              </div>
            )}
          </div>
        )}
 
        {supplierTab === "inventory" && (
          <div>
            <div className="wf-row" style={{ justifyContent: "space-between", marginBottom: 18 }}>
              <span style={{ fontSize: 13, color: T.textMute }}>{supplierProducts.length} fabrics listed</span>
              {Btn("Add fabric", startNewProduct, "primary", <Plus size={14} />, { color: dark ? "#0F1319" : "#fff" })}
            </div>
            {editingProduct && (
              <div style={{ position: "fixed", inset: 0, zIndex: 55, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => { setEditingProduct(null); setInvForm(null); }}>
                <form onSubmit={saveProduct} className="wf-card" style={{ borderColor: T.border, background: T.card, padding: 22, maxWidth: 620, width: "100%", maxHeight: "88vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
                  <div className="wf-row" style={{ justifyContent: "space-between", marginBottom: 16 }}>
                    <h3 className="wf-display" style={{ fontSize: 19, color: T.text }}>{editingProduct === "new" ? "Add fabric" : "Edit fabric"}</h3>
                    <button type="button" onClick={() => { setEditingProduct(null); setInvForm(null); }} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer", color: T.textMute, padding: 4, display: "flex" }}><X size={18} /></button>
                  </div>
 
                  <label style={{ fontSize: 12, color: T.textMute }}>Product image</label>
                  <div className="wf-row" style={{ gap: 14, marginTop: 8, marginBottom: 16 }}>
                    <div style={{ width: 72, height: 72, borderRadius: 10, overflow: "hidden", flexShrink: 0, border: `1px solid ${T.border}` }}>{Swatch(invForm.swatch, null, invForm.image)}</div>
                    <label style={{ fontSize: 12.5, fontWeight: 700, padding: "9px 16px", borderRadius: 999, border: `1px solid ${T.border}`, cursor: "pointer", color: T.text, display: "inline-flex", alignItems: "center", gap: 6 }}>
                      Upload image
                      <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => setInvForm((f) => ({ ...f, image: reader.result }));
                        reader.readAsDataURL(file);
                      }} />
                    </label>
                    {invForm.image && <button type="button" onClick={() => setInvForm((f) => ({ ...f, image: null }))} style={{ fontSize: 12, background: "none", border: "none", cursor: "pointer", color: T.rust, textDecoration: "underline" }}>Remove</button>}
                  </div>
 
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <input required placeholder="Fabric name" value={invForm.name} onChange={(e) => setInvForm((f) => ({ ...f, name: e.target.value }))} style={invInputStyle} />
                    <select value={invForm.category} onChange={(e) => setInvForm((f) => ({ ...f, category: e.target.value }))} style={invInputStyle}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
                    <input required placeholder="Material composition" value={invForm.material} onChange={(e) => setInvForm((f) => ({ ...f, material: e.target.value }))} style={invInputStyle} />
                    <select value={invForm.color} onChange={(e) => setInvForm((f) => ({ ...f, color: e.target.value }))} style={invInputStyle}>{COLORS_LIST.map((c) => <option key={c}>{c}</option>)}</select>
                    <input required type="number" step="0.1" placeholder="Price per meter" value={invForm.price} onChange={(e) => setInvForm((f) => ({ ...f, price: e.target.value }))} style={invInputStyle} />
                    <input required type="number" placeholder="GSM" value={invForm.gsm} onChange={(e) => setInvForm((f) => ({ ...f, gsm: e.target.value }))} style={invInputStyle} />
                    <input required type="number" placeholder="MOQ (meters)" value={invForm.moq} onChange={(e) => setInvForm((f) => ({ ...f, moq: e.target.value }))} style={invInputStyle} />
                    <input required type="number" placeholder="Stock (meters)" value={invForm.stock} onChange={(e) => setInvForm((f) => ({ ...f, stock: e.target.value }))} style={invInputStyle} />
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={{ fontSize: 12, color: T.textMute }}>Fallback swatch color (shown until an image is uploaded)</label>
                      <input type="color" value={invForm.swatch} onChange={(e) => setInvForm((f) => ({ ...f, swatch: e.target.value }))} style={{ width: "100%", height: 40, marginTop: 6, borderRadius: 8, border: `1px solid ${T.border}` }} />
                    </div>
                    <label className="wf-row" style={{ gridColumn: "1 / -1", gap: 8, fontSize: 13, color: T.text, cursor: "pointer" }}>
                      <input type="checkbox" checked={invForm.inStock !== false} onChange={(e) => setInvForm((f) => ({ ...f, inStock: e.target.checked }))} style={{ width: 14, height: 14, accentColor: T.rust }} /> In stock and orderable
                    </label>
                    <textarea placeholder="Description" value={invForm.description} onChange={(e) => setInvForm((f) => ({ ...f, description: e.target.value }))} style={{ ...invInputStyle, gridColumn: "1 / -1", resize: "vertical" }} rows={2} />
                    <textarea placeholder="Care instructions" value={invForm.care} onChange={(e) => setInvForm((f) => ({ ...f, care: e.target.value }))} style={{ ...invInputStyle, gridColumn: "1 / -1", resize: "vertical" }} rows={2} />
                    <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10 }}>
                      {Btn("Save fabric", null, "primary", null, { color: dark ? "#0F1319" : "#fff" }, "submit")}
                      {Btn("Cancel", () => { setEditingProduct(null); setInvForm(null); }, "outline", null, { borderColor: T.border })}
                    </div>
                  </div>
                </form>
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {supplierProducts.map((p) => (
                <div key={p.id} className="wf-card wf-cart-row" style={{ borderColor: T.border, background: T.card, padding: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>{Swatch(p.swatch, null, p.image)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="wf-row" style={{ gap: 8 }}>
                      <div style={{ fontWeight: 700, fontSize: 13.5, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                      {p.inStock === false && <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 999, background: dark ? "#2A2118" : "#211B14", color: "#fff", flexShrink: 0 }}>Out of stock</span>}
                    </div>
                    <div style={{ fontSize: 12, color: T.textMute }}>{p.category} · {currency(p.price)}/m · {p.stock}m in stock</div>
                  </div>
                  <button onClick={() => toggleStock(p)} style={{ fontSize: 11.5, fontWeight: 700, padding: "8px 12px", borderRadius: 999, border: `1px solid ${T.border}`, background: "transparent", color: T.text, cursor: "pointer", whiteSpace: "nowrap" }}>{p.inStock === false ? "Mark in stock" : "Mark out of stock"}</button>
                  <button onClick={() => startEditProduct(p)} style={{ padding: 9, borderRadius: 999, border: `1px solid ${T.border}`, background: "transparent", cursor: "pointer", display: "flex" }}><Edit2 size={13} color={T.text} /></button>
                  <button onClick={() => deleteProduct(p.id)} style={{ padding: 9, borderRadius: 999, border: `1px solid ${T.border}`, background: "transparent", cursor: "pointer", display: "flex" }}><Trash2 size={13} color={T.rust} /></button>
                </div>
              ))}
              {supplierProducts.length === 0 && <div style={{ textAlign: "center", padding: "60px 0", color: T.textMute }}>No fabrics listed yet — add your first one.</div>}
            </div>
          </div>
        )}
 
        {supplierTab === "orders" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {supplierOrders.length === 0 && <div style={{ textAlign: "center", padding: "60px 0", color: T.textMute }}>No orders yet.</div>}
            {supplierOrders.map((o) => {
              const myItems = o.items.filter((it) => productById(it.productId)?.supplierId === currentSupplier.id);
              return (
                <div key={o.id} className="wf-card" style={{ borderColor: T.border, background: T.card, padding: 18 }}>
                  <div className="wf-row" style={{ justifyContent: "space-between", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13.5, color: T.text }}>Order #{o.id.slice(-6).toUpperCase()} — {o.buyerName}</div>
                      <div style={{ fontSize: 11.5, color: T.textMute }}>{new Date(o.createdAt).toLocaleDateString()}</div>
                    </div>
                    <select value={o.status} onChange={(e) => updateOrderStatus(o.id, e.target.value)} style={{ fontSize: 12, fontWeight: 700, borderRadius: 999, border: `1px solid ${T.border}`, padding: "7px 14px", background: T.surface, color: T.text }}>
                      {["Pending", "Confirmed", "Shipped", "Delivered"].map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  {myItems.map((it, i) => <div key={i} className="wf-row" style={{ justifyContent: "space-between", fontSize: 12.5, color: T.textMute }}><span>{it.name} × {it.qty}m</span><span>{currency(it.price * it.qty)}</span></div>)}
                </div>
              );
            })}
          </div>
        )}
 
        {supplierTab === "profile" && (
          <div className="wf-card" style={{ maxWidth: 480, borderColor: T.border, background: T.card, padding: 22 }}>
            <div className="wf-row" style={{ gap: 14, marginBottom: 18 }}>
              <div className="wf-display" style={{ width: 52, height: 52, borderRadius: 999, background: T.inkBg, color: dark ? "#0F1319" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19 }}>{initials(currentSupplier.company)}</div>
              <div><div style={{ fontWeight: 700, fontSize: 14.5, color: T.text }}>{currentSupplier.company}</div><div style={{ fontSize: 13, color: T.textMute }}>{currentSupplier.contact}</div></div>
            </div>
            <div style={{ fontSize: 13, display: "flex", flexDirection: "column", gap: 10, color: T.textMute }}>
              <div className="wf-row" style={{ gap: 8 }}><Mail size={13} />{currentSupplier.email}</div>
              <div className="wf-row" style={{ gap: 8 }}><Phone size={13} />{currentSupplier.phone || "—"}</div>
              <div className="wf-row" style={{ gap: 8 }}><MapPin size={13} />{currentSupplier.location || "—"}</div>
              <div className="wf-row" style={{ gap: 8, alignItems: "flex-start" }}><Building2 size={13} style={{ marginTop: 2, flexShrink: 0 }} />{currentSupplier.description}</div>
            </div>
          </div>
        )}
      </div>
    );
  }
 
  /* =======================================================================
     ROOT
  ======================================================================= */
  if (!dataLoaded) {
    const shimmer = { background: "linear-gradient(90deg, #EFE7D6 25%, #FBF7EC 37%, #EFE7D6 63%)", backgroundSize: "400% 100%", animation: "wf-shimmer 1.4s ease infinite", borderRadius: 12 };
    return (
      <div style={{ minHeight: "100vh", background: "#F4EEE0" }}>
        <style>{`@keyframes wf-shimmer { 0% { background-position: 100% 50%; } 100% { background-position: 0 50%; } }`}</style>
        <div style={{ height: 66, borderBottom: "1px solid #E6D9BB", display: "flex", alignItems: "center", padding: "0 20px" }}>
          <div style={{ ...shimmer, width: 140, height: 22 }} />
        </div>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "76px 20px 40px" }}>
          <div style={{ ...shimmer, width: 220, height: 14, marginBottom: 22 }} />
          <div style={{ ...shimmer, width: "70%", height: 48, marginBottom: 14 }} />
          <div style={{ ...shimmer, width: "45%", height: 48, marginBottom: 28 }} />
          <div style={{ ...shimmer, width: 320, height: 14 }} />
        </div>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i}>
                <div style={{ ...shimmer, height: 152, marginBottom: 10 }} />
                <div style={{ ...shimmer, width: "60%", height: 12, marginBottom: 8 }} />
                <div style={{ ...shimmer, width: "80%", height: 14 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "'Inter', ui-sans-serif, system-ui" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        .wf-display { font-family: 'Fraunces', Georgia, serif; font-weight: 600; letter-spacing: -0.01em; }
        .wf-mono { font-family: 'IBM Plex Mono', monospace; }
        .wf-row { display: flex; align-items: center; }
        .wf-card { border: 1px solid; border-radius: 18px; }
        .wf-lift { transition: transform .22s ease, box-shadow .22s ease; }
        .wf-lift:hover { transform: translateY(-4px); box-shadow: ${T.shadow}; }
        .wf-btn { transition: transform .15s ease, opacity .15s ease; }
        .wf-btn:hover { transform: translateY(-1px); opacity: 0.92; }
        .wf-chip-hover { transition: border-color .15s ease, transform .15s ease; }
        .wf-chip-hover:hover { border-color: ${T.rust} !important; transform: translateY(-1px); }
        .wf-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .wf-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .wf-market-grid { display: grid; grid-template-columns: 250px 1fr; gap: 32px; align-items: start; }
        .wf-filter-backdrop { position: fixed; inset: 0; z-index: 55; background: rgba(0,0,0,0.45); display: flex; animation: wf-fadeup .18s ease; }
        .wf-filter-drawer { width: min(320px, 86vw); height: 100%; overflow-y: auto; animation: wf-rise .22s ease; }
        .wf-filter-panel { border-radius: 0; height: 100%; border-width: 0 1px 0 0; }
        .wf-product-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
        .wf-hero-grid { grid-template-columns: 1.1fr 0.9fr; align-items: center; }
        .wf-ai-grid { grid-template-columns: 1fr 1fr; }
        .wf-cart-row { display: flex; align-items: center; gap: 14px; }
        .wf-swatch-stack { position: relative; height: 420px; display: flex; align-items: center; justify-content: center; }
        .wf-swatch-card { position: absolute; width: 152px; height: 210px; border-radius: 6px; box-shadow: 0 20px 40px rgba(0,0,0,0.28); cursor: pointer; transition: transform .3s ease, z-index 0s; animation: wf-drop .6s ease backwards; }
        .wf-swatch-card:hover { transform: translateY(-14px) !important; }
        .wf-fab { position: fixed; bottom: 24px; right: 24px; z-index: 40; width: 56px; height: 56px; border-radius: 999px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 24px rgba(181,86,60,0.4); animation: wf-pulse 2.4s ease-in-out infinite; }
        .wf-chat { position: fixed; bottom: 24px; right: 24px; z-index: 50; width: min(380px, 92vw); height: min(560px, 70vh); border-radius: 20px; border: 1px solid; display: flex; flex-direction: column; overflow: hidden; animation: wf-rise .25s ease; }
        .wf-fade-up { animation: wf-fadeup .6s ease backwards; }
        .wf-pop { animation: wf-pop .45s cubic-bezier(.34,1.56,.64,1) backwards; }
        .wf-spin { animation: spin 0.9s linear infinite; }
        .wf-skeleton { background: linear-gradient(90deg, ${T.chipBg} 25%, ${T.cardHover} 37%, ${T.chipBg} 63%); background-size: 400% 100%; animation: wf-shimmer 1.4s ease infinite; border-radius: 12px; }
        @keyframes wf-shimmer { 0% { background-position: 100% 50%; } 100% { background-position: 0 50%; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes wf-drop { from { opacity: 0; transform: translateY(-24px) rotate(0deg) !important; } }
        @keyframes wf-pulse { 0%,100% { box-shadow: 0 10px 24px rgba(181,86,60,0.4); } 50% { box-shadow: 0 10px 30px rgba(181,86,60,0.65); } }
        @keyframes wf-rise { from { opacity: 0; transform: translateY(16px) scale(0.97); } }
        @keyframes wf-fadeup { from { opacity: 0; transform: translateY(14px); } }
        @keyframes wf-pop { from { opacity: 0; transform: scale(0.6); } }
        .wf-show-mobile { display: none; }
        @media (max-width: 860px) {
          .wf-hide-mobile { display: none !important; }
          .wf-show-mobile { display: flex !important; }
          .wf-grid-3, .wf-grid-4 { grid-template-columns: repeat(2, 1fr); }
          .wf-market-grid, .wf-product-grid, .wf-ai-grid, .wf-hero-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 520px) {
          .wf-grid-3, .wf-grid-4 { grid-template-columns: 1fr 1fr; gap: 12px; }
        }
        input, select, textarea, button { font-family: inherit; }
        input:focus, select:focus, textarea:focus { outline: 2px solid ${T.rust}; outline-offset: 1px; }
      `}</style>
 
      {NavBar()}
      {view === "landing" && LandingPage()}
      {view === "marketplace" && MarketplacePage()}
      {view === "product" && ProductPage()}
      {view === "cart" && CartPage()}
      {view === "checkout" && session?.type === "buyer" && cartLines.length > 0 && CheckoutPage()}
      {view === "confirmation" && ConfirmationPage()}
      {view === "buyer-login" && BuyerAuthPage()}
      {view === "supplier-login" && SupplierAuthPage()}
      {view === "buyer-onboarding" && (session?.type === "buyer" ? BuyerOnboardingPage() : BuyerAuthPage())}
      {view === "supplier-onboarding" && (session?.type === "supplier" ? SupplierOnboardingPage() : SupplierAuthPage())}
      {view === "buyer-dashboard" && (session?.type === "buyer" ? BuyerDashboard() : BuyerAuthPage())}
      {view === "supplier-dashboard" && (session?.type === "supplier" ? SupplierDashboard() : SupplierAuthPage())}
      {Footer()}
      {ChatWidget()}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: 24, zIndex: 50, padding: "12px 18px", borderRadius: 12, color: dark ? "#0F1319" : "#fff", background: T.inkBg, fontSize: 13.5, boxShadow: T.shadow, display: "flex", alignItems: "center", gap: 8, animation: "wf-fadeup .25s ease" }}>
          <CheckCircle size={15} color={T.gold} /> {toast}
        </div>
      )}
    </div>
  );
}
 
 



