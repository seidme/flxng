import { Component, OnInit } from '@angular/core';

import { ChoiceWithIndices } from '@flxng/mentions';

interface User {
  id: number;
  name: string;
}

@Component({
  selector: 'app-overview-a',
  templateUrl: './overview-a.component.html',
  styleUrls: ['./overview-a.component.scss'],
})
export class OverviewAComponent implements OnInit {
  text = ``;
  loading = false;
  choices: User[] = [];
  mentions: ChoiceWithIndices[] = [];

  constructor() {}

  ngOnInit() {}

  async loadChoices(searchTerm: string): Promise<User[]> {
    const users = await this.getUsers();

    this.choices = users.filter((user) => {
      const alreadyExists = this.mentions.some((m) => m.choice.name === user.name);
      return !alreadyExists && user.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });

    return this.choices;
  }

  getChoiceLabel = (user: User): string => {
    return `@${user.name}`;
  };

  onSelectedChoicesChange(choices: ChoiceWithIndices[]): void {
    this.mentions = choices;
    console.log('mentions:', this.mentions);
  }

  onMenuShow(): void {
    console.log('Menu show!');
  }

  onMenuHide(): void {
    console.log('Menu hide!');
    this.choices = [];
  }

  async getUsers(): Promise<User[]> {
    this.loading = true;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.loading = false;
        resolve([
          {
            id: 1,
            name: 'Amelia',
          },
          {
            id: 2,
            name: 'Doe',
          },
          {
            id: 3,
            name: 'John Doe',
          },
          {
            id: 4,
            name: 'John J. Doe',
          },
          {
            id: 5,
            name: 'John & Doe',
          },
          {
            id: 6,
            name: 'Fredericka Wilkie',
          },
          {
            id: 7,
            name: 'Collin Warden',
          },
          {
            id: 8,
            name: 'Hyacinth Hurla',
          },
          {
            id: 9,
            name: 'Paul Bud Mazzei',
          },
          {
            id: 10,
            name: 'Mamie Xander Blais',
          },
          {
            id: 11,
            name: 'Sacha Murawski',
          },
          {
            id: 12,
            name: 'Marcellus Van Cheney',
          },
          {
            id: 12,
            name: 'Lamar Kowalski',
          },
          {
            id: 13,
            name: 'Queena Gauss',
          },
        ]);
      }, 600);
    });
  }
}
