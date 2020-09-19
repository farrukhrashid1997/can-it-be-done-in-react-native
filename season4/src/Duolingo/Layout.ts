import { SharedValues } from "../components/AnimatedHelpers";

// TODO: since width/height are stable should they be of type Ref?
export type Offset = SharedValues<{
  order: number;
  width: number;
  height: number;
  word: string;
  x: number;
  y: number;
}>;

export const print = (input: Offset[]) => {
  input.sort((a, b) => (a.order.value > b.order.value ? 1 : -1));
  console.log(input.map((i) => i.word.value).join(" "));
};

export const reorder = (input: Offset[], from: number, to: number) => {
  "worklet";
  input.forEach((p) => {
    if (p.order.value === from) {
      p.order.value = to;
    } else if (p.order.value >= to && p.order.value < from) {
      p.order.value += 1;
    }
  });
};

export const calculateLayout = (offsets: Offset[], containerWidth: number) => {
  "worklet";
  offsets.sort((a, b) => (a.order.value > b.order.value ? 1 : -1));
  const height = offsets[0].height.value;
  let vIndex = 0;
  let lastBreak = 0;
  offsets.forEach((offset, index) => {
    const total = offsets
      .slice(lastBreak, index)
      .reduce((acc, o) => acc + o.width.value, 0);
    if (total + offset.width.value > containerWidth) {
      offset.x.value = 0;
      vIndex++;
      lastBreak = index;
    } else {
      offset.x.value = total;
    }
    offset.y.value = vIndex * height;
  });
};