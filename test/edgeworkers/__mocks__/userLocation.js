const UserLocation = jest.fn().mockImplementation(() => {
    return {
        latitude: "42.3581",
        longitude: "-71.0647",
        continent:"NA",
        country:"US",
        region:"MA",
        city:"BOSTON",
        zipCode:"02108-02125+02127-02128+02133+02163+02196+02199+02201+02203-02206+02210-02212+02215+02217+02222+02241+02266+02283-02284+02293+02295+02297-02298",
        dma: "506",
        timezone: "EST",
        networkType: "mobile",
        bandwidth: "5000",
        areaCodes: ["617"],
        fips: ["25025", "25017"]
    };
});
  
export default UserLocation;