export interface ZtScrollbarThumb{size:number;offset:number}
export function calculateThumb(viewport:number,content:number,scroll:number,minSize:number):ZtScrollbarThumb{
 if(!Number.isFinite(viewport)||!Number.isFinite(content)||viewport<=0||content<=viewport)return{size:0,offset:0}
 const safeMin=Number.isFinite(minSize)?Math.max(0,minSize):20
 const size=Math.min(viewport,Math.max(safeMin,viewport*viewport/content))
 const maxScroll=content-viewport,maxOffset=viewport-size
 const offset=Math.min(maxOffset,Math.max(0,(Number.isFinite(scroll)?scroll:0)/maxScroll*maxOffset))
 return{size:Math.round(size*1000)/1000,offset:Math.round(offset*1000)/1000}
}
