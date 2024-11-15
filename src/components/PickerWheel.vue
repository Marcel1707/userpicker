<template>
  <div v-show="enabledUsers && enabledUsers.length > 0" class="chartContainer">
    <div ref="chartContainer"></div>
    <Button icon="pi pi-undo" label="Spin" @click="rotateChart" style="margin-top: 1em"/>
  </div>

  <div v-show="!enabledUsers || enabledUsers.length === 0" class="chartContainer">
    <h2>No users defined or enabled.</h2>
  </div>

  <Dialog v-model:visible="dialogVisible" modal header="🎉 Congratulations!" :style="{ width: '25rem', textAlign: 'center' }">
    <div style="margin-bottom: 1rem">{{ selectedUser.name }}, it’s your time to shine!</div>
    <Button type="button" label="Continue" @click="onUserSelected"></Button>
  </Dialog>
</template>

<script>
import * as d3 from "d3";
import { schemePastel1 } from "d3-scale-chromatic";

export default {
  props: {
    users: {
      type: Array,
      required: true,
    },
  },
  emits: ['update-users'], // Declare the event to be emitted
  data() {
    return {
      currentAngle: 0,
      selectedUser: undefined,
      enabledUsers: [],
      dialogVisible: false,
    };
  },
  mounted() {
    this.drawChart();
  },
  watch: {
    users: {
      immediate: true,
      handler() {
        this.drawChart();
      },
    },
  },
  methods: {
    drawChart() {
      // Filter enabled users and draw the chart
      this.enabledUsers = this.users.filter(user => user.enabled === true);
      d3.select(this.$refs.chartContainer).select("svg").remove();

      const width = 1000;
      const height = 1000;

      const color = d3.scaleOrdinal(this.enabledUsers.map(user => user.name)).range(schemePastel1);
      const pie = d3.pie().value(() => 10);
      const arc = d3.arc().innerRadius(0).outerRadius(Math.min(width, height) / 2 - 1);
      const labelRadius = arc.outerRadius()() * 0.7;
      const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);
      const arcs = pie(this.enabledUsers);

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
          .attr("fill", d => color(d.data.name))
          .attr("d", arc)
          .attr("stroke", "white")
          .attr("stroke-width", 8)
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
          .attr("stroke", "var(--p-primary-color)")
          .attr("fill", "var(--p-primary-contrast-color)")
          .attr("stroke-width", 8);
    },

    rotateChart() {
      const duration = 5000;
      const rounds = 5;

      const additionalRotation = Math.floor(Math.random() * 360);
      const totalRotation = rounds * 360 + this.currentAngle + additionalRotation;

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
            const userIndex = Math.floor((360 - this.currentAngle) / (360 / this.enabledUsers.length)) % this.enabledUsers.length;
            this.selectedUser = this.enabledUsers[userIndex];
            this.dialogVisible = true;
          });
    },

    onUserSelected() {
      this.dialogVisible = false;

      // Update user enabled status based on the selection
      const updatedUsers = this.users.map(user => ({
        ...user,
        enabled: this.selectedUser === user ? false : user.enabled
      }));

      // Emit the updated user list
      this.$emit('update-users', updatedUsers);

      this.selectedUser = undefined; // Reset the selected user
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
