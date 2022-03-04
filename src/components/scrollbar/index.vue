<script>
import {defineComponent, onMounted, onUnmounted, ref, computed} from "vue"
import {minmax, realHeight} from "./utils"

export default defineComponent({
  name: "awesome-scrollbar",
  props: {
    height: {
      type: String,
      default: "100%"
    },
    width: {
      type: String,
      default: "100%"
    },
    scrollX: {
      type: Boolean,
      default: false,
    },
    scrollY: {
      type: Boolean,
      default: true,
    },
    alwaysX: {
      type: Boolean,
      default: true,
    },
    alwaysY: {
      type: Boolean,
      default: true,
    },
    snapX: {
      type: Boolean,
      default: true,
    },
    snapY: {
      type: Boolean,
      default: true,
    }
  },
  setup(){
    const container$ = ref();
    const verticalBar$ = ref();
    const horizontalBar$ = ref();
    const verticalBarThumb$ = ref();
    const horizontalBarThumb$ = ref();
    const containerHost$ = computed(() => container$.value.parentElement)

    const scrollHeight$ = ref(0);
    const scrollWidth$ = ref(0);
    const scrollX$ = ref(0);
    const scrollY$ = ref(0);
    const scrollXActive$ = ref(false);
    const scrollYActive$ = ref(false);

    let resizeObserver;
    onMounted(() => {
      resizeObserver = new ResizeObserver((entries) => {
        scrollHeight$.value = entries[0]?.target.scrollHeight ?? 0;
        scrollWidth$.value = entries[0]?.target.scrollWidth ?? 0;
      })
      resizeObserver.observe(container$.value);

      const HPercent = containerHost$.value.clientHeight / container$.value.scrollHeight;
      const WPercent = containerHost$.value.clientWidth / container$.value.scrollWidth;
      if (HPercent === 1) {
        // TODO(CGQAQ): hide thumb

      }

      if (HPercent === 1) {
        // TODO(CGQAQ): hide thumb

      }

      verticalBarThumb$.value.style.height = `${verticalBar$.value.clientHeight * HPercent}px`;
      horizontalBarThumb$.value.style.width = `${horizontalBar$.value.clientWidth * WPercent}px`;

      relocationHScroll();
      relocationVScroll();
    })

    onUnmounted(() => {
      resizeObserver.disconnect();
      resizeObserver = null;
    })

    function relocationHScroll() {
      horizontalBar$.value.style.top = `${
          scrollY$.value + containerHost$.value.clientHeight - horizontalBar$.value.clientHeight
      }px`;
      horizontalBar$.value.style.left = `${scrollX$.value}px`;
    }

    function relocationVScroll() {
      verticalBar$.value.style.left = `${
          scrollX$.value + containerHost$.value.clientWidth - verticalBar$.value.clientWidth
      }px`;
      // console.log("222222", scrollX$.value, containerHost$.value.clientWidth, verticalBar$.value.clientWidth);
      verticalBar$.value.style.top = `${scrollY$.value}px`;
    }

    /**
     * scroll to the right
     * @param {Number} fromLeft Pixels from top
     */
    function scrollLeft(fromLeft) {
      scrollX$.value = minmax(fromLeft, 0, container$.value.scrollWidth - container$.value.clientWidth);
      container$.value.scrollLeft = scrollX$.value;
      relocationHScroll();
      relocationVScroll();
    }

    /**
     * scroll to the bottom
     * @param {Number} fromTop Pixels from top
     */
    function scrollTop(fromTop) {
      scrollY$.value = minmax(fromTop, 0, container$.value.scrollHeight - container$.value.clientHeight);
      container$.value.scrollTop = scrollY$.value;
      relocationHScroll();
      relocationVScroll();
    }

    return {
      // Dom refs
      container$,
      verticalBar$,
      horizontalBar$,
      verticalBarThumb$,
      horizontalBarThumb$,

      // Data refs
      scrollX$,
      scrollY$,

      // Native event callbacks
      onHorizontalPointerDown(event) {
        scrollXActive$.value = true;
        horizontalBarThumb$.value.setPointerCapture(event.pointerId);
      },
      onHorizontalPointerUp(event) {
        scrollXActive$.value = false;
        horizontalBarThumb$.value.releasePointerCapture(event.pointerId);
      },
      onHorizontalPointerMove(event) {
        if (scrollXActive$.value) {
          scrollLeft(scrollX$.value + event.movementX / (horizontalBar$.value.clientWidth - horizontalBarThumb$.value.clientWidth) * container$.value.scrollHeight)
        }
      },

      onVerticalPointerDown(event) {
        scrollYActive$.value = true;
        verticalBarThumb$.value.setPointerCapture(event.pointerId);
      },
      onVerticalPointerUp(event) {
        scrollYActive$.value = true;
        verticalBarThumb$.value.releasePointerCapture(event.pointerId);
      },
      onVerticalPointerMove(event) {
        if (scrollYActive$.value) {
          scrollTop(scrollY$.value + event.movementY / (verticalBar$.value.clientHeight - verticalBarThumb$.value.clientHeight) * container$.value.scrollHeight);
        }
      },

      onscroll(event) {
        event.preventDefault();
        if (event.shiftKey) {
          scrollLeft(scrollX$.value + event.deltaY);
        } else {
          scrollTop(scrollY$.value + event.deltaY);
        }
      },

      // thumb positions
      hscrollOffset$: computed(() => {
        if (!horizontalBar$.value || !horizontalBarThumb$.value) {
          return 0;
        }
        return (scrollX$.value / container$.value.scrollWidth) * (horizontalBar$.value.clientWidth - horizontalBarThumb$.value.clientWidth)
      }),
      vscrollOffset$: computed(() => {
        if (!verticalBar$.value || !verticalBarThumb$.value) {
          return 0;
        }
        console.log(verticalBarThumb$.value.clientHeight, realHeight(verticalBarThumb$.value))
        return (scrollY$.value / container$.value.scrollHeight) * (verticalBar$.value.clientHeight - verticalBarThumb$.value.clientHeight)
      }),
    }
  }
})
</script>

<template>
  <div ref="container$" class="ascroll-container" @mousewheel="onscroll">
    <slot />
    <div ref="horizontalBar$" class="ascroll-scrollbar ascroll-scrollbar-horizontal">
      <div
         ref="horizontalBarThumb$"
         :style="{left: `${hscrollOffset$}px`}"
         class="ascroll-scrollbar-thumb ascroll-scrollbar-horizontal-thumb"
         @pointerdown="onHorizontalPointerDown"
         @pointerup="onHorizontalPointerUp"
         @pointermove="onHorizontalPointerMove"></div>
    </div>
    <div ref="verticalBar$" class="ascroll-scrollbar ascroll-scrollbar-vertical">
      <div
          ref="verticalBarThumb$"
          :style="{top: `${vscrollOffset$}px`}"
          class="ascroll-scrollbar-thumb ascroll-scrollbar-vertical-thumb"
          @pointerdown="onVerticalPointerDown"
          @pointerup="onVerticalPointerUp"
          @pointermove="onVerticalPointerMove"
      >
      </div>
    </div>
  </div>
</template>

<style scoped>
.ascroll-container {
  position: relative;
  overflow: hidden !important;
}

.ascroll-scrollbar {
  position: absolute;
  background-color: #eeee;
  user-select: none !important;
}

.ascroll-scrollbar-horizontal {
  height: 10px;
  width: 100%;
  left: 0;
}

.ascroll-scrollbar-vertical {
  width: 10px;
  height: 100%;
  top: 0;
}

.ascroll-scrollbar-thumb {
  /*background-color: #999;*/
  background-color: #3333;
  cursor: pointer;
}
.ascroll-scrollbar-thumb:hover {
  /*background-color: #999;*/
  background-color: #333;
}

.ascroll-scrollbar-horizontal-thumb {
  position: absolute;
  left: 0;
  top: 1px;
  bottom: 1px;
  width: 1%;
  min-width: 20px;
  border-radius: 8px;
}

.ascroll-scrollbar-vertical-thumb {
  position: absolute;
  left: 1px;
  right: 1px;
  top: 0;
  height: 1%;
  min-height: 20px;
  border-radius: 8px;
}
</style>
