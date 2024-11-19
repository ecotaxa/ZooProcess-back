// // import { TaskType } from "@prisma/client";
// // import ProcessStrategy from "./ProcessStrategy";
// // import SeparateStrategy from "./SeparateStrategy";
// // // import { Tasks } from "./tasks";

// const { TaskType } = require("@prisma/client");

// // import TaskStrategy from "./TaskStrategy";
// // import BackgroundStrategy from "./BackgroundStrategy";
// // import DetectiondStrategy from "./DetectiondStrategy";
// // import VignetteStrategy from "./VignetteStrategy";
// // import { Tasks } from "./tasks";

// const { SeparateStrategy } = require("./SeparateStrategy")
// const { ProcessStrategy } = require("./ProcessStrategy")
// const { BackgroundStrategy } = require("./BackgroundStrategy")
// const { DetectiondStrategy } = require("./DetectiondStrategy")
// const { VignetteStrategy } = require("./VignetteStrategy")


// // enum TaskType {
// //     SEPARATE = 'SEPARATE',
// //     PROCESS = 'PROCESS
// // }

// // const strategies: Record<TaskType, new (tasks: Tasks) => TaskStrategy> = {
// const strategies = {
//         [TaskType.SEPARATE]: SeparateStrategy,
//     [TaskType.PROCESS]: ProcessStrategy,
//     [TaskType.BACKGROUND]: BackgroundStrategy,
//     [TaskType.DETECTION]: DetectiondStrategy,
//     [TaskType.VIGNETTE]: VignetteStrategy,
// };


// module.exports = {
//     TaskStrategy,
//     strategies
// };
