<script>
import { defineComponent, onMounted, onUnmounted, ref, computed } from "vue"
import { minmax } from "./utils"

// NOTE(CGQAQ):
// pinter event momentX/Y for example:
//   will be exactly `RATIO` times of the value it's should be,
//   so we need to divided it by the RATIO when we're dealing with pointer event.
const RATIO = window.devicePixelRatio;

export default defineComponent({
  name: "awesome-scrollbar",
  props: {
    height: {
      type: String,
      required: false,
    },
    width: {
      type: String,
      required: false,
    },
    enableHorizontalScrollbar: {
      type: Boolean,
      default: false,
    },
    enableVerticalScrollbar: {
      type: Boolean,
      default: true,
    },
    alwaysShowHorizontalBar: {
      type: Boolean,
      default: true,
    },
    alwaysShowVerticalBar: {
      type: Boolean,
      default: true,
    },
    snapHorizontalBarToParent: {
      type: Boolean,
      default: false,
    },
    snapVerticalBarToParent: {
      type: Boolean,
      default: false,
    }
  },
  setup(props){
    const container$ = ref();
    const verticalBar$ = ref();
    const horizontalBar$ = ref();
    const verticalBarThumb$ = ref();
    const horizontalBarThumb$ = ref();
    const containerHost$ = computed(() => container$.value?.parentElement);

    // the container which scrollbar is snap to
    // if snapX is true, the y-axis relative container should be the parent container
    //   in order to make horizontal scroll bar snap to a fixed y position and vice versa.
    const snapXContainer$ = computed(() => props.snapVerticalBarToParent ? containerHost$.value : container$.value);
    const snapYContainer$ = computed(() => props.snapHorizontalBarToParent ? containerHost$.value : container$.value);


    const scrollHeight$ = ref(0);
    const scrollWidth$ = ref(0);
    const scrollX$ = ref(0);
    const scrollY$ = ref(0);
    const scrollParentX$ = ref(0);
    const scrollParentY$ = ref(0);
    const scrollXActive$ = ref(false);
    const scrollYActive$ = ref(false);

    let resizeObserver;
    function onParentScroll(event) {
      // event.preventDefault();
      if (props.snapVerticalBarToParent) {
        scrollParentX$.value = event.target.scrollLeft;
        relocationVScroll();
      } else if (props.snapHorizontalBarToParent) {
        scrollParentY$.value = event.target.scrollTop;
        relocationHScroll();
      }
    }
    onMounted(() => {
      if (typeof props.height == "string") {
        container$.value.style.height = props.height;
      }
      if (typeof props.width == "string") {
        container$.value.style.width = props.width;
      }
      verticalBar$.value.style.display = props.enableVerticalScrollbar ? "block" : "none";
      horizontalBar$.value.style.display = props.enableHorizontalScrollbar ? "block" : "none";

      resizeObserver = new ResizeObserver((entries) => {
        scrollHeight$.value = entries[0]?.target.scrollHeight ?? 0;
        scrollWidth$.value = entries[0]?.target.scrollWidth ?? 0;
      })
      resizeObserver.observe(container$.value);

      if (props.snapHorizontalBarToParent || props.snapVerticalBarToParent) {
        // snap horizontal bar to parent bottom
        containerHost$.value?.addEventListener("scroll", onParentScroll);
      }

      const HPercent = snapYContainer$.value.clientHeight / container$.value.scrollHeight;
      const WPercent = snapXContainer$.value.clientWidth / container$.value.scrollWidth;
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
      containerHost$.value?.removeEventListener("scroll", onParentScroll);
    })

    function relocationHScroll() {
      horizontalBar$.value.style.top = `${
          scrollY$.value + scrollParentY$.value + snapYContainer$.value.clientHeight - horizontalBar$.value.clientHeight
      }px`;
      horizontalBar$.value.style.left = `${scrollX$.value / (snapXContainer$.value.scrollWidth - snapXContainer$.value.clientWidth) * (horizontalBar$.value.clientWidth - horizontalBarThumb$.value.clientWidth)}px`;
    }

    function relocationVScroll() {
      verticalBar$.value.style.left = `${
          scrollX$.value + scrollParentX$.value + snapXContainer$.value.clientWidth - verticalBar$.value.clientWidth
      }px`;
      verticalBar$.value.style.top = `${scrollY$.value}px`
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
      scrollY$.value = minmax(fromTop, 0, container$.value.scrollHeight - snapYContainer$.value.clientHeight);
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
          scrollLeft(scrollX$.value + event.movementX / RATIO / (horizontalBar$.value.clientWidth - horizontalBarThumb$.value.clientWidth) * (container$.value.scrollWidth - snapXContainer$.value.clientWidth))
        }
      },

      onVerticalPointerDown(event) {
        scrollYActive$.value = true;
        verticalBarThumb$.value.setPointerCapture(event.pointerId);
      },
      onVerticalPointerUp(event) {
        scrollYActive$.value = false;
        verticalBarThumb$.value.releasePointerCapture(event.pointerId);
      },
      onVerticalPointerMove(event) {
        if (scrollYActive$.value) {
          scrollTop(scrollY$.value + event.movementY / RATIO / (verticalBar$.value.clientHeight - verticalBarThumb$.value.clientHeight) * (container$.value.scrollHeight - snapYContainer$.value.clientHeight));
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
        return (scrollX$.value / (container$.value.scrollWidth - snapXContainer$.value.clientWidth)) * (horizontalBar$.value.clientWidth - horizontalBarThumb$.value.clientWidth)
      }),
      vscrollOffset$: computed(() => {
        if (!verticalBar$.value || !verticalBarThumb$.value) {
          return 0;
        }
        return (scrollY$.value / (container$.value.scrollHeight - snapYContainer$.value.clientHeight)) * (verticalBar$.value.clientHeight - verticalBarThumb$.value.clientHeight)
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
