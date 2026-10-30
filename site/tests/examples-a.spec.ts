import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import ButtonBasic from '../src/examples/button/Basic.vue'
import Tags from '../src/examples/tag/Closable.vue'
import Tabs from '../src/examples/tabs/Editable.vue'
import Menu from '../src/examples/menu/Router.vue'
import Segmented from '../src/examples/segmented/Basic.vue'
import Steps from '../src/examples/steps/Basic.vue'
import Pagination from '../src/examples/pagination/Basic.vue'
import Collapse from '../src/examples/collapse/Basic.vue'
import Tour from '../src/examples/tour/Basic.vue'
import Infinite from '../src/examples/infinite-scroll/Retry.vue'
import Splitter from '../src/examples/splitter/Basic.vue'
import Carousel from '../src/examples/carousel/Basic.vue'
import QRCode from '../src/examples/qrcode/Basic.vue'
import QRDownload from '../src/examples/qrcode/Download.vue'
import Gallery from '../src/examples/icon/Gallery.vue'
import Preview from '../src/examples/image/Preview.vue'
import TabsGuard from '../src/examples/tabs/Guard.vue'
import MenuBasic from '../src/examples/menu/Basic.vue'
import { flushPromises } from '@vue/test-utils'
const wrappers: VueWrapper[] = []
function render(component: Parameters<typeof mount>[0]) { const wrapper = mount(component, { attachTo: document.body }); wrappers.push(wrapper); return wrapper }
afterEach(() => { wrappers.splice(0).forEach(wrapper => wrapper.unmount()); document.body.innerHTML = ''; vi.restoreAllMocks() })
describe('基础、导航与反馈示例的业务交互', () => {
  it('按钮点击更新实际提交次数', async () => { const w = render(ButtonBasic); await w.get('button').trigger('click'); expect(w.text()).toContain('已提交 1 次') })
  it('关闭标签后从数据中移除，恢复按钮能重新添加', async () => { const w = render(Tags); await w.get('.zt-tag__close').trigger('click'); expect(w.findAll('.zt-tag')).toHaveLength(2); await w.findAll('button').find(b => b.text() === '恢复标签')!.trigger('click'); expect(w.findAll('.zt-tag')).toHaveLength(3) })
  it('可编辑标签页新增并激活新草稿', async () => { const w = render(Tabs); await w.get('.zt-tabs__add').trigger('click'); expect(w.text()).toContain('草稿 3'); expect(w.text()).toContain('正在编辑：草稿 3') })
  it('路由菜单使用内存路由切换页面而不改变文档 URL', async () => { const w = render(Menu); await flushPromises(); await w.get('[data-menu-key="orders"]').trigger('click'); await flushPromises(); expect(w.text()).toContain('模拟页面：订单列表'); expect(w.text()).toContain('/orders?state=pending') })
  it('分段选择切换统计口径', async () => { const w = render(Segmented); await w.findAll('[role="radio"]').find(b => b.text().includes('月'))!.trigger('click'); expect(w.text()).toContain('本月销售额：¥128,600') })
  it('步骤前进反映业务进度', async () => { const w = render(Steps); await w.findAll('button').find(b => b.text() === '下一步')!.trigger('click'); expect(w.text()).toContain('当前：确认商品') })
  it('翻页实际更新切片数据', async () => { const w = render(Pagination); await w.findAll('button').find(b => b.text() === '2')!.trigger('click'); expect(w.text()).toContain('订单 006'); expect(w.text()).not.toContain('订单 001') })
  it('折叠面板可展开实际帮助内容', async () => { const w = render(Collapse); await w.findAll('button').find(b => b.text().includes('如何导出'))!.trigger('click'); expect(w.find('[aria-expanded="true"]').exists()).toBe(true); expect(w.text()).toContain('在报表工具栏点击导出') })
  it('开始导览显示浮层，关闭后可重新打开', async () => { const w = render(Tour); await w.findAll('button').find(b => b.text() === '开始导览')!.trigger('click'); await flushPromises(); expect(document.body.textContent).toContain('筛选订单'); expect(document.querySelector('[role="dialog"]')).not.toBeNull(); (document.querySelector('[aria-label="关闭引导"]') as HTMLElement).click(); await flushPromises(); expect(document.querySelector('[role="dialog"]')).toBeNull(); await w.findAll('button').find(b => b.text() === '开始导览')!.trigger('click'); await flushPromises(); expect(document.querySelector('[role="dialog"]')).not.toBeNull() })
  it('无限滚动失败后重试追加数据', async () => { const w = render(Infinite); await w.findAll('button').find(b => b.text() === '请求下一页')!.trigger('click'); await flushPromises(); expect(w.text()).toContain('模拟网络中断'); await w.findAll('button').find(b => b.text() === '重试')!.trigger('click'); await flushPromises(); expect(w.text()).toContain('到货通知 4'); expect(w.text()).not.toContain('模拟网络中断') })
})

describe('复杂展示示例', () => {
  it('分栏键盘调整后可收起恢复', async () => { const w = render(Splitter); await w.get('[role="separator"]').trigger('keydown', { key: 'ArrowRight' }); expect(w.text()).toContain('左栏 36%'); await w.get('[aria-label="收起第一栏"]').trigger('click'); expect(w.text()).toContain('左栏 0%'); await w.get('[aria-label="展开第一栏"]').trigger('click'); expect(w.text()).toContain('左栏 36%') })
  it('轮播切换与业务索引同步', async () => { const w = render(Carousel); await w.get('[aria-label="下一张"]').trigger('click'); expect(w.text()).toContain('当前活动：会员积分活动') })
  it('二维码重新编码并支持空内容', async () => { const w = render(QRCode); await flushPromises(); expect(w.find('svg[role="img"]').exists()).toBe(true); await w.get('input').setValue(''); await flushPromises(); expect(w.text()).toContain('暂无内容'); expect(w.find('svg[role="img"]').exists()).toBe(false) })
  it('图标库筛选与选择生成对应代码', async () => { const w = render(Gallery); await w.get('input').setValue('arrow'); expect(w.findAll('button')).toHaveLength(4); await w.findAll('button').find(b => b.text() === 'arrow-down')!.trigger('click'); expect(w.get('pre').text()).toContain('name="arrow-down"') })
  it('图片预览可切换、缩放并关闭', async () => { const w = render(Preview); await w.get('.zt-image').trigger('click'); await flushPromises(); const dialog = document.querySelector('[aria-label="图片预览"]')!; expect(dialog).not.toBeNull(); expect(dialog.textContent).toContain('1 / 3'); (dialog.querySelector('[aria-label="下一张"]') as HTMLElement).click(); await flushPromises(); expect(dialog.textContent).toContain('2 / 3'); (dialog.querySelector('[aria-label="放大"]') as HTMLElement).click(); await flushPromises(); expect((dialog.querySelector('img') as HTMLImageElement).style.transform).toContain('scale(1.2)'); (dialog.querySelector('[aria-label="关闭预览"]') as HTMLElement).click(); await flushPromises(); expect(document.querySelector('[aria-label="图片预览"]')).toBeNull() })
  it('未保存草稿阻止切页，保存后可切换', async () => { const w = render(TabsGuard); await flushPromises(); await w.findAll('[role="tab"]').find(b => b.text().includes('预览'))!.trigger('click'); expect(w.text()).toContain('请先保存草稿'); await w.get('input').setValue(true); await w.findAll('[role="tab"]').find(b => b.text().includes('预览'))!.trigger('click'); await flushPromises(); expect(w.text()).toContain('已切换到 preview'); expect(w.text()).toContain('已保存的草稿预览') })
  it('折叠菜单会创建浮层并在选择后关闭', async () => { const w = render(MenuBasic); const toggle = w.findAll('button').find(b => b.attributes('aria-label')?.includes('折叠'))!; await toggle.trigger('click'); await w.get('[data-menu-key="goods"]').trigger('click'); await flushPromises(); const popup = document.body.querySelector('.zt-menu__flyout'); expect(popup).not.toBeNull(); const stock = popup!.querySelector('[data-menu-key="stock"]') as HTMLElement; stock.click(); await flushPromises(); expect(w.text()).toContain('stock'); expect(document.body.querySelector('.zt-menu__flyout')).toBeNull() })
})

it('二维码下载会生成真实 SVG 并反馈文件名', async () => {
  const create = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test-qr')
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
  const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  const w = render(QRDownload)
  await flushPromises()
  await w.findAll('button').find(b => b.text() === '下载二维码')!.trigger('click')
  expect(create).toHaveBeenCalledOnce()
  expect(create.mock.calls[0]![0]).toBeInstanceOf(Blob)
  expect(click).toHaveBeenCalledOnce()
  expect(w.text()).toContain('已下载 order-code.svg')
})
