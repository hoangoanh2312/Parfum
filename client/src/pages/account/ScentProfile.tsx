import {
  ArrowRight,
  Check,
  Flower2,
  Leaf,
  Loader2,
  Plus,
  Sparkles,
  Trees,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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

export default function ScentProfile() {
  const [families, setFamilies] = useState<string[]>(["woody", "fresh", "oriental"]);
  const [preferredNotes, setPreferredNotes] = useState<string[]>(defaultPreferredNotes);
  const [dislikedNotes, setDislikedNotes] = useState<string[]>(defaultDislikedNotes);
  const [preferredDraft, setPreferredDraft] = useState("");
  const [dislikedDraft, setDislikedDraft] = useState("");
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

  const toggleFamily = (id: string) => {
    setFamilies((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const addNote = (type: "preferred" | "disliked") => {
    const normalized = (type === "preferred" ? preferredDraft : dislikedDraft).trim();
    if (!normalized) return;

    if (type === "preferred") {
      if (preferredNotes.includes(normalized)) {
        toast.error("Nốt hương này đã có trong danh sách");
        return;
      }

      setPreferredNotes((prev) => [...prev, normalized]);
      setPreferredDraft("");
      return;
    }

    if (dislikedNotes.includes(normalized)) {
      toast.error("Nốt hương này đã có trong danh sách");
      return;
    }

    setDislikedNotes((prev) => [...prev, normalized]);
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
              to="/shop"
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

              <form
                className="flex overflow-hidden border border-[#D7CEC4] bg-[#FCF9F4]"
                onSubmit={(event) => {
                  event.preventDefault();
                  addNote("preferred");
                }}
              >
                <input
                  value={preferredDraft}
                  onChange={(event) => setPreferredDraft(event.target.value)}
                  placeholder="Thêm nốt hương yêu thích"
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-[#A59C92]"
                />

                <button
                  type="submit"
                  className="flex w-12 items-center justify-center bg-[#8A7000] text-white transition hover:bg-[#6D5900]"
                  aria-label="Thêm nốt hương yêu thích"
                >
                  <Plus size={16} />
                </button>
              </form>
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

              <form
                className="flex overflow-hidden border border-[#D7CEC4] bg-[#FCF9F4]"
                onSubmit={(event) => {
                  event.preventDefault();
                  addNote("disliked");
                }}
              >
                <input
                  value={dislikedDraft}
                  onChange={(event) => setDislikedDraft(event.target.value)}
                  placeholder="Thêm nốt hương không thích"
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-[#A59C92]"
                />

                <button
                  type="submit"
                  className="flex w-12 items-center justify-center bg-[#6F6861] text-white transition hover:bg-[#514B45]"
                  aria-label="Thêm nốt hương không thích"
                >
                  <Plus size={16} />
                </button>
              </form>
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
