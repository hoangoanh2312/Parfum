import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../lib/api";
import RouteErrorPage from "./RouteErrorPage";

const { navigateMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("./ProductCard", () => ({
  default: ({ item }: { item: { name: string } }) => <article>{item.name}</article>,
}));

const reactTestGlobal = globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT?: boolean;
};

beforeAll(() => {
  reactTestGlobal.IS_REACT_ACT_ENVIRONMENT = true;
});

afterAll(() => {
  reactTestGlobal.IS_REACT_ACT_ENVIRONMENT = false;
});

describe("custom 404 page", () => {
  let container: HTMLDivElement;
  let root: Root | undefined;

  beforeEach(() => {
    navigateMock.mockReset();
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(async () => {
    if (root) await act(async () => root?.unmount());
    container.remove();
    vi.restoreAllMocks();
  });

  it("shows featured products and sends a search query to the shop", async () => {
    vi.spyOn(api, "get").mockResolvedValue({
      data: {
        data: [{ id: "product-1", name: "Santal nổi bật" }],
      },
    } as any);

    const router = createMemoryRouter([{ path: "*", element: <RouteErrorPage notFound /> }], {
      initialEntries: ["/duong-dan-khong-ton-tai"],
    });
    root = createRoot(container);

    await act(async () => {
      root?.render(<RouterProvider router={router} future={{ v7_startTransition: true }} />);
      await Promise.resolve();
    });

    expect(api.get).toHaveBeenCalledWith("/products", {
      params: { page: 1, limit: 4, sort: "featured" },
    });
    expect(container.textContent).toContain("Sản phẩm nổi bật");
    expect(container.textContent).toContain("Santal nổi bật");
    expect(container.textContent).toContain("Về trang chủ");

    const input = container.querySelector<HTMLInputElement>("#not-found-search")!;
    const valueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    await act(async () => {
      valueSetter?.call(input, "Dior Sauvage");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });

    const form = container.querySelector<HTMLFormElement>('form[role="search"]');
    expect(form).not.toBeNull();

    await act(async () => {
      form!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });

    expect(navigateMock).toHaveBeenCalledOnce();
    expect(navigateMock).toHaveBeenCalledWith("/shop?search=Dior%20Sauvage");
  });
});
