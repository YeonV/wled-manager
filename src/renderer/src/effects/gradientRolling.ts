// /* eslint-disable @typescript-eslint/explicit-function-return-type */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { MutableRefObject } from "react";
// import { getMultipleGradientSteps } from "./utils";

// const GradientRolling = ({
//   pixel_count,
//   timeStarted,
//   gcolor,
// }: {
//   pixel_count: number;
//   timeStarted: MutableRefObject<number>;
//   gcolor: string;
// }) => {
//   const tmp = getMultipleGradientSteps(
//     gcolor.match(/rgb\([^()]*\)|#\w+/g)?.map((c) => c.match(/\d+/g)),
//     pixel_count,
//   );
//   const speed = 8 as number;
//   const hlp = (performance.now() - timeStarted.current) / speed;
//   if (tmp.length > 0 && hlp) {
//     const sliceA = tmp.slice(0, hlp) % pixel_count;
//     const sliceB = tmp.slice(hlp) % pixel_count;
//     return [sliceB, sliceA];
//   }
//   return [
//     [0, 0, 0],
//     [0, 0, 0],
//   ];
// };

// export default GradientRolling;
