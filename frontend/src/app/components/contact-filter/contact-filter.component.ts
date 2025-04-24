import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Parentesco, Categoria } from '../../models/contacto.model';

export interface FilterCriteria {
  searchTerm: string;
  parentesco: Parentesco | '';
  parentescoOtro?: string;
  categoria: Categoria | '';
  categoriaOtro?: string;
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
  selectedParentesco: Parentesco | '' = '';
  selectedCategoria: Categoria | '' = '';

  parentescoOptions: Parentesco[] = ['Familiar', 'Amoroso', 'Amistad', 'Laboral', 'Educativo', 'Otro'];
  categoriaOptions: Categoria[] = ['Personal', 'Profesional', 'Educativo', 'Social', 'Salud', 'Financiero', 'Emergencia', 'Otro'];

  @Output() filterChange = new EventEmitter<FilterCriteria>();

  // Añadir método para verificar si hay filtros activos
  isFiltering(): boolean {
    return this.searchTerm !== '' ||
           this.selectedParentesco !== '' ||
           this.selectedCategoria !== '';
  }

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
