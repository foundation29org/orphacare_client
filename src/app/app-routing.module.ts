import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { ContentLayoutComponent } from "./layouts/content/content-layout.component";
import { WaitListPageLayoutComponent } from "./layouts/wait-list/wait-list-page-layout.component";

import { CONTENT_ROUTES } from "./shared/routes/content-layout.routes";

import { Wait_List_Pages_ROUTES } from "./shared/routes/wait-list-page-layout.routes"
import { CanDeactivateGuard } from './shared/auth/can-deactivate-guard.service';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '.',
    pathMatch: 'full',
  },
  { path: '', component: WaitListPageLayoutComponent, data: { title: 'Wait List Page' }, children: Wait_List_Pages_ROUTES },
  { path: '', component: ContentLayoutComponent, data: { title: 'content Views' }, children: CONTENT_ROUTES },
  { path: '**', redirectTo: '.'}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  providers: [
    CanDeactivateGuard
  ]
})

export class AppRoutingModule {
}
