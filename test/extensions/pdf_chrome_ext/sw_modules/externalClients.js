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
import{communicate as e}from"./communicate.js";import{privateApi as t}from"./private-api.js";import{dcLocalStorage as r}from"../common/local-storage.js";import{util as s}from"./util.js";function i(){let e;return r.getItem("pdfViewer")?"true"===r.getItem("pdfViewer")?e="enabled":"false"===r.getItem("pdfViewer")&&(e="disabled"):e="neverEnabled",e}const a=["redirectJob","redirectAuth","user_tags","frictionless_return_user"];export function externalClients(o,c,n){if(/^https:\/\/([a-zA-Z\d-]+\.){0,}(adobe|acrobat)\.com(:[0-9]*)?$/.test(c.origin))if("WebRequest"===o.type)switch(o.task){case"detect_extension":n({status:"success",result:"true"});break;case"detect_desktop":try{if(0!=e.version&&1!=e.version){n(e.version===SETTINGS.READER_VER||e.version===SETTINGS.ERP_READER_VER?{status:"success",result:"Reader"}:{status:"success",result:"Acrobat"})}else n({status:"success",result:"NoApp"})}catch(e){n({status:"error",code:"error"})}break;case"detect_viewer_enabled":try{n({status:"success",result:i()})}catch(e){n({status:"error",code:"error"})}break;case"enable_viewer":if(!s.isAcrobatOrigin(c.origin)&&!c.origin.includes("local-test.acrobat.com:11010"))return;try{r.setItem("pdfViewer","true"),t.setViewerState("enabled"),n({status:"success"})}catch(e){n({status:"error",code:"error"})}break;case"open_acrobat_clicked":if(!/^https:\/\/((dev|stage)+\.){0,}acrobat\.adobe\.com?$/.test(c.origin)&&!c.origin.includes("local-test.acrobat.com:11010"))return;try{const e=r.getItem("firstOpenedTabId");e?(chrome.tabs.update(e,{active:!0}),n({status:"success"})):n({status:"error",code:"NoTab"})}catch(e){n({status:"error",code:"Error"})}break;case"upsell_redirect_to_pdf":if(!s.isAcrobatOrigin(c.origin)&&!c.origin.includes("local-test.acrobat.com:9019"))return;chrome.tabs.update(c.tab.id,{url:o.pdfUrl});break;case"storage_bulk_read":{if(!s.isAcrobatOrigin(c.origin)&&!s.isAdobeOrigin(c.origin))return;const{keys:e=[]}=o,t={};e.forEach((e=>a.includes(e)&&(t[e]=r.getItem(e)))),n({values:t});break}case"storage_bulk_write":{if(!s.isAcrobatOrigin(c.origin)&&!s.isAdobeOrigin(c.origin))return;const{data:e={}}=o;Object.entries(e).forEach((([e,t])=>a.includes(e)&&r.setItem(e,t))),n({status:200});break}case"storage_bulk_remove":{if(!s.isAcrobatOrigin(c.origin)&&!s.isAdobeOrigin(c.origin))return;const{keys:e=[]}=o;e.forEach((e=>a.includes(e)&&r.removeItem(e))),n({status:200});break}default:n({status:"error",code:"invalid_task"})}else n({status:"error",code:"invalid_type"})}