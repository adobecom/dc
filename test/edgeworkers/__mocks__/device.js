const Device = jest.fn().mockImplementation((device) => {
    return {
      brandName:"Chrome",
      modelName:"90",
      marketingName:"Chrome 90",
      isWireless:false,
      isTablet: device === 'Tablet',
      os:"Mac OS X",
      osVersion:"10.15",
      mobileBrowser:"Chrome",
      mobileBrowserVersion:"90",
      resolutionWidth:1280,
      resolutionHeight:800,
      physicalScreenHeight:175,
      physicalScreenWidth:280,
      hasCookieSupport:true,
      hasAjaxSupport:true,
      hasFlashSupport:false,
      acceptsThirdPartyCookie:true,
      xhtmlSupportLevel:4,
      isMobile: device === 'Mobile'
      };
  });
  
  export default Device;