import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, map} from 'rxjs/operators'
import { InsightsService } from 'app/shared/services/azureInsights.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class ApiDx29ServerService {
    constructor(private http: HttpClient, public insightsService: InsightsService) {}

    searchDiseases(info) {
      return this.http.post('https://dx29.ai/api/gateway/search/disease/', info).pipe(
        map((res: any) => {
          return res;
        }),
        catchError((err) => {
          console.log(err);
          this.insightsService.trackException(err);
          return err;
        })
      );
    }

    getInfo(name){
      return this.http.get(environment.api+'/api/getinfo/'+name).pipe(
        map((res: any) => {
          return res;
        }),
        catchError((err) => {
          console.log(err);
          this.insightsService.trackException(err);
          return err;
        })
      );
    }

}
