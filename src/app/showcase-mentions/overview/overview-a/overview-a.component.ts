import { Component, OnInit } from '@angular/core';

import { ChoiceWithIndices, HighlightTag } from '@flxng/mentions';

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
  text = `Hello \n@John Doe \n@John J. Doe \n`;
  choices: User[] = [];
  loading = false;
  mentions: ChoiceWithIndices[] = [];

  constructor() {}

  ngOnInit() {}

  getChoices = async (searchTerm: string): Promise<User[]> => {
    if (!searchTerm) {
      return [];
    }

    const users = await this.getUsers();

    this.choices = users.filter((user) => {
      return user.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });

    return this.choices;
  };

  onSelectedChoicesChange(choices: ChoiceWithIndices[]): void {
    this.mentions = choices;
    console.log('this.choices" ', choices);
  }

  getChoiceLabel = (user: User): string => {
    return `@${user.name}`;
  };

  getSelectedChoices(): User[] {
    if (this.mentions.length) {
      return this.mentions.map((m) => m.choice);
    } else {
      return [
        {
          id: 3,
          name: 'John Doe',
        },
        {
          id: 4,
          name: 'John J. Doe',
        },
      ];
    }
  }

  onHighlighTagClick(tagEvent: { event: MouseEvent; tag: HighlightTag }): void {
    //console.log('onHighlighTagClick:', tagEvent);
  }

  onHighlightTagMouseEnter(tagEvent: { event: any; tag: HighlightTag }): void {
    //console.log('onHighlightTagMouseEnter:', tagEvent);
  }

  onHighlightTagMouseLeave(tagEvent: { event: any; tag: HighlightTag }): void {
    //console.log('onHighlightTagMouseLeave:', tagEvent);
  }

  onMenuShown(): void {
    console.log('Menu shown!');
  }

  onMenuHidden(): void {
    console.log('Menu hidden!');
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
            name: 'John',
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
            name: 'Donald',
          },
          {
            id: 7,
            name: 'Brian',
          },
          {
            id: 8,
            name: 'Ted',
          },
          {
            id: 9,
            name: 'Joe Ted',
          },
          {
            id: 10,
            name: 'Clara',
          },
          {
            id: 11,
            name: 'Lisa',
          },
          {
            id: 12,
            name: 'Mia',
          },
          {
            id: 12,
            name: 'Fred',
          },
        ]);
      }, 1000);
    });
  }
}
