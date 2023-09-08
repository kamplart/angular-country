import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, map, Observable, of, tap } from 'rxjs';

import { Country } from '../interfaces/country';
import { CacheStore } from '../interfaces/cache-storage';
import { Region } from '../interfaces/region.type';

@Injectable({ providedIn: 'root' })
export class CountriesService {

  private apiUrl: string = 'https://restcountries.com/v3.1'

  public cacheStore : CacheStore= {
    byCapital : { term: '', countries:[]},
    byCountry : { term: '', countries:[]},
    byRegion : { region: '', countries:[]},
  };

  constructor(private http: HttpClient ) {

    this.loadLocalStorage();
  }


private saveLocalStorage(){
  localStorage.setItem('cacheStore', JSON.stringify(this.cacheStore));
}

private loadLocalStorage(){

  if(!localStorage.getItem('cacheStore')) return;

  this.cacheStore = JSON.parse(localStorage.getItem('cacheStore')!);

}

  searchCountryByAlphaCode( code: string ): Observable<Country | null> {

    const url = `${ this.apiUrl }/alpha/${ code }`;

    return this.http.get<Country[]>( url )
      .pipe(
        map( countries => countries.length > 0 ? countries[0]: null ),
        catchError( () => of(null) ),
        delay(700),
      );
  }

/**
 *
 * @param term
 * @param tipo capital|name|region
 * @returns
 */
  searchGeo( term: string , tipo:string ): Observable<Country[]> {
    const url = `${ this.apiUrl }/${ tipo }/${ term }`;

    let miRegion: Region;
    miRegion = term as Region;

    return this.http.get<Country[]>( url )
      .pipe(
        catchError( () => of([]) ),
        delay(1500),
          tap(
            tipo === 'capital' ?
            countries => {this.cacheStore.byCapital = { term: term, countries: countries }}
             : (tipo === 'name' ?
             countries => {this.cacheStore.byCountry = { term: term, countries: countries }}
              :countries =>{this.cacheStore.byRegion = { region: miRegion, countries: countries }}
             )
          ),
          tap( () => this.saveLocalStorage() )
      );
  }


}
