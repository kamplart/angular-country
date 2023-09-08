import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

import { Country } from '../interfaces/country';

@Injectable({ providedIn: 'root' })
export class CountriesService {

  private apiUrl: string = 'https://restcountries.com/v3.1'

  constructor(private http: HttpClient ) { }

  searchCountryByAlphaCode( code: string ): Observable<Country | null> {

    const url = `${ this.apiUrl }/alpha/${ code }`;

    return this.http.get<Country[]>( url )
      .pipe(
        map( countries => countries.length > 0 ? countries[0]: null ),
        catchError( () => of(null) )
      );
  }


  searchGeo( term: string , tipo:string ): Observable<Country[]> {
    const url = `${ this.apiUrl }/${ tipo }/${ term }`;
    return this.http.get<Country[]>( url )
      .pipe(
        catchError( () => of([]) )
      );
  }


}
