import 'reflect-metadata';

export interface SimpleChange<T> {
  firstChange: boolean;
  previousValue: T;
  currentValue: T;
  isFirstChange: () => boolean;
}

export type CallBackFunction<T> = (value: T, change?: SimpleChange<T>) => void;

export function OnChange<T = any>(callback: CallBackFunction<T> | string) {
  const cachedValueKey = Symbol();
  const isFirstChangeKey = Symbol();

  return (target: any, key: PropertyKey) => {
    const callBackFn: CallBackFunction<T> = typeof callback === 'string' ? target[callback] : callback;
    if (!callBackFn) {
      throw new Error(`Cannot find method ${callback} in class ${target.constructor.name}`);
    }

    Object.defineProperty(target, key, {
      set: function(value) {
        // change status of "isFirstChange"
        this[isFirstChangeKey] = this[isFirstChangeKey] === undefined;

        // No operation if new value is same as old value
        if (!this[isFirstChangeKey] && this[cachedValueKey] === value) {
          return;
        }

        const oldValue = this[cachedValueKey];
        this[cachedValueKey] = value;
        const simpleChange: SimpleChange<T> = {
          firstChange: this[isFirstChangeKey],
          previousValue: oldValue,
          currentValue: this[cachedValueKey],
          isFirstChange: () => this[isFirstChangeKey]
        };
        callBackFn.call(this, this[cachedValueKey], simpleChange);
      },
      get: function() {
        return this[cachedValueKey];
      }
    });
  };
}

export function LogType() {
  return (target: any, key: string | symbol) => {
    const type = Reflect.getMetadata('design:type', target, key);
    console.log(`${String(key)} type: ${type.name}`);
  };
}

export function Required() {
  // rename to 'Strict'?
  return (target: any, key: string | symbol) => {
    const visiblePrivateKey = '_' + String(key);
    // const visiblePrivateKey = Symbol(String(key));

    const propertyType = Reflect.getMetadata('design:type', target, key);
    // console.log(`${String(key)} type: ${propertyType.name}`);

    Object.defineProperty(target, key, {
      get: function() {
        return this[visiblePrivateKey];
      },
      set: function(value) {
        // console.log(`${String(key)}`);

        // console.log('value typeof:', typeof value);
        //console.log('value constructor:', value.constructor.name);
        //console.log('value instanceof propertyType:', value instanceof propertyType);

        //console.log('Object.prototype.toString.call(value), : ', Object.prototype.toString.call(value));

        // let invalidValue =
        //   typeof value === 'object'
        //     ? !(value instanceof propertyType)
        //     : typeof value !== propertyType.name.toLowerCase();

        let invalidValue = false;
        if (typeof value === 'object') {
          if (Object.prototype.toString.call(value) === '[object Array]') {
            invalidValue = propertyType.name !== 'Array';
          } else {
            invalidValue = !(value instanceof propertyType);
          }
        } else {
          invalidValue = typeof value !== propertyType.name.toLowerCase();
        }
        // const invalidValue = typeof value !== propertyType.name.toLowerCase() && !(value instanceof propertyType);

        if (invalidValue) {
          // throw new Error(`Property '${String(key)}' of class '${target.constructor.name}' is required.`);
          throw new Error(
            `Value of '${String(key)}' property of '${target.constructor.name}' class is missing or invalid: ${value &&
              value.toString()}. Expecting ${propertyType.name}.`
          );
        }

        this[visiblePrivateKey] = value;
      }
    });
  };
}
