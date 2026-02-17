import { describe, it, expect } from "vitest";
import { makeRangesTree, rangesTreeToRanges, TreeNode } from "./rangeTree";

describe("makeRangesTree", () => {
  it("returns root node with no children when given no ranges", () => {
    const tree = makeRangesTree(10, []);
    expect(tree).toEqual({
      range: { r: [0, 10] },
      children: [],
    });
  });

  it("builds a tree with a single range", () => {
    const tree = makeRangesTree(10, [{ r: [2, 5], data: "a" }]);
    expect(tree.children).toHaveLength(1);
    expect(tree.children[0].range).toEqual({ r: [2, 5], data: "a" });
    expect(tree.children[0].children).toHaveLength(0);
  });

  it("builds a tree with non-overlapping ranges", () => {
    const tree = makeRangesTree(10, [
      { r: [1, 3], data: "a" },
      { r: [5, 8], data: "b" },
    ]);
    expect(tree.children).toHaveLength(2);
    expect(tree.children[0].range).toEqual({ r: [1, 3], data: "a" });
    expect(tree.children[1].range).toEqual({ r: [5, 8], data: "b" });
  });

  it("builds a tree with nested ranges", () => {
    const tree = makeRangesTree(10, [
      { r: [1, 8], data: "outer" },
      { r: [3, 6], data: "inner" },
    ]);
    expect(tree.children).toHaveLength(1);

    const outer = tree.children[0];
    expect(outer.range).toEqual({ r: [1, 8], data: "outer" });
    expect(outer.children).toHaveLength(1);
    expect(outer.children[0].range).toEqual({ r: [3, 6], data: "inner" });
  });

  it("handles deeply nested ranges", () => {
    const tree = makeRangesTree(20, [
      { r: [0, 20], data: "l1" },
      { r: [2, 18], data: "l2" },
      { r: [4, 16], data: "l3" },
    ]);
    const l1 = tree.children[0];
    expect(l1.range.data).toBe("l1");
    const l2 = l1.children[0];
    expect(l2.range.data).toBe("l2");
    const l3 = l2.children[0];
    expect(l3.range.data).toBe("l3");
  });

  it("handles partially overlapping ranges by splitting", () => {
    const tree = makeRangesTree(10, [
      { r: [1, 5], data: "a" },
      { r: [3, 8], data: "b" },
    ]);

    // The overlap [3,5] should become a child of [1,5]
    // The remaining [5,8] should be a sibling
    const children = tree.children;
    expect(children).toHaveLength(2);

    const aRange = tree.children[0];
    expect(aRange.range).toEqual({ r: [1, 5], data: "a" });
    expect(aRange.children).toHaveLength(1);
    expect(aRange.children[0].range).toEqual({ r: [3, 5], data: "b" });

    const bRange = tree.children[1];
    expect(bRange.range).toEqual({ r: [5, 8], data: "b" });
    expect(bRange.children).toHaveLength(0);
  });

  it("handles ranges without data", () => {
    const tree = makeRangesTree(10, [{ r: [2, 5] }]);
    expect(tree.children).toHaveLength(1);
    expect(tree.children[0].range).toEqual({ r: [2, 5] });
    expect(tree.children[0].children).toHaveLength(0);
  });

  it("handles adjacent ranges", () => {
    const tree = makeRangesTree(10, [
      { r: [1, 5], data: "a" },
      { r: [5, 9], data: "b" },
    ]);
    expect(tree.children).toHaveLength(2);
    expect(tree.children[0].range).toEqual({ r: [1, 5], data: "a" });
    expect(tree.children[1].range).toEqual({ r: [5, 9], data: "b" });
  });

  it("handles a range spanning the full length", () => {
    const tree = makeRangesTree(10, [{ r: [0, 10], data: "full" }]);
    expect(tree.children).toHaveLength(1);
    expect(tree.children[0].range).toEqual({ r: [0, 10], data: "full" });
  });

  it("handles ranges with the same start and different sort directions equally", () => {
    const tree = makeRangesTree(10, [{
      r: [0, 9]
    }, {
      r: [0, 8]
    }]);
    const tree1 = makeRangesTree(10, [{
      r: [0, 8]
    }, {
      r: [0, 9]
    }]);
    expect(tree).toEqual(tree1);
  });

  it("handles multiple partially overlapping ranges in a chain", () => {
    const tree = makeRangesTree(15, [
      { r: [0, 5], data: "a" },
      { r: [3, 8], data: "b" },
      { r: [6, 10], data: "c" },
    ]);

    expect(tree.children).toHaveLength(3);

    const first = tree.children[0];
    expect(first.range).toEqual({ r: [0, 5], data: "a" });
    expect(first.children).toHaveLength(1);
    expect(first.children[0].range).toEqual({ r: [3, 5], data: "b" });

    const second = tree.children[1];
    expect(second.range).toEqual({ r: [5, 8], data: "b" });
    expect(second.children).toHaveLength(1);
    expect(second.children[0].range).toEqual({ r: [6, 8], data: "c" });

    const third = tree.children[2];
    expect(third.range).toEqual({ r: [8, 10], data: "c" });
    expect(third.children).toHaveLength(0);
  });
});

describe("rangesTreeToRanges", () => {
  it("returns a single range for a leaf node", () => {
    const node: TreeNode<string> = {
      range: { r: [0, 10] },
      children: [],
    };
    const ranges = rangesTreeToRanges(node);
    expect(ranges).toEqual([{ r: [0, 10] }]);
  });

  it("fills gaps with parent data", () => {
    const node: TreeNode<string> = {
      range: { r: [0, 10], data: "parent" },
      children: [
        {
          range: { r: [3, 6], data: "child" },
          children: [],
        },
      ],
    };
    const ranges = rangesTreeToRanges(node);
    expect(ranges).toEqual([
      { r: [0, 3], data: "parent" },
      { r: [3, 6], data: "child" },
      { r: [6, 10], data: "parent" },
    ]);
  });

  it("fills gaps when child is at the start", () => {
    const node: TreeNode<string> = {
      range: { r: [0, 10], data: "parent" },
      children: [
        {
          range: { r: [0, 4], data: "child" },
          children: [],
        },
      ],
    };
    const ranges = rangesTreeToRanges(node);
    expect(ranges).toEqual([
      { r: [0, 4], data: "child" },
      { r: [4, 10], data: "parent" },
    ]);
  });

  it("fills gaps when child is at the end", () => {
    const node: TreeNode<string> = {
      range: { r: [0, 10], data: "parent" },
      children: [
        {
          range: { r: [6, 10], data: "child" },
          children: [],
        },
      ],
    };
    const ranges = rangesTreeToRanges(node);
    expect(ranges).toEqual([
      { r: [0, 6], data: "parent" },
      { r: [6, 10], data: "child" },
    ]);
  });

  it("handles multiple children with gaps", () => {
    const node: TreeNode<string> = {
      range: { r: [0, 20], data: "bg" },
      children: [
        { range: { r: [2, 5], data: "a" }, children: [] },
        { range: { r: [8, 12], data: "b" }, children: [] },
        { range: { r: [15, 18], data: "c" }, children: [] },
      ],
    };
    const ranges = rangesTreeToRanges(node);
    expect(ranges).toEqual([
      { r: [0, 2], data: "bg" },
      { r: [2, 5], data: "a" },
      { r: [5, 8], data: "bg" },
      { r: [8, 12], data: "b" },
      { r: [12, 15], data: "bg" },
      { r: [15, 18], data: "c" },
      { r: [18, 20], data: "bg" },
    ]);
  });

  it("handles nested children recursively", () => {
    const node: TreeNode<string> = {
      range: { r: [0, 10], data: "root" },
      children: [
        {
          range: { r: [2, 8], data: "mid" },
          children: [
            { range: { r: [4, 6], data: "inner" }, children: [] },
          ],
        },
      ],
    };
    const ranges = rangesTreeToRanges(node);
    expect(ranges).toEqual([
      { r: [0, 2], data: "root" },
      { r: [2, 4], data: "mid" },
      { r: [4, 6], data: "inner" },
      { r: [6, 8], data: "mid" },
      { r: [8, 10], data: "root" },
    ]);
  });

  it("uses mergeData callback when provided", () => {
    const node: TreeNode<string> = {
      range: { r: [0, 10], data: "parent" },
      children: [
        {
          range: { r: [3, 7], data: "child" },
          children: [],
        },
      ],
    };
    const mergeData = (parent: string | undefined, child: string | undefined) =>
      [parent, child].filter(Boolean).join("+");

    const ranges = rangesTreeToRanges(node, undefined, mergeData);
    expect(ranges).toEqual([
      { r: [0, 3], data: "parent" },
      { r: [3, 7], data: "parent+child" },
      { r: [7, 10], data: "parent" },
    ]);
  });

  it("uses mergeData recursively through nested levels", () => {
    const node: TreeNode<string> = {
      range: { r: [0, 10], data: "l1" },
      children: [
        {
          range: { r: [2, 8], data: "l2" },
          children: [
            { range: { r: [4, 6], data: "l3" }, children: [] },
          ],
        },
      ],
    };
    const mergeData = (parent: string | undefined, child: string | undefined) =>
      [parent, child].filter(Boolean).join(">");

    const ranges = rangesTreeToRanges(node, undefined, mergeData);
    expect(ranges).toEqual([
      { r: [0, 2], data: "l1" },
      { r: [2, 4], data: "l1>l2" },
      { r: [4, 6], data: "l1>l2>l3" },
      { r: [6, 8], data: "l1>l2" },
      { r: [8, 10], data: "l1" },
    ]);
  });

  it("returns child covering full parent with no gaps", () => {
    const node: TreeNode<string> = {
      range: { r: [0, 10], data: "parent" },
      children: [
        { range: { r: [0, 10], data: "child" }, children: [] },
      ],
    };
    const ranges = rangesTreeToRanges(node);
    expect(ranges).toEqual([{ r: [0, 10], data: "child" }]);
  });
});

describe("makeRangesTree -> rangesTreeToRanges roundtrip", () => {
  it("flattens non-overlapping ranges back to cover the full length", () => {
    const input = [
      { r: [2, 5] as [number, number], data: "a" },
      { r: [7, 9] as [number, number], data: "b" },
    ];
    const tree = makeRangesTree(10, input);
    const flat = rangesTreeToRanges(tree);

    // Should cover [0,10] completely with no gaps
    expect(flat[0].r[0]).toBe(0);
    expect(flat[flat.length - 1].r[1]).toBe(10);

    // Each range end should equal the next range start
    for (let i = 0; i < flat.length - 1; i++) {
      expect(flat[i].r[1]).toBe(flat[i + 1].r[0]);
    }
  });

  it("preserves data through roundtrip for nested ranges", () => {
    const input = [
      { r: [0, 10] as [number, number], data: "outer" },
      { r: [3, 7] as [number, number], data: "inner" },
    ];
    const tree = makeRangesTree(10, input);
    const flat = rangesTreeToRanges(tree);

    const innerRanges = flat.filter((r) => r.data === "inner");
    expect(innerRanges).toEqual([{ r: [3, 7], data: "inner" }]);

    const outerRanges = flat.filter((r) => r.data === "outer");
    expect(outerRanges).toEqual([
      { r: [0, 3], data: "outer" },
      { r: [7, 10], data: "outer" },
    ]);
  });
});
