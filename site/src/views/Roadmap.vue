<script setup lang="ts">
import {
  componentPlan,
  roadmapPhases,
  componentGroups,
  components,
} from '../docs/catalog';
import ComponentTile from '../components/ComponentTile.vue';
</script>
<template>
  <article class="doc-section roadmap-page">
    <div class="page-kicker">COMPONENT ROADMAP / 组件路线图</div>
    <h1>从 {{ components.length }} 个稳定组件，<br />走向完整业务组件体系。</h1>
    <p class="page-lead">
      路线图按业务闭环排序。规划项用于明确边界和优先级，不会提前出现在安装包、示例路由或
      API 中。
    </p>
    <div class="roadmap-summary">
      <div>
        <strong>{{ components.length }}</strong
        ><span>稳定组件</span>
      </div>
      <div>
        <strong>{{ componentPlan.length }}</strong
        ><span>规划组件</span>
      </div>
      <div>
        <strong>{{ componentGroups.length }}</strong
        ><span>能力分类</span>
      </div>
    </div>
    <div v-if="!componentPlan.length" class="doc-callout">
      本轮通用组件补全已交付，所有组件均可在左侧分类中查看演示与 API。
    </div>
    <section
      v-for="phase in roadmapPhases.filter((phase) =>
        componentPlan.some((item) => item.phase === phase.id),
      )"
      :key="phase.id"
      :id="phase.id"
      class="roadmap-phase"
    >
      <div class="roadmap-phase__head">
        <div>
          <span>{{ phase.id.toUpperCase() }}</span>
          <h2>{{ phase.title.replace(/^P\d · /, '') }}</h2>
        </div>
        <p>{{ phase.description }}</p>
      </div>
      <div class="component-landscape">
        <ComponentTile
          v-for="item in componentPlan.filter(
            (item) => item.phase === phase.id,
          )"
          :key="item.name"
          :item="item"
          planned
        />
      </div>
    </section>
    <div class="doc-callout">
      路线图会随真实业务反馈调整。进入开发前，每个组件仍需完成交互规格、无障碍模型、移动端策略、类型设计和文档示例。
    </div>
  </article>
</template>
