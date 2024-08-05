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
import{dcLocalStorage as e}from"./local-storage.js";export function isNewUser(){if(!e.getItem("extUserState")){const t=e.getItem("viewerStorage");if(t){return+(0===(parseInt(t.usage)||0))}return-1}return 0}export async function updateExtUserState(){if(!e.getItem("extUserState")){e.setItem("extUserState","ru");const t=await chrome.tabs.query({active:!0,lastFocusedWindow:!0});chrome.runtime.sendMessage({main_op:"reRegisterUninstallUrl",tab:t[0]})}}