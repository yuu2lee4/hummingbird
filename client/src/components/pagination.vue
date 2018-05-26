<template lang="html">
    <div class="compt-pagination">
      <ul v-if="totalPage > 1 && totalPage < 8" class="compt-pagination-list pagination">
        <li v-for="n in totalPage" :class="n == selected ? 'active ' + activeBGColor  : ''" @click="emitBtnClick(n)">
          <a :style="customActiveBGColor && n == selected ? {background: customActiveBGColor, borderColor: customActiveBGColor} : {}">
          {{ n }}</a>
        </li>
      </ul>
      <ul v-else-if="totalPage >= 8" class="compt-pagination-list pagination">
        <li v-for="n in pages" v-if="n.show" :class="n.content == selected ? 'active ' + activeBGColor : '' + n.disable" @click="emitBtnClick(n.content)" >
          <a v-if="n.disable != 'disabled'" :style="customActiveBGColor && n.content == selected ? {background: customActiveBGColor, borderColor: customActiveBGColor} : {}">
          {{ n.content }}</a>
          <a v-else>{{ n.content }}</a>
        </li>
      </ul>

      <div class="compt-pagination-changer">
        <i v-if="withNextPrev" :class="['iconfont ic-page-prev', disablePrev]"
        @click="!disablePrev ? btnPrev() : ''"></i>
        <i :class="['iconfont ic-page-next', disableNext]" 
        @click="!disableNext ? btnNext() : ''"></i>
      </div>
    </div>
</template>

<script>
export default {
  name: "pagination",
  props: {
    totalPage: {
      type: Number,
      required: true
    },
    currentPage: {
      type: Number,
      default: 1
    },
    myData: {
      default: null
    },
    pageRange: {
      type: Number,
      default: 3
    },
    withNextPrev: {
      type: Boolean,
      default: true
    },
    nextText: {
      type: String,
      default: "Next"
    },
    prevText: {
      type: String,
      default: "Prev"
    },
    activeBGColor: {
      type: String
    },
    customActiveBGColor: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      selected: this.currentPage,
      disableNext: "",
      disablePrev: ""
    };
  },
  mounted() {
    this.disablePrevNext();
    console.log(this.customActiveBGColor);
  },
  computed: {
    pages: function() {
      let items = [];

      for (let i = 0; i < this.totalPage; i++) {
        let page = {
          content: i + 1,
          disable: "",
          show: false
        };

        items[i] = page;
      }

      let page1 = {
        content: "...",
        disable: "disabled",
        show: false
      };

      let page2 = {
        content: "...",
        disable: "disabled",
        show: false
      };

      items.splice(1, 0, page1);
      items.splice(items.length - 1, 0, page2);

      for (let i = 0; i < items.length; i++) {
        if (i == 0 || i == items.length - 1) items[i].show = true;

        if (this.selected <= this.pageRange) {
          if (this.selected == this.pageRange) {
            if (i >= 2 && i <= this.pageRange + 1) items[i].show = true;
          } else {
            if (i >= 2 && i <= this.pageRange) items[i].show = true;
          }

          items[items.length - 2].show = true;
        } else if (this.selected > this.pageRange) {
          if (
            i >= this.selected - 1 &&
            this.selected + 2 < items.length - 2 &&
            i <= this.selected + 1
          ) {
            items[1].show = true;
            items[items.length - 2].show = true;
            items[i].show = true;
          } else if (
            i >= items.length - 2 - this.pageRange &&
            this.selected + 2 >= items.length - 2
          ) {
            items[1].show = true;
            items[items.length - 2].show = false;
            items[i].show = true;
          }
        }
      }

      return items;
    }
  },
  methods: {
    emitBtnClick: function(n) {
      this.selected = n;
      this.$emit("btnClick", n, this.myData);

      this.disablePrevNext();
    },

    btnNext: function() {
      this.selected++;
      this.$emit("btnClick", this.selected, this.myData);

      this.disablePrevNext();
    },

    btnPrev: function() {
      this.selected--;
      this.$emit("btnClick", this.selected, this.myData);

      this.disablePrevNext();
    },

    disablePrevNext: function() {
      this.disablePrev = this.selected == 1 ? "disabled" : "";
      this.disableNext = this.selected == this.totalPage ? "disabled" : "";
    }
  }
};
</script>

<style lang="less" scoped>
.compt-pagination {
  padding: 30px 0;
  display: flex;
  &-list {
    flex: 1;
    font-size: 0;
    li {
      text-align: center;
      line-height: 19px;
      display: inline-block;
      width: 19px;
      height: 19px;
      background: #f6f6f6;
      font-size: 12px;
      color: #394a58;
      margin-right: 5px;
      cursor: pointer;
      &.active {
        background: #f04b59;
        color: #fff;
      }
      &.disabled {
        background: #fff;
        cursor: not-allowed !important;
      }
    }
  }
  &-changer {
    width: 60px;
    text-align: right;
    i {
      font-size: 12px;
      color: #f04b59;
      margin-left: 15px;
      cursor: pointer;
      &.disabled {
        color: #d1d1d1;
        cursor: not-allowed;
      }
    }
  }
}

.pagination .active a {
  z-index: 0;
}

.active.primary a {
  background: #007bff;
  border-color: #007bff;
}

.active.success a {
  background: #28a745;
  border-color: #28a745;
}

.active.danger a {
  background: #dc3545;
  border-color: #dc3545;
}

.active.warning a {
  background: #ffc107;
  border-color: #ffc107;
}

.active.info a {
  background: #17a2b8;
  border-color: #17a2b8;
}

.active.dark a {
  background: #343a40;
  border-color: #343a40;
}
</style>