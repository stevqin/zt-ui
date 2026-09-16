import { defineComponent, h, type Component } from 'vue'
import type { ZtIconName } from './types'

type Shape = ['path', string] | ['circle', number, number, number] | ['rect', number, number, number, number, number?]
const shapes:Record<ZtIconName,Shape[]> = {
  add:[['path','M12 5v14M5 12h14']], minus:[['path','M5 12h14']],
  close:[['path','m6 6 12 12M18 6 6 18']], check:[['path','m5 12 4 4L19 6']],
  search:[['circle',11,11,7],['path','m20 20-4-4']],
  info:[['circle',12,12,9],['path','M12 11v6M12 7h.01']],
  warning:[['path','M10.3 3.8 2.4 18a2 2 0 0 0 1.8 3h15.6a2 2 0 0 0 1.8-3L13.7 3.8a2 2 0 0 0-3.4 0ZM12 9v4M12 17h.01']],
  error:[['circle',12,12,9],['path','m9 9 6 6M15 9l-6 6']],
  success:[['circle',12,12,9],['path','m8 12 3 3 5-6']],
  'chevron-up':[['path','m6 15 6-6 6 6']], 'chevron-right':[['path','m9 6 6 6-6 6']],
  'chevron-down':[['path','m6 9 6 6 6-6']], 'chevron-left':[['path','m15 6-6 6 6 6']],
  'arrow-up':[['path','M12 19V5m-6 6 6-6 6 6']], 'arrow-right':[['path','M5 12h14m-6-6 6 6-6 6']],
  'arrow-down':[['path','M12 5v14m6-6-6 6-6-6']], 'arrow-left':[['path','M19 12H5m6 6-6-6 6-6']],
  more:[['circle',5,12,1],['circle',12,12,1],['circle',19,12,1]],
  user:[['circle',12,8,4],['path','M4 21a8 8 0 0 1 16 0']],
  image:[['rect',3,4,18,16,2],['circle',9,9,2],['path','m21 15-5-5L5 21']],
  upload:[['path','M12 16V4m-5 5 5-5 5 5M4 15v5h16v-5']],
  download:[['path','M12 4v12m5-5-5 5-5-5M4 19h16']],
  calendar:[['rect',3,5,18,16,2],['path','M16 3v4M8 3v4M3 10h18']],
  edit:[['path','M13.5 6.5 17.5 10.5M4 20l4.5-1 10-10a2.8 2.8 0 0 0-4-4l-10 10L4 20Z']],
  delete:[['path','M4 7h16M9 7V4h6v3m3 0-1 14H7L6 7M10 11v6M14 11v6']],
  home:[['path','m3 11 9-8 9 8v10h-6v-6H9v6H3V11Z']],
  settings:[['circle',12,12,3],['path','M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z']],
  refresh:[['path','M20 7v5h-5M4 17v-5h5M6.1 8a7 7 0 0 1 11.5-2L20 12M4 12l2.4 6a7 7 0 0 0 11.5-2']],
  visibility:[['path','M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z'],['circle',12,12,3]],
}

function renderShapes(items:Shape[]){return items.map((shape,index)=>shape[0]==='path'
  ? h('path',{key:index,d:shape[1]})
  : shape[0]==='circle'?h('circle',{key:index,cx:shape[1],cy:shape[2],r:shape[3]})
  : h('rect',{key:index,x:shape[1],y:shape[2],width:shape[3],height:shape[4],rx:shape[5]}))}

export function createIconComponent(name:ZtIconName){return defineComponent({
  name:`Zt${name.split('-').map(value=>value[0]!.toUpperCase()+value.slice(1)).join('')}Icon`,
  props:{strokeWidth:{type:Number,default:2}},
  setup(props){return()=>h('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':props.strokeWidth,'stroke-linecap':'round','stroke-linejoin':'round'},renderShapes(shapes[name]))},
})}

export const iconComponents=(Object.keys(shapes) as ZtIconName[]).reduce((result,name)=>{result[name]=createIconComponent(name);return result},{} as Record<ZtIconName,Component>)
const unknownIcons=new Set<string>()
export function warnUnknownIcon(name:string){if(!unknownIcons.has(name)){unknownIcons.add(name);console.warn(`[zt-ui] Unknown icon name: ${name}`)}}
export const ZtAddIcon=iconComponents.add
export const ZtMinusIcon=iconComponents.minus
export const ZtCloseIcon=iconComponents.close
export const ZtCheckIcon=iconComponents.check
export const ZtSearchIcon=iconComponents.search
export const ZtInfoIcon=iconComponents.info
export const ZtWarningIcon=iconComponents.warning
export const ZtErrorIcon=iconComponents.error
export const ZtSuccessIcon=iconComponents.success
export const ZtChevronUpIcon=iconComponents['chevron-up']
export const ZtChevronRightIcon=iconComponents['chevron-right']
export const ZtChevronDownIcon=iconComponents['chevron-down']
export const ZtChevronLeftIcon=iconComponents['chevron-left']
export const ZtArrowUpIcon=iconComponents['arrow-up']
export const ZtArrowRightIcon=iconComponents['arrow-right']
export const ZtArrowDownIcon=iconComponents['arrow-down']
export const ZtArrowLeftIcon=iconComponents['arrow-left']
export const ZtMoreIcon=iconComponents.more
export const ZtUserIcon=iconComponents.user
export const ZtImageIcon=iconComponents.image
export const ZtUploadIcon=iconComponents.upload
export const ZtDownloadIcon=iconComponents.download
export const ZtCalendarIcon=iconComponents.calendar
export const ZtEditIcon=iconComponents.edit
export const ZtDeleteIcon=iconComponents.delete
export const ZtHomeIcon=iconComponents.home
export const ZtSettingsIcon=iconComponents.settings
export const ZtRefreshIcon=iconComponents.refresh
export const ZtVisibilityIcon=iconComponents.visibility
