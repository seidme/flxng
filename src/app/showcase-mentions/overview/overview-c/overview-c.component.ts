import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { ChoiceWithIndices, HighlightTag, getChoiceIndex } from '@flxng/mentions';

interface User {
  id: number;
  name: string;
}

@Component({
  selector: 'app-overview-c',
  templateUrl: './overview-c.component.html',
  styleUrls: ['./overview-c.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OverviewCComponent implements OnInit {
  text = `Hello \n#Amelia \n#John J. Doe \n`;
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
    return `#${user.name}`;
  };

  onSelectedChoicesChange(choices: ChoiceWithIndices[]): void {
    this.mentions = choices;
    console.log('mentions:', this.mentions);
  }

  onChoiceSelected(choice: ChoiceWithIndices): void {
    console.log('choiceSelected:', choice);
  }

  onChoiceRemoved(choice: ChoiceWithIndices): void {
    console.log('choiceRemoved:', choice);
  }

  onHighlighTagClick(tagEvent: { event: MouseEvent; tag: HighlightTag }): void {
    console.log('highlighTagClick:', tagEvent);
  }

  onHighlightTagMouseEnter(tagEvent: { event: MouseEvent; tag: HighlightTag }): void {
    console.log('highlightTagMouseEnter:', tagEvent);
  }

  onHighlightTagMouseLeave(tagEvent: { event: MouseEvent; tag: HighlightTag }): void {
    console.log('highlightTagMouseLeave:', tagEvent);
  }

  onMenuShow(): void {
    console.log('Menu show!');
  }

  onMenuHide(): void {
    console.log('Menu hide!');
    this.choices = [];
  }

  getSelectedChoices(): User[] {
    if (this.mentions.length) {
      return this.mentions.map((m) => m.choice);
    } else {
      return [
        {
          id: 1,
          name: 'Amelia',
        },
        {
          id: 4,
          name: 'John J. Doe',
        },
      ];
    }
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
      }, 600);
    });
  }
}
