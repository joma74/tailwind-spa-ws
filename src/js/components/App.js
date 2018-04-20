// @ts-ignore
import renderFnkt from "@home/app.html?style=@home/app.css";

/* eslint-disable no-new */
export default renderFnkt({
  mounted() {
    document.documentElement.replaceChild(this.$el, document.body);
  }
});
