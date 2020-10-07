import { Component, OnInit } from '@angular/core';
import 'reflect-metadata';

import { OnChange, Required, LogType } from '@flxng/common/src/decorators';

@Component({
  selector: '',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}

class Job {
  type: string = 'full-time';
  constructor() {}
}

class Person {
  // @OnChange<string>('onNameChange')
  // name: string;

  @Required()
  name: string;

  @Required()
  age: number;

  @Required()
  canWalk: boolean;

  @Required()
  createDate: Date;

  @Required()
  job: Job;

  @Required()
  skills: string[];

  @Required()
  sex: 'male' | 'female';

  @Required()
  someObj: Object;

  @Required()
  someObj2: { [key: string]: any };

  constructor(props: { [key: string]: any }) {
    //Object.assign(this, props);

    this.name = props.name;
    this.age = props.age;
    this.canWalk = props.canWalk;
    this.createDate = props.createDate;
    this.job = props.job;
    this.skills = props.skills;
    this.sex = props.sex;
    this.someObj = props.someObj;
    this.someObj2 = props.someObj2;
  }

  onNameChange(value, change) {
    //console.log('new value::::', value);
  }
}

const personA = new Person({
  name: 'Mia',
  age: 28,
  canWalk: true,
  createDate: new Date(),
  job: new Job(),
  skills: ['ts', 'js'],
  sex: 'female',
  someObj: {},
  someObj2: {},
});

personA.name = 'John';

// console.log('personA:', personA);

// const personB = new Person({ // Uncaught Error: Value of 'age' property of 'Person' class is missing or invalid: undefined. Expecting Number.
//   name: 'Mia'
// });

// console.log('personB:', personB);

// console.log(greeter.name);
// console.log(greeter);
// console.log('Object.keys:', Object.keys(greeter));
// console.log('Object.values:', Object.values(greeter));

// console.log('metadata: ', Reflect.getMetadata('design:type', greeter, 'age').name);
// console.log('metadataKeys: ', Reflect.getMetadataKeys(greeter));
