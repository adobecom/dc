/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2015 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property laws,
* including trade secret and or copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/
import{dcLocalStorage as t}from"../../../common/local-storage.js";import{util as e}from"../content-util.js";await t.init();export default class i{constructor(){this.initializeCache()}initializeCache(){const e=t.getItem("filesData")||{};if(this.limit=1e3,e.filePath)try{this.cacheMap=new Map(JSON.parse(e.filePath))}catch(t){this.cacheMap=new Map}else this.cacheMap=new Map;this.isSyncedWithHistory=e.isSyncedWithHistory}write(t,e){const i={...this.cacheMap.get(t),...e};this.cacheMap.delete(t),this.cacheMap.size===this.limit?(this.cacheMap.delete(this.cache.keys().next().value),this.cacheMap.set(t,i)):this.cacheMap.set(t,i)}async syncWithHistory(){const i=t.getItem("recentFilesData");if(i&&i.isSyncedWithHistory){const t=i.recentFilesPath?[...i.recentFilesPath]:[];for(let e=t.length-1;e>=0;e--)this.write(t[e].url,{filename:t[e].filename,lastVisited:t[e].lastVisited})}else{if(await chrome.permissions.contains({permissions:["history"],origins:["https://www.google.com/"]})){const t=await chrome.history.search({text:chrome.runtime.getURL("viewer.html"),startTime:0,maxResults:1e3});for(let i=0;i<t.length;++i){const{url:s,title:a}=t[i],{lastVisitTime:c}=t[i],h=e.getSearchParamFromURL("pdfurl",s);this.write(h,{filename:a,lastVisited:c})}}}}saveToStorage(){try{const e=JSON.stringify(Array.from(this.cacheMap.entries()));t.setItem("filesData",{filePath:e,isSyncedWithHistory:!0})}catch(t){}}async writeAndSyncWithHistory(t,e){try{this.isSyncedWithHistory||await this.syncWithHistory(),this.write(t,e),this.saveToStorage()}catch(t){}}read(t){if(!this.cacheMap.has(t))return;let e=this.cacheMap.get(t);return this.cacheMap.delete(t),this.cacheMap.set(t,e),e}getAllItems(){try{let t=[];this.initializeCache();for(let[e,i]of this.cacheMap){const{lastVisited:s,filename:a}=i;let c=e;t.push({lastVisited:s,filename:a,chromeHistory:!0,url:c})}return t}catch(t){return[]}}}