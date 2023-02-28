/*
 * @Descripttion:
 * @version:
 * @Author: cxguo
 * @Date: 2019-08-16 09:17:57
 * @LastEditors: cxguo
 * @LastEditTime: 2019-10-21 20:46:21
 */
export default {
  data() {
    return {
      offsetTop: 0
    };
  },
  methods: {
    handleScroll() {
      setTimeout(() => {
        this.offsetTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      }, 100);
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  computed: {
    'fixed': function() {
      if (this.offsetTop < 50) return 'default wfull';
      else return 'fixed wfull';
    }
  }
};
