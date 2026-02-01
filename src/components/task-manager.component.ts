import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, SubTask, TaskStatus, CasePriority } from '../models/types';

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  template: `
    <div class="h-full flex flex-col bg-slate-900/50 rounded-xl border border-slate-800">
      <!-- Header -->
      <div class="p-4 border-b border-white/5 flex justify-between items-center">
        <h3 class="font-bold text-white flex items-center gap-2">
          <span class="material-symbols-outlined text-blue-400">task_alt</span>
          Zadania
          @if(tasks().length > 0) {
            <span class="text-xs px-2 py-0.5 bg-blue-600 rounded-full">{{ tasks().length }}</span>
          }
        </h3>
        <button 
          (click)="showNewTaskModal.set(true)"
          class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm text-white flex items-center gap-1">
          <span class="material-symbols-outlined text-[16px]">add</span>
          Dodaj
        </button>
      </div>

      <!-- Filters -->
      <div class="p-3 border-b border-white/5 flex gap-2 text-xs">
        <button 
          (click)="filterStatus.set('all')" 
          [class.bg-blue-600]="filterStatus() === 'all'"
          [class.bg-slate-800]="filterStatus() !== 'all'"
          class="px-3 py-1.5 rounded hover:bg-blue-500 transition-colors">
          Wszystkie
        </button>
        <button 
          (click)="filterStatus.set('todo')" 
          [class.bg-yellow-600]="filterStatus() === 'todo'"
          [class.bg-slate-800]="filterStatus() !== 'todo'"
          class="px-3 py-1.5 rounded hover:bg-yellow-500 transition-colors">
          Do zrobienia
        </button>
        <button 
          (click)="filterStatus.set('in-progress')" 
          [class.bg-purple-600]="filterStatus() === 'in-progress'"
          [class.bg-slate-800]="filterStatus() !== 'in-progress'"
          class="px-3 py-1.5 rounded hover:bg-purple-500 transition-colors">
          W toku
        </button>
        <button 
          (click)="filterStatus.set('completed')" 
          [class.bg-green-600]="filterStatus() === 'completed'"
          [class.bg-slate-800]="filterStatus() !== 'completed'"
          class="px-3 py-1.5 rounded hover:bg-green-500 transition-colors">
          Zakończone
        </button>
      </div>

      <!-- Task List -->
      <div class="flex-1 overflow-y-auto p-3 space-y-2">
        @for (task of filteredTasks(); track task.id) {
          <div class="p-3 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors group">
            <div class="flex items-start justify-between mb-2">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <h4 class="font-medium text-white text-sm truncate">{{ task.title }}</h4>
                  <span class="text-[10px] px-1.5 py-0.5 rounded-full shrink-0"
                    [class.bg-green-600]="task.status === 'completed'"
                    [class.bg-purple-600]="task.status === 'in-progress'"
                    [class.bg-yellow-600]="task.status === 'todo'"
                    [class.bg-gray-600]="task.status === 'cancelled'">
                    {{ getStatusLabel(task.status) }}
                  </span>
                  @if(task.priority === 'urgent' || task.priority === 'high') {
                    <span class="material-symbols-outlined text-[14px]" 
                      [class.text-red-400]="task.priority === 'urgent'"
                      [class.text-orange-400]="task.priority === 'high'">
                      priority_high
                    </span>
                  }
                </div>
                @if(task.description) {
                  <p class="text-xs text-gray-400 line-clamp-2 mb-2">{{ task.description }}</p>
                }
                @if(task.dueDate) {
                  <p class="text-xs flex items-center gap-1"
                    [class.text-red-400]="isOverdue(task.dueDate)"
                    [class.text-yellow-400]="isDueSoon(task.dueDate)"
                    [class.text-gray-500]="!isOverdue(task.dueDate) && !isDueSoon(task.dueDate)">
                    <span class="material-symbols-outlined text-[14px]">event</span>
                    {{ task.dueDate | date:'dd.MM.yyyy' }}
                  </p>
                }
              </div>

              <div class="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                @if(task.status !== 'completed') {
                  <button 
                    (click)="onTaskStatusChange.emit({taskId: task.id, status: 'completed'})"
                    class="p-1 hover:bg-green-600 rounded text-gray-400 hover:text-white"
                    title="Oznacz jako zakończone">
                    <span class="material-symbols-outlined text-[16px]">check_circle</span>
                  </button>
                }
                <button 
                  (click)="onTaskDelete.emit(task.id)"
                  class="p-1 hover:bg-red-600 rounded text-gray-400 hover:text-white"
                  title="Usuń">
                  <span class="material-symbols-outlined text-[16px]">delete</span>
                </button>
              </div>
            </div>

            <!-- Subtasks -->
            @if(task.subtasks && task.subtasks.length > 0) {
              <div class="mt-2 pl-4 border-l-2 border-slate-700 space-y-1">
                @for(subtask of task.subtasks; track subtask.id) {
                  <div class="flex items-center gap-2 text-xs">
                    <input 
                      type="checkbox" 
                      [checked]="subtask.completed"
                      (change)="toggleSubtask(task.id, subtask.id)"
                      class="rounded text-blue-500 bg-slate-700 border-slate-600">
                    <span [class.line-through]="subtask.completed" [class.text-gray-500]="subtask.completed" [class.text-gray-300]="!subtask.completed">
                      {{ subtask.title }}
                    </span>
                  </div>
                }
              </div>
            }
          </div>
        } @empty {
          <div class="text-center py-12 text-gray-500">
            <span class="material-symbols-outlined text-5xl mb-2 opacity-20">task_alt</span>
            <p class="text-sm">Brak zadań</p>
          </div>
        }
      </div>

      <!-- New Task Modal -->
      @if (showNewTaskModal()) {
        <div class="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div class="bg-slate-900 border border-slate-700 p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h3 class="text-lg font-bold text-white mb-4">Nowe zadanie</h3>
            
            <div class="space-y-3">
              <div>
                <label class="block text-sm text-gray-400 mb-1">Tytuł*</label>
                <input 
                  type="text" 
                  [(ngModel)]="newTask.title"
                  placeholder="Nazwa zadania"
                  class="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white text-sm">
              </div>

              <div>
                <label class="block text-sm text-gray-400 mb-1">Opis</label>
                <textarea 
                  [(ngModel)]="newTask.description"
                  placeholder="Szczegóły zadania..."
                  rows="3"
                  class="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white text-sm"></textarea>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm text-gray-400 mb-1">Priorytet</label>
                  <select 
                    [(ngModel)]="newTask.priority"
                    class="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white text-sm">
                    <option value="low">Niski</option>
                    <option value="medium">Średni</option>
                    <option value="high">Wysoki</option>
                    <option value="urgent">Pilne</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm text-gray-400 mb-1">Termin</label>
                  <input 
                    type="date" 
                    [(ngModel)]="newTask.dueDate"
                    class="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white text-sm">
                </div>
              </div>
            </div>

            <div class="flex gap-2 justify-end mt-6">
              <button 
                (click)="showNewTaskModal.set(false); resetNewTask()"
                class="px-4 py-2 text-gray-300 hover:text-white text-sm">
                Anuluj
              </button>
              <button 
                (click)="createTask()"
                [disabled]="!newTask.title"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                Utwórz
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class TaskManagerComponent {
  @Input() tasks = signal<Task[]>([]);
  @Output() onTaskAdd = new EventEmitter<{ title: string; description?: string; dueDate?: Date; priority: CasePriority }>();
  @Output() onTaskStatusChange = new EventEmitter<{ taskId: string; status: TaskStatus }>();
  @Output() onTaskDelete = new EventEmitter<string>();
  @Output() onSubtaskToggle = new EventEmitter<{ taskId: string; subtaskId: string }>();

  filterStatus = signal<'all' | TaskStatus>('all');
  showNewTaskModal = signal(false);
  
  newTask = {
    title: '',
    description: '',
    priority: 'medium' as CasePriority,
    dueDate: ''
  };

  filteredTasks = computed(() => {
    const filter = this.filterStatus();
    if(filter === 'all') return this.tasks();
    return this.tasks().filter(t => t.status === filter);
  });

  createTask() {
    if(!this.newTask.title) return;

    this.onTaskAdd.emit({
      title: this.newTask.title,
      description: this.newTask.description || undefined,
      dueDate: this.newTask.dueDate ? new Date(this.newTask.dueDate) : undefined,
      priority: this.newTask.priority
    });

    this.showNewTaskModal.set(false);
    this.resetNewTask();
  }

  resetNewTask() {
    this.newTask = {
      title: '',
      description: '',
      priority: 'medium',
      dueDate: ''
    };
  }

  toggleSubtask(taskId: string, subtaskId: string) {
    this.onSubtaskToggle.emit({ taskId, subtaskId });
  }

  getStatusLabel(status: TaskStatus): string {
    const labels: Record<TaskStatus, string> = {
      'todo': 'Do zrobienia',
      'in-progress': 'W toku',
      'review': 'Przegląd',
      'completed': 'Zakończone',
      'cancelled': 'Anulowane'
    };
    return labels[status] || status;
  }

  isOverdue(date: Date): boolean {
    return new Date(date) < new Date();
  }

  isDueSoon(date: Date): boolean {
    const dueDate = new Date(date);
    const now = new Date();
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    return dueDate > now && (dueDate.getTime() - now.getTime()) < threeDays;
  }
}
