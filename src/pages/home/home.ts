import { Component, NgZone } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { CouchbaseProvider } from '../../providers/couchbase/couchbase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public items: Array<any>;

  constructor(public navCtrl: NavController, public couchbase: CouchbaseProvider,
              public alertCtrl: AlertController, public zone: NgZone) {

    this.items = [];

  }

  public ionViewDidEnter() {
    setTimeout( () => {
      this.couchbase.getChangeListener().subscribe( data => {
        this.items.push({ 'title': 'Test 1'});
        
        // for (let i=0; i < data.length; i++) {
        //   if (!data[i].hasOwnProperty("deleted") && data[i].id.indexOf("_design") === -1) {
        //     this.couchbase.getDatabase().getDocument(data[i].id).then ( result => {
        //       if (result.type === "list") {
        //         this.zone.run( () => {
        //           this.items.push(result);
        //         });
        //       }
        //     });
        //     this.refresh();
        //   }
        // }
      });
    }, 100);
  }
  public refresh() {
    this.couchbase.getDatabase().queryView("_design/todo", "items",  {})
       .then( result => {
         this.items = [];
         for (var i=0; i < result.rows.length; i++) {
           this.items.push(result.rows[i].value);           
         }
       }, error => {
         console.error("ERROR: " + JSON.stringify(error));
       });
  }

  public add() {
    let prompt = this.alertCtrl.create( {
      title: 'Todo Items',
      message: "Add a new item to the todo list",
      inputs: [
        { name: 'title', placeholder: 'Title' },
      
      ],
      buttons: [
        { text: 'Cancel', handler: data => {} },
        { text: 'Save', handler: data => {

          this.items.push({'title': 'test insert 1'});

             this.couchbase.getDatabase().createDocument( 
               {type: 'list', title: data.title}
            );
        }}
      ]
    });
    prompt.present();
  }


}
