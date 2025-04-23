import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface FilterCriteria {
  searchTerm: string;
  parentesco: string;
  categoria: string;
}

@Component({
  selector: 'app-contact-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './contact-filter.component.html',
  styleUrls: ['./contact-filter.component.css']
})
export class ContactFilterComponent {
  searchTerm: string = '';
  selectedParentesco: string = '';
  selectedCategoria: string = '';

  parentescoOptions = ['Amigo', 'Hermano', 'Pareja', 'Compañero de trabajo', 'Otro'];
  categoriaOptions = ['Profesional', 'Utilidad', 'Academico', 'Otro'];

  @Output() filterChange = new EventEmitter<FilterCriteria>();

  onFilterChange() {
    this.filterChange.emit({
      searchTerm: this.searchTerm,
      parentesco: this.selectedParentesco,
      categoria: this.selectedCategoria
    });
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedParentesco = '';
    this.selectedCategoria = '';
    this.onFilterChange();
  }
}
