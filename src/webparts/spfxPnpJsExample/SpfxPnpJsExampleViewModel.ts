import * as ko from "knockout";
import styles from "./SpfxPnpJsExample.module.scss";
import { ISpfxPnpJsExampleWebPartProps } from "./SpfxPnpJsExampleWebPart";
require("tslib");
require("@pnp/logging");
require("@pnp/common");
require("@pnp/odata");
import {
  sp,
  List,
  ListEnsureResult,
  ItemAddResult,
  FieldAddResult
} from "@pnp/sp";

export interface IPnPjsExampleBindingContext
  extends ISpfxPnpJsExampleWebPartProps {
  shouter: KnockoutSubscribable<{}>;
}

/**
 * Interface which defines the fields in our list items
 */
export interface OrderListItem {
  Title: string;
  Url: string;
  Descripcion: string;
}

export default class PnPjsExampleViewModel {
                 public description: KnockoutObservable<string> = ko.observable(
                   ""
                 );
                 public newItemTitle: KnockoutObservable<
                   string
                 > = ko.observable("");
                 public newItemNumber: KnockoutObservable<
                   string
                 > = ko.observable("");
                 public items: KnockoutObservableArray<
                   OrderListItem
                 > = ko.observableArray([]);

                 public labelClass: string = styles.label;
                 public helloWorldClass: string = styles.spfxPnpJsExample;
                 public containerClass: string = styles.container;
                 public rowClass: string = `ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}`;
                 public buttonClass: string = `ms-Button ${styles.button}`;

                 constructor(bindings: IPnPjsExampleBindingContext) {
                   this.description(bindings.description);

                   // When web part description is updated, change this view model's description.
                   bindings.shouter.subscribe(
                     (value: string) => {
                       this.description(value);
                     },
                     this,
                     "description"
                   );

                   // call the load the items
                   this.getItems().then(items => {
                     this.items(items);
                   });
                  //  this.getServices().then(items => {
                  //    this.items(items);
                  //  });
                 }

                 /**
                  * Gets the items from the list
                  */
                 private getItems(): Promise<OrderListItem[]> {
                   return this.ensureList().then(list => {
                     // here we are using the getAs operator so that our returned value will be typed
                     return list.items
                       .select("Title", "OData__x0076_mo3", "OData__x0071_iy4")
                       .get<OrderListItem[]>();
                   });
                 }

                //  private getServices(): Promise<OrderListItem[]> {
                //    return this.ensureList().then(list => {
                //      // here we are using the getAs operator so that our returned value will be typed
                //      return list.items
                //        .select("Title")
                //        .get<OrderListItem[]>();
                //    });
                //  }

                 /**
                  * Adds an item to the list
                  */
                 // public addItem(): void {
                 //   if (this.newItemTitle() !== "") {
                 //     this.ensureList().then(list => {
                 //       // add the new item to the SharePoint list
                 //       list.items
                 //         .add({
                 //           Title: this.newItemTitle()
                 //         })
                 //         .then((iar: ItemAddResult) => {
                 //           // add the new item to the display
                 //           this.items.push({
                 //             Title: iar.data.Title,
                 //             _x0076_mo3: iar.data._x0076_mo3
                 //           });

                 //           // clear the form
                 //           this.newItemTitle("");
                 //         });
                 //     });
                 //   }
                 // }

                 /**
                  * Deletes an item from the list
                  */
                 public deleteItem(data): void {
                   if (confirm("Are you sure you want to delete this item?")) {
                     this.ensureList()
                       .then(list => {
                         list.items
                           .getById(data.Id)
                           .delete()
                           .then(_ => {
                             this.items.remove(data);
                           });
                       })
                       .catch((e: Error) => {
                         alert(
                           `There was an error deleting the item ${e.message}`
                         );
                       });
                   }
                 }

                 /**
                  * Ensures the list exists and if it creates it adds some default example data
                  */
                 private ensureList(): Promise<List> {
                   return new Promise<List>((resolve, reject) => {
                     // use lists.ensure to always have the list available
                     sp.web.lists
                       .ensure("CatalogodeServicio")
                       .then((ler: ListEnsureResult) => {
                         if (ler.created) {
                           // we created the list on this call so let's add a column
                           ler.list.fields

                             .addText("Title, Url, Descripcion")
                             .then(_ => {
                               // and we will also add a few items so we can see some example data
                               // here we use batching

                               // create a batch
                               let batch = sp.web.createBatch();

                               ler.list
                                 .getListItemEntityTypeFullName()
                                 .then(typeName => {
                                   ler.list.items.inBatch(batch).add(
                                     {
                                       Title: "Title 1"
                                     },
                                     typeName
                                   );

                                   ler.list.items.inBatch(batch).add(
                                     {
                                       Title: "Title 2"
                                     },
                                     typeName
                                   );

                                   ler.list.items.inBatch(batch).add(
                                     {
                                       Title: "Title 3"
                                     },
                                     typeName
                                   );

                                   // excute the batched operations
                                   batch
                                     .execute()
                                     .then(_ => {
                                       // all of the items have been added within the batch

                                       resolve(ler.list);
                                     })
                                     .catch(e => reject(e));
                                 })
                                 .catch(e => reject(e));
                             })
                             .catch(e => reject(e));
                         } else {
                           resolve(ler.list);
                         }
                       })
                       .catch(e => reject(e));
                   });
                 }
               }
