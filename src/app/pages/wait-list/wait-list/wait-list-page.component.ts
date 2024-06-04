import { NgbModal, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { PrivacyPolicyPageComponent } from 'app/pages/content-pages/privacy-policy/privacy-policy.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ApiDx29ServerService } from 'app/shared/services/api-dx29-server.service';

@Component({
  selector: 'app-wait-list-page',
  templateUrl: './wait-list-page.component.html',
  styleUrls: ['./wait-list-page.component.scss'],
  providers: [ApiDx29ServerService]
})

export class WaitListPageComponent implements OnInit, OnDestroy {
  modalReference: NgbModalRef;


  private subscription: Subscription = new Subscription();
  idUser: string;
  haveInfo: Boolean = false;
  trash = [];
  newItemName: string = '';
  disease: any = { "id": "", "name": "", "items": []} ;

  nothingFoundDisease: boolean = false;
  searchDiseaseField: string = '';
  actualInfoOneDisease: any = {};
  private subscriptionDiseasesCall: Subscription = new Subscription();
  private subscriptionDiseasesNotFound: Subscription = new Subscription();
  callListOfDiseases: boolean = false;
  listOfFilteredDiseases: any = [];
  selectedDiseaseIndex: number = -1;
  loadingOneDisease: boolean = false;
  gettingItems: boolean = false;
  bodyElement: HTMLElement = document.body;
  loading = false;
  step = '0';
  loadingData = false;
  infodata: any = {}
  newQuestion = '';
  newAnswer = '';
  
  constructor(public translate: TranslateService, public toastr: ToastrService, private apiDx29ServerService: ApiDx29ServerService, private modalService: NgbModal) {
  }


  async ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async ngOnInit() {

  }

  start(){
    this.step = '1';
  }
  goback(){
    this.step = '0';
  }

  onKey(event: KeyboardEvent) {
    if(event.key ==='ArrowLeft' || event.key ==='ArrowUp' || event.key ==='ArrowRight' || event.key ==='ArrowDown'){

    }else{
        this.nothingFoundDisease = false;
        if (this.searchDiseaseField.trim().length > 3) {
            if (this.subscriptionDiseasesCall) {
                this.subscriptionDiseasesCall.unsubscribe();
            }
            if (this.subscriptionDiseasesNotFound) {
                this.subscriptionDiseasesNotFound.unsubscribe();
            }
            this.callListOfDiseases = true;
            var tempModelTimp = this.searchDiseaseField.trim();
            var info = {
                "text": tempModelTimp,
                "lang": 'en'
            }
            this.subscriptionDiseasesCall= this.apiDx29ServerService.searchDiseases(info)
                .subscribe((res: any) => {
                    this.callListOfDiseases = false;
                    if(res==null){
                        this.nothingFoundDisease = true;
                        this.listOfFilteredDiseases = [];
                    }else{
                        this.nothingFoundDisease = false;
                        this.listOfFilteredDiseases = res;
                        if(this.listOfFilteredDiseases.length == 0){
                            this.nothingFoundDisease = true;
                        }
                    }
                    
                }, (err) => {
                    console.log(err);
                    this.nothingFoundDisease = false;
                    this.callListOfDiseases = false;
                });
        } else {
            this.callListOfDiseases = false;
            this.listOfFilteredDiseases = [];
        }
    }
}

showMoreInfoDiagnosePopup(index){
  this.loadingOneDisease = true;
  this.selectedDiseaseIndex = index;
  let tempDisease = this.listOfFilteredDiseases[index];
  

  Swal.fire({
      title: this.translate.instant("generics.Are you sure?"),
      html: '<p class="mt-2">You have selected: '+tempDisease.name+'</p><p class="mt-2">'+tempDisease.id+'</p>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#24b4a5',
      confirmButtonText: 'Yes, I am sure.',
      cancelButtonColor: '#b0b6bb',
      cancelButtonText: this.translate.instant("generics.Cancel"),
      showLoaderOnConfirm: true,
      allowOutsideClick: false
  }).then((result) => {
      if (result.value) {
        this.actualInfoOneDisease = this.listOfFilteredDiseases[this.selectedDiseaseIndex];
        console.log(this.actualInfoOneDisease)        
        this.haveInfo = true;
        this.loadingData = true;
        this.loadingOneDisease = false;
        this.getInfo(this.actualInfoOneDisease.name);
      }
      this.clearsearchDiseaseField();
  });
  
}

getInfo(name){
  this.infodata = {
    "orphanDrugs": [
      {
        "name": "Stiripentol (Diacomit)"
      },
      {
        "name": "Cannabidiol (Epidiolex)"
      },
      {
        "name": "Fenfluramine (Fintepla)"
      }
    ],
    "questionsAnswers": [
      {
        "question": "What is Stiripentol (Diacomit) used for?",
        "answer": "Stiripentol (Diacomit) is used to treat seizures associated with Dravet syndrome in patients taking clobazam.",
        "rating": 0,
        "feedback": ''
      },
      {
        "question": "How does Cannabidiol (Epidiolex) work for Dravet syndrome?",
        "answer": "Cannabidiol (Epidiolex) works by interacting with the body's endocannabinoid system to reduce the frequency of seizures in patients with Dravet syndrome.",
        "rating": 0,
        "feedback": ''
      },
      {
        "question": "What are the side effects of Fenfluramine (Fintepla)?",
        "answer": "Common side effects of Fenfluramine (Fintepla) include decreased appetite, drowsiness, and fatigue. Serious side effects may include valvular heart disease and pulmonary arterial hypertension.",
        "rating": 0,
        "feedback": ''
      }
    ]
  }
  this.loadingData = false;

  /*
  this.subscription.add(this.apiDx29ServerService.getInfo(name)
  .subscribe((res: any) => {
    console.log(res)
    this.loadingData = false;
  }, (err) => {
    console.log(err);
  }));*/
}


addQuestionAnswer() {
  if (this.newQuestion && this.newAnswer) {
    this.infodata.questionsAnswers.push({ question: this.newQuestion, answer: this.newAnswer });
    this.newQuestion = '';
    this.newAnswer = '';
  }
}

saveAllData(){
  //Swal que diga que se guardo correctamente
  Swal.fire({
    title: 'Saved',
    icon: 'success',
    showConfirmButton: false,
    timer: 1500
  });
  this.actualInfoOneDisease = {};
  this.haveInfo = false;
  this.step = '0';
}

focusOutFunctionDiseases(){
  //if (this.searchDiseaseField.trim().length > 3 && this.listOfFilteredDiseases.length==0 && !this.callListOfDiseases) {
  if (this.searchDiseaseField.trim().length > 3 && !this.callListOfDiseases) {
      //send text
    
  }
}

clearsearchDiseaseField(){
  this.searchDiseaseField = "";
  this.listOfFilteredDiseases = [];
  this.callListOfDiseases = false;
}
  
deleteDisease(){
  Swal.fire({
    title: this.translate.instant("generics.Are you sure?"),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#24b4a5',
    cancelButtonColor: '#b0b6bb',
    confirmButtonText: this.translate.instant("generics.Delete"),
    cancelButtonText: this.translate.instant("generics.No, cancel"),
    showLoaderOnConfirm: true,
    allowOutsideClick: false
  }).then((result) => {
    if (result.value) {
      this.confirmDeleteDisease();
    }
  });
}

confirmDeleteDisease(){
  this.actualInfoOneDisease = {};
  this.haveInfo = false;
}

  openPolicy() {
    let ngbModalOptions: NgbModalOptions = {
      windowClass: 'ModalClass-lg'// xl, lg, sm
    };
    this.modalReference = this.modalService.open(PrivacyPolicyPageComponent, ngbModalOptions);
  }

  closeModal() {
    if (this.modalReference != undefined) {
      this.modalReference.close()
    }
  }



}
