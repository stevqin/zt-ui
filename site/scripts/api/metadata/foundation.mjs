export default {
  'config-provider.ZtConfigProvider.props.size': { description:'为后代组件提供默认尺寸；组件自身的 size 优先。', inherit:'default' },
  'config-provider.ZtConfigProvider.props.theme': { description:'为后代组件和 Teleport 浮层提供 light 或 dark 主题。', defaultValue:'light' },
  'config-provider.ZtConfigProvider.props.borderRadius': { description:'全局圆角基准，单位为 px；0 表示直角。', defaultValue:'11' },
}
