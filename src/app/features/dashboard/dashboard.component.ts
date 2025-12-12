import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Carte Projets -->
      <div class="bg-gradient-to-br from-amber-600 to-amber-700 text-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-amber-100 text-sm font-sans font-medium mb-1">Total Projets</div>
            <div class="text-4xl font-serif font-bold">{{ totalProjects }}</div>
          </div>
        </div>
        <div class="mt-4 flex items-center text-amber-100 text-sm font-sans">
          Gestion de vos projets
        </div>
      </div>

      <!-- Carte Tâches -->
      <div class="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-amber-50 text-sm font-sans font-medium mb-1">Total Tâches</div>
            <div class="text-4xl font-serif font-bold">{{ totalTasks }}</div>
          </div>
        </div>
        <div class="mt-4 flex items-center text-amber-50 text-sm font-sans">
          Tâches en cours
        </div>
      </div>

      <!-- Carte Progression -->
      <div class="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-green-50 text-sm font-sans font-medium mb-1">Progression Globale</div>
            <div class="text-4xl font-serif font-bold">{{ progress }}%</div>
          </div>
          <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <!-- SVG Circle Progress -->
            <svg viewBox="0 0 36 36" class="w-14 h-14 transform -rotate-90">
              <path class="text-white/30" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
              <path [attr.stroke-dasharray]="progress + ', 100'" class="text-white" stroke-width="3" stroke="currentColor" fill="none" stroke-linecap="round" d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
            </svg>
          </div>
        </div>
        <div class="mt-4 flex items-center text-green-50 text-sm font-sans">
          Taux de complétion
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  @Input() totalProjects = 0;
  @Input() totalTasks = 0;
  @Input() progress = 0;
}
