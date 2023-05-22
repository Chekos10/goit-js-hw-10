
function fetchCountries(name){
    return fetch(`https://restcountries.com/v3.1/name/${name}?fields=flags,name,capital,population,languages`).then((res)=>{
    if(!res.ok){
        throw new Error(res.status);
    }
        return res.json();
    })
}
export {fetchCountries}


