import 'reset-css/reset.css';
import '../styles/index.css'
import { anim } from "./animation.js";
import { preventLinktemporary } from "./preventLinktemporary.js";

document.addEventListener('DOMContentLoaded', () => {
  preventLinktemporary()
  anim()
})
