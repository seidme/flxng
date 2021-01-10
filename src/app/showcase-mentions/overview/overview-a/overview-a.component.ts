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
  text = 'Hey @Ted';
  mentions: ChoiceWithIndices[] = [];

  constructor() {}

  ngOnInit() {}

  getAutocompleteMentions = (searchTerm: string): User[] => {
    if (!searchTerm) {
      return [];
    }

    const users = this.getUsers();

    return users.filter((user) => {
      return user.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
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
          id: 8,
          name: 'Ted',
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

  getUsers(): User[] {
    return [
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
    ];
  }
}
