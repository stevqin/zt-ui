import type { ZtPopoverPlacement } from './types'
export interface RectLike{top:number;bottom:number;left:number;right:number;width:number;height:number}
export interface PopupSize{width:number;height:number}
export interface ViewportSize{width:number;height:number;padding:number}
export interface PopoverPosition{top:number;left:number;placement:ZtPopoverPlacement;arrowX?:number;arrowY?:number}
type Side='top'|'bottom'|'left'|'right'
const opposite:Record<Side,Side>={top:'bottom',bottom:'top',left:'right',right:'left'}
export function placePopover(trigger:RectLike,popup:PopupSize,viewport:ViewportSize,requested:ZtPopoverPlacement,offset:number):PopoverPosition{
 const [rawSide,align='center']=requested.split('-') as [Side,string],pad=viewport.padding
 const space:Record<Side,number>={top:trigger.top-pad,bottom:viewport.height-trigger.bottom-pad,left:trigger.left-pad,right:viewport.width-trigger.right-pad}
 const needed=rawSide==='top'||rawSide==='bottom'?popup.height+offset:popup.width+offset
 const other=opposite[rawSide],side=space[rawSide]<needed&&space[other]>space[rawSide]?other:rawSide
 let top=0,left=0
 if(side==='top')top=trigger.top-popup.height-offset
 if(side==='bottom')top=trigger.bottom+offset
 if(side==='left')left=trigger.left-popup.width-offset
 if(side==='right')left=trigger.right+offset
 if(side==='top'||side==='bottom')left=align==='start'?trigger.left:align==='end'?trigger.right-popup.width:trigger.left+(trigger.width-popup.width)/2
 else top=align==='start'?trigger.top:align==='end'?trigger.bottom-popup.height:trigger.top+(trigger.height-popup.height)/2
 left=Math.max(pad,Math.min(viewport.width-pad-popup.width,left));top=Math.max(pad,Math.min(viewport.height-pad-popup.height,top))
 const placement=`${side}${align==='center'?'':`-${align}`}` as ZtPopoverPlacement
 return{top,left,placement,arrowX:Math.max(10,Math.min(popup.width-10,trigger.left+trigger.width/2-left)),arrowY:Math.max(10,Math.min(popup.height-10,trigger.top+trigger.height/2-top))}
}
