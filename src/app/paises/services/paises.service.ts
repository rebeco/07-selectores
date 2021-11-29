import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Fronteras, Pais, PaisSmall } from '../interfaces/paises.interfaces';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PaisesService {
  private _baseURL: string = 'https://restcountries.com/v3.1';

  private _regiones: string[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
  ];

  constructor(private http: HttpClient) {}

  get regiones(): string[] {
    return [...this._regiones];
  }

  getPaisesPorRegion(region: string): Observable<PaisSmall[]> {
    return this.http.get<PaisSmall[]>(
      `${this._baseURL}/region/${region}?fields=cca2,name`
    );
  }

  getPaisPorCodigo(codigo: string): Observable<Pais[] | null> {
    if (!codigo) return of(null);

    return this.http.get<Pais[]>(`${this._baseURL}/alpha/${codigo}`);
  }

  getPaisPorCodigoSmall(codigo: string): Observable<PaisSmall> {
    return this.http.get<PaisSmall>(
      `${this._baseURL}/alpha/${codigo}?fields=cca2,name`
    );
  }

  getPaisesPorFrontera(codigos: string[]): Observable<PaisSmall[]> {
    if (!codigos) return of([]);

    const peticiones: Observable<PaisSmall>[] = []; // Importante la situación de los corchetes en el tipado del Observable
    codigos.forEach((codigo) => {
      const peticion = this.getPaisPorCodigoSmall(codigo);
      peticiones.push(peticion);
    });
    return combineLatest(peticiones);
  }
}
