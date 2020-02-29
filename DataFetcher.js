function getMatchList(){
    try {
        let response = await fetch(
          'https://pubg-app.herokuapp.com/match',
        );
        let responseJson = await response.json();
    
        return responseJson
      } catch (error) {
        console.error(error);
      }
    
}
