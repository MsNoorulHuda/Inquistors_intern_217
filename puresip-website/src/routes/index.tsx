import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Leaf,
  Truck,
  ChefHat,
  ShoppingBag,
  Star,
  Phone,
  MapPin,
  Mail,
  Instagram,
  Facebook,
  MessageCircle,
  X,
  Flame,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import logoAsset from "@/assets/puresip-logo.png.asset.json";
import imgDetoxGreen from "@/assets/juice-detox-green.jpg";
import imgBeetBoost from "@/assets/juice-beet-boost.jpg";
import imgCitrusPunch from "@/assets/juice-citrus-punch.jpg";
import imgMixedBerry from "@/assets/juice-mixed-berry.jpg";
import imgTropicalGlow from "@/assets/juice-tropical-glow.jpg";
import imgImmunityShot from "@/assets/juice-immunity-shot.jpg";
import imgProteinBites from "@/assets/snack-protein-bites.jpg";
import imgChiaParfait from "@/assets/snack-chia-parfait.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PureSip — Fresh Cold-Pressed Juices & Healthy Snacks | Lahore" },
      {
        name: "description",
        content:
          "Order fresh cold-pressed juices and healthy snacks in Lahore. Made daily, no preservatives, delivered to your door.",
      },
      { property: "og:title", content: "PureSip — Fresh Cold-Pressed Juices & Healthy Snacks | Lahore" },
      {
        property: "og:description",
        content: "Order fresh cold-pressed juices and healthy snacks in Lahore. Made daily, no preservatives, delivered to your door.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const WHATSAPP_NUMBER = "923001234567"; // placeholder

type Nutrition = {
  kcal: number;
  protein: number; // grams
  carbs: number;
  sugar: number;
  fat: number;
  fibre: number;
};

type Product = {
  name: string;
  desc: string;
  price: string;
  image: string;
  badges: string[];
  ingredients: string[];
  allergens: string[];
  nutrition: Nutrition;
  bestSeller?: boolean;
};

const products: Product[] = [
  {
    name: "Detox Green",
    desc: "Spinach, cucumber, apple, ginger, lemon",
    price: "Rs. 450",
    image: imgDetoxGreen,
    badges: ["Vegan", "Detox", "Low Sugar"],
    ingredients: ["Spinach", "Cucumber", "Green apple", "Ginger", "Lemon"],
    allergens: ["None"],
    nutrition: { kcal: 90, protein: 2, carbs: 20, sugar: 14, fat: 0.5, fibre: 3 },
    bestSeller: true,
  },
  {
    name: "Beet Boost",
    desc: "Beetroot, carrot, apple, lemon",
    price: "Rs. 450",
    image: imgBeetBoost,
    badges: ["Iron+", "Vegan", "Antioxidant"],
    ingredients: ["Beetroot", "Carrot", "Apple", "Lemon"],
    allergens: ["None"],
    nutrition: { kcal: 120, protein: 2, carbs: 28, sugar: 22, fat: 0.3, fibre: 4 },
  },
  {
    name: "Citrus Punch",
    desc: "Orange, grapefruit, lemon, mint",
    price: "Rs. 400",
    image: imgCitrusPunch,
    badges: ["Vitamin C", "Vegan", "Immunity"],
    ingredients: ["Orange", "Grapefruit", "Lemon", "Fresh mint"],
    allergens: ["None"],
    nutrition: { kcal: 110, protein: 2, carbs: 26, sugar: 21, fat: 0.4, fibre: 2 },
    bestSeller: true,
  },
  {
    name: "Mixed Berry",
    desc: "Strawberry, blueberry, pomegranate",
    price: "Rs. 550",
    image: imgMixedBerry,
    badges: ["Antioxidant", "Vegan", "Vitamin C"],
    ingredients: ["Strawberry", "Blueberry", "Pomegranate", "Apple"],
    allergens: ["None"],
    nutrition: { kcal: 130, protein: 1.5, carbs: 30, sugar: 24, fat: 0.5, fibre: 4 },
  },
  {
    name: "Tropical Glow",
    desc: "Mango, pineapple, passionfruit",
    price: "Rs. 500",
    image: imgTropicalGlow,
    badges: ["Vegan", "Vitamin C"],
    ingredients: ["Mango", "Pineapple", "Passionfruit", "Lime"],
    allergens: ["None"],
    nutrition: { kcal: 140, protein: 1.5, carbs: 32, sugar: 26, fat: 0.4, fibre: 3 },
  },
  {
    name: "Immunity Shot",
    desc: "Ginger, turmeric, lemon, honey",
    price: "Rs. 200",
    image: imgImmunityShot,
    badges: ["Immunity", "Anti-inflam", "Low Sugar"],
    ingredients: ["Fresh ginger", "Turmeric root", "Lemon", "Raw honey", "Black pepper"],
    allergens: ["None"],
    nutrition: { kcal: 45, protein: 0.5, carbs: 11, sugar: 9, fat: 0.1, fibre: 0.5 },
  },
  {
    name: "Protein Bites",
    desc: "Dates, oats, almonds, cocoa (6 pcs)",
    price: "Rs. 600",
    image: imgProteinBites,
    badges: ["High Protein", "Gluten-Free"],
    ingredients: ["Medjool dates", "Rolled oats", "Almonds", "Cocoa", "Chia seeds"],
    allergens: ["Tree nuts (almonds)"],
    nutrition: { kcal: 180, protein: 6, carbs: 24, sugar: 14, fat: 7, fibre: 5 },
    bestSeller: true,
  },
  {
    name: "Chia Parfait",
    desc: "Chia, coconut milk, fresh fruits",
    price: "Rs. 500",
    image: imgChiaParfait,
    badges: ["Omega-3", "High Fibre", "Vegan"],
    ingredients: ["Chia seeds", "Coconut milk", "Mango", "Berries", "Maple syrup"],
    allergens: ["Coconut"],
    nutrition: { kcal: 210, protein: 5, carbs: 22, sugar: 12, fat: 12, fibre: 8 },
  },
];

const ALL_FILTERS = [
  "Vegan",
  "Vitamin C",
  "High Protein",
  "Low Sugar",
  "Antioxidant",
  "Immunity",
  "Gluten-Free",
];

const testimonials = [
  {
    name: "Ayesha K.",
    text: "The Detox Green is my morning ritual now. Genuinely tastes fresh — you can tell it's made the same day.",
    role: "DHA, Lahore",
  },
  {
    name: "Hamza R.",
    text: "Ordered the Protein Bites for post-workout. Clean ingredients and actually filling. Delivery was on time too.",
    role: "Gulberg, Lahore",
  },
  {
    name: "Sana M.",
    text: "Finally a local brand that skips the sugar and preservatives. The Beet Boost is unreal.",
    role: "Bahria Town, Lahore",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <BestSellers />
      <About />
      <Menu />
      <HowItWorks />
      <Testimonials />
      <Order />
      <Footer />
    </div>
  );
}

function BestSellers() {
  const [openProduct, setOpenProduct] = useState<Product | null>(null);
  const items = products.filter((p) => p.bestSeller);
  return (
    <section className="mx-auto max-w-6xl px-5 pt-16 md:pt-20">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-widest text-primary">
            <Flame className="h-4 w-4 text-[oklch(0.72_0.16_65)]" /> Best Sellers
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            This week's favourites
          </h2>
        </div>
      </div>
      <Carousel opts={{ align: "start", loop: true }} className="w-full">
        <CarouselContent className="-ml-4">
          {items.map((p) => (
            <CarouselItem key={p.name} className="basis-full pl-4 sm:basis-1/2 lg:basis-1/3">
              <button
                type="button"
                onClick={() => setOpenProduct(p)}
                className="group relative flex w-full flex-col overflow-hidden rounded-3xl border border-border bg-card text-left shadow-card transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-soft"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    width={768}
                    height={576}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[oklch(0.72_0.16_65)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[oklch(0.2_0.05_60)] shadow-sm">
                    <Flame className="h-3 w-3" /> Best Seller
                  </span>
                </div>
                <div className="flex items-end justify-between gap-3 p-5">
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold">{p.name}</h3>
                    <p className="mt-1 truncate text-sm text-muted-foreground">{p.desc}</p>
                  </div>
                  <span className="shrink-0 text-xl font-extrabold text-primary">{p.price}</span>
                </div>
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
      <ProductModal product={openProduct} onOpenChange={(o) => !o && setOpenProduct(null)} />
    </section>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <a href="#top" className="flex items-center gap-2">
          <img src={logoAsset.url} alt="PureSip" className="h-9 w-9 object-contain" />
          <span className="text-lg font-extrabold tracking-tight text-primary">PureSip</span>
        </a>
        <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          <a href="#menu" className="transition-colors hover:text-primary">Menu</a>
          <a href="#about" className="transition-colors hover:text-primary">About</a>
          <a href="#how" className="transition-colors hover:text-primary">How it works</a>
          <a href="#order" className="transition-colors hover:text-primary">Contact</a>
        </nav>
        <a
          href="#order"
          className="rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-105"
        >
          Order Now
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-hero">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 pt-14 pb-20 md:grid-cols-2 md:pt-24 md:pb-28">
        <div className="text-center md:text-left">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Leaf className="h-3.5 w-3.5" /> Made fresh in Lahore
          </span>
          <h1 className="mt-5 text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground md:text-6xl">
            Fresh. <span className="text-primary">Pure.</span>{" "}
            <span className="text-[oklch(0.72_0.16_65)]">Delivered.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-lg text-muted-foreground md:mx-0">
            Cold-pressed juices and wholesome snacks — prepared the same morning, delivered
            straight to your door.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <a
              href="#order"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-105"
            >
              <ShoppingBag className="h-4 w-4" /> Order Now
            </a>
            <a
              href="#menu"
              className="inline-flex items-center rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              View Menu
            </a>
          </div>
        </div>
        <div className="relative flex items-center justify-center">
          <div className="absolute h-72 w-72 rounded-full bg-primary/15 blur-3xl md:h-96 md:w-96" />
          <div className="absolute right-8 top-6 h-24 w-24 rounded-full bg-accent/40 blur-2xl" />
          <img
            src={logoAsset.url}
            alt="PureSip logo"
            className="relative w-64 max-w-full drop-shadow-xl md:w-80"
          />
        </div>
      </div>
    </section>
  );
}

function About() {
  const items = [
    { icon: Leaf, title: "No preservatives", text: "Just fruit, veg, and cold-pressed goodness." },
    { icon: ChefHat, title: "Prepared daily", text: "Every bottle is made the morning it ships." },
    { icon: Truck, title: "Made with love", text: "A small home kitchen serving Lahore locally." },
  ];
  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Our Story</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
          Started at home, brewed with intention
        </h2>
        <p className="mt-4 text-muted-foreground">
          PureSip began in a small Lahore kitchen with one simple belief — that clean, honest juice
          shouldn't be a luxury. No shortcuts, no additives. Just real produce, pressed fresh, and
          delivered before the day gets busy.
        </p>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {items.map((i) => (
          <div
            key={i.title}
            className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-soft"
          >
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <i.icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">{i.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{i.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Menu() {
  const [active, setActive] = useState<string[]>([]);
  const [openProduct, setOpenProduct] = useState<Product | null>(null);

  const toggle = (f: string) =>
    setActive((cur) => (cur.includes(f) ? cur.filter((x) => x !== f) : [...cur, f]));

  const filtered = useMemo(
    () =>
      active.length === 0
        ? products
        : products.filter((p) => active.every((f) => p.badges.includes(f))),
    [active],
  );

  return (
    <section id="menu" className="bg-secondary/40 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">The Menu</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Bottled goodness, made this morning
          </h2>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setActive([])}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              active.length === 0
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            All
          </button>
          {ALL_FILTERS.map((f) => {
            const on = active.includes(f);
            return (
              <button
                key={f}
                type="button"
                onClick={() => toggle(f)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  on
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <p className="mt-12 text-center text-sm text-muted-foreground">
            No items match those filters. Try removing one.
          </p>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((p) => (
              <button
                type="button"
                key={p.name}
                onClick={() => setOpenProduct(p)}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-left shadow-card transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-soft"
              >
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-secondary to-background">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    width={768}
                    height={768}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute right-2 top-2 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground shadow-sm backdrop-blur">
                    {p.nutrition.kcal} kcal
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base font-bold">{p.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.badges.map((b) => (
                      <span
                        key={b}
                        className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-1 items-end justify-between">
                    <span className="text-lg font-extrabold text-primary">{p.price}</span>
                    <span className="rounded-full bg-[oklch(0.78_0.15_65)] px-3 py-1.5 text-xs font-semibold text-[oklch(0.25_0.05_60)] transition-transform group-hover:scale-105">
                      View
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <ProductModal product={openProduct} onOpenChange={(o) => !o && setOpenProduct(null)} />
    </section>
  );
}

function ProductModal({
  product,
  onOpenChange,
}: {
  product: Product | null;
  onOpenChange: (open: boolean) => void;
}) {
  const p = product;
  return (
    <Dialog open={!!p} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto p-0">
        {p && (
          <div>
            <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
              <img
                src={p.image}
                alt={p.name}
                className="h-full w-full object-cover"
              />
              {p.bestSeller && (
                <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-[oklch(0.72_0.16_65)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[oklch(0.2_0.05_60)] shadow-sm">
                  <Flame className="h-3 w-3" /> Best Seller
                </span>
              )}
            </div>
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <DialogTitle className="text-2xl font-extrabold">{p.name}</DialogTitle>
                  <DialogDescription className="mt-1 text-sm text-muted-foreground">
                    {p.desc}
                  </DialogDescription>
                </div>
                <span className="shrink-0 text-2xl font-extrabold text-primary">{p.price}</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.badges.map((b) => (
                  <span
                    key={b}
                    className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary"
                  >
                    {b}
                  </span>
                ))}
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Ingredients
                  </h4>
                  <ul className="mt-3 space-y-1.5 text-sm">
                    {p.ingredients.map((i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {i}
                      </li>
                    ))}
                  </ul>
                  <h4 className="mt-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Allergens
                  </h4>
                  <p className="mt-2 text-sm">{p.allergens.join(", ")}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Nutrition (per serving)
                  </h4>
                  <div className="mt-3 divide-y divide-border rounded-xl border border-border">
                    {[
                      ["Calories", `${p.nutrition.kcal} kcal`],
                      ["Protein", `${p.nutrition.protein} g`],
                      ["Carbs", `${p.nutrition.carbs} g`],
                      ["of which sugars", `${p.nutrition.sugar} g`],
                      ["Fat", `${p.nutrition.fat} g`],
                      ["Fibre", `${p.nutrition.fibre} g`],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between px-4 py-2.5 text-sm">
                        <span className="text-muted-foreground">{k}</span>
                        <span className="font-semibold">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi PureSip! I'd like to order: " + p.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.01]"
              >
                <ShoppingBag className="h-4 w-4" /> Order {p.name} on WhatsApp
              </a>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function HowItWorks() {
  const steps = [
    { icon: ShoppingBag, title: "Order", text: "Pick your juices or snacks via WhatsApp or the form below." },
    { icon: ChefHat, title: "Prepare Fresh", text: "We cold-press and pack your order the same morning." },
    { icon: Truck, title: "Deliver", text: "Chilled delivery to your doorstep across Lahore." },
  ];
  return (
    <section id="how" className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">How it works</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Three simple steps</h2>
      </div>
      <div className="relative mt-14 grid gap-8 md:grid-cols-3">
        {steps.map((s, idx) => (
          <div key={s.title} className="relative text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-soft">
              <s.icon className="h-7 w-7" />
            </div>
            <div className="mt-4 inline-block rounded-full bg-secondary px-3 py-0.5 text-xs font-bold text-primary">
              Step {idx + 1}
            </div>
            <h3 className="mt-3 text-xl font-bold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="bg-secondary/40 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Loved locally</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            What our sippers say
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-border bg-card p-6 shadow-card transition-transform hover:-translate-y-1"
            >
              <div className="flex gap-0.5 text-[oklch(0.78_0.15_65)]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-foreground">"{t.text}"</p>
              <div className="mt-5">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Order() {
  const [form, setForm] = useState({ name: "", phone: "", address: "", details: "" });

  const waHref = () => {
    const msg = `Hi PureSip! I'd like to place an order.%0A%0AName: ${form.name}%0APhone: ${form.phone}%0AAddress: ${form.address}%0AOrder: ${form.details}`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
  };

  return (
    <section id="order" className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      <div className="grid gap-10 rounded-3xl border border-border bg-card p-6 shadow-card md:grid-cols-2 md:p-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Order / Contact</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Place your order
          </h2>
          <p className="mt-3 text-muted-foreground">
            Fill in your details and we'll confirm on WhatsApp. Fastest response between 9am–8pm.
          </p>
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Phone className="h-4 w-4 text-primary" /> +92 300 1234567
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Mail className="h-4 w-4 text-primary" /> hello@puresip.pk
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" /> Lahore, Pakistan
            </div>
          </div>
          <a
            href={waHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-soft transition-transform hover:scale-105"
          >
            <MessageCircle className="h-4 w-4" /> Order on WhatsApp
          </a>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            window.open(waHref(), "_blank");
          }}
          className="space-y-4"
        >
          <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Input label="Phone" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <Input label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Order details
            </label>
            <textarea
              required
              rows={4}
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
              placeholder="e.g. 2x Detox Green, 1x Protein Bites"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]"
          >
            Send Order
          </button>
        </form>
      </div>
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
      />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <img src={logoAsset.url} alt="PureSip" className="h-8 w-8 object-contain" />
            <span className="text-lg font-extrabold text-primary">PureSip</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Fresh cold-pressed juices and healthy snacks, delivered daily across Lahore.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Contact</p>
          <p className="mt-3">+92 300 1234567</p>
          <p>hello@puresip.pk</p>
          <p>Lahore, Pakistan</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Follow</p>
          <div className="mt-3 flex gap-3">
            <SocialIcon href="#" label="Instagram"><Instagram className="h-4 w-4" /></SocialIcon>
            <SocialIcon href="#" label="Facebook"><Facebook className="h-4 w-4" /></SocialIcon>
            <SocialIcon href={`https://wa.me/${WHATSAPP_NUMBER}`} label="WhatsApp"><MessageCircle className="h-4 w-4" /></SocialIcon>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} PureSip. All rights reserved.
      </div>
    </footer>
  );
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
    >
      {children}
    </a>
  );
}
