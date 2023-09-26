import { w as writable } from "./index2.js";
const interviewAnswerStore = writable();
const followupsStore = writable([]);
const currentFollowupStore = writable();
export {
  currentFollowupStore as c,
  followupsStore as f,
  interviewAnswerStore as i
};
