<template>
  <div class="chartContainer" ref="chartContainer"></div>
  <Button label="Spin" @click="rotateChart"  />

  <Dialog v-model:visible="dialogVisible" modal header="🎉 Congratulations!" :style="{ width: '25rem' }">
    <span class="text-surface-500 dark:text-surface-400 block mb-8">{{ selectedUser.name }}, it’s your time to shine!</span>
  </Dialog>
</template>

<script>
import * as d3 from "d3";
import { schemePastel1 } from "d3-scale-chromatic";
import { watch } from 'vue';

export default {
  props: {
    users: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      currentAngle: 0,
      selectedUser: undefined,
      dialogVisible: false,
    };
  },
  mounted() {
    this.drawChart(); // Initial drawing of the chart
  },
  watch: {
    users: {
      immediate: true, // Call the handler immediately on component mount
      handler() {
        this.drawChart(); // Redraw the chart when users change
      }
    }
  },
  methods: {
    drawChart() {
      d3.select(this.$refs.chartContainer).select("svg").remove();

      const width = 1000;
      const height = 1000;

      const color = d3.scaleOrdinal(this.users.map(user => user.name)).range(schemePastel1);
      const pie = d3.pie().value(() => 10);
      const arc = d3.arc().innerRadius(0).outerRadius(Math.min(width, height) / 2 - 1);
      const labelRadius = arc.outerRadius()() * 0.7;
      const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);
      const arcs = pie(this.users);

      this.svg = d3.select(this.$refs.chartContainer)
          .append("svg")
          .attr('viewBox', `0 -50 ${width} ${height + 50}`)
          .attr('preserveAspectRatio', 'xMidYMid meet')
          .append("g")
          .attr("transform", `translate(${width / 2}, ${height / 2})`);

      this.chartGroup = this.svg.append("g");

      this.chartGroup
          .selectAll("path")
          .data(arcs)
          .join("path")
          .attr("fill", d => color(d.data.name)) // Make sure to use d.data.name
          .attr("d", arc)
          .attr("stroke", "white") // Stroke color for pie slices
          .attr("stroke-width", 5) // Stroke width for pie slices
          .append("title")
          .text(d => d.data.name);

      this.chartGroup
          .selectAll("text")
          .data(arcs)
          .join("text")
          .attr("transform", d => {
            const centroid = arcLabel.centroid(d);
            const angle = (d.startAngle + d.endAngle) / 2;
            const rotation = angle * (180 / Math.PI) - 90;
            return `translate(${centroid}) rotate(${rotation})`;
          })
          .attr("text-anchor", "middle")
          .call(text =>
              text
                  .append("tspan")
                  .attr("font-weight", "bold")
                  .attr("font-size", "40")
                  .text(d => d.data.name)
          );

      this.svg
          .append("polygon")
          .attr("points", `0,${-height / 2 + 40} -40,${-height / 2 - 20} 40,${-height / 2 - 20}`) // Triangle pointing downwards
          .attr("fill", "white")
          .attr("stroke", "white")
          .attr("stroke-width", 5);
    },

    rotateChart() {
      const duration = 3000;
      const rounds = 5;

      const additionalRotation = Math.floor(Math.random() * 360);
      const totalRotation = 360 + this.currentAngle + additionalRotation;

      this.chartGroup
          .transition()
          .duration(duration)
          .ease(d3.easeCubicOut)
          .attrTween("transform", () => {
            const interpolate = d3.interpolate(this.currentAngle, totalRotation);
            return t => `rotate(${interpolate(t)})`;
          })
          .on("end", () => {
            this.currentAngle = totalRotation % 360;
            const userIndex = Math.floor((360 - this.currentAngle) / (360 / this.users.length)) % this.users.length;
            this.selectedUser = this.users[userIndex];
            this.dialogVisible = true;
          });
    }
  }
};
</script>

<style>
.chartContainer {
  width: 100%;
  max-width: 600px;
}
</style>
