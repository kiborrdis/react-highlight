export type HighlightedRange<D = unknown> = {
  r: [number, number];
  data?: D;
};

export type TreeNode<D = unknown> = {
  range: HighlightedRange<D>;
  children: TreeNode<D>[];
};

const sortRanges = <D>(ranges: HighlightedRange<D>[]) => {
  return [...ranges].sort((a, b) => {
    const r1 = a.r[0] - b.r[0];

    if (r1 !== 0) {
      return r1;
    }

    return b.r[1] - a.r[1];
  });
}

export const makeRangesTree = <D = unknown>(
  length: number,
  ranges: HighlightedRange<D>[],
) => {
  const root: TreeNode<D> = { range: { r: [0, length] }, children: [] };
  const stack: TreeNode<D>[] = [root];
  let currentIndex = 0;

  ranges = sortRanges(ranges);

  while (stack.length > 0 && currentIndex < ranges.length) {
    const currentRange = ranges[currentIndex];
    if (!currentRange) {
      break;
    }
    const top = stack[stack.length - 1];

    // Current range is fully contained within range on top of the stack
    if (top.range.r[1] >= currentRange.r[1]) {
      const range = { range: currentRange, children: [] };
      stack.push(range);
      currentIndex += 1;

    // Current range is partially overlapping with the range on top of the stack
    } else if (top.range.r[1] > currentRange.r[0]) {
      // Split the top range into two parts: the overlapping part and the remaining part
      const overlapRange = {
        range: {
          r: [currentRange.r[0], top.range.r[1]] as [number, number],
          data: currentRange.data,
        },
        children: [],
      };

      top.children.push(overlapRange);

      // Remove the overlapping part from the top range, since there wont be any more ranges overlapping with it
      stack.pop();

      if (stack.length === 0) {
        break;
      }

      // Add the remaining part as child of the previous top
      const newTop = stack[stack.length - 1];
      const remainingRange = {
        range: {
          r: [top.range.r[1], currentRange.r[1]] as [number, number],
          data: currentRange.data,
        },
        children: [],
      };
      newTop.children.push(top);

      // Add the remaining part of the top range back to the stack, since there can be more ranges overlapping with it
      stack.push(remainingRange);
      currentIndex += 1;

    // Current range had no overlap with the top range
    } else if (top.range.r[1] <= currentRange.r[0]) {

      // Removing the top range from the stack, since there wont be any more ranges overlapping with it
      stack.pop();

      if (stack.length === 0) {
        break;
      }

      // We add top to the children of previous top, since there wont be any more ranges overlapping with it
      // And we process the current range in the next iteration 
      const newTop = stack[stack.length - 1];
      newTop.children.push(top);
    }
  }

  // Add remaining ranges in the stack to the tree
  while (stack.length > 0) {
    const top = stack.pop()!;
    if (stack.length === 0) {
      break;
    }
    const newTop = stack[stack.length - 1];
    newTop.children.push(top);
  }

  return root;
};

export const rangesTreeToRanges = <D = unknown>(
  node: TreeNode<D>,
  parentData?: D,
  mergeData?: (
    parentData: D | undefined,
    childData: D | undefined,
  ) => D | undefined,
): HighlightedRange<D>[] => {
  const result: HighlightedRange<D>[] = [];
  let currentIndex = node.range.r[0];

  node.children.forEach((child) => {
    // Create range with parent data with gap between prev child(or parent start) and current child start
    const newParentData = mergeData ? mergeData(parentData, node.range.data) : node.range.data;

    if (currentIndex < child.range.r[0]) {
      result.push({
        ...node.range,
        r: [currentIndex, child.range.r[0]] as [number, number],
        data: newParentData,
      });
      currentIndex = child.range.r[0];
    }
    result.push(...rangesTreeToRanges(child, newParentData, mergeData));
    currentIndex = child.range.r[1];
  });

  // Create range with parent data with gap between last child end and parent end
  if (currentIndex < node.range.r[1]) {
    result.push({
      ...node.range,
      r: [currentIndex, node.range.r[1]] as [number, number],
      data: mergeData ? mergeData(parentData, node.range.data) : node.range.data,
    });
  }

  return result;
};
