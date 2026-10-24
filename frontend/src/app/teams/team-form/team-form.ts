import {
  email,
  form,
  FormField,
  FormRoot,
  minLength,
  pattern,
  required,
} from '@angular/forms/signals';
import { Component, signal } from '@angular/core';
import { SelectComponent, SelectOption } from '../../shared/select/select';
import { ButtonComponent } from '../../shared/button/button';
import { TextFieldComponent } from '../../shared/text-field/text-field';
import { TextareaComponent } from '../../shared/textarea/textarea';

interface TeamFormModel {
  name: string;
  slug: string;
  description: string;
  department: string;
  ownerEmail: string;
  timezone: string;
  visibility: string;
  defaultRole: string;
  notifyAboutUpdates: boolean;
  allowExternalMembers: boolean;
}

const INITIAL_TEAM: TeamFormModel = {
  name: 'Customer Experience',
  slug: 'customer-experience',
  description: 'Unterstützt Kundinnen und Kunden bei Fragen zu unseren Produkten und Services.',
  department: '',
  ownerEmail: 'jordan.davis@example.com',
  timezone: 'Europe/Berlin',
  visibility: 'Private',
  defaultRole: 'Member',
  notifyAboutUpdates: true,
  allowExternalMembers: false,
};

@Component({
  selector: 'app-team-form',
  imports: [
    ButtonComponent,
    FormField,
    FormRoot,
    SelectComponent,
    TextFieldComponent,
    TextareaComponent,
  ],
  templateUrl: './team-form.html',
})
export class TeamFormComponent {
  protected readonly teamModel = signal<TeamFormModel>({ ...INITIAL_TEAM });
  protected readonly validatedTeam = signal<TeamFormModel | null>(null);
  protected readonly departmentOptions: readonly SelectOption[] = [
    { value: 'Customer Success', label: 'Customer Success' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Operations', label: 'Operations' },
    { value: 'Product', label: 'Product' },
  ];
  protected readonly timezoneOptions: readonly SelectOption[] = [
    { value: 'Europe/Berlin', label: 'Europe/Berlin (UTC+1)' },
    { value: 'Europe/London', label: 'Europe/London (UTC+0)' },
    { value: 'America/New_York', label: 'America/New_York (UTC−5)' },
    { value: 'Asia/Tokyo', label: 'Asia/Tokyo (UTC+9)' },
  ];
  protected readonly visibilityOptions: readonly SelectOption[] = [
    { value: 'Private', label: 'Privat – nur eingeladene Personen' },
    { value: 'Workspace', label: 'Workspace – alle können beitreten' },
  ];
  protected readonly roleOptions: readonly SelectOption[] = [
    { value: 'Viewer', label: 'Viewer' },
    { value: 'Member', label: 'Member' },
    { value: 'Admin', label: 'Admin' },
  ];

  protected readonly teamForm = form(
    this.teamModel,
    (path) => {
      required(path.name, { message: 'Bitte gib einen Teamnamen ein.' });
      minLength(path.name, 3, { message: 'Der Teamname muss mindestens 3 Zeichen lang sein.' });
      required(path.slug, { message: 'Bitte gib einen Team-Kürzel ein.' });
      pattern(path.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: 'Nutze Kleinbuchstaben, Zahlen und Bindestriche.',
      });
      required(path.description, { message: 'Bitte beschreibe die Aufgabe des Teams.' });
      minLength(path.description, 20, {
        message: 'Die Beschreibung muss mindestens 20 Zeichen enthalten.',
      });
      required(path.department, { message: 'Bitte wähle einen Bereich aus.' });
      required(path.ownerEmail, { message: 'Bitte gib eine verantwortliche E-Mail-Adresse ein.' });
      email(path.ownerEmail, { message: 'Bitte gib eine gültige E-Mail-Adresse ein.' });
    },
    {
      submission: {
        action: async () => {
          this.validatedTeam.set({ ...this.teamModel() });
        },
      },
    },
  );
}
