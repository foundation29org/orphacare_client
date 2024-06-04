import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WaitListPageComponent } from "./wait-list/wait-list-page.component";
import { AboutUsPageComponent } from "./about-us/about-us-page.component";
import { BehindPageComponent } from "./behind/behind-page.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '.',
        component: WaitListPageComponent,
        data: {
          title: 'OrphaCare'
        },
      },
      {
        path: 'aboutus',
        component: AboutUsPageComponent,
        data: {
          title: 'About OrphaCare'
        }
      },
      {
        path: 'behind',
        component: BehindPageComponent,
        data: {
          title: 'Behind OrphaCare'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaitListPageRoutingModule { }
