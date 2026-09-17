export default {
  'vtable-grid.ZtVTableGrid.props.pageSize': { description:'每页记录数；优先于 pagination.pageSize，并支持 v-model:page-size。', defaultValue:'200' },
  'pagination.ZtPagination.events.current-change': { description:'用户切换当前页后触发，参数为新的页码。' },
  'pagination.ZtPagination.events.size-change': { description:'用户切换每页数量后触发，参数为新的每页数量。' },
}
