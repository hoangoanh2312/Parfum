import {
  ArrowRight,
  Check,
  Flower2,
  Leaf,
  Loader2,
  Plus,
  Search,
  Sparkles,
  Trees,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { toast } from "../../store/toast.store";

const scentFamilies = [
  {
    id: "woody",
    name: "Woody",
    description: "Gỗ đàn hương, tuyết tùng, trầm hương",
    icon: Trees,
  },
  {
    id: "floral",
    name: "Floral",
    description: "Hoa hồng, hoa nhài, dành dành",
    icon: Flower2,
  },
  {
    id: "fresh",
    name: "Fresh",
    description: "Cam bergamot, chanh, hương biển",
    icon: Leaf,
  },
  {
    id: "oriental",
    name: "Oriental",
    description: "Hổ phách, vanilla, gia vị ấm",
    icon: Sparkles,
  },
];

const defaultPreferredNotes = [
  "Oud",
  "Amber",
  "Bergamot",
  "Sandalwood",
  "Vanilla",
  "Musk",
];

const defaultDislikedNotes = ["Tobacco", "Leather"];

interface ScentProfileData {
  families: string[];
  preferredNotes: string[];
  dislikedNotes: string[];
}

interface ProductNotesResponse {
  data: Array<{
    notes?: {
      top?: string[];
      middle?: string[];
      base?: string[];
    };
  }>;
}

export default function ScentProfile() {
  const [families, setFamilies] = useState<string[]>(["woody", "fresh", "oriental"]);
  const [preferredNotes, setPreferredNotes] = useState<string[]>(defaultPreferredNotes);
  const [dislikedNotes, setDislikedNotes] = useState<string[]>(defaultDislikedNotes);
  const [preferredDraft, setPreferredDraft] = useState("");
  const [dislikedDraft, setDislikedDraft] = useState("");
  const [preferredOpen, setPreferredOpen] = useState(false);
  const [dislikedOpen, setDislikedOpen] = useState(false);
  const [noteOptions, setNoteOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    api
      .get<ScentProfileData>("/account/scent-profile")
      .then(({ data }) => {
        if (!mounted) return;
        setFamilies(data.families || []);
        setPreferredNotes(data.preferredNotes || []);
        setDislikedNotes(data.dislikedNotes || []);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Không thể tải hồ sơ mùi hương");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    api
      .get<ProductNotesResponse>("/products", { params: { limit: 100 } })
      .then(({ data }) => {
        if (!mounted || !Array.isArray(data.data)) return;
        const notes = data.data.flatMap((product) => [
          ...(product.notes?.top || []),
          ...(product.notes?.middle || []),
          ...(product.notes?.base || []),
        ]);
        setNoteOptions(
          Array.from(new Set(notes.map((note) => String(note).trim()).filter(Boolean))).sort((a, b) =>
            a.localeCompare(b),
          ),
        );
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, []);

  const selectedFamilyNames = useMemo(
    () =>
      scentFamilies
        .filter((item) => families.includes(item.id))
        .map((item) => item.name)
        .join(" "),
    [families],
  );
  const selectedFamilyFilters = useMemo(
    () =>
      scentFamilies
        .filter((item) => families.includes(item.id))
        .map((item) => item.name),
    [families],
  );
  const discoverPath =
    selectedFamilyFilters.length > 0
      ? `/shop?scent=${encodeURIComponent(selectedFamilyFilters.join(","))}`
      : "/shop";

  const toggleFamily = (id: string) => {
    setFamilies((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const addNote = (type: "preferred" | "disliked") => {
    const normalized = (type === "preferred" ? preferredDraft : dislikedDraft).trim();
    if (!normalized) return;
    const matchedOption = noteOptions.find((item) => item.toLowerCase() === normalized.toLowerCase());

    if (!matchedOption) {
      toast.error("Vui lòng chọn nốt hương trong danh sách");
      return;
    }

    if (type === "preferred") {
      if (preferredNotes.includes(matchedOption)) {
        toast.error("Nốt hương này đã có trong danh sách");
        return;
      }

      setPreferredNotes((prev) => [...prev, matchedOption]);
      setPreferredDraft("");
      return;
    }

    if (dislikedNotes.includes(matchedOption)) {
      toast.error("Nốt hương này đã có trong danh sách");
      return;
    }

    setDislikedNotes((prev) => [...prev, matchedOption]);
    setDislikedDraft("");
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const { data } = await api.put<ScentProfileData>("/account/scent-profile", {
        families,
        preferredNotes,
        dislikedNotes,
      });
      setFamilies(data.families || []);
      setPreferredNotes(data.preferredNotes || []);
      setDislikedNotes(data.dislikedNotes || []);
      toast.success("Đã lưu hồ sơ mùi hương");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể lưu hồ sơ mùi hương");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF9F4] text-[#2D2925]">
      <section className="border-b border-[#E7E0D7] px-6 pb-7 pt-12 lg:px-12">
        <p className="text-[10px] uppercase tracking-[0.28em] text-[#9B9288]">
          Personal Portal
        </p>

        <h1 className="mt-2 font-serif text-4xl lg:text-5xl">
          Scent Profile
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7C746C]">
          Hồ sơ mùi hương giúp chúng tôi đề xuất các sản phẩm phù hợp với sở
          thích và phong cách của bạn.
        </p>
      </section>

      <main className="space-y-10 px-6 py-10 lg:px-12">
        {loading && (
          <div className="flex items-center gap-3 border border-[#E2DBD2] bg-[#FFFDF9] p-5 text-sm text-[#7C746C]">
            <Loader2 size={16} className="animate-spin" />
            Đang tải hồ sơ mùi hương...
          </div>
        )}

        <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="bg-[#F2EEE9] p-7 lg:p-9">
            <p className="text-[9px] uppercase tracking-[0.24em] text-[#978D82]">
              Your Scent DNA
            </p>

            <h2 className="mt-3 font-serif text-3xl">
              {selectedFamilyNames || "Chưa chọn nhóm hương"}
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#70685F]">
              Phong cách mùi hương của bạn thiên về nhóm gỗ phương Đông với
              các nốt trầm hương, gỗ đàn hương và hổ phách. Bạn phù hợp với
              những mùi hương ấm áp, sâu lắng và sang trọng.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {preferredNotes.slice(0, 4).map((note) => (
                <span
                  key={note}
                  className="border border-[#D4CCC2] bg-[#FCF9F4] px-4 py-2 text-[9px] uppercase tracking-[0.14em]"
                >
                  {note}
                </span>
              ))}
            </div>

            <Link
              to={discoverPath}
              className="mt-7 flex items-center gap-3 bg-[#816A00] px-6 py-3 text-[10px] uppercase tracking-[0.15em] text-white hover:bg-[#675500]"
            >
              Khám phá sản phẩm phù hợp
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="flex min-h-[320px] items-center justify-center overflow-hidden bg-[#D9D0C4]">
            <img
              src="https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=1000&auto=format&fit=crop"
              alt="Scent profile"
              className="h-full w-full object-cover"
            />
          </div>
        </section>

        <section>
          <div className="mb-6">
            <h2 className="font-serif text-2xl">Nhóm hương yêu thích</h2>

            <p className="mt-2 text-sm text-[#81786F]">
              Chọn những nhóm mùi hương phù hợp với sở thích của bạn.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {scentFamilies.map((item) => {
              const Icon = item.icon;
              const selected = families.includes(item.id);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleFamily(item.id)}
                  className={`relative min-h-[180px] border p-6 text-left transition ${
                    selected
                      ? "border-[#9A7D00] bg-[#F2EDDC]"
                      : "border-[#E0D9D0] bg-[#FFFDF9] hover:border-[#B7AA9A]"
                  }`}
                >
                  {selected && (
                    <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-[#927600] text-white">
                      <Check size={13} />
                    </span>
                  )}

                  <Icon size={25} strokeWidth={1.3} />

                  <h3 className="mt-7 font-serif text-xl">{item.name}</h3>

                  <p className="mt-2 text-xs leading-5 text-[#81786F]">
                    {item.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="border border-[#E2DBD2] bg-[#FFFDF9] p-7">
            <h2 className="font-serif text-2xl">Nốt hương yêu thích</h2>

            <p className="mt-2 text-sm text-[#81786F]">
              Các nốt hương thường xuyên xuất hiện trong lựa chọn của bạn.
            </p>

            <div className="mt-6 space-y-5">
              <div className="flex flex-wrap gap-3">
                {preferredNotes.map((note) => (
                  <button
                    key={note}
                    type="button"
                    onClick={() => setPreferredNotes((prev) => prev.filter((item) => item !== note))}
                    className="border border-[#B69A27] bg-[#F3EEDC] px-4 py-2 text-[10px] uppercase tracking-[0.13em] text-[#765F00]"
                  >
                    {note} ×
                  </button>
                ))}
              </div>

              <NotePicker
                value={preferredDraft}
                options={noteOptions}
                selected={preferredNotes}
                placeholder="Chọn nốt hương yêu thích"
                accentClassName="bg-[#8A7000] hover:bg-[#6D5900]"
                open={preferredOpen}
                onOpenChange={setPreferredOpen}
                onChange={setPreferredDraft}
                onAdd={() => addNote("preferred")}
                onSelect={(note) => {
                  setPreferredDraft(note);
                  if (!preferredNotes.includes(note)) setPreferredNotes((prev) => [...prev, note]);
                  setPreferredDraft("");
                  setPreferredOpen(false);
                }}
              />
            </div>
          </div>

          <div className="border border-[#E2DBD2] bg-[#FFFDF9] p-7">
            <h2 className="font-serif text-2xl">Nốt hương không yêu thích</h2>

            <p className="mt-2 text-sm text-[#81786F]">
              Chúng tôi sẽ hạn chế đề xuất sản phẩm chứa các nốt hương này.
            </p>

            <div className="mt-6 space-y-5">
              <div className="flex flex-wrap gap-3">
                {dislikedNotes.map((note) => (
                  <button
                    key={note}
                    type="button"
                    onClick={() => setDislikedNotes((prev) => prev.filter((item) => item !== note))}
                    className="border border-[#D6CFC6] bg-[#F4F1ED] px-4 py-2 text-[10px] uppercase tracking-[0.13em] text-[#6F6861]"
                  >
                    {note} ×
                  </button>
                ))}
              </div>

              <NotePicker
                value={dislikedDraft}
                options={noteOptions}
                selected={dislikedNotes}
                placeholder="Chọn nốt hương không thích"
                accentClassName="bg-[#6F6861] hover:bg-[#514B45]"
                open={dislikedOpen}
                onOpenChange={setDislikedOpen}
                onChange={setDislikedDraft}
                onAdd={() => addNote("disliked")}
                onSelect={(note) => {
                  setDislikedDraft(note);
                  if (!dislikedNotes.includes(note)) setDislikedNotes((prev) => [...prev, note]);
                  setDislikedDraft("");
                  setDislikedOpen(false);
                }}
              />
            </div>
          </div>
        </section>

        <section className="flex flex-col justify-between gap-5 bg-[#EDE8E1] p-7 md:flex-row md:items-center">
          <div>
            <h2 className="font-serif text-2xl">Cập nhật hồ sơ mùi hương</h2>

            <p className="mt-2 text-sm text-[#776F67]">
              Lưu thay đổi để nhận đề xuất sản phẩm chính xác hơn.
            </p>
          </div>

          <button
            type="button"
            onClick={saveProfile}
            disabled={saving}
            className="flex items-center justify-center gap-3 bg-[#816A00] px-7 py-4 text-[10px] uppercase tracking-[0.16em] text-white hover:bg-[#675500] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </section>
      </main>
    </div>
  );
}

interface NotePickerProps {
  value: string;
  options: string[];
  selected: string[];
  placeholder: string;
  accentClassName: string;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onChange: (value: string) => void;
  onAdd: () => void;
  onSelect: (value: string) => void;
}

function NotePicker({
  value,
  options,
  selected,
  placeholder,
  accentClassName,
  open,
  onOpenChange,
  onChange,
  onAdd,
  onSelect,
}: NotePickerProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const filteredOptions = options
    .filter((option) => !selected.includes(option))
    .filter((option) => option.toLowerCase().includes(value.trim().toLowerCase()))
    .slice(0, 8);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) onOpenChange(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [onOpenChange, open]);

  return (
    <div ref={rootRef} className="relative">
      <form
        className="flex overflow-hidden border border-[#D7CEC4] bg-[#FCF9F4]"
        onSubmit={(event) => {
          event.preventDefault();
          onAdd();
        }}
      >
        <div className="relative min-w-0 flex-1">
          <Search
            size={15}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9C9389]"
          />

          <input
            value={value}
            onFocus={() => onOpenChange(true)}
            onChange={(event) => {
              onChange(event.target.value);
              onOpenChange(true);
            }}
            placeholder={placeholder}
            className="w-full bg-transparent py-3 pl-11 pr-4 text-sm outline-none placeholder:text-[#A59C92]"
          />
        </div>

        <button
          type="submit"
          className={`flex w-12 items-center justify-center text-white transition ${accentClassName}`}
          aria-label={placeholder}
        >
          <Plus size={16} />
        </button>
      </form>

      {open && (
        <div className="absolute left-0 right-0 top-full z-20 max-h-56 overflow-auto border border-t-0 border-[#D7CEC4] bg-[#FFFDF9] shadow-[0_18px_40px_rgba(55,45,35,0.08)]">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onSelect(option)}
                className="block w-full px-4 py-3 text-left text-sm text-[#4F4943] transition hover:bg-[#F1EDE7]"
              >
                {option}
              </button>
            ))
          ) : (
            <p className="px-4 py-3 text-sm text-[#92887D]">
              Không có nốt hương phù hợp trong MongoDB
            </p>
          )}
        </div>
      )}
    </div>
  );
}
