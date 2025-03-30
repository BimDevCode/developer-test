export const environment = {
    production: false,
    apiUrl: 'http://localhost:5256/api/',
    usersRoute: 'Users',
    iconsRoute: 'Icons/',
  };
  export const apiUrls = {
    production: false,
    iconsUrl : environment.apiUrl + environment.iconsRoute,
    usersUrl : environment.apiUrl + environment.usersRoute,
  };
  