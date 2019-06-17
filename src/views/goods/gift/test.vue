<template>
  <div class="content" ref="scroll" id="switchModule">
    <div class="section">
      <div class="box1 d_jump">1</div>
      <div class="box2 d_jump">2</div>
      <div class="box3 d_jump">3</div>
      <div class="box4 d_jump">4</div>
      <div class="box5 d_jump">5</div>
      <div class="box6 d_jump">6</div>
    </div>
    <div class="fix">
      <p @click="jump('1')">1</p>
      <p @click="jump('2')">2</p>
      <p @click="jump('3')">3</p>
      <p @click="jump('4')">4</p>
      <p @click="jump('5')">5</p>
      <p @click="jump('6')">6</p>
    </div>
  </div>
</template>
<script>
// import qs from 'qs';
// import request from '../../../service/request.js';
// import getInputVal from '../../../utils/common.js';

export default {
  data() {
    return {};
  },
  mounted: function() {
    this.$nextTick(function() {
      window.addEventListener('scroll', this.onScroll, true);
    });
  },
  methods: {
    onScroll() {
      let scroll = document.documentElement.scrollTop || document.body.scrollTop;
    },
    jump(num) {
      let index = Number(num);

      // 用 class="d_jump" 添加锚点
      let jump = document.querySelectorAll('.d_jump');

      let total = jump[index - 1].offsetTop;

      let distance = document.documentElement.scrollTop || document.body.scrollTop;
      // let distance = 200;

      // 平滑滚动，时长500ms，每10ms一跳，共50跳
      let step = total / 50;
      if (total > distance) {
        smoothDown();
      } else {
        let newTotal = distance - total;
        step = newTotal / 50;
        smoothUp();
      }
      function smoothDown() {
        if (distance < total) {
          distance += step;
          document.body.scrollTop = distance;
          document.documentElement.scrollTop = distance - 64;
          setTimeout(smoothDown, 10);
        } else {
          document.body.scrollTop = total;
          document.documentElement.scrollTop = total - 64;
        }
      }
      function smoothUp() {
        if (distance > total) {
          distance -= step;
          document.body.scrollTop = distance;
          document.documentElement.scrollTop = distance - 64;
          setTimeout(smoothUp, 10);
        } else {
          document.body.scrollTop = total;
          document.documentElement.scrollTop = total - 64;
        }
      }
    }
  },
  components: {}
};
</script>
<style scoped>
.section div {
  color: #fff;
  font-size: 20px;
}
.box1 {
  height: 300px;
  background: red;
}
.box2 {
  height: 400px;
  background: yellow;
}
.box3 {
  height: 600px;
  background: green;
}
.box4 {
  height: 600px;
  background: black;
}
.box5 {
  height: 400px;
  background: pink;
}

.box6 {
  height: 800px;
  background: orange;
}
.fix {
  position: fixed;
  bottom: 50px;
  right: 50px;
}
.fix p {
  cursor: pointer;
  height: 40px;
  line-height: 40px;
  width: 120px;
  background: #fff;
}
</style>
