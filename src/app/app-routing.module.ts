import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LandingComponent} from './views/landing/landing.component';
import {SignupComponent} from './views/signup/signup.component';
import {ConfirmComponent} from './views/confirm/confirm.component';
import {DashboardComponent} from './views/dashboard/dashboard.component';
import {AuthGuard} from './guards/auth.guard';
import {UnauthGuard} from './guards/unauth.guard';
import {EmailParamGuard} from './guards/email-param.guard';
import {NoGroupComponent} from './views/no-group/no-group.component';
import {InviteComponent} from './views/invite/invite.component';
import {BeneficiariesComponent} from './views/dashboard/beneficiaries/beneficiaries.component';
import {SummaryComponent} from './views/dashboard/summary/summary.component';
import {ScoutersComponent} from './views/dashboard/scouters/scouters.component';
import {NoGroupGuard} from './guards/no-group.guard';
import {GroupGuard} from './guards/group.guard';
import {NotFoundComponent} from './views/not-found/not-found.component';
import {ForbiddenGroupComponent} from './views/forbidden-group/forbidden-group.component';
import {BeneficiariesSummaryComponent} from './views/dashboard/beneficiaries-summary/beneficiaries-summary.component';
import {SummaryDetailsComponent} from './views/summary-details/summary-details.component';
import {BeneficiariesFileComponent} from './views/beneficiaries-file/beneficiaries-file.component';
import {BeneficiaryBinnacleComponent} from './views/beneficiary-binnacle/beneficiary-binnacle.component';
import {BeneficiaryRegistryComponent} from './views/beneficiary-registry/beneficiary-registry.component';
import {BeneficiariesEmptyContainerComponent} from './views/beneficiaries-empty-container/beneficiaries-empty-container.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    canActivate: [UnauthGuard]
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [UnauthGuard]
  },
  {
    path: 'confirm',
    component: ConfirmComponent,
    canActivate: [UnauthGuard, EmailParamGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'no-group',
    component: NoGroupComponent,
    canActivate: [AuthGuard, NoGroupGuard]
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'beneficiaries',
    children: [
      {
        path: ':userId',
        component: BeneficiariesEmptyContainerComponent,
        children: [
          {
            path: '',
            component: BeneficiariesFileComponent
          },
          {
            path: 'file',
            component: BeneficiariesFileComponent,
            children: [
              {
                path: 'binnacle',
                component: BeneficiaryBinnacleComponent
              },
              {
                path: 'registry',
                component: BeneficiaryRegistryComponent
              },
              {
                path: '**',
                redirectTo: 'binnacle'
              }
            ]
          },
          {
            path: '**',
            redirectTo: 'file'
          }
        ]
      },
      {
        path: ':unit',
        component: BeneficiariesComponent,
        children: [
          {
            path: '',
            component: BeneficiariesSummaryComponent
          },
          {
            path: '**',
            redirectTo: ''
          }
        ]
      }
    ]
  },
  {
    path: 'districts/:districtId',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'groups/:groupId',
        children: [
          {
            path: '',
            component: ForbiddenGroupComponent
          },
          {
            path: 'dashboard',
            component: DashboardComponent,
            canActivate: [GroupGuard],
            children: [
              {
                path: 'summary',
                component: SummaryComponent,
                children: [
                  {
                    path: '',
                    component: SummaryDetailsComponent
                  },
                  {
                    path: 'details',
                    component: SummaryDetailsComponent
                  },
                  {
                    path: '**',
                    redirectTo: 'details'
                  }
                ]
              },
              {
                path: 'beneficiaries',
                children: [
                  {
                    path: '',
                    component: BeneficiariesComponent,
                    children: [
                      {
                        path: '',
                        component: BeneficiariesSummaryComponent
                      },
                      {
                        path: 'b/:userId',
                        component: BeneficiariesSummaryComponent,
                        children: [
                          {
                            path: '',
                            component: BeneficiariesFileComponent
                          },
                          {
                            path: 'file',
                            component: BeneficiariesFileComponent,
                            children: [
                              {
                                path: 'binnacle',
                                component: BeneficiaryBinnacleComponent
                              },
                              {
                                path: 'registry',
                                component: BeneficiaryRegistryComponent
                              },
                              {
                                path: '**',
                                redirectTo: 'binnacle'
                              }
                            ]
                          },
                          {
                            path: '**',
                            redirectTo: 'file'
                          }
                        ]
                      },
                      {
                        path: '**',
                        redirectTo: ''
                      }
                    ]
                  },
                  {
                    path: ':unit',
                    component: BeneficiariesComponent,
                    children: [
                      {
                        path: '',
                        component: BeneficiariesSummaryComponent
                      },
                      {
                        path: '**',
                        redirectTo: ''
                      }
                    ]
                  }
                ]
              },
              {
                path: 'scouters',
                component: ScoutersComponent
              },
              {
                path: '**',
                redirectTo: 'summary'
              }
            ]
          },
          {
            path: 'invite',
            component: InviteComponent
          },
          {
            path: '**',
            redirectTo: 'dashboard'
          },
        ]
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy', paramsInheritanceStrategy: 'always'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
