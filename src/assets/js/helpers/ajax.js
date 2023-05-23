import { Utils } from "./utils";
export class Ajax {

  static async get(url) {
    return fetch(url, 
    {
      "headers" : {
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
      .then(response => response.json())
      .catch(error => { if( Utils.isDebug ){ console.error(error); } return false; });
  }

  static async post(url, data, contentType = "x-www-form-urlencoded") {

    switch( contentType ){
      case "formData":
        return fetch(url, {
          method: "POST",
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: data
        })
        .then(response => response.json())
        .catch(error => { if( Utils.isDebug ){ console.error(error); } return false; });
      break;
      case "x-www-form-urlencoded":
        let formData = new FormData();
        for (let key in data) {
          formData.append(key, data[key]);
        }
        return fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: new URLSearchParams(formData).toString()
        })
        .then(response => response.json())
        .catch(error => { if( Utils.isDebug ){ console.error(error); } return false; });
      break;
      case "json":
        return fetch(url, {
          method: "POST",
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        })
        .then(response => response.json())
        .catch(error => { if( Utils.isDebug ){ console.error(error); } return false; });
      break;
    }

  }

}