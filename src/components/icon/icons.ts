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
  clipboard:[['path','M9 5H6a2 2 0 0 0-2 2v13h16V7a2 2 0 0 0-2-2h-3'],['rect',9,3,6,4,1],['path','M8 12h8M8 16h5']],
  checklist:[['path','m3 6 2 2 4-4M12 6h9M3 13h3M10 13h11M3 20h3M10 20h11']],
  'filter-list':[['path','M4 6h16M7 12h13M10 18h10']],
  'more-vertical':[['circle',12,5,1],['circle',12,12,1],['circle',12,19,1]],
  menu:[['path','M4 7h16M4 12h16M4 17h16']],
  users:[['circle',9,8,3.5],['path','M2.5 20a6.5 6.5 0 0 1 13 0'],['path','M16 4.8a3.5 3.5 0 0 1 0 6.4'],['path','M17.5 14.8A5.5 5.5 0 0 1 22 20']],
  file:[['path','M7 3h7l5 5v13H7V3Z'],['path','M14 3v5h5']],
  folder:[['path','M3 6h7l2 2h9v11H3V6Z']],
  paperclip:[['path','m20 11-8.2 8.2a4 4 0 0 1-5.7-5.7l8.5-8.5a2.7 2.7 0 0 1 3.8 3.8L9.9 17.3a1.3 1.3 0 0 1-1.9-1.9L15.5 8']],
  clock:[['circle',12,12,9],['path','M12 7v5l3.5 2']],
  'eye-off':[['path','M3 3 21 21'],['path','M10.6 10.7a2 2 0 0 0 2.7 2.7'],['path','M9.5 5.3A9.6 9.6 0 0 1 12 5c6.5 0 10 7 10 7a17.8 17.8 0 0 1-3.3 4.3M6.3 6.3C3.9 8 2 12 2 12s3.5 7 10 7c1.2 0 2.3-.2 3.3-.5']],
  lock:[['rect',5,11,14,10,2],['path','M8 11V8a4 4 0 0 1 8 0v3']],
  unlock:[['rect',5,11,14,10,2],['path','M8 11V8a4 4 0 0 1 7.6-1.7']],
  save:[['path','M5 4h11l4 4v12H5V4Z'],['path','M8 4v6h8V4M8 20v-6h8v6']],
  copy:[['rect',9,9,12,12,2],['path','M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1']],
  link:[['path','M10.5 13.5a4 4 0 0 0 5.7 0l2.3-2.3a4 4 0 1 0-5.7-5.7l-1.3 1.3'],['path','M13.5 10.5a4 4 0 0 0-5.7 0l-2.3 2.3a4 4 0 1 0 5.7 5.7l1.3-1.3']],
  'external-link':[['path','M14 4h6v6M20 4 11 13'],['path','M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6']],
  share:[['circle',6,12,2],['circle',18,6,2],['circle',18,18,2],['path','m8 11 8-4M8 13l8 4']],
  tag:[['path','M3 12V4h8l9 9-8 8-9-9Z'],['circle',8,8,1.2]],
  star:[['path','m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9L12 3Z']],
  heart:[['path','M12 20.5S4 15.8 4 10.4A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 8 2.8c0 5.4-8 10.1-8 10.1Z']],
  bookmark:[['path','M7 4h10v16l-5-3.4L7 20V4Z']],
  mail:[['rect',3,5,18,14,2],['path','m3 8 9 6 9-6']],
  phone:[['path','M7.5 3h2.8l1.4 4-2 1.4a12.5 12.5 0 0 0 5.9 5.9L17 12.3l4 1.4v2.8a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3.5 5.2 2 2 0 0 1 5.5 3h2Z']],
  location:[['path','M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10Z'],['circle',12,11,2.4]],
  help:[['circle',12,12,9],['path','M9.3 9.2a3 3 0 0 1 5.7 1.1c0 2-2.8 2.5-2.8 2.5M12 17h.01']],
  ban:[['circle',12,12,9],['path','m6 6 12 12']],
  play:[['path','M8 5v14l12-7L8 5Z']],
  pause:[['path','M8 5v14M16 5v14']],
  undo:[['path','M4 8h10a5 5 0 0 1 0 10H8'],['path','m8 4-4 4 4 4']],
  redo:[['path','M20 8H10a5 5 0 0 0 0 10h6'],['path','m16 4 4 4-4 4']],
  login:[['path','M14 5h4a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-4'],['path','m10 8-4 4 4 4M6 12h9']],
  logout:[['path','M10 5H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h4'],['path','m15 8 4 4-4 4M19 12H9']],
  maximize:[['path','M8 4H4v4M16 4h4v4M4 16v4h4M20 16v4h-4']],
  chart:[['path','M3 3v18h18'],['path','m7 15 4-5 3 3 5-7']],
  sun:[['circle',12,12,4],['path','M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4']],
  moon:[['path','M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z']],
  filter:[['path','M4 5h16l-6 7v6l-4 2v-8L4 5Z']],
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
export const ZtClipboardIcon=iconComponents.clipboard
export const ZtChecklistIcon=iconComponents.checklist
export const ZtFilterListIcon=iconComponents['filter-list']
export const ZtMoreVerticalIcon=iconComponents['more-vertical']
export const ZtMenuIcon=iconComponents.menu
export const ZtUsersIcon=iconComponents.users
export const ZtFileIcon=iconComponents.file
export const ZtFolderIcon=iconComponents.folder
export const ZtPaperclipIcon=iconComponents.paperclip
export const ZtClockIcon=iconComponents.clock
export const ZtEyeOffIcon=iconComponents['eye-off']
export const ZtLockIcon=iconComponents.lock
export const ZtUnlockIcon=iconComponents.unlock
export const ZtSaveIcon=iconComponents.save
export const ZtCopyIcon=iconComponents.copy
export const ZtLinkIcon=iconComponents.link
export const ZtExternalLinkIcon=iconComponents['external-link']
export const ZtShareIcon=iconComponents.share
export const ZtTagIcon=iconComponents.tag
export const ZtStarIcon=iconComponents.star
export const ZtHeartIcon=iconComponents.heart
export const ZtBookmarkIcon=iconComponents.bookmark
export const ZtMailIcon=iconComponents.mail
export const ZtPhoneIcon=iconComponents.phone
export const ZtLocationIcon=iconComponents.location
export const ZtHelpIcon=iconComponents.help
export const ZtBanIcon=iconComponents.ban
export const ZtPlayIcon=iconComponents.play
export const ZtPauseIcon=iconComponents.pause
export const ZtUndoIcon=iconComponents.undo
export const ZtRedoIcon=iconComponents.redo
export const ZtLoginIcon=iconComponents.login
export const ZtLogoutIcon=iconComponents.logout
export const ZtMaximizeIcon=iconComponents.maximize
export const ZtChartIcon=iconComponents.chart
export const ZtSunIcon=iconComponents.sun
export const ZtMoonIcon=iconComponents.moon
export const ZtFilterIcon=iconComponents.filter
