import { defineComponent, h, type Component } from 'vue'
import type { ZtIconName } from './types'

import { additionalIconShapes } from './additional-icons'
import type { IconShape } from './shapes'

const shapes:Record<ZtIconName,readonly IconShape[]> = {
  ...additionalIconShapes,
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
  'filter-list':[['path','M4 6h16M4 12h5M4 18h5'],['path','M11 10h9l-3 3.5v3l-3 1.5v-4.5L11 10Z']],
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
  login:[['path','M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5'],['path','m11 8 4 4-4 4M3 12h12']],
  logout:[['path','M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5'],['path','m17 8 4 4-4 4M9 12h12']],
  maximize:[['path','M8 4H4v4M16 4h4v4M4 16v4h4M20 16v4h-4']],
  // Lucide Maximize2 / Minimize2 (ISC/MIT); see THIRD_PARTY_NOTICES.
  'maximize-2':[['path','M15 3h6v6'],['path','m21 3-7 7'],['path','m3 21 7-7'],['path','M9 21H3v-6']],
  'minimize-2':[['path','m14 10 7-7'],['path','M20 10h-6V4'],['path','m3 21 7-7'],['path','M4 14h6v6']],
  chart:[['path','M3 3v18h18'],['path','m7 15 4-5 3 3 5-7']],
  sun:[['circle',12,12,4],['path','M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4']],
  moon:[['path','M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z']],
  filter:[['path','M4 5h16l-6 7v6l-4 2v-8L4 5Z']],
}

function renderShapes(items:readonly IconShape[]){return items.map((shape,index)=>shape[0]==='path'
  ? h('path',{key:index,pathLength:100,d:shape[1]})
  : shape[0]==='circle'?h('circle',{key:index,pathLength:100,cx:shape[1],cy:shape[2],r:shape[3]})
  : h('rect',{key:index,pathLength:100,x:shape[1],y:shape[2],width:shape[3],height:shape[4],rx:shape[5]}))}

export function createIconComponent(name:ZtIconName){return defineComponent({
  name:`Zt${name.split('-').map(value=>value[0]!.toUpperCase()+value.slice(1)).join('')}Icon`,
  props:{strokeWidth:{type:Number,default:2}},
  setup(props){return()=>h('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':props.strokeWidth,'stroke-linecap':name==='barcode'?'butt':'round','stroke-linejoin':'round'},renderShapes(shapes[name]))},
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
export const ZtMaximize2Icon=iconComponents['maximize-2']
export const ZtMinimize2Icon=iconComponents['minimize-2']
export const ZtChartIcon=iconComponents.chart
export const ZtSunIcon=iconComponents.sun
export const ZtMoonIcon=iconComponents.moon
export const ZtFilterIcon=iconComponents.filter
export const ZtChartBarIcon=iconComponents['chart-bar']
export const ZtChartPieIcon=iconComponents['chart-pie']
export const ZtChartAreaIcon=iconComponents['chart-area']
export const ZtChartScatterIcon=iconComponents['chart-scatter']
export const ZtChartRadarIcon=iconComponents['chart-radar']
export const ZtChartDonutIcon=iconComponents['chart-donut']
export const ZtChartCandlestickIcon=iconComponents['chart-candlestick']
export const ZtChartFunnelIcon=iconComponents['chart-funnel']
export const ZtChartGaugeIcon=iconComponents['chart-gauge']
export const ZtChartHeatmapIcon=iconComponents['chart-heatmap']
export const ZtChartBoxplotIcon=iconComponents['chart-boxplot']
export const ZtDashboardIcon=iconComponents['dashboard']
export const ZtDatabaseIcon=iconComponents['database']
export const ZtServerIcon=iconComponents['server']
export const ZtTableIcon=iconComponents['table']
export const ZtRowsIcon=iconComponents['rows']
export const ZtColumnsIcon=iconComponents['columns']
export const ZtSortAscendingIcon=iconComponents['sort-ascending']
export const ZtSortDescendingIcon=iconComponents['sort-descending']
export const ZtGroupIcon=iconComponents['group']
export const ZtAggregateIcon=iconComponents['aggregate']
export const ZtFormulaIcon=iconComponents['formula']
export const ZtDataImportIcon=iconComponents['data-import']
export const ZtDataExportIcon=iconComponents['data-export']
export const ZtShirtIcon=iconComponents['shirt']
export const ZtDressIcon=iconComponents['dress']
export const ZtJacketIcon=iconComponents['jacket']
export const ZtPantsIcon=iconComponents['pants']
export const ZtSkirtIcon=iconComponents['skirt']
export const ZtCoatIcon=iconComponents['coat']
export const ZtHangerIcon=iconComponents['hanger']
export const ZtShoeIcon=iconComponents['shoe']
export const ZtBagIcon=iconComponents['bag']
export const ZtScissorsIcon=iconComponents['scissors']
export const ZtRulerIcon=iconComponents['ruler']
export const ZtPaletteIcon=iconComponents['palette']
export const ZtStoreIcon=iconComponents['store']
export const ZtShoppingCartIcon=iconComponents['shopping-cart']
export const ZtShoppingBasketIcon=iconComponents['shopping-basket']
export const ZtBarcodeIcon=iconComponents['barcode']
export const ZtQrCodeIcon=iconComponents['qr-code']
export const ZtReceiptIcon=iconComponents['receipt']
export const ZtCouponIcon=iconComponents['coupon']
export const ZtGiftIcon=iconComponents['gift']
export const ZtCreditCardIcon=iconComponents['credit-card']
export const ZtWalletIcon=iconComponents['wallet']
export const ZtCashRegisterIcon=iconComponents['cash-register']
export const ZtPercentIcon=iconComponents['percent']
export const ZtPackageIcon=iconComponents['package']
export const ZtBoxesIcon=iconComponents['boxes']
export const ZtWarehouseIcon=iconComponents['warehouse']
export const ZtInventoryIcon=iconComponents['inventory']
export const ZtPalletIcon=iconComponents['pallet']
export const ZtForkliftIcon=iconComponents['forklift']
export const ZtTruckIcon=iconComponents['truck']
export const ZtContainerIcon=iconComponents['container']
export const ZtRouteIcon=iconComponents['route']
export const ZtCompassIcon=iconComponents['compass']
export const ZtScaleIcon=iconComponents['scale']
export const ZtConveyorIcon=iconComponents['conveyor']
export const ZtBriefcaseIcon=iconComponents['briefcase']
export const ZtBuildingIcon=iconComponents['building']
export const ZtWorkflowIcon=iconComponents['workflow']
export const ZtApprovalIcon=iconComponents['approval']
export const ZtStampIcon=iconComponents['stamp']
export const ZtContractIcon=iconComponents['contract']
export const ZtPresentationIcon=iconComponents['presentation']
export const ZtNotebookIcon=iconComponents['notebook']
export const ZtArchiveIcon=iconComponents['archive']
export const ZtPrinterIcon=iconComponents['printer']
export const ZtCalendarCheckIcon=iconComponents['calendar-check']
export const ZtCalendarRangeIcon=iconComponents['calendar-range']
export const ZtMessageIcon=iconComponents['message']
export const ZtMessagesIcon=iconComponents['messages']
export const ZtSendIcon=iconComponents['send']
export const ZtBellIcon=iconComponents['bell']
export const ZtBellOffIcon=iconComponents['bell-off']
export const ZtMegaphoneIcon=iconComponents['megaphone']
export const ZtUserAddIcon=iconComponents['user-add']
export const ZtUserCheckIcon=iconComponents['user-check']
export const ZtUserCardIcon=iconComponents['user-card']
export const ZtOrganizationIcon=iconComponents['organization']
export const ZtHandshakeIcon=iconComponents['handshake']
export const ZtHeadsetIcon=iconComponents['headset']
export const ZtShieldIcon=iconComponents['shield']
export const ZtShieldCheckIcon=iconComponents['shield-check']
export const ZtKeyIcon=iconComponents['key']
export const ZtFingerprintIcon=iconComponents['fingerprint']
export const ZtQrScanIcon=iconComponents['qr-scan']
export const ZtCloudIcon=iconComponents['cloud']
export const ZtCloudUploadIcon=iconComponents['cloud-upload']
export const ZtWifiIcon=iconComponents['wifi']
export const ZtGlobeIcon=iconComponents['globe']
export const ZtPowerIcon=iconComponents['power']
export const ZtCodeIcon=iconComponents['code']
export const ZtBugIcon=iconComponents['bug']
export const ZtMonitorIcon=iconComponents['monitor']
export const ZtLaptopIcon=iconComponents['laptop']
export const ZtSmartphoneIcon=iconComponents['smartphone']
export const ZtKeyboardIcon=iconComponents['keyboard']
export const ZtMouseIcon=iconComponents['mouse']
export const ZtCameraIcon=iconComponents['camera']
export const ZtVideoIcon=iconComponents['video']
export const ZtMicrophoneIcon=iconComponents['microphone']
export const ZtVolumeIcon=iconComponents['volume']
export const ZtVolumeOffIcon=iconComponents['volume-off']
export const ZtMusicIcon=iconComponents['music']
export const ZtFilmIcon=iconComponents['film']
export const ZtLightningIcon=iconComponents['lightning']
export const ZtSparklesIcon=iconComponents['sparkles']
export const ZtTargetIcon=iconComponents['target']
export const ZtFlagIcon=iconComponents['flag']
export const ZtPinIcon=iconComponents['pin']
export const ZtRocketIcon=iconComponents['rocket']
export const ZtTimerIcon=iconComponents['timer']
export const ZtHistoryIcon=iconComponents['history']
export const ZtZoomInIcon=iconComponents['zoom-in']
export const ZtZoomOutIcon=iconComponents['zoom-out']
export const ZtSlidersIcon=iconComponents['sliders']
export const ZtToolIcon=iconComponents['tool']
export const ZtBankIcon=iconComponents['bank']
export const ZtCoinsIcon=iconComponents['coins']
export const ZtBanknoteIcon=iconComponents['banknote']
export const ZtCalculatorIcon=iconComponents['calculator']
export const ZtInvoiceIcon=iconComponents['invoice']
export const ZtPiggyBankIcon=iconComponents['piggy-bank']
export const ZtSafeIcon=iconComponents['safe']
export const ZtTrendUpIcon=iconComponents['trend-up']
export const ZtTrendDownIcon=iconComponents['trend-down']
export const ZtCurrencyYuanIcon=iconComponents['currency-yuan']
export const ZtCurrencyDollarIcon=iconComponents['currency-dollar']
export const ZtAbacusIcon=iconComponents['abacus']
export const ZtBowTieIcon=iconComponents['bow-tie']
export const ZtTieIcon=iconComponents['tie']
export const ZtHatIcon=iconComponents['hat']
export const ZtCapIcon=iconComponents['cap']
export const ZtGlassesIcon=iconComponents['glasses']
export const ZtSockIcon=iconComponents['sock']
export const ZtBootIcon=iconComponents['boot']
export const ZtSneakerIcon=iconComponents['sneaker']
export const ZtWatchIcon=iconComponents['watch']
export const ZtRingIcon=iconComponents['ring']
export const ZtUmbrellaIcon=iconComponents['umbrella']
export const ZtThreadSpoolIcon=iconComponents['thread-spool']
export const ZtShipIcon=iconComponents['ship']
export const ZtPlaneIcon=iconComponents['plane']
export const ZtTrainIcon=iconComponents['train']
export const ZtCarIcon=iconComponents['car']
export const ZtBicycleIcon=iconComponents['bicycle']
export const ZtAnchorIcon=iconComponents['anchor']
export const ZtCraneIcon=iconComponents['crane']
export const ZtHandTruckIcon=iconComponents['hand-truck']
export const ZtDeliveryReturnIcon=iconComponents['delivery-return']
export const ZtMapIcon=iconComponents['map']
export const ZtSignpostIcon=iconComponents['signpost']
export const ZtFuelIcon=iconComponents['fuel']
export const ZtFileTextIcon=iconComponents['file-text']
export const ZtFileSpreadsheetIcon=iconComponents['file-spreadsheet']
export const ZtFilePdfIcon=iconComponents['file-pdf']
export const ZtFileCodeIcon=iconComponents['file-code']
export const ZtFolderOpenIcon=iconComponents['folder-open']
export const ZtFolderAddIcon=iconComponents['folder-add']
export const ZtBookOpenIcon=iconComponents['book-open']
export const ZtGraduationCapIcon=iconComponents['graduation-cap']
export const ZtMedalIcon=iconComponents['medal']
export const ZtAwardIcon=iconComponents['award']
export const ZtCoffeeIcon=iconComponents['coffee']
export const ZtClipboardSignatureIcon=iconComponents['clipboard-signature']
export const ZtContactBookIcon=iconComponents['contact-book']
export const ZtTeamMeetingIcon=iconComponents['team-meeting']
export const ZtUserRemoveIcon=iconComponents['user-remove']
export const ZtUserSettingsIcon=iconComponents['user-settings']
export const ZtUserLockIcon=iconComponents['user-lock']
export const ZtChatCheckIcon=iconComponents['chat-check']
export const ZtMailOpenIcon=iconComponents['mail-open']
export const ZtMailSendIcon=iconComponents['mail-send']
export const ZtPhoneCallIcon=iconComponents['phone-call']
export const ZtPhoneMissedIcon=iconComponents['phone-missed']
export const ZtVideoCallIcon=iconComponents['video-call']
export const ZtLanguagesIcon=iconComponents['languages']
export const ZtChartStackedIcon=iconComponents['chart-stacked']
export const ZtChartWaterfallIcon=iconComponents['chart-waterfall']
export const ZtChartNetworkIcon=iconComponents['chart-network']
export const ZtChartTreemapIcon=iconComponents['chart-treemap']
export const ZtChartTimelineIcon=iconComponents['chart-timeline']
export const ZtPivotTableIcon=iconComponents['pivot-table']
export const ZtMergeCellsIcon=iconComponents['merge-cells']
export const ZtSplitCellsIcon=iconComponents['split-cells']
export const ZtBracesIcon=iconComponents['braces']
export const ZtBinaryIcon=iconComponents['binary']
export const ZtTerminalIcon=iconComponents['terminal']
export const ZtWebhookIcon=iconComponents['webhook']
export const ZtArrowUpRightIcon=iconComponents['arrow-up-right']
export const ZtArrowDownLeftIcon=iconComponents['arrow-down-left']
export const ZtArrowsExpandIcon=iconComponents['arrows-expand']
export const ZtArrowsCollapseIcon=iconComponents['arrows-collapse']
export const ZtRepeatIcon=iconComponents['repeat']
export const ZtShuffleIcon=iconComponents['shuffle']
export const ZtAlignLeftIcon=iconComponents['align-left']
export const ZtAlignCenterIcon=iconComponents['align-center']
export const ZtAlignRightIcon=iconComponents['align-right']
export const ZtIndentIcon=iconComponents['indent']
export const ZtOutdentIcon=iconComponents['outdent']
export const ZtCropIcon=iconComponents['crop']
export const ZtPriceTagsIcon=iconComponents['price-tags']
export const ZtDiscountBadgeIcon=iconComponents['discount-badge']
export const ZtMembershipIcon=iconComponents['membership']
export const ZtTicketIcon=iconComponents['ticket']
export const ZtScanLineIcon=iconComponents['scan-line']
export const ZtPosTerminalIcon=iconComponents['pos-terminal']
export const ZtShoppingBagCheckIcon=iconComponents['shopping-bag-check']
export const ZtStorefrontCheckIcon=iconComponents['storefront-check']
export const ZtReturnReceiptIcon=iconComponents['return-receipt']
export const ZtSalesTargetIcon=iconComponents['sales-target']
export const ZtLoyaltyPointsIcon=iconComponents['loyalty-points']
export const ZtVoucherStackIcon=iconComponents['voucher-stack']
export const ZtCpuIcon=iconComponents['cpu']
export const ZtMemoryIcon=iconComponents['memory']
export const ZtHardDriveIcon=iconComponents['hard-drive']
export const ZtUsbIcon=iconComponents['usb']
export const ZtPlugIcon=iconComponents['plug']
export const ZtBatteryIcon=iconComponents['battery']
export const ZtBatteryChargingIcon=iconComponents['battery-charging']
export const ZtBluetoothIcon=iconComponents['bluetooth']
export const ZtNetworkIcon=iconComponents['network']
export const ZtShieldAlertIcon=iconComponents['shield-alert']
export const ZtLockKeyholeIcon=iconComponents['lock-keyhole']
export const ZtScanFaceIcon=iconComponents['scan-face']
export const ZtLeafIcon=iconComponents['leaf']
export const ZtFlowerIcon=iconComponents['flower']
export const ZtTreeIcon=iconComponents['tree']
export const ZtMountainIcon=iconComponents['mountain']
export const ZtWavesIcon=iconComponents['waves']
export const ZtFlameIcon=iconComponents['flame']
export const ZtDropletIcon=iconComponents['droplet']
export const ZtSnowflakeIcon=iconComponents['snowflake']
export const ZtThermometerIcon=iconComponents['thermometer']
export const ZtWindIcon=iconComponents['wind']
export const ZtCloudRainIcon=iconComponents['cloud-rain']
export const ZtCloudSnowIcon=iconComponents['cloud-snow']
