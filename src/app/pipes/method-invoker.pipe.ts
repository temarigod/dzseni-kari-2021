import { Pipe, PipeTransform } from '@angular/core';

type InvokableMethod<T extends any, U> = (
  arg0: T,
  ...restArgs: Array<any>
) => U;

@Pipe({
  name: 'invoke',
})
export class MethodInvokerPipe implements PipeTransform {
  /**
   * konstruktor
   */
  constructor() {}

  /**
   * A PipeTransform interface implementációja
   *
   * @param value A meghívandó függvény első bementi paramétere (value)
   * @param method a meghívandó függvény
   * @param restArgs a meghívandó függvény többi paraméterét tartalmazó lista
   */
  public transform<T extends any, U>(
    value: T,
    method: InvokableMethod<T, U>,
    ...restArgs: Array<any>
  ): U {
    if (typeof method !== 'function') {
      throw Error(
        `MethodInvokerPipe expected a function to call but got: ${method}`
      );
    }

    return method?.call(undefined, value, ...(restArgs ?? []));
  }
}
